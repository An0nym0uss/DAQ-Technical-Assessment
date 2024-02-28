import "./App.css";

interface TemperatureProps {
  temp: number;
}

function LiveValue({ temp }: TemperatureProps) {
  let valueColour = "green";
  if (temp > 80 || temp < 20) {
    valueColour = "red";
  } else if (temp > 75 || temp < 25) {
    valueColour = "yellow";
  }

  return (
    <header className="live-value" style={{ color: valueColour }}>
      {`${temp.toPrecision(3)}°C`}
    </header>
  );
}

export default LiveValue;
