import React, { useMemo } from 'react';
import { DailyLog, UserConfig, RhythmStatus } from '../types';
import { calculateRhythmStatus, getWeeklyLogs } from '../services/ritmoLogic';
import { Activity, Phone, MessageSquare, Calendar, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  logs: DailyLog[];
  config: UserConfig;
  onLogClick: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ logs, config, onLogClick }) => {
  const { status, message, totals } = useMemo(() => {
    const weeklyLogs = getWeeklyLogs(logs);
    return calculateRhythmStatus(weeklyLogs, config);
  }, [logs, config]);

  const weeklyLogsReversed = useMemo(() => getWeeklyLogs(logs).reverse(), [logs]);
  // Prepare chart data (simple consistency trend based on contacts)
  const chartData = useMemo(() => {
    const data = weeklyLogsReversed.map(log => ({
      name: new Date(log.date).toLocaleDateString('pt-BR', { weekday: 'short' }),
      contatos: log.contacts
    }));
    if (data.length === 0) return [{ name: 'Hoje', contatos: 0 }];
    return data;
  }, [weeklyLogsReversed]);

  const getStatusColor = (s: RhythmStatus) => {
    switch (s) {
      case RhythmStatus.HEALTHY: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case RhythmStatus.MEDIUM: return 'text-amber-600 bg-amber-50 border-amber-100';
      case RhythmStatus.LOW: return 'text-rose-600 bg-rose-50 border-rose-100';
    }
  };

  const getStatusIndicator = (s: RhythmStatus) => {
    switch (s) {
      case RhythmStatus.HEALTHY: return 'bg-emerald-500';
      case RhythmStatus.MEDIUM: return 'bg-amber-500';
      case RhythmStatus.LOW: return 'bg-rose-500';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Main Status Card */}
      <div className={`p-6 rounded-2xl border ${getStatusColor(status)} shadow-sm transition-colors duration-500`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-3 h-3 rounded-full ${getStatusIndicator(status)} animate-pulse`} />
          <span className="font-bold tracking-wide text-sm uppercase opacity-90">Ritmo {status}</span>
        </div>
        <p className="text-xl font-medium leading-relaxed opacity-90">
          {message}
        </p>
      </div>

      {/* Stats Grid 2x2 */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1 mb-2">Esta Semana</h3>
        
        <div className="grid grid-cols-2 gap-3">
            {/* Contacts */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                  <Phone size={18} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{totals.contacts}</div>
                </div>
              </div>
              <div>
                  <div className="text-xs text-slate-500 mb-2">Contatos</div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-slate-900" 
                        style={{ width: `${Math.min((totals.contacts / (config.dailyTargets.contacts * 5)) * 100, 100)}%` }} 
                      />
                  </div>
              </div>
            </div>

            {/* Conversations */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                  <MessageSquare size={18} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{totals.conversations}</div>
                </div>
              </div>
              <div>
                  <div className="text-xs text-slate-500 mb-2">Conversas</div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-slate-400" 
                        style={{ width: `${Math.min((totals.conversations / (config.dailyTargets.conversations * 5)) * 100, 100)}%` }} 
                      />
                  </div>
              </div>
            </div>

            {/* Meetings */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                  <Calendar size={18} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{totals.meetings}</div>
                </div>
              </div>
              <div>
                  <div className="text-xs text-slate-500 mb-2">Reuniões</div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-slate-400" 
                        style={{ width: `${Math.min((totals.meetings / (config.dailyTargets.meetings * 5)) * 100, 100)}%` }} 
                      />
                  </div>
              </div>
            </div>

            {/* Sales (New) */}
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm flex flex-col justify-between h-32">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-white rounded-lg text-emerald-600">
                  <DollarSign size={18} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-900">{totals.sales}</div>
                </div>
              </div>
              <div>
                  <div className="text-xs text-emerald-700 mb-2">Vendas</div>
                  <div className="w-full h-1 bg-emerald-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500" 
                        style={{ width: `${Math.min((totals.sales / (config.dailyTargets.sales * 5)) * 100, 100)}%` }} 
                      />
                  </div>
              </div>
            </div>
        </div>
      </div>

      {/* Simple Trend Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-slate-400" />
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tendência de Contatos</h3>
        </div>
        <div className="h-32 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={chartData}>
               <defs>
                 <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                   <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <Tooltip 
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 cursor={{ stroke: '#cbd5e1' }}
               />
               <Area type="monotone" dataKey="contatos" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorContacts)" />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Subtext */}
      <div className="text-center p-4">
        <p className="text-xs text-slate-500 italic">
          "O foco é manter constância, não performance pontual."
        </p>
      </div>

      <button 
        onClick={onLogClick} 
        className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold shadow-lg hover:bg-slate-800 transition-all active:scale-[0.98]"
      >
        Registrar Ações de Hoje
      </button>

    </div>
  );
};
