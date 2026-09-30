import React from 'react';
import {
  Compass,
  FileText,
  Flame,
  Home,
  PlusCircle,
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface BottomNavProps {
  currentTab: 'home' | 'report' | 'map' | 'incidents' | 'insights';
  language: Language;
  onSelectTab: (tab: 'home' | 'report' | 'map' | 'incidents' | 'insights') => void;
  criticalCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  language,
  onSelectTab,
  criticalCount,
}) => {
  const t = translations[language].nav;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/98 backdrop-blur-md border-t border-slate-800 text-white select-none pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 h-14">
        {/* Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center gap-0.5 transition ${
            currentTab === 'home' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px]">{t.home}</span>
        </button>

        {/* Civic Map */}
        <button
          onClick={() => onSelectTab('map')}
          className={`flex flex-col items-center justify-center gap-0.5 transition ${
            currentTab === 'map' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[10px]">{t.map}</span>
        </button>

        {/* Central Report Action Button */}
        <button
          onClick={() => onSelectTab('report')}
          className="flex flex-col items-center justify-center -mt-3.5"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition active:scale-95 ${
              currentTab === 'report'
                ? 'bg-teal-400 text-slate-950 ring-4 ring-slate-900'
                : 'bg-teal-500 text-slate-950 hover:bg-teal-400 ring-4 ring-slate-900'
            }`}
          >
            <PlusCircle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span
            className={`text-[9px] mt-0.5 font-bold ${
              currentTab === 'report' ? 'text-teal-400' : 'text-teal-300'
            }`}
          >
            {t.report}
          </span>
        </button>

        {/* Incidents */}
        <button
          onClick={() => onSelectTab('incidents')}
          className={`relative flex flex-col items-center justify-center gap-0.5 transition ${
            currentTab === 'incidents'
              ? 'text-teal-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <FileText className="w-4 h-4" />
            {criticalCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[8px] font-bold flex items-center justify-center">
                {criticalCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">{t.incidents}</span>
        </button>

        {/* Insights */}
        <button
          onClick={() => onSelectTab('insights')}
          className={`flex flex-col items-center justify-center gap-0.5 transition ${
            currentTab === 'insights'
              ? 'text-teal-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span className="text-[10px]">{t.insights}</span>
        </button>
      </div>
    </nav>
  );
};
