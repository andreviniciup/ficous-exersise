import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Settings } from 'lucide-react';

export function FocusPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos em segundos
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [session, setSession] = useState(1);
  const [completedSessions, setCompletedSessions] = useState(0);
  
  const [settings, setSettings] = useState({
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4
  });

  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const modes = {
    focus: { time: settings.focusTime * 60, label: 'Foco', color: '#c8a939' },
    shortBreak: { time: settings.shortBreak * 60, label: 'Pausa Curta', color: '#9cbe7a' },
    longBreak: { time: settings.longBreak * 60, label: 'Pausa Longa', color: '#91acc5' }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsRunning(false);
      playNotificationSound();
      
      if (mode === 'focus') {
        const newCompletedSessions = completedSessions + 1;
        setCompletedSessions(newCompletedSessions);
        
        if (newCompletedSessions % settings.sessionsUntilLongBreak === 0) {
          setMode('longBreak');
          setTimeLeft(modes.longBreak.time);
        } else {
          setMode('shortBreak');
          setTimeLeft(modes.shortBreak.time);
        }
      } else {
        setMode('focus');
        setTimeLeft(modes.focus.time);
        setSession(prev => prev + 1);
      }
    }
  }, [timeLeft, mode, completedSessions, settings.sessionsUntilLongBreak]);

  const playNotificationSound = () => {
    try {
      // Criar um beep simples usando Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio notification not available');
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(modes[mode].time);
  };

  const switchMode = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(modes[newMode].time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = modes[mode].time;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className="absolute h-[982px] left-[241px] overflow-clip top-0 w-[1271px]">
      {/* Header Rectangle */}
      <div 
        className="absolute h-[110px] left-[60px] rounded-[11px] top-[48px] w-[1151px] transition-colors duration-300" 
        style={{ backgroundColor: modes[mode].color }}
      />
      
      <p className="absolute font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] left-[61px] text-[36px] text-black text-nowrap top-[193px] whitespace-pre">
        Foco
      </p>
      <p className="absolute font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[61px] text-[20px] text-black text-nowrap whitespace-pre top-[246px]">
        {modes[mode].label} - Sessão {session}
      </p>

      {/* Main Timer Area */}
      <div className="absolute left-[300px] top-[320px] w-[650px] h-[500px] flex flex-col items-center justify-center">
        {/* Progress Circle */}
        <div className="relative w-[300px] h-[300px] mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#f0f0f0"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={modes[mode].color}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          {/* Timer Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-['Alexandria:Medium',_sans-serif] font-medium text-[48px] text-[#202020]">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={toggleTimer}
            className="flex items-center justify-center w-16 h-16 rounded-full transition-colors"
            style={{ backgroundColor: modes[mode].color }}
          >
            {isRunning ? (
              <Pause size={24} className="text-white" />
            ) : (
              <Play size={24} className="text-white ml-1" />
            )}
          </button>
          
          <button
            onClick={resetTimer}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <RotateCcw size={20} className="text-gray-600" />
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 mb-6">
          {Object.entries(modes).map(([key, modeData]) => (
            <button
              key={key}
              onClick={() => switchMode(key as any)}
              className={`px-4 py-2 rounded-lg font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] transition-colors ${
                mode === key 
                  ? 'text-white' 
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
              style={mode === key ? { backgroundColor: modeData.color } : {}}
            >
              {modeData.label}
            </button>
          ))}
        </div>

        {/* Session Counter */}
        <div className="text-center">
          <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] text-gray-600 mb-2">
            Sessões Completas: {completedSessions}
          </p>
          <div className="flex gap-2 justify-center">
            {Array.from({ length: settings.sessionsUntilLongBreak }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index < (completedSessions % settings.sessionsUntilLongBreak)
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute right-[60px] top-[320px] w-[300px] h-[400px] bg-white rounded-[12px] border border-gray-200 shadow-lg p-6">
          <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[20px] text-[#202020] mb-6">
            Configurações
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] text-[#202020] mb-2">
                Tempo de Foco (minutos)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.focusTime}
                onChange={(e) => setSettings(prev => ({ ...prev, focusTime: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-['Alexandria:Regular',_sans-serif] font-normal text-[14px]"
              />
            </div>
            
            <div>
              <label className="block font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] text-[#202020] mb-2">
                Pausa Curta (minutos)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.shortBreak}
                onChange={(e) => setSettings(prev => ({ ...prev, shortBreak: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-['Alexandria:Regular',_sans-serif] font-normal text-[14px]"
              />
            </div>
            
            <div>
              <label className="block font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] text-[#202020] mb-2">
                Pausa Longa (minutos)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.longBreak}
                onChange={(e) => setSettings(prev => ({ ...prev, longBreak: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-['Alexandria:Regular',_sans-serif] font-normal text-[14px]"
              />
            </div>
            
            <div>
              <label className="block font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] text-[#202020] mb-2">
                Sessões até pausa longa
              </label>
              <input
                type="number"
                min="2"
                max="8"
                value={settings.sessionsUntilLongBreak}
                onChange={(e) => setSettings(prev => ({ ...prev, sessionsUntilLongBreak: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-['Alexandria:Regular',_sans-serif] font-normal text-[14px]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}