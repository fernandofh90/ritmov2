import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, PlusCircle, BookOpen, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="bg-white px-6 py-5 border-b border-slate-100 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">RITMO</h1>
            <p className="text-xs text-slate-500">Constância sobre intensidade.</p>
          </div>
          <button onClick={() => setView('settings')} className="text-slate-400 hover:text-slate-600">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 py-6 scroll-smooth no-scrollbar">
        {children}
      </main>

      {/* Navigation */}
      <nav className="absolute bottom-0 w-full bg-white border-t border-slate-100 py-3 px-6 pb-6 z-20">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setView('dashboard')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <LayoutDashboard size={24} />
            <span className="text-[10px] font-medium">Espelho</span>
          </button>

          <button 
            onClick={() => setView('goals')}
            className={`flex flex-col items-center gap-1 -mt-8`}
          >
            <div className={`p-4 rounded-full shadow-lg transition-transform active:scale-95 ${currentView === 'goals' ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'}`}>
              <PlusCircle size={32} />
            </div>
          </button>

          <button 
            onClick={() => setView('guidance')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'guidance' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <BookOpen size={24} />
            <span className="text-[10px] font-medium">Orientação</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
