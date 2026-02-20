import React, { useState, useEffect } from 'react';
import { Play, Pause, X, CheckCircle, Coffee } from 'lucide-react';

interface FocusTimerProps {
  mode: 'FOCUS' | 'BREAK';
  onComplete: (rating?: number) => void;
  onCancel: () => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ mode, onComplete, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(mode === 'FOCUS' ? 60 * 60 : 15 * 60); // 60min focus, 15min break
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setCompleted(true);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'FOCUS' 
    ? ((60 * 60 - timeLeft) / (60 * 60)) * 100 
    : ((15 * 60 - timeLeft) / (15 * 60)) * 100;

  if (completed) {
      return (
          <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 animate-fade-in">
              <div className="bg-emerald-500/20 p-6 rounded-full text-emerald-400 mb-6">
                  <CheckCircle size={48} />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                  {mode === 'FOCUS' ? 'Bloco concluído!' : 'Break finalizado!'}
              </h2>
              <p className="text-slate-400 mb-8 text-center">
                  {mode === 'FOCUS' 
                    ? 'Como foi sua produtividade?' 
                    : 'Você deve estar se sentindo mais recuperado.'}
              </p>

              {mode === 'FOCUS' ? (
                  <div className="grid grid-cols-4 gap-2 w-full">
                      {['😞', '😐', '😊', '🔥'].map((emoji, idx) => (
                          <button 
                            key={idx}
                            onClick={() => onComplete(idx + 1)}
                            className="p-4 bg-slate-800 rounded-xl text-2xl hover:bg-slate-700 transition-colors"
                          >
                              {emoji}
                          </button>
                      ))}
                  </div>
              ) : (
                  <button 
                    onClick={() => onComplete()}
                    className="w-full py-4 bg-emerald-600 rounded-xl font-bold"
                  >
                      Voltar ao Ritmo
                  </button>
              )}
          </div>
      );
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden ${mode === 'FOCUS' ? 'bg-slate-900 text-white' : 'bg-emerald-900 text-white'}`}>
      
      {/* Background Pulse */}
      {isActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-96 h-96 rounded-full opacity-10 animate-ping ${mode === 'FOCUS' ? 'bg-blue-500' : 'bg-emerald-400'}`}></div>
          </div>
      )}

      <div className="z-10 w-full max-w-md text-center">
          <div className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest opacity-70 mb-2">
                  {mode === 'FOCUS' ? 'Foco Ativo' : 'Break Ativo'}
              </h2>
              <h1 className="text-3xl font-bold">
                  {mode === 'FOCUS' ? 'Proposta Cliente X' : 'Caminhada / Alongamento'}
              </h1>
          </div>

          <div className="relative w-64 h-64 mx-auto mb-12 flex items-center justify-center">
              {/* Circular Progress SVG */}
              <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/10"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 120}
                    strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                    className={mode === 'FOCUS' ? 'text-blue-500 transition-all duration-1000' : 'text-emerald-400 transition-all duration-1000'}
                    strokeLinecap="round"
                  />
              </svg>
              <div className="absolute text-5xl font-mono font-bold tracking-tighter">
                  {formatTime(timeLeft)}
              </div>
          </div>

          {mode === 'FOCUS' && (
              <div className="bg-white/5 p-4 rounded-xl mb-8 backdrop-blur-sm">
                  <p className="text-sm opacity-80 flex items-center justify-center gap-2">
                      🔇 Modo Silencioso ATIVO
                  </p>
              </div>
          )}

          {mode === 'BREAK' && (
              <div className="bg-white/10 p-4 rounded-xl mb-8 backdrop-blur-sm text-left">
                  <p className="text-xs font-bold uppercase mb-2 opacity-70">Durante o break:</p>
                  <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2"><CheckCircle size={14} /> Caminhe (não fique sentado)</li>
                      <li className="flex items-center gap-2"><CheckCircle size={14} /> Beba água</li>
                      <li className="flex items-center gap-2"><CheckCircle size={14} /> Olhe para longe (não tela)</li>
                  </ul>
              </div>
          )}

          <div className="flex gap-4">
              {!isActive ? (
                  <button 
                    onClick={() => setIsActive(true)}
                    className="flex-1 py-4 bg-white text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100"
                  >
                      <Play size={20} fill="currentColor" />
                      {timeLeft < (mode === 'FOCUS' ? 3600 : 900) ? 'Continuar' : 'Iniciar'}
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
                onClick={onCancel}
                className="px-6 py-4 bg-transparent border border-white/20 rounded-xl text-white hover:bg-white/10"
              >
                  <X size={24} />
              </button>
          </div>
          
          <button onClick={() => setCompleted(true)} className="mt-6 text-sm opacity-50 hover:opacity-100 underline">
              Finalizar agora (Debug)
          </button>
      </div>
    </div>
  );
};
