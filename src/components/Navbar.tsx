import React from 'react';
import {
  Compass,
  FileText,
  Flame,
  Globe,
  Home,
  Layers,
  MapPin,
  Play,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentTab: 'home' | 'report' | 'map' | 'incidents' | 'insights';
  language: Language;
  onSelectTab: (tab: 'home' | 'report' | 'map' | 'incidents' | 'insights') => void;
  onToggleLanguage: () => void;
  onLaunchDemoStory: () => void;
  criticalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  language,
  onSelectTab,
  onToggleLanguage,
  onLaunchDemoStory,
  criticalCount,
}) => {
  const t = translations[language].nav;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 border-b border-slate-800 text-white select-none">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          {/* Logo Mark */}
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 group-hover:border-teal-500/50 transition-colors shadow-xs">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" stroke="#0ea5e9" strokeDasharray="3 3" opacity="0.6" />
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" stroke="#38bdf8" />
              <circle cx="12" cy="12" r="3" fill="#0284c7" />
              <circle cx="12" cy="12" r="1.2" fill="#ffffff" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base tracking-wider text-white">NAGAR-EYE</span>
            </div>
            <p className="hidden md:block text-[10px] text-slate-400 font-medium tracking-tight">
              See the problem. Understand the impact. Fix it faster.
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentTab === 'home'
                ? 'bg-slate-800 text-teal-400 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.home}
          </button>

          <button
            onClick={() => onSelectTab('report')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              currentTab === 'report'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                : 'text-teal-400 hover:bg-teal-500/10'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.report}</span>
          </button>

          <button
            onClick={() => onSelectTab('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              currentTab === 'map'
                ? 'bg-slate-800 text-teal-400 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{t.map}</span>
          </button>

          <button
            onClick={() => onSelectTab('incidents')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              currentTab === 'incidents'
                ? 'bg-slate-800 text-teal-400 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>{t.incidents}</span>
            {criticalCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                {criticalCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('insights')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentTab === 'insights'
                ? 'bg-slate-800 text-teal-400 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.insights}
          </button>
        </nav>

        {/* Right Action Tools: Language, Demo Story, Install */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* 45s Presenter Story Mode CTA */}
          <button
            onClick={onLaunchDemoStory}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-teal-950/80 hover:bg-teal-900 border border-teal-500/40 text-teal-300 text-xs font-bold transition active:scale-95 shadow-xs shrink-0 cursor-pointer"
            title="Launch interactive 45-second judge demo"
          >
            <Play className="w-3 h-3 fill-teal-400" />
            <span className="hidden xs:inline sm:inline">{t.demoMode}</span>
          </button>

          {/* In-App PWA Install Button */}
          <PWAInstallButton language={language} className="shrink-0" />

          {/* Language Toggle (EN / বাংলা) */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition shrink-0 cursor-pointer"
            title="Toggle Language / ভাষা পরিবর্তন"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
