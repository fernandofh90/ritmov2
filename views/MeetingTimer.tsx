import React, { useState, useEffect } from 'react';
import { Play, Pause, X, CheckCircle, Users } from 'lucide-react';

interface MeetingTimerProps {
  onComplete: (duration: number) => void;
  onCancel: () => void;
}

export const MeetingTimer: React.FC<MeetingTimerProps> = ({ onComplete, onCancel }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
        return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      {/* Background Pulse */}
      {isActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 rounded-full bg-blue-500 opacity-10 animate-ping"></div>
          </div>
      )}

      <div className="z-10 w-full max-w-md text-center">
          <div className="mb-8">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                  <Users size={32} />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-widest opacity-70 mb-2">
                  Reunião em Andamento
              </h2>
              <h1 className="text-5xl font-mono font-bold tracking-tighter mb-4">
                  {formatTime(seconds)}
              </h1>
              <p className="text-slate-400 text-sm">
                  O RITMO está monitorando o tempo para ajustar sua energia depois.
              </p>
          </div>

          <div className="flex gap-4">
              {!isActive ? (
                  <button 
                    onClick={() => setIsActive(true)}
                    className="flex-1 py-4 bg-white text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100"
                  >
                      <Play size={20} fill="currentColor" />
                      Retomar
                  </button>
              ) : (
                  <button 
                    onClick={() => setIsActive(false)}
                    className="flex-1 py-4 bg-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20"
                  >
                      <Pause size={20} fill="currentColor" />
                      Pausar
                  </button>
              )}
              
              <button 
                onClick={() => onComplete(seconds)}
                className="px-6 py-4 bg-rose-600 rounded-xl text-white font-bold hover:bg-rose-700"
              >
                  Encerrar
              </button>
          </div>
          
          <button onClick={onCancel} className="mt-8 text-sm opacity-50 hover:opacity-100 underline">
              Cancelar (não salvar)
          </button>
      </div>
    </div>
  );
};
