import "./App.css";

interface TemperatureProps {
  temp: number;
}

function ValueTitle({ temp }: TemperatureProps) {
  let status: string = "Safe";
  if (temp == -1) {
    status = "Unsafe";
  } 

return (
    <div>
        <p className="value-title">Live Battery Temperature status: {status}</p>
    </div>
);
}

export default ValueTitle;