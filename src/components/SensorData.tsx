import React from 'react';

interface SensorDataProps {
  speed: number;
  pressure: number;
  co2: number;
  temperature: number;
  speedHistory: number[];
  tempHistory: number[];
}

const Sparkline: React.FC<{ data: number[], color: string, min: number, max: number }> = ({ data, color, min, max }) => {
  const width = 100;
  const height = 30;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / (max - min)) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="mt-2 opacity-50">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

const SensorData: React.FC<SensorDataProps> = ({ speed, pressure, co2, temperature, speedHistory, tempHistory }) => {
  const getCo2Color = (val: number) => {
    if (val > 900) return 'var(--color-red)';
    if (val > 800) return 'var(--color-amber)';
    return 'var(--color-green)';
  };

  return (
    <div className="card sensors-card col-start-2 row-start-2">
      <div className="card-header">
        <div className="card-title">Telemetry · Active</div>
        <div className="tag tag-indigo">Encrypted</div>
      </div>
      <div className="sensors-grid grid grid-cols-2 gap-3 p-4 flex-1">
        <div className="sensor-tile group" style={{ '--fill': `${(speed / 20) * 100}%`, '--bar-color': 'var(--color-ink)' } as React.CSSProperties}>
          <div className="flex justify-between items-start">
            <div className="st-label">Velocity</div>
            <div className="text-[10px] font-bold text-green font-mono">↑ 0.2</div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <div className="st-num">{speed}</div>
              <div className="st-unit">m/s</div>
            </div>
            <Sparkline data={speedHistory} color="var(--color-ink)" min={0} max={20} />
          </div>
        </div>

        <div className="sensor-tile" style={{ '--fill': `${((pressure - 990) / 40) * 100}%`, '--bar-color': 'var(--color-blue)' } as React.CSSProperties}>
          <div className="st-label">Atm. Pressure</div>
          <div className="flex flex-col mt-1">
            <div className="flex items-baseline gap-1">
              <div className="st-num">{pressure}</div>
              <div className="st-unit">hPa</div>
            </div>
            <div className="text-[8px] font-bold text-ink3 mt-1 uppercase tracking-widest">Normal Range</div>
          </div>
        </div>

        <div className="sensor-tile" style={{ '--fill': `${(co2 / 1200) * 100}%`, '--bar-color': getCo2Color(co2) } as React.CSSProperties}>
          <div className="st-label">Carbon Dioxide</div>
          <div className="flex flex-col mt-1">
            <div className="flex items-baseline gap-1">
              <div className="st-num" style={{ color: getCo2Color(co2) }}>{co2}</div>
              <div className="st-unit">ppm</div>
            </div>
            <div className="flex gap-1 mt-1">
               <div className={`w-1 h-1 rounded-full ${co2 > 900 ? 'bg-red animate-pulse' : 'bg-green'}`}></div>
               <span className="text-[8px] font-bold text-ink3 uppercase">{co2 > 900 ? 'High' : 'Stable'}</span>
            </div>
          </div>
        </div>

        <div className="sensor-tile" style={{ '--fill': `${(temperature / 50) * 100}%`, '--bar-color': 'var(--color-thermal)' } as React.CSSProperties}>
          <div className="st-label">Environment Temp</div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <div className="st-num">{temperature}</div>
              <div className="st-unit">°C</div>
            </div>
            <Sparkline data={tempHistory} color="var(--color-thermal)" min={20} max={40} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorData;
