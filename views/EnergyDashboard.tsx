import React, { useMemo, useState, useEffect } from 'react';
import { DailyLog, UserConfig } from '../types';
import { Battery, Zap, Brain, Heart, Users, AlertTriangle, Calendar, ArrowRight, Coffee, Clock } from 'lucide-react';

interface EnergyDashboardProps {
  logs: DailyLog[];
  config: UserConfig;
  onCheckinClick: () => void;
  onFocusClick: () => void;
  onBreakClick: () => void;
  onEveningClick: () => void;
  onMeetingClick: () => void;
}

const RECOVERY_PHRASES = [
    "Pausas curtas evitam decisões longas e erradas.",
    "Sua mente precisa de silêncio para voltar a ter foco.",
    "Respire fundo. A produtividade volta com o oxigênio.",
    "Um break de 5 minutos economiza 1 hora de retrabalho.",
    "Não é sobre parar, é sobre reabastecer.",
    "Energia baixa cria problemas que não existem.",
    "Saia da tela. Olhe para o horizonte.",
    "Beba água. Seu cérebro é 75% água.",
    "Estique o corpo. A tensão bloqueia o fluxo mental.",
    "Recupere o controle do seu dia parando por um instante."
];

export const EnergyDashboard: React.FC<EnergyDashboardProps> = ({ 
  logs, 
  config, 
  onCheckinClick, 
  onFocusClick,
  onBreakClick,
  onEveningClick,
  onMeetingClick
}) => {
  const todayLog = logs.find(l => l.date === new Date().toISOString().split('T')[0]);
  const energy = todayLog?.energy;
  const [recoveryPhrase, setRecoveryPhrase] = useState("");

  useEffect(() => {
      setRecoveryPhrase(RECOVERY_PHRASES[Math.floor(Math.random() * RECOVERY_PHRASES.length)]);
  }, []);

  // Calculate scores
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

  // Dynamic Targets Calculation
  const adjustedTargets = useMemo(() => {
      let multiplier = 1;
      if (scores.total > 90) multiplier = 1.2;
      else if (scores.total > 80) multiplier = 1.1;
      else if (scores.total >= 65) multiplier = 1;
      else if (scores.total >= 50) multiplier = 0.9;
      else multiplier = 0.7; // Very low energy

      return {
          contacts: Math.ceil(config.dailyTargets.contacts * multiplier),
          conversations: Math.ceil(config.dailyTargets.conversations * multiplier),
          meetings: Math.ceil(config.dailyTargets.meetings * multiplier),
          sales: Math.ceil(config.dailyTargets.sales * multiplier),
          multiplier
      };
  }, [scores.total, config.dailyTargets]);

  const getMultiplierLabel = (m: number) => {
      if (m > 1) return <span className="text-emerald-600 font-bold text-xs">(+{Math.round((m-1)*100)}%)</span>;
      if (m < 1) return <span className="text-rose-600 font-bold text-xs">({Math.round((m-1)*100)}%)</span>;
      return <span className="text-slate-400 text-xs">(Base)</span>;
  };

  const schedule = useMemo(() => {
      // Hourly schedule 9h-17h
      const hours = [
          { time: '09:00', label: 'Início / Foco' },
          { time: '10:00', label: 'Reuniões' },
          { time: '11:00', label: 'Prospecção' },
          { time: '12:00', label: 'Almoço' },
          { time: '13:00', label: 'Admin / Leve' },
          { time: '14:00', label: 'Foco Tarde' },
          { time: '15:00', label: 'Follow-up' },
          { time: '16:00', label: 'Fechamento' },
          { time: '17:00', label: 'Fim do Dia' },
      ];
      return hours;
  }, []);

  const getTipOfTheDay = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Manhã é para criar. Ataque a tarefa mais difícil agora.";
      if (hour < 16) return "Pós-almoço pede tarefas mecânicas. Evite decisões complexas.";
      return "Fim de tarde é para conectar. Faça follow-ups e planeje amanhã.";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Energy Recovery Warning */}
      {scores.total < 65 && scores.total > 0 && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl shadow-sm animate-pulse">
              <div className="flex items-start gap-3">
                  <div className="bg-rose-100 p-2 rounded-full text-rose-600">
                      <Battery size={20} />
                  </div>
                  <div>
                      <h3 className="font-bold text-rose-900 text-sm mb-1">Recuperação Necessária</h3>
                      <p className="text-xs text-rose-700 mb-2 leading-relaxed">
                          {recoveryPhrase}
                      </p>
                      <button 
                        onClick={onBreakClick}
                        className="text-xs font-bold bg-white text-rose-600 px-3 py-1.5 rounded-lg border border-rose-200 shadow-sm"
                      >
                          Iniciar Pausa Agora
                      </button>
                  </div>
              </div>
          </div>
      )}

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

      {/* Dynamic Suggested Rhythm */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Calendar size={18} className="text-slate-500" />
                  Ritmo Sugerido
              </h3>
              {getMultiplierLabel(adjustedTargets.multiplier)}
          </div>
          
          {/* Targets Grid */}
          <div className="grid grid-cols-4 divide-x divide-slate-100 border-b border-slate-100">
              <div className="p-3 text-center">
                  <div className="text-xs text-slate-500 mb-1">Contatos</div>
                  <div className="font-bold text-slate-900">{adjustedTargets.contacts}</div>
              </div>
              <div className="p-3 text-center">
                  <div className="text-xs text-slate-500 mb-1">Conversas</div>
                  <div className="font-bold text-slate-900">{adjustedTargets.conversations}</div>
              </div>
              <div className="p-3 text-center">
                  <div className="text-xs text-slate-500 mb-1">Reuniões</div>
                  <div className="font-bold text-slate-900">{adjustedTargets.meetings}</div>
              </div>
              <div className="p-3 text-center">
                  <div className="text-xs text-slate-500 mb-1">Vendas</div>
                  <div className="font-bold text-slate-900">{adjustedTargets.sales}</div>
              </div>
          </div>

          {/* Hourly Schedule */}
          <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto no-scrollbar">
              {schedule.map((item, idx) => (
                  <div key={idx} className="px-4 py-3 flex gap-4 items-center">
                      <div className="font-mono text-xs font-bold text-slate-400 w-10">{item.time}</div>
                      <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                      <div className="text-xs text-slate-600 font-medium">{item.label}</div>
                  </div>
              ))}
              {/* 
              <div className="p-3 text-center">
                  <button className="text-xs font-bold text-blue-600 flex items-center justify-center gap-1 w-full py-2 hover:bg-blue-50 rounded-lg transition-colors">
                      Ver agenda completa <ArrowRight size={12} />
                  </button>
              </div> 
              */}
          </div>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Row 1 */}
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
            onClick={onMeetingClick}
            className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors text-left"
        >
            <div className="bg-indigo-50 w-10 h-10 rounded-full flex items-center justify-center text-indigo-600 mb-2">
                <Users size={20} />
            </div>
            <span className="font-bold text-slate-900 block text-sm">Entrar em Reunião</span>
            <span className="text-xs text-slate-500">Monitorar tempo</span>
        </button>

        {/* Row 2 */}
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

        {/* Row 3 */}
        <button 
            onClick={onEveningClick}
            className="col-span-2 p-4 bg-slate-900 border border-slate-900 rounded-2xl shadow-sm hover:bg-slate-800 transition-colors flex items-center justify-between"
        >
            <div className="flex items-center gap-3">
                <div className="bg-slate-800 w-10 h-10 rounded-full flex items-center justify-center text-white">
                    <ArrowRight size={20} />
                </div>
                <div className="text-left">
                    <span className="font-bold text-white block text-sm">Fim do Dia</span>
                    <span className="text-xs text-slate-400">Check-out & Registro</span>
                </div>
            </div>
            <Clock size={20} className="text-slate-500" />
        </button>
      </div>

      {/* Daily Tip */}
      <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl shadow-sm">
          <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Zap size={16} /> Dica de agora
          </h3>
          <p className="text-sm text-amber-800 italic">
              "{getTipOfTheDay()}"
          </p>
      </div>
    </div>
  );
};
