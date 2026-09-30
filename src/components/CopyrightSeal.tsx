import React from 'react';

interface CopyrightSealProps {
  variant?: 'compact' | 'footer';
  className?: string;
}

export const CopyrightSeal: React.FC<CopyrightSealProps> = ({
  className = '',
}) => {
  return (
    <footer
      className={`w-full py-4 px-4 sm:px-6 bg-slate-900 border-t border-slate-800 text-slate-300 text-xs shadow-inner select-none ${className}`}
      aria-label="Footer Copyright"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        {/* Verified Copyright Seal Emblem & Author */}
        <div className="flex items-center gap-3">
          {/* Circular Architectural Seal Emblem */}
          <div className="relative w-8 h-8 rounded-full border border-teal-400/80 bg-slate-950 flex items-center justify-center shrink-0 shadow-xs">
            <svg className="w-7 h-7" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#2dd4bf"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="1.5"
              />
              <circle
                cx="50"
                cy="50"
                r="16"
                fill="#0f172a"
                stroke="#2dd4bf"
                strokeWidth="1.8"
              />
              <text
                x="50"
                y="55"
                fontSize="12"
                fill="#ffffff"
                fontWeight="bold"
                textAnchor="middle"
              >
                ©
              </text>
            </svg>
          </div>

          <div className="text-xs text-slate-200 font-medium">
            Copyright © 2026{' '}
            <strong className="text-white font-bold">Tanjima Tasnim Oyshi</strong> &{' '}
            <strong className="text-white font-bold">A.B.M Masrur Ahmed</strong>. All Rights Reserved.
          </div>
        </div>

        {/* Civic Hackathon Track Metadata */}
        <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
          <span>AI Collective — Hack for Humanity</span>
          <span>•</span>
          <span>Track 3: Smart Society</span>
        </div>
      </div>
    </footer>
  );
};
