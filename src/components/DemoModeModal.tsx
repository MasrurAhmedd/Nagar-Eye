import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  FileText,
  Play,
  RotateCcw,
  Sparkles,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { CivicIncident } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { CivicImpactChainView } from './CivicImpactChainView';
import { Language, translations } from '../i18n/translations';

interface DemoModeModalProps {
  demoIncident: CivicIncident;
  language: Language;
  onClose: () => void;
  onOpenLiveDossier: (incident: CivicIncident) => void;
  onJumpToMap: (incident: CivicIncident) => void;
}

export const DemoModeModal: React.FC<DemoModeModalProps> = ({
  demoIncident,
  language,
  onClose,
  onOpenLiveDossier,
  onJumpToMap,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;

  const t = translations[language].demo;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-auto animate-fadeIn">
        {/* Header with Step Tracker */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
              <Play className="w-4 h-4 fill-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-wide">
                  NAGAR-EYE Presenter Walkthrough
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-900 text-teal-300 border border-teal-700">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                The 45-second judge demonstration story
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-teal-400 h-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Content Slides */}
        <div className="p-6 space-y-5 text-slate-800 text-xs sm:text-sm min-h-[380px] flex flex-col justify-between bg-slate-50/50">
          {/* STEP 1: CITIZEN REPORTING */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="inline-block px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 text-[11px] font-bold">
                {t.step1}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Citizen points camera at Mirpur Road
              </h3>
              <p className="text-slate-600 leading-relaxed text-xs">
                A commuter encounters severe waterlogging near Mirpur-10 metro roundabout.
                Instead of filling complex forms, they simply take a photo or short clip.
              </p>

              <div className="relative w-full h-56 rounded-xl overflow-hidden bg-slate-950 border border-slate-200">
                <img
                  src={demoIncident.imageUrl}
                  alt="Field Evidence"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                  GPS: 23.8069° N, 90.3687° E • Mirpur-10
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: AI MULTIMODAL PERCEPTION */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="inline-block px-2.5 py-1 rounded-md bg-teal-100 text-teal-800 text-[11px] font-bold">
                {t.step2}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                NAGAR-EYE detects: "Waterlogging (~25cm depth)"
              </h3>
              <p className="text-slate-600 leading-relaxed text-xs">
                Multimodal vision isolates standing water boundaries, estimates submerged curb depth, and extracts structural defect geometry.
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-600 block">AI Confidence</span>
                  <span className="text-lg font-black text-teal-700">89%</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-600 block">Est. Depth</span>
                  <span className="text-lg font-black text-slate-900">~25 cm</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-600 block">Civic Score</span>
                  <span className="text-lg font-black text-rose-600">87 / 100</span>
                </div>
              </div>

              <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-200">
                <img
                  src={demoIncident.imageUrl}
                  alt="AI detection overlay"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-8 inset-y-8 border-2 border-dashed border-sky-400 bg-sky-500/20 rounded-lg pointer-events-none flex items-start p-2">
                  <span className="bg-sky-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-sm">
                    Water Submersion: ~25cm • 89% Confidence
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CIVIC CONTEXT & IMPACT */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="inline-block px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold">
                {t.step3}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Civic Context: Major Arterial + Girls' School (180m) + Bus Hub (90m)
              </h3>
              <p className="text-slate-600 leading-relaxed text-xs">
                A puddle in a secluded alley is low priority. But this defect blocks thousands of students and commuters — elevating it to <strong className="text-rose-600">CRITICAL PRIORITY</strong>.
              </p>

              <CivicImpactChainView
                chain={{
                  problem: 'Severe waterlogging (~25cm depth)',
                  exposure: 'Major arterial road • School (180m) • Bus stop (90m)',
                  impact: 'Major thoroughfare paralysis & school transit risk',
                  priority: 'CRITICAL',
                }}
                language={language}
              />
            </div>
          )}

          {/* STEP 4: GEOSPATIAL CLUSTERING */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="inline-block px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 text-[11px] font-bold">
                {t.step4}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Geospatial Clustering: 14 Supporting Reports Form a Hotspot
              </h3>
              <p className="text-slate-600 leading-relaxed text-xs">
                NAGAR-EYE detects proximity to existing citizen reports within 300m. It clusters them together, signaling an <em>Emerging Hotspot</em> on the Dhaka municipal grid.
              </p>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    Mirpur-10 Corridor Hotspot
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                    CRITICAL HOTSPOT
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Users className="w-4 h-4 text-teal-600" />
                    <span>14 Aggregated Reports</span>
                  </div>
                  <div>Trend: <span className="font-bold text-rose-600">↑ Increasing</span></div>
                  <div>Routing: <span className="font-bold text-teal-800">Drainage / Public Works</span></div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PUBLIC WORKS LIFECYCLE */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                {t.step5}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Actionable Municipal Report & Public Works Routing
              </h3>
              <p className="text-slate-600 leading-relaxed text-xs">
                City engineers receive an official dossier routed directly to WASA & DNCC. The status is tracked from DETECTED → ASSIGNED → IN PROGRESS → RESOLVED.
              </p>

              <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-[11px] space-y-1.5 rounded-xl border border-slate-800 shadow-inner">
                <div className="text-teal-400 font-bold">NAGAR-EYE CIVIC INCIDENT REPORT</div>
                <div className="text-slate-400">Ref: DHK-2026-0819 • Location: Mirpur Road Section 10</div>
                <div className="text-slate-300">Severity: 87/100 (CRITICAL) • Recommended Action: Deploy submersible pumps & culvert clearing</div>
                <div className="text-emerald-400 font-bold pt-1">Status: Dispatched to Public Works Crew #3</div>
              </div>
            </div>
          )}

          {/* STEP 6: BEFORE / AFTER RESOLUTION */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                {t.step6}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                ✓ AI Verification: Problem Confirmed Resolved
              </h3>
              <p className="text-slate-600 leading-relaxed text-xs">
                Public works uploads the after-repair photo. AI verifies clearance with 94% confidence, closing the loop: <strong className="text-slate-900">Report → Action → Verification</strong>.
              </p>

              <BeforeAfterSlider
                beforeImage={demoIncident.imageUrl}
                afterImage={demoIncident.afterImageUrl || ''}
                beforeLabel="BEFORE (WATERLOGGED)"
                afterLabel="AFTER (RESOLVED)"
                heightClass="h-52"
              />

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">Water Cleared & Surface Restored</span>
                </div>
                <span className="font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  94% Verification Conf
                </span>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition ${
                currentStep === 1
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl text-white bg-slate-900 hover:bg-slate-800 transition active:scale-95 shadow-sm"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    onOpenLiveDossier(demoIncident);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl text-white bg-teal-600 hover:bg-teal-500 transition active:scale-95 shadow-sm"
                >
                  <span>Open Full Incident Dossier</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
