import React, { useMemo, useState } from 'react';
import { LESSONS } from '../constants';
import { UserConfig, RhythmStatus } from '../types';
import { Lightbulb, RefreshCw, Quote } from 'lucide-react';

interface GuidanceProps {
    status: RhythmStatus;
    config: UserConfig;
}

export const Guidance: React.FC<GuidanceProps> = ({ status, config }) => {
  // Simple randomization for now, could be smarter based on status in V2
  const [seed, setSeed] = useState(Date.now());
  
  const lesson = useMemo(() => {
     // Pick a lesson based on a pseudo-random seed to keep it stable until refresh
     const randomIndex = seed % LESSONS.length;
     return LESSONS[randomIndex];
  }, [seed]);

  const handleRefresh = () => {
    setSeed(Date.now());
  };

  const getPillarColor = (pillar: string) => {
      if (pillar.includes('Constância')) return 'text-blue-600 bg-blue-50';
      if (pillar.includes('Prospecção')) return 'text-purple-600 bg-purple-50';
      if (pillar.includes('Reuniões')) return 'text-amber-600 bg-amber-50';
      if (pillar.includes('Conversão')) return 'text-emerald-600 bg-emerald-50';
      return 'text-slate-600 bg-slate-100';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Orientação</h2>
        <button onClick={handleRefresh} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <RefreshCw size={20} />
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl relative overflow-hidden">
        {/* Decorative Quote Icon */}
        <Quote className="absolute top-4 right-4 text-slate-100 opacity-50 transform rotate-12" size={80} />
        
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${getPillarColor(lesson.pillar)}`}>
            {lesson.pillar}
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-6 relative z-10">
            {lesson.title}
        </h3>
        
        <div className="w-12 h-1 bg-slate-200 mb-6 rounded-full" />
        
        <p className="text-lg text-slate-600 leading-relaxed relative z-10">
            {lesson.content}
        </p>
      </div>

      {/* Actionable Tip based on context (Hardcoded simple logic for V1) */}
      <div className="bg-slate-900 text-slate-300 p-6 rounded-xl flex gap-4 items-start">
         <Lightbulb className="flex-shrink-0 text-yellow-400 mt-1" size={24} />
         <div>
             <h4 className="font-bold text-white mb-1">Ação Sugerida</h4>
             <p className="text-sm opacity-90">
                 {status === RhythmStatus.LOW 
                   ? `Tente realizar ao menos ${Math.ceil(config.dailyTargets.contacts * 0.8)} contatos hoje para retomar o ritmo.`
                   : 'Mantenha o volume atual. Sua consistência está criando oportunidades futuras.'
                 }
             </p>
         </div>
      </div>
      
      <div className="text-center mt-8">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Manifesto</p>
          <p className="text-slate-600 text-sm mt-2 italic max-w-xs mx-auto">
            "O RITMO não promete venda. Ele garante que o processo continue acontecendo."
          </p>
      </div>
    </div>
  );
};