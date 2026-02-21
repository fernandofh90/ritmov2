import React, { useState } from 'react';
import { UserConfig } from '../types';
import { Target, CheckCircle, ArrowLeft } from 'lucide-react';

interface GoalAdjustmentProps {
  currentConfig: UserConfig;
  onSave: (newConfig: UserConfig) => void;
  onCancel: () => void;
}

export const GoalAdjustment: React.FC<GoalAdjustmentProps> = ({ currentConfig, onSave, onCancel }) => {
  const [targets, setTargets] = useState(currentConfig.dailyTargets);

  const handleSave = () => {
    onSave({
      ...currentConfig,
      dailyTargets: targets
    });
  };

  return (
    <div className="animate-fade-in p-2">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <ArrowLeft size={24} />
        </button>
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Ajustar Metas</h2>
            <p className="text-slate-500 text-sm">O que você consegue fazer repetidamente?</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 mb-2 text-blue-600">
            <Target size={24} />
            <h3 className="font-bold text-lg">Metas Diárias Base</h3>
        </div>

        <div className="space-y-5">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    Contatos Realizados
                </label>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setTargets({...targets, contacts: Math.max(0, targets.contacts - 1)})}
                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600 hover:bg-slate-200"
                    >
                        -
                    </button>
                    <div className="flex-1 text-center">
                        <span className="text-3xl font-bold text-slate-900">{targets.contacts}</span>
                    </div>
                    <button 
                        onClick={() => setTargets({...targets, contacts: targets.contacts + 1})}
                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600 hover:bg-slate-200"
                    >
                        +
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    Conversas Iniciadas
                </label>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setTargets({...targets, conversations: Math.max(0, targets.conversations - 1)})}
                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600 hover:bg-slate-200"
                    >
                        -
                    </button>
                    <div className="flex-1 text-center">
                        <span className="text-3xl font-bold text-slate-900">{targets.conversations}</span>
                    </div>
                    <button 
                        onClick={() => setTargets({...targets, conversations: targets.conversations + 1})}
                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600 hover:bg-slate-200"
                    >
                        +
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    Reuniões Agendadas
                </label>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setTargets({...targets, meetings: Math.max(0, targets.meetings - 1)})}
                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600 hover:bg-slate-200"
                    >
                        -
                    </button>
                    <div className="flex-1 text-center">
                        <span className="text-3xl font-bold text-slate-900">{targets.meetings}</span>
                    </div>
                    <button 
                        onClick={() => setTargets({...targets, meetings: targets.meetings + 1})}
                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600 hover:bg-slate-200"
                    >
                        +
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    Vendas Fechadas (Conversão)
                </label>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setTargets({...targets, sales: Math.max(0, targets.sales - 1)})}
                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600 hover:bg-slate-200"
                    >
                        -
                    </button>
                    <div className="flex-1 text-center">
                        <span className="text-3xl font-bold text-slate-900">{targets.sales}</span>
                    </div>
                    <button 
                        onClick={() => setTargets({...targets, sales: targets.sales + 1})}
                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600 hover:bg-slate-200"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        className="w-full mt-6 py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-blue-700 transition-all active:scale-[0.98]"
      >
        <CheckCircle size={20} />
        Salvar Novas Metas
      </button>
    </div>
  );
};
