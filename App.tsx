import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard'; // Sales Dashboard
import { EnergyDashboard } from './views/EnergyDashboard'; // New Energy Dashboard
import { DailyLogView } from './views/DailyLog';
import { Guidance } from './views/Guidance';
import { MorningCheckin } from './views/MorningCheckin';
import { EveningCheckout } from './views/EveningCheckout';
import { FocusTimer } from './views/FocusTimer';
import { MeetingTimer } from './views/MeetingTimer';
import { GoalAdjustment } from './views/GoalAdjustment';
import { StorageService } from './services/storage';
import { UserConfig, DailyLog, ViewState } from './types';
import { INITIAL_CONFIG } from './constants';
import { calculateRhythmStatus, getWeeklyLogs } from './services/ritmoLogic';

// Tailwind custom animation class extension via style tag injection for smoother UX
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }
`;
document.head.appendChild(style);

const App: React.FC = () => {
  const [config, setConfig] = useState<UserConfig>(INITIAL_CONFIG);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [view, setView] = useState<ViewState>('dashboard');
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const storedConfig = StorageService.getConfig();
    const storedLogs = StorageService.getLogs();
    
    setConfig(storedConfig);
    setLogs(storedLogs);
    setLoading(false);

    // Check if morning checkin is needed
    if (storedConfig.isOnboarded) {
        const today = new Date().toISOString().split('T')[0];
        const todayLog = storedLogs.find(l => l.date === today);
        if (!todayLog || !todayLog.energy) {
            setView('morning-checkin');
        }
    }
  }, []);

  const handleOnboardingComplete = (newConfig: UserConfig) => {
    StorageService.saveConfig(newConfig);
    setConfig(newConfig);
    setView('morning-checkin'); // Go to checkin after onboarding
  };

  const handleConfigUpdate = (newConfig: UserConfig) => {
      StorageService.saveConfig(newConfig);
      setConfig(newConfig);
      setView('dashboard');
  };

  const handleSaveLog = (log: DailyLog) => {
    StorageService.saveLog(log);
    setLogs(StorageService.getLogs()); // Refresh logs
    setTimeout(() => {
        setView('dashboard');
    }, 1500);
  };

  const handleEnergyUpdate = (partialLog: Partial<DailyLog>) => {
      const today = new Date().toISOString().split('T')[0];
      const existingLog = logs.find(l => l.date === today) || {
          date: today,
          contacts: 0,
          conversations: 0,
          meetings: 0,
          sales: 0
      };

      const updatedLog = { ...existingLog, ...partialLog };
      StorageService.saveLog(updatedLog);
      setLogs(StorageService.getLogs());
      // Don't change view here automatically unless specified
  };

  const handleReset = () => {
      if(window.confirm("Deseja reiniciar as configurações?")) {
          const resetConfig = { ...INITIAL_CONFIG, isOnboarded: false };
          StorageService.saveConfig(resetConfig);
          setConfig(resetConfig);
      }
  };

  if (loading) return null;

  if (!config.isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} initialConfig={config} />;
  }

  // Calculate status for passing down if needed
  const weeklyLogs = getWeeklyLogs(logs);
  const { status } = calculateRhythmStatus(weeklyLogs, config);

  return (
    <>
        {view === 'morning-checkin' ? (
            <MorningCheckin 
                onSave={(data) => {
                    handleEnergyUpdate(data);
                    setView('dashboard');
                }} 
                onSkip={() => setView('dashboard')} 
            />
        ) : view === 'focus-mode' ? (
            <FocusTimer 
                mode="FOCUS" 
                onComplete={() => setView('dashboard')} 
                onCancel={() => setView('dashboard')} 
            />
        ) : view === 'break-mode' ? (
            <FocusTimer 
                mode="BREAK" 
                onComplete={() => setView('dashboard')} 
                onCancel={() => setView('dashboard')} 
            />
        ) : view === 'meeting-mode' ? (
            <MeetingTimer 
                onComplete={(duration) => {
                    // Could log meeting duration here
                    setView('dashboard');
                }} 
                onCancel={() => setView('dashboard')} 
            />
        ) : view === 'evening-checkin' ? (
            <EveningCheckout 
                onSave={(data) => {
                    handleEnergyUpdate(data);
                    setView('log'); // Go to Daily Log after checkout
                }} 
            />
        ) : (
            <Layout currentView={view} setView={setView}>
            {view === 'dashboard' && (
                <div className="space-y-8">
                    <EnergyDashboard 
                        logs={logs} 
                        config={config} 
                        onCheckinClick={() => setView('morning-checkin')} 
                        onFocusClick={() => setView('focus-mode')}
                        onBreakClick={() => setView('break-mode')}
                        onEveningClick={() => setView('evening-checkin')}
                        onMeetingClick={() => setView('meeting-mode')}
                    />
                    
                    {/* Legacy Sales Dashboard as a section below */}
                    <div className="pt-8 border-t border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4 px-2">Performance Comercial</h2>
                        <Dashboard 
                            logs={logs} 
                            config={config} 
                            onLogClick={() => setView('evening-checkin')} 
                        />
                    </div>
                </div>
            )}
            
            {view === 'log' && (
                <DailyLogView 
                onSave={handleSaveLog} 
                />
            )}

            {view === 'goals' && (
                <GoalAdjustment 
                    currentConfig={config} 
                    onSave={handleConfigUpdate}
                    onCancel={() => setView('dashboard')}
                />
            )}
            
            {view === 'guidance' && (
                <Guidance status={status} config={config} />
            )}

            {view === 'settings' && (
                <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold mb-4">Configurações</h2>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4">
                        <p className="text-sm text-slate-500 mb-2">Perfil</p>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span>Modo Social</span>
                            <span className="font-bold text-blue-600">
                                {config.socialPreference === 'SOLITARY' ? 'Introvertido' : 'Extrovertido'}
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span>Pico Produtividade</span>
                            <span className="font-bold text-amber-600">
                                {config.peakProductivity}
                            </span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Meta Sono</span>
                            <span className="font-bold text-indigo-600">
                                {config.sleepGoal}h
                            </span>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4">
                        <p className="text-sm text-slate-500 mb-2">Meta Diária (Vendas)</p>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span>Contatos</span>
                            <span className="font-bold">{config.dailyTargets.contacts}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span>Conversas</span>
                            <span className="font-bold">{config.dailyTargets.conversations}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span>Reuniões</span>
                            <span className="font-bold">{config.dailyTargets.meetings}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Vendas</span>
                            <span className="font-bold">{config.dailyTargets.sales}</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleReset}
                        className="w-full p-4 border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                    >
                        Reiniciar Onboarding
                    </button>
                </div>
            )}
            </Layout>
        )}
    </>
  );
};

export default App;
