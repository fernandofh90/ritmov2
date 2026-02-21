import React, { useState } from 'react';
import { DailyLog } from '../types';
import { Sun, Coffee, Moon, CheckCircle, Battery } from 'lucide-react';

interface MorningCheckinProps {
  onSave: (data: Partial<DailyLog>) => void;
  onSkip: () => void;
}

export const MorningCheckin: React.FC<MorningCheckinProps> = ({ onSave, onSkip }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    sleepHours: 7.5,
    restedLevel: 'OK' as 'TIRED' | 'OK' | 'ENERGIZED',
    hadBreakfast: false
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleComplete = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
        onSave({
        energy: {
            date: new Date().toISOString().split('T')[0],
            physical: {
                sleepHours: data.sleepHours,
                restedLevel: data.restedLevel,
                hadBreakfast: data.hadBreakfast
            },
            mental: { focusBlocks: 0, decisionFatigue: 0 }, // Init
            emotional: { drainers: [], energizers: [], batteryLevel: 80 }, // Init
            social: { interactions: 0, drained: false } // Init
        }
        } as any);
    }, 1500);
  };

  if (isAnalyzing) {
      return (
          <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8">
              <div className="animate-pulse mb-6">
                  <Battery size={64} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Analisando sua energia...</h2>
              <div className="w-full max-w-xs bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 animate-[width_1.5s_ease-out_forwards]" style={{ width: '100%' }}></div>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col justify-center max-w-md mx-auto">
      <div className="mb-8 text-center">
        <Sun className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold">Bom dia!</h2>
        <p className="text-slate-400">
            {step === 1 && "Como você acordou?"}
            {step === 2 && "Dormiu quantas horas?"}
            {step === 3 && "Tomou café da manhã?"}
        </p>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-3 gap-3">
                <button 
                    onClick={() => { setData({...data, restedLevel: 'TIRED'}); setStep(2); }}
                    className="p-4 bg-slate-800 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-700 transition-colors border border-slate-700"
                >
                    <span className="text-3xl">😴</span>
                    <span className="font-bold text-sm">Cansado</span>
                </button>
                <button 
                    onClick={() => { setData({...data, restedLevel: 'OK'}); setStep(2); }}
                    className="p-4 bg-slate-800 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-700 transition-colors border border-slate-700"
                >
                    <span className="text-3xl">😐</span>
                    <span className="font-bold text-sm">OK</span>
                </button>
                <button 
                    onClick={() => { setData({...data, restedLevel: 'ENERGIZED'}); setStep(2); }}
                    className="p-4 bg-slate-800 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-700 transition-colors border border-slate-700"
                >
                    <span className="text-3xl">⚡</span>
                    <span className="font-bold text-sm">Energizado</span>
                </button>
            </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-800 p-8 rounded-3xl text-center border border-slate-700">
            <div className="text-6xl font-bold mb-2">
                {data.sleepHours}
                <span className="text-xl text-slate-400 font-normal ml-1">h</span>
            </div>
            
            <div className="flex items-center gap-4 justify-center mt-8">
                <button onClick={() => setData({...data, sleepHours: Math.max(0, data.sleepHours - 0.5)})} className="w-12 h-12 bg-slate-700 rounded-full text-2xl hover:bg-slate-600">-</button>
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${(data.sleepHours / 12) * 100}%` }}></div>
                </div>
                <button onClick={() => setData({...data, sleepHours: data.sleepHours + 0.5})} className="w-12 h-12 bg-slate-700 rounded-full text-2xl hover:bg-slate-600">+</button>
            </div>
          </div>
          <button onClick={() => setStep(3)} className="w-full py-4 bg-blue-600 rounded-xl font-bold">Continuar</button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-fade-in">
            <button 
                onClick={() => { setData({...data, hadBreakfast: true}); handleComplete(); }}
                className="w-full p-6 bg-slate-800 rounded-2xl flex items-center gap-4 hover:bg-slate-700 border border-slate-700"
            >
                <div className="bg-emerald-500/20 p-3 rounded-full text-emerald-400">
                    <Coffee size={24} />
                </div>
                <div className="text-left">
                    <span className="block font-bold text-lg">Sim, refeição completa</span>
                </div>
            </button>

            <button 
                onClick={() => { setData({...data, hadBreakfast: true}); handleComplete(); }}
                className="w-full p-6 bg-slate-800 rounded-2xl flex items-center gap-4 hover:bg-slate-700 border border-slate-700"
            >
                <div className="bg-amber-500/20 p-3 rounded-full text-amber-400">
                    <Coffee size={24} />
                </div>
                <div className="text-left">
                    <span className="block font-bold text-lg">Só café / rápido</span>
                </div>
            </button>

            <button 
                onClick={() => { setData({...data, hadBreakfast: false}); handleComplete(); }}
                className="w-full p-6 bg-slate-800 rounded-2xl flex items-center gap-4 hover:bg-slate-700 border border-slate-700"
            >
                <div className="bg-rose-500/20 p-3 rounded-full text-rose-400">
                    <Moon size={24} />
                </div>
                <div className="text-left">
                    <span className="block font-bold text-lg">Não, vou comer depois</span>
                </div>
            </button>
        </div>
      )}
      
      <button onClick={onSkip} className="mt-8 text-slate-500 text-sm">
        Pular check-in
      </button>
    </div>
  );
};
