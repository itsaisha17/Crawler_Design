import React from 'react';

interface CameraViewProps {
  isCrackSimulated: boolean;
  toggleCrack: () => void;
  pan: number;
  tilt: number;
  brightness: number;
  contrast: number;
  setBrightness: (v: number) => void;
  setContrast: (v: number) => void;
  isRecording: boolean;
  toggleRecording: () => void;
  takeSnapshot: () => void;
  cameraMode: 'normal' | 'thermal';
  setCameraMode: (mode: 'normal' | 'thermal') => void;
}

const CameraView: React.FC<CameraViewProps> = ({ 
  isCrackSimulated, 
  toggleCrack, 
  pan, 
  tilt, 
  brightness, 
  contrast, 
  setBrightness, 
  setContrast,
  isRecording,
  toggleRecording,
  takeSnapshot,
  cameraMode,
  setCameraMode
}) => {
  return (
    <div className="card camera-card col-start-1 row-span-2 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="card-header border-b-0">
        <div className="flex flex-col">
          <div className="card-title">Live Feed · Primary</div>
          <div className="text-[9px] font-mono text-ink3 uppercase mt-0.5 tracking-tighter">Secure Link 256-bit</div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex bg-surface2 rounded-lg p-0.5 border border-line">
            <button 
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${cameraMode === 'normal' ? 'bg-white shadow-sm text-ink' : 'text-ink3 hover:text-ink2'}`}
              onClick={() => setCameraMode('normal')}
            >
              VIS
            </button>
            <button 
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${cameraMode === 'thermal' ? 'bg-thermal text-white shadow-sm' : 'text-ink3 hover:text-ink2'}`}
              onClick={() => setCameraMode('thermal')}
            >
              IR
            </button>
          </div>
          <button 
            className={`btn-action ${isRecording ? 'btn-danger animate-pulse-red' : 'btn-secondary'}`}
            onClick={toggleRecording}
          >
            {isRecording ? (
              <>
                <div className="w-2 h-2 rounded-full bg-white"></div>
                REC
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-red"></div>
                RECORD
              </>
            )}
          </button>
          <button className="btn-action btn-secondary" onClick={takeSnapshot}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Snap
          </button>
        </div>
      </div>

      <div className="cam-viewport flex-1 bg-[#0c0c0a] relative overflow-hidden m-4 mt-0 rounded-xl shadow-inner group">
        {/* Overlay based on mode */}
        {cameraMode === 'thermal' && (
          <div className="absolute inset-0 bg-thermal/20 mix-blend-color pointer-events-none z-10"></div>
        )}
        
        <div className="cam-grid absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:36px_36px]"></div>
        
        <div className="cam-corners transition-all group-hover:scale-[1.02]">
          <span className="absolute w-4 h-4 border-white/40 border-t-[2px] border-l-[2px] top-4 left-4"></span>
          <span className="absolute w-4 h-4 border-white/40 border-t-[2px] border-r-[2px] top-4 right-4"></span>
          <span className="absolute w-4 h-4 border-white/40 border-b-[2px] border-l-[2px] bottom-4 left-4"></span>
          <span className="absolute w-4 h-4 border-white/40 border-b-[2px] border-r-[2px] bottom-4 right-4"></span>
        </div>

        {/* Reticle UI */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-40">
           <div className="w-16 h-16 border border-white/20 rounded-full"></div>
           <div className="absolute w-8 h-[1px] bg-white"></div>
           <div className="absolute w-[1px] h-8 bg-white"></div>
        </div>

        <div className="cam-meta absolute top-4 left-4 text-[10px] text-white/50 z-[2] font-mono flex flex-col gap-1">
          <div className="flex items-center gap-2">
             <span className="bg-red w-2 h-2 rounded-full animate-pulse"></span>
             LIVE 4K · {cameraMode.toUpperCase()}
          </div>
          <div className="text-white/30 tracking-widest">FPS: 60.0</div>
        </div>

        <div className="cam-badge-wrap absolute bottom-6 left-1/2 -translate-x-1/2 z-[2] transition-transform hover:scale-110">
          <div 
            className={`${isCrackSimulated ? 'bg-red shadow-lg shadow-red/40 animate-[breathe_0.8s_infinite]' : 'bg-green/80 shadow-md'} text-white text-[11px] font-black px-6 py-2 rounded-full backdrop-blur-lg border border-white/20 tracking-wider cursor-pointer transition-all`}
            onClick={toggleCrack}
          >
            {isCrackSimulated ? '⚠ SURFACE ANOMALY' : '✓ SURFACE STABLE'}
          </div>
        </div>

        {isRecording && (
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-red/20 backdrop-blur-md rounded-lg border border-red/40 z-20">
             <div className="w-2.5 h-2.5 rounded-full bg-red animate-pulse"></div>
             <span className="text-white font-mono font-bold text-[10px] tracking-widest">00:04:12</span>
          </div>
        )}
      </div>

      <div className="cam-controls p-4 pt-0 flex flex-col gap-3">
        <div className="flex items-center gap-4">
           <div className="flex-1 flex flex-col gap-1">
             <div className="flex justify-between">
                <span className="text-[9px] text-ink3 font-bold uppercase">Exposure</span>
                <span className="text-[10px] text-ink font-mono">{brightness}%</span>
             </div>
             <input 
               type="range" min="0" max="100" value={brightness} 
               onChange={(e) => setBrightness(parseInt(e.target.value))}
               className="appearance-none h-1.5 rounded-full outline-none cursor-pointer bg-line"
               style={{ background: `linear-gradient(90deg, var(--color-ink) ${brightness}%, var(--color-line) ${brightness}%)` }}
             />
           </div>
           <div className="flex-1 flex flex-col gap-1">
             <div className="flex justify-between">
                <span className="text-[9px] text-ink3 font-bold uppercase">Contrast</span>
                <span className="text-[10px] text-ink font-mono">{contrast}%</span>
             </div>
             <input 
               type="range" min="0" max="100" value={contrast} 
               onChange={(e) => setContrast(parseInt(e.target.value))}
               className="appearance-none h-1.5 rounded-full outline-none cursor-pointer bg-line"
               style={{ background: `linear-gradient(90deg, var(--color-ink) ${contrast}%, var(--color-line) ${contrast}%)` }}
             />
           </div>
        </div>

        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
             <div className="bg-surface2 rounded-lg px-3 py-1.5 flex flex-col border border-line shadow-sm">
                <span className="text-[8px] text-ink3 font-bold uppercase">Pan</span>
                <span className="text-[11px] text-ink font-bold font-mono">{pan}°</span>
             </div>
             <div className="bg-surface2 rounded-lg px-3 py-1.5 flex flex-col border border-line shadow-sm">
                <span className="text-[8px] text-ink3 font-bold uppercase">Tilt</span>
                <span className="text-[11px] text-ink font-bold font-mono">{tilt}°</span>
             </div>
          </div>
          <div className="flex gap-2">
             <div className="bg-indigo/5 text-indigo rounded-lg px-3 py-1.5 flex flex-col border border-indigo/20 shadow-sm">
                <span className="text-[8px] font-bold uppercase">Zoom</span>
                <span className="text-[11px] font-bold font-mono">1.2x</span>
             </div>
             <div className="bg-green/5 text-green rounded-lg px-3 py-1.5 flex flex-col border border-green/20 shadow-sm">
                <span className="text-[8px] font-bold uppercase">Quality</span>
                <span className="text-[11px] font-bold font-mono">HQ</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraView;
