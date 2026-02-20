import React, { useState } from 'react';
import { DailyLog } from '../types';
import { Moon, Battery, ThumbsUp, ThumbsDown, Meh } from 'lucide-react';

interface EveningCheckoutProps {
  onSave: (data: Partial<DailyLog>) => void;
}

export const EveningCheckout: React.FC<EveningCheckoutProps> = ({ onSave }) => {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<'BAD' | 'OK' | 'GOOD' | null>(null);
  const [drainers, setDrainers] = useState<string[]>([]);
  const [energizers, setEnergizers] = useState<string[]>([]);

  const handleComplete = () => {
    // Save logic would go here, updating the log
    onSave({
        // Just a mock update for now
    });
  };

  const toggleItem = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
      if (list.includes(item)) {
          setList(list.filter(i => i !== item));
      } else {
          setList([...list, item]);
      }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col justify-center max-w-md mx-auto">
      <div className="mb-8 text-center">
        <Moon className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Check-out do Dia</h2>
        <p className="text-slate-400">Hora de desligar e recuperar.</p>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <p className="text-center font-bold text-lg">Como foi seu dia?</p>
          <div className="grid grid-cols-3 gap-3">
                <button 
                    onClick={() => { setMood('BAD'); setStep(2); }}
                    className="p-4 bg-slate-800 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-700 border border-slate-700"
                >
                    <ThumbsDown size={32} className="text-rose-400" />
                    <span className="font-bold text-sm">Pesado</span>
                </button>
                <button 
                    onClick={() => { setMood('OK'); setStep(2); }}
                    className="p-4 bg-slate-800 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-700 border border-slate-700"
                >
                    <Meh size={32} className="text-amber-400" />
                    <span className="font-bold text-sm">OK</span>
                </button>
                <button 
                    onClick={() => { setMood('GOOD'); setStep(2); }}
                    className="p-4 bg-slate-800 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-700 border border-slate-700"
                >
                    <ThumbsUp size={32} className="text-emerald-400" />
                    <span className="font-bold text-sm">Produtivo</span>
                </button>
            </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
           <div className="flex items-center gap-2 mb-2">
               <Battery size={20} className="text-rose-400" />
               <h3 className="font-bold">O que DRENOU energia?</h3>
           </div>
           <div className="space-y-2">
               {['Reunião específica', 'Cliente difícil', 'Tarefas burocráticas', 'Conflito com equipe', 'Problemas técnicos'].map(item => (
                   <button
                    key={item}
                    onClick={() => toggleItem(item, drainers, setDrainers)}
                    className={`w-full p-4 rounded-xl text-left transition-colors ${drainers.includes(item) ? 'bg-rose-900/50 border-rose-500 border' : 'bg-slate-800 border border-slate-700'}`}
                   >
                       {item}
                   </button>
               ))}
           </div>
           <button onClick={() => setStep(3)} className="w-full py-4 bg-blue-600 rounded-xl font-bold mt-4">Continuar</button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
           <div className="flex items-center gap-2 mb-2">
               <Battery size={20} className="text-emerald-400" />
               <h3 className="font-bold">O que DEU energia?</h3>
           </div>
           <div className="space-y-2">
               {['Fechei venda/meta', 'Elogio de cliente', 'Problema resolvido', 'Tempo com equipe', 'Aprendizado novo'].map(item => (
                   <button
                    key={item}
                    onClick={() => toggleItem(item, energizers, setEnergizers)}
                    className={`w-full p-4 rounded-xl text-left transition-colors ${energizers.includes(item) ? 'bg-emerald-900/50 border-emerald-500 border' : 'bg-slate-800 border border-slate-700'}`}
                   >
                       {item}
                   </button>
               ))}
           </div>
           <button onClick={handleComplete} className="w-full py-4 bg-blue-600 rounded-xl font-bold mt-4">Finalizar Dia</button>
        </div>
      )}
    </div>
  );
};
