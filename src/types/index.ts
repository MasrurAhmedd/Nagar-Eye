export type ProblemType =
  | 'waterlogging'
  | 'pothole'
  | 'garbage'
  | 'blocked_drain'
  | 'road_damage'
  | 'sidewalk_damage'
  | 'broken_streetlight'
  | 'unsafe_crossing'
  | 'accessibility_barrier'
  | 'waste_burning';

export type PriorityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type IncidentStatus =
  | 'DETECTED'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED';

export type RoadImportance =
  | 'EXPRESSWAY'
  | 'PRIMARY_ARTERIAL'
  | 'SECONDARY'
  | 'LOCAL';

export interface NearbyFacility {
  type: 'school' | 'hospital' | 'bus_stop' | 'market' | 'government_office' | 'residential';
  name: string;
  distanceMeters: number;
}

export interface AiAnnotation {
  label: string;
  // Bounding box [x, y, width, height] in percentage (0-100)
  box: [number, number, number, number];
  confidence: number;
  highlightColor?: string;
}

export interface CivicImpactChain {
  problem: string;
  exposure: string;
  impact: string;
  priority: PriorityLevel;
}

export interface StatusTimelineEvent {
  status: IncidentStatus;
  timestamp: string;
  note?: string;
  actor?: string;
}

export interface CivicIncident {
  id: string;
  type: ProblemType;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  afterImageUrl?: string;
  latitude: number;
  longitude: number;
  locationName: string;
  roadName: string;
  city: string;
  timestamp: string;
  severity: number; // 0-100
  priority: PriorityLevel;
  confidence: number; // 0-1
  status: IncidentStatus;
  suggestedServiceCategory: string;
  roadImportance: RoadImportance;
  nearbyFacilities: NearbyFacility[];
  civicImpactChain: CivicImpactChain;
  estimatedDepthCm?: number;
  affectedFeatures: string[];
  recommendedAction: string;
  annotations: AiAnnotation[];
  reportCount: number;
  isDuplicateCluster?: boolean;
  clusterIncidentIds?: string[];
  isPendingSync?: boolean;
  resolutionEvidence?: {
    afterImageUrl: string;
    resolvedAt: string;
    confidence: number;
    verificationNote: string;
  };
  timeline: StatusTimelineEvent[];
}

export interface CivicHotspot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  reportCount: number;
  primaryType: ProblemType;
  averageSeverity: number;
  priority: PriorityLevel;
  trend: 'increasing' | 'stable' | 'decreasing';
  incidentIds: string[];
}

export interface FilterOptions {
  problemType: string; // 'all' or ProblemType
  priority: string; // 'all' or PriorityLevel
  status: string; // 'all' or IncidentStatus
  timeRange: 'today' | '7days' | '30days' | 'all';
  searchQuery: string;
}

export interface AiAnalysisResult {
  problemType: ProblemType;
  confidence: number;
  severity: number;
  priority: PriorityLevel;
  description: string;
  estimatedDepthCm?: number;
  affectedFeatures: string[];
  recommendedAction: string;
  suggestedServiceCategory: string;
  annotations: AiAnnotation[];
  roadImportance: RoadImportance;
  nearbyFacilities: NearbyFacility[];
  isAiFallback?: boolean;
}
