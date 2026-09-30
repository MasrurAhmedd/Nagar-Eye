import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Flame,
  Layers,
  MapPin,
  TrendingUp,
  Users,
} from 'lucide-react';
import { CivicHotspot, CivicIncident, ProblemType } from '../types';
import { Language, translations } from '../i18n/translations';

interface InsightsViewProps {
  incidents: CivicIncident[];
  hotspots: CivicHotspot[];
  language: Language;
  onNavigateToMap: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  incidents,
  hotspots,
  language,
  onNavigateToMap,
}) => {
  const t = translations[language].insights;
  const tCat = translations[language].categories;
  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | '30days'>('30days');

  // Compute metrics from actual data
  const totalIncidents = incidents.length;
  const activeCount = incidents.filter((i) => i.status !== 'RESOLVED').length;
  const criticalCount = incidents.filter((i) => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const resolvedCount = incidents.filter((i) => i.status === 'RESOLVED').length;
  const resolutionRate = totalIncidents > 0 ? Math.round((resolvedCount / totalIncidents) * 100) : 0;

  // Breakdown by defect type
  const typeCounts: Partial<Record<ProblemType, number>> = {};
  incidents.forEach((inc) => {
    typeCounts[inc.type] = (typeCounts[inc.type] || 0) + (inc.reportCount || 1);
  });

  const totalAggregatedReports = Object.values(typeCounts).reduce((a, b) => a + b, 0) || 1;

  const sortedIssues = Object.entries(typeCounts)
    .map(([type, count]) => ({
      type: type as ProblemType,
      count,
      percentage: Math.round((count / totalAggregatedReports) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{t.subtitle}</p>
        </div>

        {/* Time period filter */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setTimeFilter('today')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              timeFilter === 'today' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeFilter('7days')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              timeFilter === '7days' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeFilter('30days')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              timeFilter === '30days' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* 4 Core Intelligence Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-600 block">{t.activeCount}</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{activeCount}</span>
            <span className="text-[11px] font-semibold text-slate-600">Pending</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-600 block">{t.criticalCount}</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-600">{criticalCount}</span>
            <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Immediate
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-600 block">{t.hotspotsCount}</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{hotspots.length}</span>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Corridors
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-600 block">{t.resolutionRate}</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">{resolutionRate}%</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Resolved
            </span>
          </div>
        </div>
      </div>

      {/* Top Defect Types & Spatial Hotspots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Defect Breakdown Bar Chart */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">{t.topIssues}</h3>
            <span className="text-xs text-slate-600 font-medium">Aggregated Impact</span>
          </div>

          <div className="space-y-3">
            {sortedIssues.slice(0, 6).map((item) => (
              <div key={item.type} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 capitalize">
                    {tCat[item.type] || item.type.replace('_', ' ')}
                  </span>
                  <span className="font-bold text-slate-900">
                    {item.count} reports ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.type === 'waterlogging'
                        ? 'bg-sky-600'
                        : item.type === 'pothole'
                        ? 'bg-stone-800'
                        : item.type === 'garbage'
                        ? 'bg-lime-600'
                        : item.type === 'blocked_drain'
                        ? 'bg-purple-700'
                        : 'bg-teal-600'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spatial Hotspots Table */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">{t.spatialHotspots}</h3>
              <button
                onClick={onNavigateToMap}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>View Map</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 mt-3">
              {hotspots.map((hs) => (
                <div
                  key={hs.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{hs.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                        {hs.averageSeverity}/100
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600 capitalize block mt-0.5">
                      Primary: {tCat[hs.primaryType] || hs.primaryType} • {hs.reportCount} reports
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      hs.trend === 'increasing'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {hs.trend === 'increasing' ? '↑ Increasing' : '• Stable'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600">
            Hotspots are dynamically evaluated based on geospatial density (350m radius) of citizen reports.
          </div>
        </div>
      </div>
    </div>
  );
};
