import React, { useRef, useEffect, useState } from 'react';
import type { LogEntry } from '../types';

interface GimbalControlProps {
  pan: number;
  tilt: number;
  setPan: (v: number) => void;
  setTilt: (v: number) => void;
  onGoPreset: (p: number, t: number) => void;
  logs: LogEntry[];
}

const GimbalControl: React.FC<GimbalControlProps> = ({ pan, tilt, setPan, setTilt, onGoPreset, logs }) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [joyOffset, setJoyOffset] = useState({ x: 0, y: 0 });
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      const dx = ((pan - 90) / 90) * 36;
      const dy = ((tilt - 90) / 90) * 36;
      setJoyOffset({ x: dx, y: dy });
    }
  }, [pan, tilt, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLocked) return;
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !joystickRef.current) return;

      const rect = joystickRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxR = 36;
      const cl = Math.min(dist, maxR);
      const a = Math.atan2(dy, dx);
      const nx = Math.cos(a) * cl;
      const ny = Math.sin(a) * cl;

      setJoyOffset({ x: nx, y: ny });
      setPan(Math.round(90 + (nx / maxR) * 90));
      setTilt(Math.round(90 + (ny / maxR) * 90));
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      setPan(90);
      setTilt(90);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setPan, setTilt]);

  return (
    <div className="card gimbal-card col-start-3 row-span-2 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="card-header border-b-0">
        <div className="card-title">Gimbal · Manual</div>
        <button 
          className={`btn-action ${isLocked ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setIsLocked(!isLocked)}
        >
          {isLocked ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
               <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
               <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 016 0v1h2V7a5 5 0 00-5-5z" />
            </svg>
          )}
          {isLocked ? 'Locked' : 'Unlock'}
        </button>
      </div>
      <div className="gimbal-body flex-1 p-4 flex flex-col gap-4 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-line">
        
        <div 
          ref={joystickRef}
          className={`joystick-outer w-[110px] h-[110px] rounded-full bg-surface2 border border-line relative flex items-center justify-center cursor-crosshair shrink-0 self-center shadow-inner ${isLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-0 border-[1.5px] border-dashed border-line rounded-full w-[70%] h-[70%] m-auto"></div>
          <div className="j-cross absolute inset-0 opacity-20">
            <div className="absolute w-[1px] h-full left-1/2 bg-ink"></div>
            <div className="absolute h-[1px] w-full top-1/2 bg-ink"></div>
          </div>
          
          <div className="j-label t absolute top-2 left-1/2 -translate-x-1/2 text-[9px] text-ink3 font-black uppercase tracking-tighter">N</div>
          <div className="j-label b absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-ink3 font-black uppercase tracking-tighter">S</div>
          <div className="j-label l absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-ink3 font-black uppercase tracking-tighter">W</div>
          <div className="j-label r absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-ink3 font-black uppercase tracking-tighter">E</div>
          
          <div 
            className={`j-thumb absolute w-6 h-6 rounded-full bg-ink cursor-grab z-[2] shadow-lg flex items-center justify-center group ${isLocked ? 'bg-ink3' : ''}`}
            style={{ 
              transform: `translate(${joyOffset.x}px, ${joyOffset.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)'
            }}
          >
             <div className="w-1.5 h-1.5 bg-white/20 rounded-full group-hover:bg-white/40 transition-colors"></div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <div className="angle-group w-full flex flex-col gap-1.5">
            <div className="angle-row flex justify-between items-baseline">
              <div className="angle-name">Pan Axis</div>
              <div className="angle-num">{pan}°</div>
            </div>
            <input 
              type="range" min="0" max="180" value={pan} 
              disabled={isLocked}
              onChange={(e) => setPan(parseInt(e.target.value))}
              className="appearance-none h-1.5 rounded-full outline-none cursor-pointer bg-line disabled:opacity-50"
              style={{ background: isLocked ? 'var(--color-line)' : `linear-gradient(90deg, var(--color-ink) ${(pan/180)*100}%, var(--color-line) ${(pan/180)*100}%)` }}
            />
          </div>

          <div className="angle-group w-full flex flex-col gap-1.5">
            <div className="angle-row flex justify-between items-baseline">
              <div className="angle-name">Tilt Axis</div>
              <div className="angle-num">{tilt}°</div>
            </div>
            <input 
              type="range" min="0" max="180" value={tilt} 
              disabled={isLocked}
              onChange={(e) => setTilt(parseInt(e.target.value))}
              className="appearance-none h-1.5 rounded-full outline-none cursor-pointer bg-line disabled:opacity-50"
              style={{ background: isLocked ? 'var(--color-line)' : `linear-gradient(90deg, var(--color-ink) ${(tilt/180)*100}%, var(--color-line) ${(tilt/180)*100}%)` }}
            />
          </div>
        </div>

        <div className="divider h-[1px] bg-line/50 w-full shrink-0 my-1"></div>

        <div>
          <div className="preset-title mb-2.5">Position Presets</div>
          <div className="preset-grid grid grid-cols-3 gap-2">
            <button className={`preset-btn ${pan === 90 && tilt === 90 ? 'active' : ''}`} onClick={() => onGoPreset(90, 90)}>Center</button>
            <button className={`preset-btn ${pan === 0 && tilt === 90 ? 'active' : ''}`} onClick={() => onGoPreset(0, 90)}>Left</button>
            <button className={`preset-btn ${pan === 180 && tilt === 90 ? 'active' : ''}`} onClick={() => onGoPreset(180, 90)}>Right</button>
            <button className={`preset-btn ${pan === 90 && tilt === 0 ? 'active' : ''}`} onClick={() => onGoPreset(90, 0)}>Apex</button>
            <button className={`preset-btn ${pan === 90 && tilt === 180 ? 'active' : ''}`} onClick={() => onGoPreset(90, 180)}>Base</button>
            <button className={`preset-btn ${pan === 45 && tilt === 130 ? 'active' : ''}`} onClick={() => onGoPreset(45, 130)}>Scan</button>
          </div>
        </div>

        <div className="log-section w-full mt-auto">
          <div className="preset-title mb-2.5">Security Logs</div>
          <div id="eventLog" className="flex flex-col gap-0.5">
            {logs.map(log => (
              <div key={log.id} className="log-entry">
                <div className={`ldot w-[6px] h-[6px] rounded-full shrink-0 ${log.type === 'err' ? 'bg-red animate-pulse' : 'bg-green'}`}></div>
                <span className="truncate flex-1 font-bold opacity-80">{log.msg}</span>
                <span className="ltime font-mono text-ink3 text-[8px]">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GimbalControl;
