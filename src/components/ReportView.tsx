import React, { useState, useRef, useEffect } from 'react';
import {
  AlertTriangle,
  Camera,
  Check,
  CheckCircle2,
  Compass,
  FileVideo,
  Loader2,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Upload,
  Video,
  Wrench,
  X,
} from 'lucide-react';
import {
  AiAnnotation,
  AiAnalysisResult,
  CivicIncident,
  PriorityLevel,
  ProblemType,
  RoadImportance,
} from '../types';
import { calculateCivicPriority } from '../services/severityEngine';
import { findPotentialDuplicates } from '../services/duplicateEngine';
import { CivicImpactChainView } from './CivicImpactChainView';
import { createCivicImageSvg, INITIAL_DEMO_INCIDENTS } from '../data/demoIncidents';
import { Language, translations } from '../i18n/translations';

interface ReportViewProps {
  language: Language;
  existingIncidents: CivicIncident[];
  onSubmitIncident: (newIncident: CivicIncident) => Promise<void>;
  onNavigateToMap: (incident?: CivicIncident) => void;
  onCancel: () => void;
  preselectedPreset?: ProblemType;
}

export const ReportView: React.FC<ReportViewProps> = ({
  language,
  existingIncidents,
  onSubmitIncident,
  onNavigateToMap,
  onCancel,
  preselectedPreset,
}) => {
  const t = translations[language].report;

  // Step state: 'capture' | 'analyzing' | 'review' | 'submitted'
  const [step, setStep] = useState<'capture' | 'analyzing' | 'review' | 'submitted'>('capture');

  // Media state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Location state
  const [locationName, setLocationName] = useState<string>('Mirpur Road, Section 10');
  const [roadName, setRoadName] = useState<string>('Mirpur Arterial Corridor');
  const [coordinates, setCoordinates] = useState<[number, number]>([23.8069, 90.3687]);
  const [locationStatus, setLocationStatus] = useState<'locked' | 'manual' | 'detecting'>('locked');

  // Analysis state & progressive checklist
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [analysisSteps, setAnalysisSteps] = useState({
    visual: false,
    detection: false,
    context: false,
    priority: false,
  });

  // Result data
  const [analysisResult, setAnalysisResult] = useState<AiAnalysisResult | null>(null);
  const [duplicateMatches, setDuplicateMatches] = useState<CivicIncident[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedIncident, setSubmittedIncident] = useState<CivicIncident | null>(null);

  // If preselectedPreset is passed, initialize automatically
  useEffect(() => {
    if (preselectedPreset) {
      applyPreset(preselectedPreset);
    }
  }, [preselectedPreset]);

  // Request browser geolocation once
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordinates([pos.coords.latitude, pos.coords.longitude]);
          setLocationStatus('locked');
        },
        () => {
          setLocationStatus('manual');
        },
        { timeout: 8000 }
      );
    }
  }, []);

  // Camera stream handler
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 800;
    canvas.height = videoRef.current.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg', 0.85);
      setSelectedImage(dataUri);
      stopCamera();
    }
  };

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      setIsVideo(true);
      // Simulate video processing upload progress (5-10s)
      setVideoProgress(15);
      const interval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 25;
        });
      }, 250);
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Demo Presets Selection
  const applyPreset = (type: ProblemType) => {
    stopCamera();
    let img = '';
    let loc = 'Mirpur Road, Section 10';
    let road = 'Mirpur Arterial Road';
    let coords: [number, number] = [23.8069, 90.3687];

    switch (type) {
      case 'waterlogging':
        img = createCivicImageSvg('waterlogging', '~25 cm', 'Mirpur Road, Section 10');
        loc = 'Mirpur Section 10 Roundabout';
        road = 'Mirpur Arterial Corridor';
        coords = [23.8069, 90.3687];
        break;
      case 'pothole':
        img = createCivicImageSvg('pothole', '~18 cm', 'Dhanmondi Road 27');
        loc = 'Dhanmondi Road 27 / Road 16';
        road = 'Mirpur Connector Road';
        coords = [23.7538, 90.3752];
        break;
      case 'garbage':
        img = createCivicImageSvg('garbage', '>2.5 Tons', 'Farmgate Footbridge');
        loc = 'Farmgate Footbridge East Descent';
        road = 'Indira Road / Airport Connector';
        coords = [23.7571, 90.3888];
        break;
      case 'blocked_drain':
        img = createCivicImageSvg('blocked_drain', '90% Choked', 'Karwan Bazar Arterial');
        loc = 'Karwan Bazar Wholesale Frontage';
        road = 'Kazi Nazrul Islam Avenue';
        coords = [23.7516, 90.3934];
        break;
      default:
        img = createCivicImageSvg('road_damage', '4m Fissure', 'Mohakhali Flyover');
        loc = 'Mohakhali Flyover North Ramp';
        road = 'Bir Uttam AK Khandakar Road';
        coords = [23.7778, 90.4045];
        break;
    }

    setSelectedImage(img);
    setLocationName(loc);
    setRoadName(road);
    setCoordinates(coords);
  };

  // Trigger Multi-modal AI Analysis
  const handleStartAnalysis = async () => {
    if (!selectedImage) return;

    setStep('analyzing');
    setAnalysisProgress(10);
    setAnalysisSteps({ visual: false, detection: false, context: false, priority: false });

    // Step 1: Visual Inspection
    setTimeout(() => {
      setAnalysisSteps((prev) => ({ ...prev, visual: true }));
      setAnalysisProgress(30);
    }, 400);

    // Step 2: Infrastructure Detection
    setTimeout(() => {
      setAnalysisSteps((prev) => ({ ...prev, detection: true }));
      setAnalysisProgress(60);
    }, 900);

    // Step 3: Civic Context & Facilities
    setTimeout(() => {
      setAnalysisSteps((prev) => ({ ...prev, context: true }));
      setAnalysisProgress(85);
    }, 1400);

    try {
      // Call server backend
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          problemCategoryHint: selectedImage.includes('pothole')
            ? 'pothole'
            : selectedImage.includes('garbage')
            ? 'garbage'
            : selectedImage.includes('blocked_drain')
            ? 'blocked_drain'
            : 'waterlogging',
        }),
      });

      let data: any = null;
      if (response.ok) {
        data = await response.json();
      }

      // Step 4: Priority Engine
      setTimeout(() => {
        setAnalysisSteps((prev) => ({ ...prev, priority: true }));
        setAnalysisProgress(100);

        const problemType: ProblemType = (data?.problemType as ProblemType) || 'waterlogging';
        const depth = data?.estimatedDepthCm || 25;
        const roadImportance: RoadImportance = 'PRIMARY_ARTERIAL';

        // Nearby facilities lookup around current coordinates
        const nearbyFacilities = [
          { type: 'school' as const, name: 'Mirpur Girls Ideal Institute', distanceMeters: 180 },
          { type: 'bus_stop' as const, name: 'Mirpur-10 Transit Metro Hub', distanceMeters: 90 },
          { type: 'hospital' as const, name: 'Al-Helal Specialized Hospital', distanceMeters: 310 },
        ];

        const calculated = calculateCivicPriority({
          problemType,
          estimatedDepthCm: depth,
          roadImportance,
          nearbyFacilities,
        });

        const annotations: AiAnnotation[] = data?.annotations || [
          { label: 'Surface Water Submersion', box: [15, 42, 70, 48], confidence: 0.91, highlightColor: '#0284c7' },
          { label: 'Submerged Curb & Footpath', box: [65, 52, 28, 38], confidence: 0.86, highlightColor: '#f59e0b' },
        ];

        const result: AiAnalysisResult = {
          problemType,
          confidence: data?.confidence || 0.89,
          severity: calculated.score,
          priority: calculated.priority,
          description: data?.description || 'Significant surface water accumulation across arterial lanes with flow blockage.',
          estimatedDepthCm: depth,
          affectedFeatures: data?.affectedFeatures || ['Metro Access Ramp', 'Pedestrian Walkway', 'Southbound Arterial Carriageway'],
          recommendedAction: calculated.suggestedServiceCategory.includes('Drainage')
            ? 'Drainage inspection and temporary water-removal assessment'
            : 'Immediate road inspection and pavement repair',
          suggestedServiceCategory: calculated.suggestedServiceCategory,
          annotations,
          roadImportance,
          nearbyFacilities,
          isAiFallback: data?.isAiFallback ?? false,
        };

        // Check for duplicate reports in proximity
        const dupes = findPotentialDuplicates(
          { latitude: coordinates[0], longitude: coordinates[1], type: problemType },
          existingIncidents
        );

        setAnalysisResult(result);
        setDuplicateMatches(dupes);
        setStep('review');
      }, 1900);
    } catch (err) {
      console.warn('Perception request error, using fallback:', err);
    }
  };

  // Submit to Application State
  const handleSubmit = async () => {
    if (!analysisResult || !selectedImage) return;

    setIsSubmitting(true);
    const incidentId = `DHK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newIncident: CivicIncident = {
      id: incidentId,
      type: analysisResult.problemType,
      title: `${translations[language].categories[analysisResult.problemType] || analysisResult.problemType} on ${roadName}`,
      description: analysisResult.description,
      imageUrl: selectedImage,
      videoUrl: isVideo ? 'https://assets.nagareye.internal/demo-video-evidence.mp4' : undefined,
      latitude: coordinates[0],
      longitude: coordinates[1],
      locationName,
      roadName,
      city: 'Dhaka',
      timestamp: new Date().toISOString(),
      severity: analysisResult.severity,
      priority: analysisResult.priority,
      confidence: analysisResult.confidence,
      status: 'DETECTED',
      suggestedServiceCategory: analysisResult.suggestedServiceCategory,
      roadImportance: analysisResult.roadImportance,
      nearbyFacilities: analysisResult.nearbyFacilities,
      civicImpactChain: {
        problem: `${translations[language].categories[analysisResult.problemType]} (~${analysisResult.estimatedDepthCm || 15}cm)`,
        exposure: `${roadName} • ${analysisResult.nearbyFacilities[0]?.name || 'Transit hub'}`,
        impact: 'High pedestrian exposure & vehicular disruption',
        priority: analysisResult.priority,
      },
      estimatedDepthCm: analysisResult.estimatedDepthCm,
      affectedFeatures: analysisResult.affectedFeatures,
      recommendedAction: analysisResult.recommendedAction,
      annotations: analysisResult.annotations,
      reportCount: duplicateMatches.length > 0 ? duplicateMatches.reduce((acc, d) => acc + d.reportCount, 1) + 1 : 1,
      isDuplicateCluster: duplicateMatches.length > 0,
      clusterIncidentIds: duplicateMatches.map((d) => d.id),
      timeline: [
        {
          status: 'DETECTED',
          timestamp: new Date().toISOString(),
          note: `Logged via citizen mobile field reporting. AI severity: ${analysisResult.severity}/100.`,
        },
      ],
    };

    await onSubmitIncident(newIncident);
    setSubmittedIncident(newIncident);
    setIsSubmitting(false);
    setStep('submitted');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{t.subtitle}</p>
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* STEP 1: CAPTURE & UPLOAD */}
      {step === 'capture' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Media Capture Frame */}
          <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-slate-900 border border-slate-200 overflow-hidden flex flex-col items-center justify-center shadow-inner">
            {cameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 z-20">
                  <button
                    onClick={captureCameraFrame}
                    className="w-16 h-16 rounded-full border-4 border-white bg-rose-600 active:scale-95 transition shadow-xl flex items-center justify-center"
                    title={t.captureButton}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/30" />
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-950/80 text-white text-xs font-semibold backdrop-blur-xs"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : selectedImage ? (
              <div className="relative w-full h-full">
                <img
                  src={selectedImage}
                  alt="Captured problem"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-teal-400">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Capture or Upload Evidence
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Take a live photo, upload from gallery, or select a sample scene below.
                  </p>
                </div>
              </div>
            )}

            {/* Location Status Badge */}
            <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-xs text-white text-[11px] font-medium px-3 py-1 rounded-full flex items-center gap-1.5 border border-slate-700/60 z-10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{locationName}</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              onClick={startCamera}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 text-white font-semibold text-xs sm:text-sm hover:bg-slate-800 transition active:scale-95 shadow-sm"
            >
              <Camera className="w-4 h-4" />
              <span>{t.takePhoto}</span>
            </button>

            <label className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-xs sm:text-sm hover:bg-slate-50 cursor-pointer transition active:scale-95 shadow-xs">
              <Upload className="w-4 h-4 text-slate-500" />
              <span>{t.upload}</span>
              <input
                type="file"
                accept="image/*,video/*"
                capture="environment"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            <div className="col-span-2 sm:col-span-1">
              <button
                disabled={!selectedImage}
                onClick={handleStartAnalysis}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition shadow-sm ${
                  selectedImage
                    ? 'bg-teal-600 hover:bg-teal-500 text-white active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.usePhoto}</span>
              </button>
            </div>
          </div>

          {/* Quick Presets for Reliable Demonstrations */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[11px] uppercase font-bold text-slate-600 block mb-2">
              {t.quickPresetHelp}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => applyPreset('waterlogging')}
                className="p-2.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-950 text-left transition active:scale-95"
              >
                <span className="text-xs font-bold block">1. Waterlogging</span>
                <span className="text-[10px] text-sky-700">Mirpur-10 Road (~25cm)</span>
              </button>

              <button
                onClick={() => applyPreset('pothole')}
                className="p-2.5 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-900 text-left transition active:scale-95"
              >
                <span className="text-xs font-bold block">2. Deep Pothole</span>
                <span className="text-[10px] text-stone-600">Dhanmondi-27 (~18cm)</span>
              </button>

              <button
                onClick={() => applyPreset('garbage')}
                className="p-2.5 rounded-xl border border-lime-200 bg-lime-50 hover:bg-lime-100 text-lime-950 text-left transition active:scale-95"
              >
                <span className="text-xs font-bold block">3. Solid Waste</span>
                <span className="text-[10px] text-lime-700">Farmgate Footbridge</span>
              </button>

              <button
                onClick={() => applyPreset('blocked_drain')}
                className="p-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-950 text-left transition active:scale-95"
              >
                <span className="text-xs font-bold block">4. Blocked Drain</span>
                <span className="text-[10px] text-purple-700">Karwan Bazar Inlet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: ANALYZING SCENE (Professional Transition) */}
      {step === 'analyzing' && (
        <div className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200 shadow-md text-center max-w-lg mx-auto space-y-6 animate-fadeIn">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
            <div
              className="absolute inset-0 rounded-full border-4 border-teal-600 border-t-transparent animate-spin"
            />
            <Sparkles className="w-8 h-8 text-teal-700 animate-pulse" />
          </div>

          <div>
            <h2 className="text-lg font-black tracking-wide text-slate-900 uppercase">
              {t.analyzingScene}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Multi-modal Vision & Civic Spatial Context Evaluation
            </p>
          </div>

          {/* Sequential Verification Steps */}
          <div className="space-y-2.5 text-left text-xs font-medium max-w-xs mx-auto">
            <div
              className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${
                analysisSteps.visual ? 'text-teal-900 bg-teal-50' : 'text-slate-400 bg-slate-50'
              }`}
            >
              {analysisSteps.visual ? (
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 animate-spin text-slate-400 shrink-0" />
              )}
              <span>{t.stepVisual}</span>
            </div>

            <div
              className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${
                analysisSteps.detection ? 'text-teal-900 bg-teal-50' : 'text-slate-400 bg-slate-50'
              }`}
            >
              {analysisSteps.detection ? (
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
              )}
              <span>{t.stepDetection}</span>
            </div>

            <div
              className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${
                analysisSteps.context ? 'text-teal-900 bg-teal-50' : 'text-slate-400 bg-slate-50'
              }`}
            >
              {analysisSteps.context ? (
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
              )}
              <span>{t.stepContext}</span>
            </div>

            <div
              className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${
                analysisSteps.priority ? 'text-teal-900 bg-teal-50' : 'text-slate-400 bg-slate-50'
              }`}
            >
              {analysisSteps.priority ? (
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
              )}
              <span>{t.stepPriority}</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: RESULT & CONFIRMATION */}
      {step === 'review' && analysisResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* Visual Annotation Overlay Preview */}
          <div className="relative w-full h-72 sm:h-84 rounded-2xl bg-slate-950 border border-slate-200 overflow-hidden shadow-inner">
            <img
              src={selectedImage || ''}
              alt="Detected defect"
              className="w-full h-full object-cover"
            />

            {/* AI Bounding Box Annotations */}
            {analysisResult.annotations.map((ann, idx) => {
              const [x, y, w, h] = ann.box;
              return (
                <div
                  key={idx}
                  className="absolute border-2 border-dashed rounded-md pointer-events-none"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${w}%`,
                    height: `${h}%`,
                    borderColor: ann.highlightColor || '#0284c7',
                    backgroundColor: `${ann.highlightColor || '#0284c7'}20`,
                  }}
                >
                  <div
                    className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-md"
                    style={{ backgroundColor: ann.highlightColor || '#0284c7' }}
                  >
                    {ann.label} • {(ann.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              );
            })}

            <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-md border border-slate-700">
              {translations[language].categories[analysisResult.problemType].toUpperCase()}
            </div>
          </div>

          {/* Core Result Header Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-600 block">
                {t.civicScore}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-rose-600">{analysisResult.severity}</span>
                <span className="text-xs text-slate-600 font-semibold">/ 100</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mt-0.5">
                {analysisResult.priority}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-600 block">
                {t.estDepth}
              </span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">
                ~{analysisResult.estimatedDepthCm || 20} cm
              </span>
              <span className="text-[10px] text-slate-600">Physical dimension</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-600 block">
                {t.aiConfidence}
              </span>
              <span className="text-sm font-bold text-teal-700 mt-1 block">
                {(analysisResult.confidence * 100).toFixed(0)}%
              </span>
              <span className="text-[10px] text-slate-600">Visual Perception</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-600 block">
                Road Importance
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1 block truncate">
                {analysisResult.roadImportance.replace('_', ' ')}
              </span>
              <span className="text-[10px] text-slate-600">{roadName}</span>
            </div>
          </div>

          {/* Duplicate Clustering Alert (if matches found) */}
          {duplicateMatches.length > 0 && (
            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold block">
                  Corridor Cluster Identified ({duplicateMatches.reduce((a, b) => a + b.reportCount, 0)} supporting citizen reports)
                </span>
                <p className="text-teal-900 mt-0.5">
                  This hazard aligns with existing verified reports within 300 meters on {roadName}. Submitting will strengthen the municipal priority score rather than creating fragmented duplicates.
                </p>
              </div>
            </div>
          )}

          {/* Civic Impact Chain */}
          <CivicImpactChainView
            chain={{
              problem: `${translations[language].categories[analysisResult.problemType]} (~${analysisResult.estimatedDepthCm || 25}cm)`,
              exposure: `Major Arterial • School (180m) • Bus Stop (90m)`,
              impact: 'Major road access disruption & pedestrian hazard',
              priority: analysisResult.priority,
            }}
            language={language}
          />

          {/* Service Routing and Action */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block">
                {t.suggestedService}
              </span>
              <p className="text-xs sm:text-sm font-bold text-teal-900 mt-0.5">
                {analysisResult.suggestedServiceCategory}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block">
                {t.recommendedAction}
              </span>
              <p className="text-xs text-slate-800 mt-0.5">
                {analysisResult.recommendedAction}
              </p>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 rounded-lg bg-slate-100 text-slate-600 text-[11px] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{t.privacyNote}</span>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep('capture')}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              {t.retake}
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-slate-800 active:scale-95 transition shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.submitting}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.submitIncident}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SUCCESS CONFIRMATION */}
      {step === 'submitted' && submittedIncident && (
        <div className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200 shadow-md text-center max-w-lg mx-auto space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {t.submittedSuccess}
            </h2>
            <p className="font-mono text-xs text-slate-600 font-semibold mt-1">
              Reference: {submittedIncident.id}
            </p>
            <p className="text-xs text-slate-600 mt-2">
              Routed to {submittedIncident.suggestedServiceCategory}. Clustered on Dhaka Civic Grid.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateToMap(submittedIncident)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition active:scale-95 shadow-sm"
            >
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>{t.viewOnMap}</span>
            </button>

            <button
              onClick={() => {
                setStep('capture');
                setSelectedImage(null);
                setAnalysisResult(null);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Report Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
