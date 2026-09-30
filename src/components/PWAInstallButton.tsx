import React, { useState } from 'react';
import {
  Download,
  X,
  Smartphone,
  Monitor,
  ExternalLink,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language, translations } from '../i18n/translations';

interface PWAGuideModalProps {
  language: Language;
  onClose: () => void;
}

export const PWAGuideModal: React.FC<PWAGuideModalProps> = ({ language, onClose }) => {
  const t = translations[language].pwa;
  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  const handleOpenStandaloneTab = () => {
    if (typeof window !== 'undefined') {
      window.open(window.location.href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 text-white p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Download className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{t.modalTitle}</h3>
              <p className="text-[11px] text-slate-400">PWA Offline & Home Screen</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Embedded Iframe Preview Notice (if applicable) */}
        {isInIframe && (
          <div className="p-3.5 rounded-xl bg-teal-950/70 border border-teal-500/30 space-y-2.5">
            <div className="flex items-start gap-2 text-xs text-teal-200">
              <span className="w-2 h-2 rounded-full bg-teal-400 mt-1 shrink-0" />
              <p className="leading-relaxed">{t.iframeNote}</p>
            </div>
            <button
              onClick={handleOpenStandaloneTab}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-teal-400 hover:bg-teal-300 text-teal-950 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{t.openInNewTab}</span>
            </button>
          </div>
        )}

        {/* Device-Specific Instructions */}
        <div className="space-y-2.5 text-xs text-slate-300">
          {/* Desktop Chrome / Edge */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 text-teal-400">
              <Monitor className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-semibold text-white text-xs">Chrome / Edge (Desktop)</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">{t.desktopStep}</p>
            </div>
          </div>

          {/* Android */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 text-emerald-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-semibold text-white text-xs">Android (Chrome)</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">{t.androidStep}</p>
            </div>
          </div>

          {/* iOS Safari */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 text-sky-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-semibold text-white text-xs">iOS (Safari iPhone / iPad)</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                1. {t.iosStep1} <br />
                2. {t.iosStep2}
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 text-xs font-semibold transition cursor-pointer"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};

interface PWAInstallButtonProps {
  language: Language;
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  language,
  className = '',
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const t = translations[language].pwa;

  const handleClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {isInstalled ? (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-teal-400 bg-teal-950/60 border border-teal-800/60 rounded-lg ${className}`}
          title={t.installedBadge}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden sm:inline">{t.installedBadge}</span>
        </span>
      ) : (
        <button
          onClick={handleClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-950 bg-teal-400 hover:bg-teal-300 rounded-lg shadow-sm transition active:scale-95 cursor-pointer ${className}`}
          title={t.installApp}
          aria-label={t.installApp}
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{t.installApp}</span>
        </button>
      )}

      {showGuideModal && (
        <PWAGuideModal language={language} onClose={() => setShowGuideModal(false)} />
      )}
    </>
  );
};

export const PWAInstallBanner: React.FC<PWAInstallButtonProps> = ({ language }) => {
  const { isInstalled, isInstallable, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const t = translations[language].pwa;

  if (isInstalled || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    if (isInstallable) {
      const ok = await install();
      if (!ok) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <div className="rounded-2xl bg-gradient-to-r from-teal-950/90 via-slate-900 to-slate-900 border border-teal-500/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
            <Download className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{t.installBannerTitle}</h4>
            <p className="text-xs text-slate-300 mt-0.5">{t.installBannerDesc}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={() => setDismissed(true)}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 font-medium transition cursor-pointer"
          >
            {t.notNow}
          </button>
          <button
            onClick={handleInstall}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-teal-950 font-bold text-xs transition active:scale-95 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{t.installButton}</span>
          </button>
        </div>
      </div>

      {showGuideModal && (
        <PWAGuideModal language={language} onClose={() => setShowGuideModal(false)} />
      )}
    </>
  );
};
