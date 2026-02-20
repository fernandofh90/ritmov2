import React, { useState, useEffect } from 'react';
import { DailyLog } from '../types';
import { Save, CheckCircle, DollarSign } from 'lucide-react';
import { StorageService } from '../services/storage';

interface DailyLogProps {
  onSave: (log: DailyLog) => void;
  existingLog?: DailyLog | null;
}

export const DailyLogView: React.FC<DailyLogProps> = ({ onSave, existingLog }) => {
  const [log, setLog] = useState<DailyLog>({
    date: new Date().toISOString().split('T')[0],
    contacts: 0,
    conversations: 0,
    meetings: 0,
    sales: 0,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Check if there's already a log for today in storage to pre-fill
    const today = new Date().toISOString().split('T')[0];
    const stored = StorageService.getLogForDate(today);
    if (stored) {
      setLog({ ...log, ...stored }); // Merge to ensure new fields are covered
    }
  }, []);

  const handleSave = () => {
    onSave(log);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000); // Reset feedback
  };

  const increment = (field: keyof Omit<DailyLog, 'date'>) => {
    setLog(prev => ({ ...prev, [field]: Number(prev[field]) + 1 }));
  };

  if (saved) {
      return (
          <div className="h-[60vh] flex flex-col items-center justify-center animate-fade-in">
              <div className="bg-emerald-100 text-emerald-600 p-6 rounded-full mb-6">
                  <CheckCircle size={48} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Registro Salvo</h2>
              <p className="text-slate-500">Seu ritmo foi atualizado.</p>
          </div>
      )
  }

  return (
    <div className="max-w-md mx-auto py-4 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Registro Diário</h2>
        <p className="text-slate-500 text-sm mt-1">
            Não é necessário detalhar nomes. Apenas a quantidade real.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
             Contatos Feitos
          </label>
          <div className="flex items-center gap-4">
             <input
                type="number"
                inputMode="numeric"
                className="flex-1 text-3xl font-bold text-slate-900 border-b-2 border-slate-100 focus:border-blue-500 outline-none pb-1 bg-transparent transition-colors"
                value={log.contacts || ''}
                placeholder="0"
                onChange={(e) => setLog({ ...log, contacts: Number(e.target.value) })}
             />
             <button 
                onClick={() => increment('contacts')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-colors"
             >
                +
             </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
             Conversas Reais
          </label>
          <div className="flex items-center gap-4">
             <input
                type="number"
                inputMode="numeric"
                className="flex-1 text-3xl font-bold text-slate-900 border-b-2 border-slate-100 focus:border-blue-500 outline-none pb-1 bg-transparent transition-colors"
                value={log.conversations || ''}
                placeholder="0"
                onChange={(e) => setLog({ ...log, conversations: Number(e.target.value) })}
             />
             <button 
                onClick={() => increment('conversations')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-colors"
             >
                +
             </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
             Reuniões Agendadas
          </label>
          <div className="flex items-center gap-4">
             <input
                type="number"
                inputMode="numeric"
                className="flex-1 text-3xl font-bold text-slate-900 border-b-2 border-slate-100 focus:border-blue-500 outline-none pb-1 bg-transparent transition-colors"
                value={log.meetings || ''}
                placeholder="0"
                onChange={(e) => setLog({ ...log, meetings: Number(e.target.value) })}
             />
             <button 
                onClick={() => increment('meetings')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-colors"
             >
                +
             </button>
          </div>
        </div>

        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 shadow-sm">
          <label className="block text-xs font-bold text-emerald-600 mb-2 uppercase tracking-wide flex items-center gap-2">
             <DollarSign size={14} />
             Vendas Fechadas
          </label>
          <div className="flex items-center gap-4">
             <input
                type="number"
                inputMode="numeric"
                className="flex-1 text-3xl font-bold text-slate-900 border-b-2 border-emerald-200 focus:border-emerald-500 outline-none pb-1 bg-transparent transition-colors"
                value={log.sales || ''}
                placeholder="0"
                onChange={(e) => setLog({ ...log, sales: Number(e.target.value) })}
             />
             <button 
                onClick={() => increment('sales')}
                className="bg-emerald-200 hover:bg-emerald-300 text-emerald-800 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-colors"
             >
                +
             </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full mt-8 bg-slate-900 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg active:scale-[0.98]"
      >
        <Save size={20} />
        Salvar Ritmo de Hoje
      </button>
    </div>
  );
};
