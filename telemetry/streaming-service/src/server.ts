import net from "net";
import { WebSocket, WebSocketServer } from "ws";

interface VehicleData {
  battery_temperature: number;
  timestamp: number;
}

const TCP_PORT = 12000;
const WS_PORT = 8080;
const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: WS_PORT });
let time: number = Date.now();
let count: number = 0;

tcpServer.on("connection", (socket) => {
  console.log("TCP client connected");
  
  socket.on("data", (msg) => {
    console.log(`Received: ${msg.toString()}`);

    if (isValidJson(msg.toString())) {
      const jsonData: VehicleData = JSON.parse(msg.toString());
      if (jsonData.battery_temperature > 80 || jsonData.battery_temperature < 20) {
        count++;
      }
      if (jsonData.timestamp - time > 5000 && count > 0) {
        time = Date.now();
        count = 0;
      }
      if (count >= 3) {
        console.error('Unsafe operating temperature at timestamp' + jsonData.timestamp);
        count = 0;
      }
      console.log(count);
      
      // Send JSON over WS to frontend clients
      websocketServer.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          if (count >= 3) {
            console.error('Unsafe operating temperature');
            client.send(JSON.stringify({ battery_temperature: -1, timestamp: Date.now() }));
          } else {
            client.send(msg.toString());
          }
        }
      });
    } else {
        console.error('Invalid JSON:', msg.toString());
    }
  });

  socket.on("end", () => {
    console.log("Closing connection with the TCP client");
  });

  socket.on("error", (err) => {
    console.log("TCP client error: ", err);
  });
});

websocketServer.on("listening", () =>
  console.log(`Websocket server started on port ${WS_PORT}`)
);

websocketServer.on("connection", async (ws: WebSocket) => {
  console.log("Frontend websocket client connected");
  ws.on("error", console.error);
});

tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server listening on port ${TCP_PORT}`);
});

function isValidJson(json: string): boolean {
  try {
      JSON.parse(json);
      return true;
  } catch {
      return false;
  }
}