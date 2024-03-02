import { useState, useEffect } from "react";
import LiveValue from "./live_value";
import TemperatureGauge from "./temperature_gauge";
import ValueTitle from "./value_title";
import RedbackLogo from "./redback_logo.jpg";
import "./App.css";
import useWebSocket, { ReadyState } from "react-use-websocket";

const WS_URL = "ws://localhost:8080";

interface VehicleData {
  battery_temperature: number;
  timestamp: number;
}

function App() {
  const [temperature, setTemperature] = useState<number>(0);
  const [status, setStatus] = useState<number>(0);
  const {
    lastJsonMessage,
    readyState,
  }: { lastJsonMessage: VehicleData | null; readyState: ReadyState } =
    useWebSocket(WS_URL, {
      share: false,
      shouldReconnect: () => true,
    });

  useEffect(() => {
    switch (readyState) {
      case ReadyState.OPEN:
        console.log("Connected to streaming service");
        break;
      case ReadyState.CLOSED:
        console.log("Disconnected from streaming service");
        break;
      default:
        break;
    }
  }, [readyState]);

  useEffect(() => {
    if (lastJsonMessage === null) {
      return;
    }
    if (lastJsonMessage["battery_temperature"] === -1) {
      console.log("Error: Unsafe operating temperature at timestamp " + lastJsonMessage["timestamp"]);
      setStatus(-1);
    } else {
      console.log("Received: ", lastJsonMessage);
      setStatus(0);
    }
    setTemperature(lastJsonMessage["battery_temperature"]);
  }, [lastJsonMessage]);

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={RedbackLogo}
          className="redback-logo"
          alt="Redback Racing Logo"
        />
        <div className="Temperature"> 
          <TemperatureGauge temp={temperature} />
          <LiveValue temp={temperature} />
        </div>
        <ValueTitle temp={status} />
      </header>
    </div>
  );
}

export default App;
