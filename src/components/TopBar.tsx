import React from 'react';

interface TopBarProps {
  clock: string;
  isCrackSimulated: boolean;
  battery: number;
  signal: number;
}

const TopBar: React.FC<TopBarProps> = ({ clock, isCrackSimulated, battery, signal }) => {
  return (
    <div className="topbar flex items-center bg-surface rounded-xl px-5 border border-line shadow-sm">
      <div className="wordmark font-display font-extrabold text-[16px] tracking-[-0.5px] text-ink mr-auto flex items-center gap-2.5">
        <svg width="24" height="24" viewBox="0 0 100 100" className="drop-shadow-sm">
           <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" fill="#ff9500" />
           <path d="M35 35 L55 35 Q65 35 65 45 Q65 55 55 55 L35 55 L35 75 M50 55 L65 75" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" />
        </svg>
        <span className="uppercase tracking-tight">Raphson Robotics</span>
        <span className="text-[10px] font-mono font-medium text-ink3 ml-1 tracking-widest uppercase">PRO v2.0</span>
      </div>
      
      <div className="flex items-center gap-1 px-4 border-x border-line mx-4">
        <div className="flex items-center gap-1 mr-4">
          <div className="flex items-end gap-[1px] h-3 w-6">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={`w-1 rounded-sm ${i <= signal ? 'bg-ink' : 'bg-line'}`}
                style={{ height: `${i * 25}%` }}
              ></div>
            ))}
          </div>
          <span className="text-[10px] font-bold text-ink2 uppercase">Signal</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-8 h-4 border border-ink2 rounded-sm p-[1px] flex items-center">
            <div 
              className={`h-full rounded-sm ${battery < 20 ? 'bg-red' : 'bg-green'}`} 
              style={{ width: `${battery}%` }}
            ></div>
            <div className="absolute -right-1 w-1 h-2 bg-ink2 rounded-r-sm"></div>
          </div>
          <span className="text-[10px] font-bold text-ink2">{Math.round(battery)}%</span>
        </div>
      </div>

      <div className="flex items-center">
        <div className="pill ok"><div className="dot"></div>Camera</div>
        <div className={`pill ${isCrackSimulated ? 'err' : 'ok'}`}>
          <div className="dot"></div>
          {isCrackSimulated ? 'Crack Warning' : 'Surface OK'}
        </div>
      </div>

      <div className="clock text-xs text-ink2 ml-4 pl-4 border-l border-line font-bold font-mono">
        {clock}
      </div>
    </div>
  );
};

export default TopBar;
