import "./App.css";
import GaugeComponent from 'react-gauge-component'

interface gaugeProps {
  temp: number;
}

function TemperatureGauge({ temp }: gaugeProps) {
    if (temp > 100) {
        temp = 100;
    } else if (temp < 0) {
        temp = 0;
    }

  return (
    <GaugeComponent
          className="gauge"
          type="semicircle"
          arc={{
            width: 0.2,
            padding: 0.005,
            cornerRadius: 1,
            subArcs: [
              {
                limit: 20,
                color: '#EA4228',
                showTick: true
              },
              {
                limit: 25,
                color: '#F5CD19',
                showTick: true
              },
              {
                limit: 75,
                color: '#5BE12C',
                showTick: true
              },
              {
                limit: 80,
                color: '#F5CD19',
                showTick: true
              },
              {
                limit: 100,
                color: '#EA4228',
                showTick: true
              },
            ]
          }}
          pointer={{
            color: '#345243',
            length: 0.80,
            width: 15,
          }}
          labels={{
            valueLabel: { formatTextValue: value => value + 'ºC', hide: true },
            tickLabels: {
              type: 'outer',
              defaultTickValueConfig: { formatTextValue: value => value + 'ºC' },
            }
          }}
          value={temp}
        />
  );
}

export default TemperatureGauge;