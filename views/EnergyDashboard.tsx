import React, { useMemo } from 'react';
import { DailyLog, UserConfig } from '../types';
import { Battery, Zap, Brain, Heart, Users, AlertTriangle, Calendar, ArrowRight, Coffee } from 'lucide-react';

interface EnergyDashboardProps {
  logs: DailyLog[];
  config: UserConfig;
  onCheckinClick: () => void;
  onFocusClick: () => void;
  onBreakClick: () => void;
  onEveningClick: () => void;
}

export const EnergyDashboard: React.FC<EnergyDashboardProps> = ({ 
  logs, 
  config, 
  onCheckinClick, 
  onFocusClick,
  onBreakClick,
  onEveningClick
}) => {
  const todayLog = logs.find(l => l.date === new Date().toISOString().split('T')[0]);
  const energy = todayLog?.energy;

  // Calculate scores (Mock logic for V1 if no data)
  const scores = useMemo(() => {
    if (!energy) return { physical: 0, mental: 70, emotional: 70, social: 70, total: 0 };

    let physical = 50;
    if (energy.physical.sleepHours >= config.sleepGoal) physical += 30;
    if (energy.physical.restedLevel === 'ENERGIZED') physical += 20;
    if (energy.physical.restedLevel === 'OK') physical += 10;
    if (energy.physical.hadBreakfast) physical += 10;

    // Placeholder logic for others until we have real inputs
    const mental = 72; 
    const emotional = 80;
    const social = 75;

    const total = Math.round((physical + mental + emotional + social) / 4);
    return { physical, mental, emotional, social, total };
  }, [energy, config.sleepGoal]);

  const getBatteryColor = (level: number) => {
    if (level > 75) return 'bg-emerald-500';
    if (level > 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const schedule = useMemo(() => {
      // Simple mock schedule based on peak productivity
      if (config.peakProductivity === 'MORNING') {
          return [
              { time: '8h-11h', type: '🔥 BLOCO PESADO', desc: 'Trabalho que exige foco' },
              { time: '11h-12h', type: '📧 Tarefas leves', desc: 'Emails, admin' },
              { time: '12h-13h', type: '🍽️ ALMOÇO', desc: 'Obrigatório' },
          ];
      } else {
          return [
              { time: '9h-10h', type: '📧 Admin/Emails', desc: 'Aquecimento' },
              { time: '10h-12h', type: '📞 Reuniões', desc: 'Energia média' },
              { time: '14h-17h', type: '🔥 BLOCO PESADO', desc: 'Seu pico de energia' },
          ];
      }
  }, [config.peakProductivity]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Main Energy Battery */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Energia Total</h2>
                <div className="text-4xl font-bold mt-1 flex items-baseline gap-2">
                    {scores.total > 0 ? `${scores.total}%` : '--'}
                    <span className="text-sm font-normal text-slate-400">
                        {scores.total > 70 ? '⚡ Produtivo' : '⚠️ Atenção'}
                    </span>
                </div>
            </div>
            <div className="bg-slate-800 p-2 rounded-lg">
                <Battery size={24} className={scores.total > 70 ? 'text-emerald-400' : 'text-amber-400'} />
            </div>
        </div>

        <div className="space-y-4">
            {/* Physical */}
            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1 text-slate-300"><Zap size={12} /> Física</span>
                    <span className="font-mono">{scores.physical}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getBatteryColor(scores.physical)}`} style={{ width: `${scores.physical}%` }} />
                </div>
            </div>

            {/* Mental */}
            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1 text-slate-300"><Brain size={12} /> Mental</span>
                    <span className="font-mono">{scores.mental}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getBatteryColor(scores.mental)}`} style={{ width: `${scores.mental}%` }} />
                </div>
            </div>

            {/* Emotional */}
            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1 text-slate-300"><Heart size={12} /> Emocional</span>
                    <span className="font-mono">{scores.emotional}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getBatteryColor(scores.emotional)}`} style={{ width: `${scores.emotional}%` }} />
                </div>
            </div>

            {/* Social */}
            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1 text-slate-300"><Users size={12} /> Social</span>
                    <span className="font-mono">{scores.social}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getBatteryColor(scores.social)}`} style={{ width: `${scores.social}%` }} />
                </div>
            </div>
        </div>
      </div>

      {/* Suggested Schedule */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Calendar size={18} className="text-slate-500" />
                  Ritmo Sugerido
              </h3>
              <span className="text-xs font-bold text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-md">
                  {config.peakProductivity === 'MORNING' ? 'Manhã' : 'Tarde'}
              </span>
          </div>
          <div className="divide-y divide-slate-100">
              {schedule.map((item, idx) => (
                  <div key={idx} className="p-4 flex gap-4">
                      <div className="font-mono text-xs font-bold text-slate-400 w-12 pt-1">{item.time}</div>
                      <div>
                          <div className="font-bold text-slate-900 text-sm">{item.type}</div>
                          <div className="text-xs text-slate-500">{item.desc}</div>
                      </div>
                  </div>
              ))}
              <div className="p-3 text-center">
                  <button className="text-xs font-bold text-blue-600 flex items-center justify-center gap-1 w-full py-2 hover:bg-blue-50 rounded-lg transition-colors">
                      Ver agenda completa <ArrowRight size={12} />
                  </button>
              </div>
          </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button 
            onClick={onCheckinClick}
            className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors text-left"
        >
            <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 mb-2">
                <Zap size={20} />
            </div>
            <span className="font-bold text-slate-900 block text-sm">Check-in Energia</span>
            <span className="text-xs text-slate-500">Atualizar status</span>
        </button>

        <button 
            onClick={onFocusClick}
            className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors text-left"
        >
            <div className="bg-purple-50 w-10 h-10 rounded-full flex items-center justify-center text-purple-600 mb-2">
                <Brain size={20} />
            </div>
            <span className="font-bold text-slate-900 block text-sm">Bloco de Foco</span>
            <span className="text-xs text-slate-500">Iniciar 60min</span>
        </button>

        <button 
            onClick={onBreakClick}
            className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors text-left"
        >
            <div className="bg-emerald-50 w-10 h-10 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                <Coffee size={20} />
            </div>
            <span className="font-bold text-slate-900 block text-sm">Pausa / Break</span>
            <span className="text-xs text-slate-500">Recuperar 15min</span>
        </button>

        <button 
            onClick={onEveningClick}
            className="p-4 bg-slate-900 border border-slate-900 rounded-2xl shadow-sm hover:bg-slate-800 transition-colors text-left"
        >
            <div className="bg-slate-800 w-10 h-10 rounded-full flex items-center justify-center text-white mb-2">
                <ArrowRight size={20} />
            </div>
            <span className="font-bold text-white block text-sm">Fim do Dia</span>
            <span className="text-xs text-slate-400">Check-out</span>
        </button>
      </div>

      {/* Daily Tip */}
      <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl shadow-sm">
          <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Zap size={16} /> Dica de hoje
          </h3>
          <p className="text-sm text-amber-800 italic">
              "Sua energia está ALTA. Tackle a tarefa mais difícil AGORA."
          </p>
      </div>
    </div>
  );
};
