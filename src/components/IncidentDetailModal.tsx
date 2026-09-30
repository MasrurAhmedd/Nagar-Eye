import React, { useState } from 'react';
import {
  AlertTriangle,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  MapPin,
  Maximize2,
  Navigation,
  School,
  Share2,
  Sparkles,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { CivicIncident, IncidentStatus, PriorityLevel } from '../types';
import { CivicImpactChainView } from './CivicImpactChainView';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { CivicReportModal } from './CivicReportModal';
import { ResolutionModal } from './ResolutionModal';
import { Language, translations } from '../i18n/translations';

interface IncidentDetailModalProps {
  incident: CivicIncident;
  language: Language;
  onClose: () => void;
  onUpdateStatus: (
    id: string,
    newStatus: IncidentStatus,
    note?: string,
    resolutionEvidence?: CivicIncident['resolutionEvidence']
  ) => Promise<void>;
  onNavigateToMap?: (incident: CivicIncident) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  language,
  onClose,
  onUpdateStatus,
  onNavigateToMap,
}) => {
  const t = translations[language].dossier;
  const tCategories = translations[language].categories;
  const tPriorities = translations[language].priorities;
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showResolutionModal, setShowResolutionModal] = useState<boolean>(false);

  const statusProgression: IncidentStatus[] = [
    'DETECTED',
    'VERIFIED',
    'ASSIGNED',
    'IN_PROGRESS',
    'RESOLVED',
  ];

  const currentStatusIndex = statusProgression.indexOf(incident.status);

  const priorityBadgeStyles: Record<PriorityLevel, string> = {
    CRITICAL: 'bg-rose-100 text-rose-800 border-rose-300',
    HIGH: 'bg-amber-100 text-amber-800 border-amber-300',
    MODERATE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    LOW: 'bg-slate-100 text-slate-800 border-slate-300',
  };

  const handleStepStatus = async (status: IncidentStatus) => {
    if (status === 'RESOLVED') {
      setShowResolutionModal(true);
      return;
    }
    await onUpdateStatus(incident.id, status);
  };

  const handleResolutionConfirmed = async (
    afterImage: string,
    verificationNote: string,
    confidence: number
  ) => {
    await onUpdateStatus(incident.id, 'RESOLVED', 'Resolution verified with after-repair imagery.', {
      afterImageUrl: afterImage,
      resolvedAt: new Date().toISOString(),
      confidence,
      verificationNote,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
        <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-auto animate-fadeIn max-h-[92vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-400 font-semibold">{incident.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${priorityBadgeStyles[incident.priority]}`}
                  >
                    {tPriorities[incident.priority] || incident.priority}
                  </span>
                  {incident.reportCount > 1 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-900 text-teal-300 border border-teal-700">
                      <Users className="w-3 h-3" />
                      {incident.reportCount} {translations[language].map.supportingReports}
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mt-0.5 leading-snug">
                  {incident.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 space-y-6 overflow-y-auto bg-slate-50/50 flex-1">
            {/* Top Stat Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Civic Priority Score</span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-rose-600">{incident.severity}</span>
                  <span className="text-xs text-slate-600 font-semibold">/ 100</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-600 block">AI Confidence</span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-teal-700">{(incident.confidence * 100).toFixed(0)}%</span>
                  <span className="text-xs text-slate-600">Model Conf</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Physical Dimension</span>
                <div className="mt-1 text-xs font-bold text-slate-900 truncate">
                  {incident.estimatedDepthCm ? `~${incident.estimatedDepthCm} cm depth` : 'Surface Fracture'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Status</span>
                <div className="mt-1 text-xs font-bold text-slate-900">
                  {translations[language].statuses[incident.status] || incident.status}
                </div>
              </div>
            </div>

            {/* Visual Evidence with AI Annotation Overlay */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span className="font-bold text-slate-900 text-xs">{t.evidenceTitle}</span>
                </div>
                <button
                  onClick={() => setShowAnnotations(!showAnnotations)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                >
                  {showAnnotations ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{t.toggleAnnotations}</span>
                </button>
              </div>

              {/* If resolved, allow viewing Before/After or regular evidence */}
              {incident.status === 'RESOLVED' && incident.afterImageUrl ? (
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                    ✓ Verified Repaired State
                  </span>
                  <BeforeAfterSlider
                    beforeImage={incident.imageUrl}
                    afterImage={incident.afterImageUrl}
                    beforeLabel="BEFORE"
                    afterLabel="AFTER (RESOLVED)"
                  />
                  {incident.resolutionEvidence && (
                    <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 font-medium">
                      {incident.resolutionEvidence.verificationNote} (Confidence: {(incident.resolutionEvidence.confidence * 100).toFixed(0)}%)
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden bg-slate-950 border border-slate-200 select-none">
                  <img
                    src={incident.imageUrl}
                    alt={incident.title}
                    className="w-full h-full object-cover"
                  />

                  {/* AI Visual Bounding Overlays */}
                  {showAnnotations &&
                    incident.annotations.map((ann, idx) => {
                      const [x, y, w, h] = ann.box;
                      return (
                        <div
                          key={idx}
                          className="absolute border-2 border-dashed rounded-md pointer-events-none transition-all duration-300 shadow-sm"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            width: `${w}%`,
                            height: `${h}%`,
                            borderColor: ann.highlightColor || '#0284c7',
                            backgroundColor: `${ann.highlightColor || '#0284c7'}15`,
                          }}
                        >
                          <div
                            className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-md flex items-center gap-1 whitespace-nowrap"
                            style={{ backgroundColor: ann.highlightColor || '#0284c7' }}
                          >
                            <span>{ann.label}</span>
                            <span className="opacity-80">{(ann.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      );
                    })}

                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md">
                    Location: {incident.locationName}
                  </div>
                </div>
              )}
            </div>

            {/* Civic Impact Chain */}
            <CivicImpactChainView chain={incident.civicImpactChain} language={language} />

            {/* Suggested Public Works Routing & Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                  Suggested Service Category
                </span>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-teal-950 block">
                      {incident.suggestedServiceCategory}
                    </span>
                    <span className="text-[11px] text-slate-600">Automated municipal domain routing</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                    Recommended Action
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {incident.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Nearby Facilities Exposure */}
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-600 block mb-2">
                  Nearby Civic Infrastructure & Exposure
                </span>
                <div className="space-y-2">
                  {incident.nearbyFacilities.map((fac, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {fac.type === 'school' ? (
                          <School className="w-3.5 h-3.5 text-blue-600" />
                        ) : fac.type === 'hospital' ? (
                          <Building className="w-3.5 h-3.5 text-rose-600" />
                        ) : (
                          <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span className="font-semibold text-slate-800">{fac.name}</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 px-2 py-0.5 rounded bg-white border border-slate-200">
                        {fac.distanceMeters}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Status Progression Timeline */}
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  {t.statusProgression}
                </span>
                <span className="text-[11px] text-slate-600">Click a stage to advance workflow</span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {statusProgression.map((st, idx) => {
                  const isPastOrCurrent = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;

                  return (
                    <button
                      key={st}
                      onClick={() => handleStepStatus(st)}
                      className={`flex flex-col items-center text-center p-2 rounded-xl transition border text-xs ${
                        isCurrent
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm font-bold scale-[1.02]'
                          : isPastOrCurrent
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 bg-white/20">
                        {isPastOrCurrent && !isCurrent ? '✓' : idx + 1}
                      </div>
                      <span className="text-[10px] sm:text-xs">
                        {translations[language].statuses[st] || st}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Resolution button shortcut if not yet resolved */}
              {incident.status !== 'RESOLVED' && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-600">Completed public works repair?</span>
                  <button
                    onClick={() => setShowResolutionModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.markResolved}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-200 shrink-0">
            <button
              onClick={() => {
                if (onNavigateToMap) {
                  onNavigateToMap(incident);
                  onClose();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
            >
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>{translations[language].report.viewOnMap}</span>
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white bg-slate-900 hover:bg-slate-800 transition active:scale-95 shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>{t.generateReport}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Report Modal */}
      {showReportModal && (
        <CivicReportModal
          incident={incident}
          language={language}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Resolution Modal */}
      {showResolutionModal && (
        <ResolutionModal
          incident={incident}
          language={language}
          onClose={() => setShowResolutionModal(false)}
          onConfirmResolved={handleResolutionConfirmed}
        />
      )}
    </>
  );
};
