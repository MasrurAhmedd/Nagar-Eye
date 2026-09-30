import {
  CivicImpactChain,
  NearbyFacility,
  PriorityLevel,
  ProblemType,
  RoadImportance,
} from '../types';

export interface SeverityInputs {
  problemType: ProblemType;
  basePhysicalSeverity?: number; // 0 - 40
  estimatedDepthCm?: number;
  roadImportance: RoadImportance;
  nearbyFacilities: NearbyFacility[];
  accessibilityBarrier?: boolean;
}

export interface SeverityResult {
  score: number; // 0 - 100
  priority: PriorityLevel;
  breakdown: {
    baseProblemScore: number;
    physicalScore: number;
    roadScore: number;
    facilityScore: number;
    accessibilityScore: number;
  };
  impactChain: CivicImpactChain;
  suggestedServiceCategory: string;
}

export function calculateCivicPriority(inputs: SeverityInputs): SeverityResult {
  const {
    problemType,
    estimatedDepthCm = 15,
    roadImportance,
    nearbyFacilities,
    accessibilityBarrier = false,
  } = inputs;

  // 1. Base Problem Type Base Score (Max 35)
  let baseProblemScore = 20;
  switch (problemType) {
    case 'waterlogging':
      baseProblemScore = 32;
      break;
    case 'blocked_drain':
      baseProblemScore = 28;
      break;
    case 'pothole':
      baseProblemScore = 26;
      break;
    case 'road_damage':
      baseProblemScore = 27;
      break;
    case 'garbage':
      baseProblemScore = 24;
      break;
    case 'waste_burning':
      baseProblemScore = 30;
      break;
    case 'unsafe_crossing':
      baseProblemScore = 28;
      break;
    case 'broken_streetlight':
      baseProblemScore = 18;
      break;
    case 'sidewalk_damage':
      baseProblemScore = 20;
      break;
    case 'accessibility_barrier':
      baseProblemScore = 22;
      break;
  }

  // 2. Physical dimension score (Max 25)
  let physicalScore = 10;
  if (estimatedDepthCm > 30) {
    physicalScore = 25;
  } else if (estimatedDepthCm > 20) {
    physicalScore = 20;
  } else if (estimatedDepthCm > 10) {
    physicalScore = 14;
  }

  // 3. Road Importance score (Max 20)
  let roadScore = 5;
  switch (roadImportance) {
    case 'EXPRESSWAY':
      roadScore = 20;
      break;
    case 'PRIMARY_ARTERIAL':
      roadScore = 18;
      break;
    case 'SECONDARY':
      roadScore = 12;
      break;
    case 'LOCAL':
      roadScore = 6;
      break;
  }

  // 4. Facility exposure within 300m (Max 15)
  let facilityScore = 0;
  let hasSchool = false;
  let hasHospital = false;
  let hasTransit = false;

  for (const fac of nearbyFacilities) {
    if (fac.distanceMeters <= 300) {
      if (fac.type === 'hospital') {
        facilityScore += 8;
        hasHospital = true;
      } else if (fac.type === 'school') {
        facilityScore += 6;
        hasSchool = true;
      } else if (fac.type === 'bus_stop') {
        facilityScore += 5;
        hasTransit = true;
      } else if (fac.type === 'market') {
        facilityScore += 4;
      }
    }
  }
  facilityScore = Math.min(15, facilityScore);

  // 5. Accessibility Impact (Max 10)
  const accessibilityScore = accessibilityBarrier || problemType === 'accessibility_barrier' || problemType === 'sidewalk_damage' ? 8 : 4;

  const totalRaw = baseProblemScore + physicalScore + roadScore + facilityScore + accessibilityScore;
  const score = Math.max(10, Math.min(99, Math.round(totalRaw)));

  let priority: PriorityLevel = 'LOW';
  if (score >= 80) {
    priority = 'CRITICAL';
  } else if (score >= 60) {
    priority = 'HIGH';
  } else if (score >= 30) {
    priority = 'MODERATE';
  }

  // Civic Impact Chain derivation
  const roadDesc =
    roadImportance === 'EXPRESSWAY'
      ? 'Expressway corridor'
      : roadImportance === 'PRIMARY_ARTERIAL'
      ? 'Major arterial road'
      : roadImportance === 'SECONDARY'
      ? 'Connecting urban collector'
      : 'Local neighborhood street';

  const exposureParts: string[] = [roadDesc];
  if (hasSchool) exposureParts.push('School nearby');
  if (hasTransit) exposureParts.push('Bus stop / Transit nearby');
  if (hasHospital) exposureParts.push('Hospital nearby');

  let impactDesc = 'Local transit friction & delay';
  if (priority === 'CRITICAL') {
    impactDesc = 'Major thoroughfare paralysis & high pedestrian accident risk';
  } else if (priority === 'HIGH') {
    impactDesc = 'Severe access disruption during rush hours & school transit';
  } else if (priority === 'MODERATE') {
    impactDesc = 'Pedestrian inconvenience and lane narrowing';
  }

  const problemLabelMap: Record<ProblemType, string> = {
    waterlogging: 'Severe waterlogging',
    pothole: 'Deep road surface crater',
    garbage: 'Overflowing solid waste',
    blocked_drain: 'Obstructed storm drain',
    road_damage: 'Extensive asphalt deterioration',
    sidewalk_damage: 'Fractured pedestrian walkway',
    broken_streetlight: 'Unlit thoroughfare at night',
    unsafe_crossing: 'High-risk zebra crossing',
    accessibility_barrier: 'Wheelchair / stroller obstruction',
    waste_burning: 'Open toxic waste incineration',
  };

  const impactChain: CivicImpactChain = {
    problem: problemLabelMap[problemType],
    exposure: exposureParts.slice(0, 3).join(' • '),
    impact: impactDesc,
    priority,
  };

  const suggestedServiceCategory = getServiceCategory(problemType);

  return {
    score,
    priority,
    breakdown: {
      baseProblemScore,
      physicalScore,
      roadScore,
      facilityScore,
      accessibilityScore,
    },
    impactChain,
    suggestedServiceCategory,
  };
}

export function getServiceCategory(problemType: ProblemType): string {
  switch (problemType) {
    case 'waterlogging':
    case 'blocked_drain':
      return 'Drainage / Public Works (WASA & City Corp)';
    case 'pothole':
    case 'road_damage':
      return 'Roads & Highways / Public Works Department';
    case 'garbage':
      return 'Solid Waste Management Department';
    case 'waste_burning':
      return 'Environmental & Waste Enforcement';
    case 'broken_streetlight':
      return 'Electrical & Street Lighting Division';
    case 'sidewalk_damage':
    case 'accessibility_barrier':
      return 'Urban Infrastructure & Footpath Engineering';
    case 'unsafe_crossing':
      return 'Traffic Engineering & Municipal Safety';
    default:
      return 'Municipal Public Works';
  }
}
