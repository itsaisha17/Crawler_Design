import React from 'react';

interface ClawsViewProps {
  grip: number;
  clawPos: string;
  clawTorque: string;
}

const ClawsView: React.FC<ClawsViewProps> = ({ grip, clawPos, clawTorque }) => {
  return (
    <div className="card claws-card col-start-2 row-start-1">
      <div className="card-header border-b-0">
        <div className="card-title">Arm Dynamics · 3D</div>
        <div className="tag tag-blue font-bold">LOCKED</div>
      </div>
      <div className="claws-body flex-1 flex items-center justify-center bg-bg mx-4 mb-4 rounded-xl overflow-hidden relative border border-line/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(51,154,240,0.08)_0%,transparent_70%)]"></div>
        
        {/* Grip Strength Meter */}
        <div className="absolute left-4 top-4 bottom-4 w-1 bg-line rounded-full overflow-hidden flex flex-col justify-end">
           <div 
             className="w-full bg-blue transition-all duration-500 rounded-full" 
             style={{ height: `${grip}%` }}
           ></div>
           <div className="absolute -left-1 -bottom-1 text-[7px] font-bold text-blue uppercase origin-left -rotate-90 ml-4">Grip</div>
        </div>

        <svg className="claw-svg w-[80%] h-[80%] transition-transform duration-700 hover:scale-110" viewBox="0 0 260 175" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="0" dy="4" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.1" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#495057" />
              <stop offset="50%" stopColor="#1a1b1e" />
              <stop offset="100%" stopColor="#343a40" />
            </linearGradient>
          </defs>

          {/* Background grid */}
          <g opacity="0.3">
            <circle cx="130" cy="88" r="80" fill="none" stroke="var(--color-line)" strokeWidth="0.5" strokeDasharray="4 4" />
            <circle cx="130" cy="88" r="50" fill="none" stroke="var(--color-line)" strokeWidth="0.5" />
            <line x1="50" y1="88" x2="210" y2="88" stroke="var(--color-line)" strokeWidth="0.5" />
            <line x1="130" y1="8" x2="130" y2="168" stroke="var(--color-line)" strokeWidth="0.5" />
          </g>

          {/* The Robotic Arm */}
          <g filter="url(#shadow)">
            {/* Main Base */}
            <circle cx="130" cy="30" r="12" fill="url(#metal)" />
            <circle cx="130" cy="30" r="4" fill="#666" />

            {/* Main Shaft */}
            <rect x="126" y="30" width="8" height="60" rx="4" fill="url(#metal)" />
            
            {/* Joint */}
            <circle cx="130" cy="90" r="10" fill="url(#metal)" />
            <circle cx="130" cy="90" r="5" fill="var(--color-blue)" className="animate-pulse" />

            {/* Claw Fingers */}
            <g transform={`rotate(${(grip-70)*0.5}, 130, 90)`}>
              <path d="M128,90 L110,140 Q105,150 115,145 L130,100" fill="url(#metal)" />
            </g>
            <g transform={`rotate(${(70-grip)*0.5}, 130, 90)`}>
              <path d="M132,90 L150,140 Q155,150 145,145 L130,100" fill="url(#metal)" />
            </g>
          </g>
          
          {/* Shadow underneath */}
          <ellipse cx="130" cy="160" rx="40" ry="6" fill="rgba(0,0,0,0.05)" />
        </svg>

        <div className="absolute right-4 top-4 flex flex-col gap-1">
           <div className="bg-surface/80 backdrop-blur-md px-2 py-1 rounded border border-line text-[9px] font-bold shadow-sm">
              Z-AXIS: <span className="text-blue font-mono">NOMINAL</span>
           </div>
        </div>
      </div>
      
      <div className="claws-stats flex border-t border-line shrink-0 bg-surface2/30">
        <div className="claw-stat flex-1 p-3 border-r border-line group">
          <div className="cs-label group-hover:text-blue transition-colors">Extension</div>
          <div className="cs-val font-mono">{clawPos}</div>
        </div>
        <div className="claw-stat flex-1 p-3 border-r border-line group">
          <div className="cs-label group-hover:text-blue transition-colors">Torque</div>
          <div className="cs-val font-mono">{clawTorque}</div>
        </div>
        <div className="claw-stat flex-1 p-3 group">
          <div className="cs-label group-hover:text-blue transition-colors">Grip Force</div>
          <div className="cs-val font-mono">{grip}%</div>
        </div>
      </div>
    </div>
  );
};

export default ClawsView;
