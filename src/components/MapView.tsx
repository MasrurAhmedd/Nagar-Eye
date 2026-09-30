import React, { useEffect, useMemo, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  Circle,
  Map,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  Crosshair,
  Layers,
  MapPin,
  Navigation,
  RefreshCw,
  Satellite,
  Search,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react';
import { CivicHotspot, CivicIncident } from '../types';
import { Language, translations } from '../i18n/translations';

interface MapViewProps {
  incidents: CivicIncident[];
  hotspots: CivicHotspot[];
  selectedIncident: CivicIncident | null;
  language: Language;
  onSelectIncident: (incident: CivicIncident) => void;
  onOpenDossier: (incident: CivicIncident) => void;
}

const DHAKA_CENTER = { lat: 23.7806, lng: 90.395 };

// Inner controller that responds to selection changes & provides imperative camera control
const MapCameraController: React.FC<{
  selectedIncident: CivicIncident | null;
  triggerCenter?: { lat: number; lng: number; zoom: number; key: number } | null;
}> = ({ selectedIncident, triggerCenter }) => {
  const map = useMap();

  useEffect(() => {
    if (map && selectedIncident) {
      map.panTo({
        lat: selectedIncident.latitude,
        lng: selectedIncident.longitude,
      });
      map.setZoom(15);
    }
  }, [map, selectedIncident]);

  useEffect(() => {
    if (map && triggerCenter) {
      map.panTo({ lat: triggerCenter.lat, lng: triggerCenter.lng });
      map.setZoom(triggerCenter.zoom);
    }
  }, [map, triggerCenter]);

  return null;
};

export const MapView: React.FC<MapViewProps> = ({
  incidents,
  hotspots,
  selectedIncident,
  language,
  onSelectIncident,
  onOpenDossier,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activePriority, setActivePriority] = useState<string>('all');
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [panelOpen, setPanelOpen] = useState<boolean>(true);
  const [mapType, setMapType] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [cameraTrigger, setCameraTrigger] = useState<{
    lat: number;
    lng: number;
    zoom: number;
    key: number;
  } | null>(null);

  // Resolved API key from Vite env or fallback fetch
  const [mapsApiKey, setMapsApiKey] = useState<string>(
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  );

  useEffect(() => {
    if (!mapsApiKey) {
      fetch('/api/maps-key')
        .then((r) => r.json())
        .then((data) => {
          if (data?.apiKey) {
            setMapsApiKey(data.apiKey);
          }
        })
        .catch(() => {
          // Ignore key fetch errors
        });
    }
  }, [mapsApiKey]);

  const tMap = translations[language].map;
  const tCat = translations[language].categories;

  // Filter incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((item) => {
      if (activeCategory !== 'all' && item.type !== activeCategory) return false;
      if (activePriority !== 'all' && item.priority !== activePriority) return false;
      if (activeStatus !== 'all' && item.status !== activeStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.locationName.toLowerCase().includes(q);
        const matchRoad = item.roadName.toLowerCase().includes(q);
        const matchId = item.id.toLowerCase().includes(q);
        const matchType = item.type.toLowerCase().includes(q);
        if (!matchName && !matchRoad && !matchId && !matchType) return false;
      }
      return true;
    });
  }, [incidents, activeCategory, activePriority, activeStatus, searchQuery]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setCameraTrigger({ lat: latitude, lng: longitude, zoom: 16, key: Date.now() });
      },
      () => {
        // Geolocation denied or unavailable
      }
    );
  };

  const handleResetDhaka = () => {
    setCameraTrigger({ lat: DHAKA_CENTER.lat, lng: DHAKA_CENTER.lng, zoom: 12, key: Date.now() });
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden flex flex-col md:flex-row bg-slate-100">
      {/* Search & Floating Filters Bar */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto sm:left-4 z-20 flex flex-col gap-2 max-w-xl pointer-events-auto">
        {/* Search Input Box */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md">
          <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
          <input
            type="text"
            placeholder={tMap.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm bg-transparent border-none outline-hidden text-slate-800 placeholder-slate-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-600 mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {/* Category Filter */}
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition shadow-xs ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tCat.all}
          </button>
          <button
            onClick={() => setActiveCategory('waterlogging')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition shadow-xs ${
              activeCategory === 'waterlogging'
                ? 'bg-sky-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tCat.waterlogging}
          </button>
          <button
            onClick={() => setActiveCategory('pothole')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition shadow-xs ${
              activeCategory === 'pothole'
                ? 'bg-stone-800 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tCat.pothole}
          </button>
          <button
            onClick={() => setActiveCategory('garbage')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition shadow-xs ${
              activeCategory === 'garbage'
                ? 'bg-lime-700 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tCat.garbage}
          </button>
          <button
            onClick={() => setActiveCategory('blocked_drain')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition shadow-xs ${
              activeCategory === 'blocked_drain'
                ? 'bg-purple-800 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tCat.blocked_drain}
          </button>

          {/* Priority Toggles */}
          <div className="h-4 w-px bg-slate-300 mx-1 shrink-0" />
          <button
            onClick={() =>
              setActivePriority(activePriority === 'CRITICAL' ? 'all' : 'CRITICAL')
            }
            className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition shadow-xs flex items-center gap-1 ${
              activePriority === 'CRITICAL'
                ? 'bg-rose-600 text-white'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Critical</span>
          </button>
          <button
            onClick={() => setActivePriority(activePriority === 'HIGH' ? 'all' : 'HIGH')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition shadow-xs flex items-center gap-1 ${
              activePriority === 'HIGH'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>High</span>
          </button>
          <button
            onClick={() =>
              setActiveStatus(activeStatus === 'RESOLVED' ? 'all' : 'RESOLVED')
            }
            className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition shadow-xs flex items-center gap-1 ${
              activeStatus === 'RESOLVED'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Resolved</span>
          </button>
        </div>
      </div>

      {/* Floating Map Utility Buttons */}
      <div className="absolute top-28 right-3 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={handleLocateMe}
          title={tMap.locateMe}
          className="p-2.5 rounded-xl bg-white text-slate-700 shadow-md border border-slate-200 hover:bg-slate-50 transition active:scale-95"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetDhaka}
          title={tMap.resetView}
          className="p-2.5 rounded-xl bg-white text-slate-700 shadow-md border border-slate-200 hover:bg-slate-50 transition active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowHotspots(!showHotspots)}
          title="Toggle Hotspot Halos"
          className={`p-2.5 rounded-xl shadow-md border transition active:scale-95 ${
            showHotspots
              ? 'bg-teal-700 text-white border-teal-800'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>

        <button
          onClick={() => setMapType(mapType === 'roadmap' ? 'hybrid' : 'roadmap')}
          title="Toggle Satellite Imagery"
          className={`p-2.5 rounded-xl shadow-md border transition active:scale-95 ${
            mapType === 'hybrid'
              ? 'bg-sky-700 text-white border-sky-800'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Satellite className="w-4 h-4" />
        </button>
      </div>

      {/* Main Google Maps Canvas wrapped in APIProvider */}
      <div className="w-full h-full flex-1 z-10" style={{ minHeight: '300px' }}>
        <APIProvider
          apiKey={mapsApiKey}
          libraries={['marker', 'places', 'geometry']}
        >
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={DHAKA_CENTER}
            defaultZoom={12}
            gestureHandling="greedy"
            disableDefaultUI={false}
            mapTypeId={mapType}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
            internalUsageAttributionIds={['gmp_git_agentskills_v1']}
          >
            {/* Imperative camera pans & zoom controller */}
            <MapCameraController
              selectedIncident={selectedIncident}
              triggerCenter={cameraTrigger}
            />

            {/* Hotspot Circles (Geospatial Hazard Density Zones) */}
            {showHotspots &&
              hotspots.map((hs) => {
                const isCritical = hs.priority === 'CRITICAL';
                return (
                  <Circle
                    key={hs.id}
                    center={{ lat: hs.latitude, lng: hs.longitude }}
                    radius={hs.radiusMeters}
                    fillColor={isCritical ? '#f43f5e' : '#f59e0b'}
                    fillOpacity={0.16}
                    strokeColor={isCritical ? '#e11d48' : '#d97706'}
                    strokeWeight={2}
                    strokeOpacity={0.8}
                  />
                );
              })}

            {/* User GPS Geolocation Marker */}
            {userLocation && (
              <AdvancedMarker position={userLocation} title="Your Location">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-8 h-8 rounded-full bg-sky-400/40 animate-ping" />
                  <div className="w-5 h-5 rounded-full bg-sky-500 border-2 border-white shadow-md flex items-center justify-center">
                    <Navigation className="w-3 h-3 text-white fill-white" />
                  </div>
                </div>
              </AdvancedMarker>
            )}

            {/* Advanced Markers for Civic Incidents */}
            {filteredIncidents.map((item) => {
              const isSelected = selectedIncident?.id === item.id;
              let pinBg = '#94a3b8';
              let haloBg = 'rgba(148, 163, 184, 0.4)';

              if (item.status === 'RESOLVED') {
                pinBg = '#10b981';
                haloBg = 'rgba(16, 185, 129, 0.35)';
              } else if (item.priority === 'CRITICAL') {
                pinBg = '#ef4444';
                haloBg = 'rgba(239, 68, 68, 0.45)';
              } else if (item.priority === 'HIGH') {
                pinBg = '#f97316';
                haloBg = 'rgba(249, 115, 22, 0.4)';
              } else if (item.priority === 'MODERATE') {
                pinBg = '#eab308';
                haloBg = 'rgba(234, 179, 8, 0.4)';
              }

              const size = isSelected ? 36 : 28;

              return (
                <AdvancedMarker
                  key={item.id}
                  position={{ lat: item.latitude, lng: item.longitude }}
                  onClick={() => {
                    onSelectIncident(item);
                    setPanelOpen(true);
                  }}
                  title={`${item.title} — ${item.locationName}`}
                  zIndex={isSelected ? 99 : item.priority === 'CRITICAL' ? 50 : 10}
                >
                  <div
                    className="relative cursor-pointer transition-transform duration-200 hover:scale-110"
                    style={{ width: `${size}px`, height: `${size}px` }}
                  >
                    {item.priority === 'CRITICAL' && item.status !== 'RESOLVED' && (
                      <div
                        className="absolute inset-[-6px] rounded-full animate-ping"
                        style={{ backgroundColor: haloBg }}
                      />
                    )}
                    <div
                      className="w-full h-full rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-[11px] font-extrabold select-none"
                      style={{
                        backgroundColor: pinBg,
                        boxShadow: isSelected
                          ? '0 0 0 3px #0ea5e9, 0 8px 16px rgba(0,0,0,0.35)'
                          : '0 4px 6px -1px rgba(0,0,0,0.3)',
                      }}
                    >
                      {item.reportCount > 1 ? item.reportCount : ''}
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}
          </Map>
        </APIProvider>
      </div>

      {/* Selected Incident Drawer / Side Panel */}
      {selectedIncident && panelOpen && (
        <div className="absolute bottom-16 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 z-30 w-auto sm:w-96 rounded-2xl bg-white/98 backdrop-blur-md shadow-2xl border border-slate-200 p-4 animate-slideUp">
          <div className="flex items-start justify-between pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-slate-600 font-bold">
                  {selectedIncident.id}
                </span>
                <span
                  className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                    selectedIncident.priority === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-800'
                      : selectedIncident.priority === 'HIGH'
                      ? 'bg-amber-100 text-amber-800'
                      : selectedIncident.status === 'RESOLVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {selectedIncident.priority}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-0.5 leading-snug">
                {selectedIncident.title}
              </h3>
              <p className="text-[11px] text-slate-600">
                {selectedIncident.locationName}
              </p>
            </div>
            <button
              onClick={() => setPanelOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 my-3">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[9px] uppercase font-bold text-slate-600 block">
                Civic Score
              </span>
              <span className="font-black text-rose-600 text-xs sm:text-sm">
                {selectedIncident.severity}/100
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[9px] uppercase font-bold text-slate-600 block">
                Est. Depth
              </span>
              <span className="font-bold text-slate-800 text-xs">
                {selectedIncident.estimatedDepthCm
                  ? `~${selectedIncident.estimatedDepthCm}cm`
                  : 'Fracture'}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[9px] uppercase font-bold text-slate-600 block">
                Status
              </span>
              <span className="font-bold text-slate-800 text-xs truncate block">
                {selectedIncident.status}
              </span>
            </div>
          </div>

          {/* Thumbnail Evidence */}
          <div className="w-full h-28 rounded-lg overflow-hidden border border-slate-200 mb-3 bg-slate-900">
            <img
              src={selectedIncident.imageUrl}
              alt={selectedIncident.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Nearby Exposure */}
          <div className="text-[11px] text-slate-600 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="font-semibold text-slate-800 block mb-0.5">
              Nearby Facilities Exposed:
            </span>
            {selectedIncident.nearbyFacilities
              .map((f) => `${f.name} (${f.distanceMeters}m)`)
              .join(', ')}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDossier(selectedIncident)}
              className="w-full py-2 px-3 text-xs font-bold rounded-xl text-white bg-slate-900 hover:bg-slate-800 transition active:scale-95 shadow-xs text-center"
            >
              {tMap.viewDossier}
            </button>
          </div>
        </div>
      )}

      {/* Map Legend (Bottom Left) */}
      <div className="hidden sm:flex absolute bottom-4 left-4 z-20 items-center gap-3 p-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md text-[11px] font-semibold text-slate-700 pointer-events-auto">
        <span className="text-slate-600 font-bold uppercase tracking-wider text-[10px]">
          {tMap.legendTitle}:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Critical (80+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>High (60-79)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span>Moderate (30-59)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Resolved</span>
        </div>
      </div>
    </div>
  );
};
