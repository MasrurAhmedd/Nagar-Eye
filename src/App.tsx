import React, { useEffect, useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ReportView } from './components/ReportView';
import { MapView } from './components/MapView';
import { IncidentsView } from './components/IncidentsView';
import { InsightsView } from './components/InsightsView';
import { IncidentDetailModal } from './components/IncidentDetailModal';
import { DemoModeModal } from './components/DemoModeModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { storageService } from './services/storage';
import { computeCivicHotspots } from './services/duplicateEngine';
import { CivicIncident, IncidentStatus, ProblemType } from './types';
import { Language } from './i18n/translations';
import { Loader2 } from 'lucide-react';
import { CopyrightSeal } from './components/CopyrightSeal';

export function App() {
  const [incidents, setIncidents] = useState<CivicIncident[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<'home' | 'report' | 'map' | 'incidents' | 'insights'>('home');
  const [selectedIncident, setSelectedIncident] = useState<CivicIncident | null>(null);
  const [dossierOpen, setDossierOpen] = useState<boolean>(false);
  const [showDemoStory, setShowDemoStory] = useState<boolean>(false);
  const [reportPreset, setReportPreset] = useState<ProblemType | undefined>(undefined);

  // Language state (persisted in localStorage)
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('nagar_eye_lang');
      return saved === 'bn' ? 'bn' : 'en';
    } catch {
      return 'en';
    }
  });

  const toggleLanguage = () => {
    const next = language === 'en' ? 'bn' : 'en';
    setLanguage(next);
    try {
      localStorage.setItem('nagar_eye_lang', next);
    } catch {}
  };

  // Load persistent incidents from IndexedDB
  useEffect(() => {
    storageService.getAllIncidents().then((loaded) => {
      setIncidents(loaded);
      setIsLoading(false);
    });
  }, []);

  // Dynamically compute hotspots from actual application state
  const hotspots = useMemo(() => computeCivicHotspots(incidents), [incidents]);

  const criticalCount = useMemo(
    () => incidents.filter((i) => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length,
    [incidents]
  );

  // Primary demo incident (Mirpur Waterlogging) for the demo story
  const demoIncident = useMemo(() => {
    return incidents.find((i) => i.id === 'DHK-2026-0819') || incidents[0];
  }, [incidents]);

  const handleOpenPresetReport = (type: ProblemType) => {
    setReportPreset(type);
    setCurrentTab('report');
  };

  const handleSelectIncident = (incident: CivicIncident) => {
    setSelectedIncident(incident);
    setDossierOpen(true);
  };

  const handleSubmitNewIncident = async (newIncident: CivicIncident) => {
    await storageService.saveIncident(newIncident);
    setIncidents((prev) => [newIncident, ...prev]);
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: IncidentStatus,
    note?: string,
    resolutionEvidence?: CivicIncident['resolutionEvidence']
  ) => {
    const updated = await storageService.updateIncidentStatus(id, newStatus, note, resolutionEvidence);
    if (updated) {
      setIncidents((prev) => prev.map((item) => (item.id === id ? updated : item)));
      if (selectedIncident?.id === id) {
        setSelectedIncident(updated);
      }
    }
  };

  const handleNavigateToMapWithIncident = (incident?: CivicIncident) => {
    if (incident) {
      setSelectedIncident(incident);
    }
    setCurrentTab('map');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="text-center">
          <h1 className="font-bold text-base tracking-wider">NAGAR-EYE</h1>
          <p className="text-xs text-slate-400 mt-1">Initializing Dhaka Infrastructure Grid...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        language={language}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setReportPreset(undefined);
        }}
        onToggleLanguage={toggleLanguage}
        onLaunchDemoStory={() => setShowDemoStory(true)}
        criticalCount={criticalCount}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16 md:pb-0">
        {currentTab === 'home' && (
          <HomeScreen
            incidents={incidents}
            hotspots={hotspots}
            language={language}
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              setReportPreset(undefined);
            }}
            onOpenReportWithPreset={handleOpenPresetReport}
            onSelectIncident={handleSelectIncident}
          />
        )}

        {currentTab === 'report' && (
          <ReportView
            language={language}
            existingIncidents={incidents}
            onSubmitIncident={handleSubmitNewIncident}
            onNavigateToMap={handleNavigateToMapWithIncident}
            onCancel={() => {
              setCurrentTab('home');
              setReportPreset(undefined);
            }}
            preselectedPreset={reportPreset}
          />
        )}

        {currentTab === 'map' && (
          <MapView
            incidents={incidents}
            hotspots={hotspots}
            selectedIncident={selectedIncident}
            language={language}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            onOpenDossier={(inc) => {
              setSelectedIncident(inc);
              setDossierOpen(true);
            }}
          />
        )}

        {currentTab === 'incidents' && (
          <IncidentsView
            incidents={incidents}
            language={language}
            onSelectIncident={handleSelectIncident}
            onNavigateToMap={handleNavigateToMapWithIncident}
          />
        )}

        {currentTab === 'insights' && (
          <InsightsView
            incidents={incidents}
            hotspots={hotspots}
            language={language}
            onNavigateToMap={() => setCurrentTab('map')}
          />
        )}

        {/* Global Compact Copyright & Architecture Seal (except map full-bleed) */}
        {currentTab !== 'map' && (
          <div className="mt-8 border-t border-slate-200">
            <CopyrightSeal variant="compact" />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        language={language}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setReportPreset(undefined);
        }}
        criticalCount={criticalCount}
      />

      {/* Incident Detail Dossier Modal */}
      {dossierOpen && selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          language={language}
          onClose={() => setDossierOpen(false)}
          onUpdateStatus={handleUpdateStatus}
          onNavigateToMap={handleNavigateToMapWithIncident}
        />
      )}

      {/* Dedicated Hackathon Presenter Story Mode Modal */}
      {showDemoStory && demoIncident && (
        <DemoModeModal
          demoIncident={demoIncident}
          language={language}
          onClose={() => setShowDemoStory(false)}
          onOpenLiveDossier={(inc) => {
            setSelectedIncident(inc);
            setDossierOpen(true);
          }}
          onJumpToMap={handleNavigateToMapWithIncident}
        />
      )}

      {/* Global Offline Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}

export default App;
