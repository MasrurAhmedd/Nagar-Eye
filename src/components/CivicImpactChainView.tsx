import React from 'react';
import { AlertCircle, ArrowRight, Compass, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { CivicImpactChain, PriorityLevel } from '../types';
import { Language, translations } from '../i18n/translations';

interface CivicImpactChainViewProps {
  chain: CivicImpactChain;
  language: Language;
}

export const CivicImpactChainView: React.FC<CivicImpactChainViewProps> = ({ chain, language }) => {
  const t = translations[language].report;

  const priorityStyles: Record<PriorityLevel, { bg: string; text: string; border: string }> = {
    CRITICAL: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-300' },
    HIGH: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' },
    MODERATE: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300' },
    LOW: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-300' },
  };

  const style = priorityStyles[chain.priority] || priorityStyles.MODERATE;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-slate-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {t.civicImpactTitle}
          </span>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${style.bg} ${style.text} ${style.border}`}
        >
          {chain.priority} PRIORITY
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 relative">
        {/* Step 1: Problem */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
            1. {t.problemLabel}
          </span>
          <p className="mt-1 text-xs font-semibold text-slate-900 leading-snug">
            {chain.problem}
          </p>
        </div>

        {/* Step 2: Exposure */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
            2. {t.exposureLabel}
          </span>
          <p className="mt-1 text-xs font-semibold text-slate-800 leading-snug">
            {chain.exposure}
          </p>
        </div>

        {/* Step 3: Impact */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
            3. {t.impactLabel}
          </span>
          <p className="mt-1 text-xs font-medium text-slate-700 leading-snug">
            {chain.impact}
          </p>
        </div>

        {/* Step 4: Civic Priority Output */}
        <div className={`p-2.5 rounded-lg border ${style.bg} ${style.border} flex flex-col justify-between`}>
          <span className={`text-[10px] uppercase font-bold tracking-wider ${style.text}`}>
            4. {t.priorityLabel}
          </span>
          <p className={`mt-1 text-xs font-bold leading-snug ${style.text}`}>
            {chain.priority} ACTION TIER
          </p>
        </div>
      </div>
    </div>
  );
};
