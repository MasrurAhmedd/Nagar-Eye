import React, { useState } from 'react';
import {
  AlertTriangle,
  Building,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  MapPin,
  Search,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { CivicIncident, IncidentStatus, PriorityLevel, ProblemType } from '../types';
import { Language, translations } from '../i18n/translations';

interface IncidentsViewProps {
  incidents: CivicIncident[];
  language: Language;
  onSelectIncident: (incident: CivicIncident) => void;
  onNavigateToMap: (incident: CivicIncident) => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  incidents,
  language,
  onSelectIncident,
  onNavigateToMap,
}) => {
  const t = translations[language].incidents;
  const tCat = translations[language].categories;
  const tPriorities = translations[language].priorities;
  const tStatuses = translations[language].statuses;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filtered = incidents.filter((item) => {
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    if (selectedType !== 'all' && item.type !== selectedType) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.locationName.toLowerCase().includes(q);
      const matchRoad = item.roadName.toLowerCase().includes(q);
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      const matchCategory = item.type.toLowerCase().includes(q);
      if (!matchName && !matchRoad && !matchTitle && !matchId && !matchCategory) return false;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {t.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{t.subtitle}</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-hidden focus:border-teal-500 shadow-xs font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category selector */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-700 outline-hidden focus:border-teal-500 shadow-xs font-medium cursor-pointer"
        >
          <option value="all">{tCat.all}</option>
          <option value="waterlogging">{tCat.waterlogging}</option>
          <option value="pothole">{tCat.pothole}</option>
          <option value="garbage">{tCat.garbage}</option>
          <option value="blocked_drain">{tCat.blocked_drain}</option>
          <option value="road_damage">{tCat.road_damage}</option>
          <option value="sidewalk_damage">{tCat.sidewalk_damage}</option>
          <option value="broken_streetlight">{tCat.broken_streetlight}</option>
          <option value="unsafe_crossing">{tCat.unsafe_crossing}</option>
        </select>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition border-b-2 -mb-px ${
            selectedStatus === 'all'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {tStatuses.all} ({incidents.length})
        </button>

        <button
          onClick={() => setSelectedStatus('DETECTED')}
          className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition border-b-2 -mb-px ${
            selectedStatus === 'DETECTED'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {tStatuses.DETECTED}
        </button>

        <button
          onClick={() => setSelectedStatus('VERIFIED')}
          className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition border-b-2 -mb-px ${
            selectedStatus === 'VERIFIED'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {tStatuses.VERIFIED}
        </button>

        <button
          onClick={() => setSelectedStatus('ASSIGNED')}
          className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition border-b-2 -mb-px ${
            selectedStatus === 'ASSIGNED'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {tStatuses.ASSIGNED}
        </button>

        <button
          onClick={() => setSelectedStatus('IN_PROGRESS')}
          className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition border-b-2 -mb-px ${
            selectedStatus === 'IN_PROGRESS'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {tStatuses.IN_PROGRESS}
        </button>

        <button
          onClick={() => setSelectedStatus('RESOLVED')}
          className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition border-b-2 -mb-px ${
            selectedStatus === 'RESOLVED'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {tStatuses.RESOLVED}
        </button>
      </div>

      {/* List of Editorial Cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs">
          {t.noIncidents}
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Left: Thumbnail & Info */}
              <div
                className="flex items-start gap-4 flex-1 cursor-pointer"
                onClick={() => onSelectIncident(item)}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-200">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-slate-600">
                      {item.id}
                    </span>
                    <span
                      className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                        item.priority === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : item.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : item.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {item.priority}
                    </span>
                    {item.reportCount > 1 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.2 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                        <Users className="w-3 h-3" />
                        {item.reportCount} reports
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm hover:text-teal-700 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.locationName}
                    </span>
                    <span>•</span>
                    <span>{item.suggestedServiceCategory}</span>
                  </div>
                </div>
              </div>

              {/* Right: Score, Status & Actions */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-600 block">
                    Priority Score
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-rose-600">{item.severity}</span>
                    <span className="text-xs text-slate-600">/ 100</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToMap(item)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
                    title="View on Map"
                  >
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  </button>

                  <button
                    onClick={() => onSelectIncident(item)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition active:scale-95 shadow-xs"
                  >
                    {t.viewDetails}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
