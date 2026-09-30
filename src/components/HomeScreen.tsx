import React from 'react';
import {
  AlertCircle,
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  Layers,
  MapPin,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react';
import { CivicHotspot, CivicIncident, ProblemType } from '../types';
import { Language, translations } from '../i18n/translations';
import { PWAInstallBanner } from './PWAInstallButton';

interface HomeScreenProps {
  incidents: CivicIncident[];
  hotspots: CivicHotspot[];
  language: Language;
  onNavigateTab: (tab: 'home' | 'report' | 'map' | 'incidents' | 'insights') => void;
  onOpenReportWithPreset?: (type: ProblemType) => void;
  onSelectIncident: (incident: CivicIncident) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  incidents,
  hotspots,
  language,
  onNavigateTab,
  onOpenReportWithPreset,
  onSelectIncident,
}) => {
  const t = translations[language].home;
  const tPriorities = translations[language].priorities;
  const tCategories = translations[language].categories;

  // Real computed numbers from application state
  const criticalCount = incidents.filter((i) => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const openCount = incidents.filter((i) => i.status !== 'RESOLVED').length;
  const resolvedCount = incidents.filter((i) => i.status === 'RESOLVED').length;
  const hotspotCount = hotspots.length;

  const recentIncidents = incidents.slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Subtle background radar circles */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full border border-teal-500/10 pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full border border-teal-500/20 pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>AI-Powered Civic Infrastructure Intelligence</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            See the problem. <br />
            <span className="text-teal-400">Understand the impact.</span> Fix it faster.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('report')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition active:scale-95 shadow-lg shadow-teal-900/20"
            >
              <Camera className="w-4 h-4 stroke-[2.5]" />
              <span>{t.reportProblem}</span>
            </button>

            <button
              onClick={() => onNavigateTab('map')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition active:scale-95"
            >
              <Compass className="w-4 h-4 text-slate-400" />
              <span>{t.exploreMap}</span>
            </button>
          </div>
        </div>
      </div>

      {/* PWA Home Screen Installation Prompt Banner */}
      <PWAInstallBanner language={language} />

      {/* TODAY'S CIVIC PICTURE - Real application state */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              {t.todaysPicture}
            </h2>
          </div>
          <span className="text-xs text-slate-600 font-medium">Dhaka Metropolitan Grid</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Critical */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition">
            <span className="text-xs font-bold text-slate-600 block">
              {t.criticalIncidents}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-rose-600">{criticalCount}</span>
              <span className="text-[11px] font-semibold text-rose-600/80 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Action Req.
              </span>
            </div>
          </div>

          {/* Open */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition">
            <span className="text-xs font-bold text-slate-600 block">
              {t.openIncidents}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{openCount}</span>
              <span className="text-[11px] font-semibold text-slate-600">Active</span>
            </div>
          </div>

          {/* Resolved */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition">
            <span className="text-xs font-bold text-slate-600 block">
              {t.resolvedToday}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">{resolvedCount}</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Verified
              </span>
            </div>
          </div>

          {/* Hotspots */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition">
            <span className="text-xs font-bold text-slate-600 block">
              {t.emergingHotspots}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-600">{hotspotCount}</span>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Clustered
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Test Presets (For Demo & Fast Presenting) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">{t.quickPresets}</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Instantly test AI perception with authentic field samples:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onOpenReportWithPreset && onOpenReportWithPreset('waterlogging')}
            className="p-3 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-left transition active:scale-95 group"
          >
            <div className="flex items-center justify-between text-sky-950 font-bold text-xs mb-1">
              <span>Waterlogging</span>
              <ArrowRight className="w-3.5 h-3.5 text-sky-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <span className="text-[11px] text-sky-800 block">Mirpur Road (25cm)</span>
          </button>

          <button
            onClick={() => onOpenReportWithPreset && onOpenReportWithPreset('pothole')}
            className="p-3 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-left transition active:scale-95 group"
          >
            <div className="flex items-center justify-between text-stone-900 font-bold text-xs mb-1">
              <span>Deep Pothole</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <span className="text-[11px] text-stone-700 block">Dhanmondi 27 (18cm)</span>
          </button>

          <button
            onClick={() => onOpenReportWithPreset && onOpenReportWithPreset('garbage')}
            className="p-3 rounded-xl border border-lime-300 bg-lime-50/70 hover:bg-lime-100 text-left transition active:scale-95 group"
          >
            <div className="flex items-center justify-between text-lime-950 font-bold text-xs mb-1">
              <span>Solid Waste</span>
              <ArrowRight className="w-3.5 h-3.5 text-lime-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <span className="text-[11px] text-lime-800 block">Farmgate Bridge</span>
          </button>

          <button
            onClick={() => onOpenReportWithPreset && onOpenReportWithPreset('blocked_drain')}
            className="p-3 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-left transition active:scale-95 group"
          >
            <div className="flex items-center justify-between text-purple-950 font-bold text-xs mb-1">
              <span>Blocked Drain</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <span className="text-[11px] text-purple-800 block">Karwan Bazar</span>
          </button>
        </div>
      </div>

      {/* Map Teaser & Emerging Hotspots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hotspots Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">Emerging Hotspots</h3>
            </div>
            <div className="space-y-3">
              {hotspots.slice(0, 3).map((hs) => (
                <div
                  key={hs.id}
                  onClick={() => onNavigateTab('map')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer border border-slate-100 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{hs.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                      {hs.averageSeverity}/100
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600">
                    <span>{hs.reportCount} reports</span>
                    <span>•</span>
                    <span className="capitalize">{hs.primaryType.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('map')}
            className="w-full mt-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition text-center"
          >
            Inspect All Hotspots on Map →
          </button>
        </div>

        {/* Recent Field Reports Feed */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">{t.recentReports}</h3>
            <button
              onClick={() => onNavigateTab('incidents')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800"
            >
              {t.viewAll} →
            </button>
          </div>

          <div className="space-y-2.5">
            {recentIncidents.map((incident) => (
              <div
                key={incident.id}
                onClick={() => onSelectIncident(incident)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer border border-slate-100 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-200">
                    <img
                      src={incident.imageUrl}
                      alt={incident.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {incident.title}
                      </span>
                      {incident.reportCount > 1 && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                          {incident.reportCount} reports
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-600 block mt-0.5">
                      {incident.locationName}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      incident.priority === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : incident.priority === 'HIGH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {incident.severity}/100
                  </span>
                  <span className="text-[10px] text-slate-600 block mt-1">
                    {incident.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
