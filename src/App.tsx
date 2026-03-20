import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import CameraView from './components/CameraView';
import ClawsView from './components/ClawsView';
import SensorData from './components/SensorData';
import GimbalControl from './components/GimbalControl';
import type { LogEntry } from './types';

// UI for the rover control system

const App: React.FC = () => {
  const [clock, setClock] = useState<string>('--:--:--');
  const [isCrackSimulated, setIsCrackSimulated] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 3, msg: 'System ready', type: 'ok', time: '' },
    { id: 2, msg: 'Sensors online', type: 'ok', time: '' },
    { id: 1, msg: 'Gimbal calibrated', type: 'ok', time: '' },
  ]);
  const [pan, setPan] = useState<number>(90);
  const [tilt, setTilt] = useState<number>(90);
  const [brightness, setBrightness] = useState<number>(65);
  const [contrast, setContrast] = useState<number>(50);
  
  // New states
  const [battery, setBattery] = useState<number>(98);
  const [signal, setSignal] = useState<number>(4); // 0-4
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<'normal' | 'thermal'>('normal');
  
  // Sensor states
  const [speed, setSpeed] = useState<number>(12.4);
  const [pressure, setPressure] = useState<number>(1013);
  const [co2, setCo2] = useState<number>(847);
  const [temperature, setTemperature] = useState<number>(32.1);
  const [clawPos, setClawPos] = useState<string>('+0.2mm');
  const [clawTorque, setClawTorque] = useState<string>('1.4 Nm');
  const [grip, setGrip] = useState<number>(72);

  // Historical data for sparklines
  const [speedHistory, setSpeedHistory] = useState<number[]>(new Array(20).fill(12));
  const [tempHistory, setTempHistory] = useState<number[]>(new Array(20).fill(32));

  useEffect(() => {
    const tick = () => {
      const t = new Date().toLocaleTimeString('en-GB');
      setClock(t);
      setLogs(prev => prev.map(log => log.time === '' ? { ...log, time: t } : log));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let ph = 0;
    const interval = setInterval(() => {
      ph += 0.04;
      const s = parseFloat((12 + Math.sin(ph) * 3).toFixed(1));
      const t = parseFloat((31 + Math.sin(ph * 0.25) * 3.5).toFixed(1));
      
      setSpeed(s);
      setPressure(Math.round(1013 + Math.sin(ph * 0.4) * 6));
      setCo2(Math.round(830 + Math.sin(ph * 0.7) * 90));
      setTemperature(t);
      setClawPos((Math.sin(ph) * 0.5).toFixed(2) + 'mm');
      setClawTorque((1.2 + Math.sin(ph * 0.5) * 0.4).toFixed(1) + ' Nm');
      setGrip(Math.round(65 + Math.sin(ph * 0.3) * 10));
      
      // Update history
      setSpeedHistory(prev => [...prev.slice(1), s]);
      setTempHistory(prev => [...prev.slice(1), t]);

      // Drain battery slowly
      setBattery(prev => Math.max(0, prev - 0.01));
      
      // Random signal fluctuation
      if (Math.random() > 0.95) {
        setSignal(Math.floor(Math.random() * 2) + 3);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const addLog = (msg: string, type: 'ok' | 'err') => {
    const newLog: LogEntry = {
      id: Date.now(),
      msg,
      type,
      time: new Date().toLocaleTimeString('en-GB'),
    };
    setLogs(prev => [newLog, ...prev].slice(0, 5));
  };

  const toggleCrack = () => {
    const newState = !isCrackSimulated;
    setIsCrackSimulated(newState);
    if (newState) {
      addLog('CRACK DETECTED', 'err');
    } else {
      addLog('Surface cleared', 'ok');
    }
  };

  const handleGoPreset = (p: number, t: number) => {
    setPan(p);
    setTilt(t);
    addLog(`Preset: ${p}°/${t}°`, 'ok');
  };

  const toggleRecording = () => {
    const next = !isRecording;
    setIsRecording(next);
    addLog(next ? 'Recording started' : 'Recording saved', 'ok');
  };

  const takeSnapshot = () => {
    addLog('Snapshot captured', 'ok');
  };

  return (
    <div className="shell grid grid-rows-[52px_1fr] h-screen p-3 gap-2.5">
      <TopBar 
        clock={clock} 
        isCrackSimulated={isCrackSimulated} 
        battery={battery}
        signal={signal}
      />
      
      <main className="main grid grid-cols-[1fr_1fr_300px] grid-rows-[1fr_1fr] gap-2.5 min-h-0">
        <CameraView 
          isCrackSimulated={isCrackSimulated} 
          toggleCrack={toggleCrack}
          pan={pan}
          tilt={tilt}
          brightness={brightness}
          contrast={contrast}
          setBrightness={setBrightness}
          setContrast={setContrast}
          isRecording={isRecording}
          toggleRecording={toggleRecording}
          takeSnapshot={takeSnapshot}
          cameraMode={cameraMode}
          setCameraMode={setCameraMode}
        />
        
        <ClawsView 
          grip={grip}
          clawPos={clawPos}
          clawTorque={clawTorque}
        />
        
        <SensorData 
          speed={speed}
          pressure={pressure}
          co2={co2}
          temperature={temperature}
          speedHistory={speedHistory}
          tempHistory={tempHistory}
        />
        
        <GimbalControl 
          pan={pan}
          tilt={tilt}
          setPan={setPan}
          setTilt={setTilt}
          onGoPreset={handleGoPreset}
          logs={logs}
        />
      </main>
    </div>
  );
};

export default App;
