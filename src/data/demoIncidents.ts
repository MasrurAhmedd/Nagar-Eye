import { CivicIncident, NearbyFacility } from '../types';

// Helper to create reliable high-resolution SVG imagery data URIs for civic infrastructure
export function createCivicImageSvg(type: string, depthOrSize: string, location: string): string {
  let innerArt = '';
  let colorTheme = '#1e293b';

  if (type === 'waterlogging') {
    colorTheme = '#0c4a6e';
    innerArt = `
      <!-- Asphalt background -->
      <rect width="800" height="600" fill="#334155"/>
      <path d="M0 300 Q200 240 450 280 T800 260 L800 600 L0 600 Z" fill="#0369a1" opacity="0.88"/>
      <path d="M0 340 Q250 310 500 350 T800 330 L800 600 L0 600 Z" fill="#0284c7" opacity="0.6"/>
      <!-- Water ripples -->
      <ellipse cx="420" cy="440" rx="280" ry="60" fill="#38bdf8" opacity="0.25"/>
      <ellipse cx="260" cy="490" rx="190" ry="40" fill="#bae6fd" opacity="0.2"/>
      <!-- Curb and Metro Pillar -->
      <rect x="620" y="80" width="110" height="520" fill="#64748b"/>
      <rect x="610" y="420" width="130" height="20" fill="#475569"/>
      <!-- Water line depth indicator -->
      <line x1="610" y1="420" x2="560" y2="420" stroke="#f43f5e" stroke-width="3" stroke-dasharray="4 4"/>
      <text x="440" y="415" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="16">Water Line: ${depthOrSize}</text>
      <!-- Road divider reflection -->
      <line x1="120" y1="260" x2="350" y2="600" stroke="#fbbf24" stroke-width="12" stroke-dasharray="40 30" opacity="0.7"/>
    `;
  } else if (type === 'pothole') {
    colorTheme = '#1c1917';
    innerArt = `
      <rect width="800" height="600" fill="#475569"/>
      <!-- Asphalt texture lines -->
      <line x1="0" y1="200" x2="800" y2="200" stroke="#334155" stroke-width="2"/>
      <line x1="0" y1="400" x2="800" y2="400" stroke="#334155" stroke-width="2"/>
      <!-- Major Pothole Crater -->
      <path d="M220 320 Q300 240 480 270 Q620 290 640 410 Q610 510 440 520 Q260 520 210 430 Z" fill="#0f172a"/>
      <path d="M260 350 Q340 300 460 310 Q560 330 580 410 Q560 470 430 480 Q290 480 250 410 Z" fill="#020617"/>
      <!-- Broken sharp edges & rubble -->
      <circle cx="280" cy="330" r="14" fill="#94a3b8"/>
      <circle cx="490" cy="285" r="18" fill="#94a3b8"/>
      <circle cx="590" cy="460" r="16" fill="#64748b"/>
      <circle cx="340" cy="495" r="22" fill="#64748b"/>
      <path d="M200 410 L240 430 L220 450 Z" fill="#cbd5e1"/>
      <!-- Stagnant rainwater inside depression -->
      <ellipse cx="420" cy="420" rx="90" ry="35" fill="#334155" opacity="0.85"/>
      <text x="350" y="425" fill="#94a3b8" font-family="sans-serif" font-size="14" font-weight="600">Depth: ${depthOrSize}</text>
    `;
  } else if (type === 'garbage') {
    colorTheme = '#365314';
    innerArt = `
      <rect width="800" height="600" fill="#64748b"/>
      <!-- Sidewalk pavement -->
      <rect x="0" y="320" width="800" height="280" fill="#475569"/>
      <!-- Overflowing municipal dumpster -->
      <rect x="440" y="240" width="260" height="200" fill="#15803d" rx="10"/>
      <rect x="420" y="225" width="300" height="25" fill="#166534" rx="4"/>
      <!-- Overflowing piles of plastic & organic waste -->
      <path d="M120 540 Q240 350 450 380 Q640 330 750 540 Z" fill="#713f12" opacity="0.9"/>
      <!-- Discarded colored plastics -->
      <ellipse cx="260" cy="480" rx="50" ry="30" fill="#3b82f6"/>
      <ellipse cx="380" cy="460" rx="65" ry="35" fill="#ef4444"/>
      <ellipse cx="510" cy="490" rx="70" ry="40" fill="#eab308"/>
      <ellipse cx="320" cy="520" rx="80" ry="35" fill="#10b981"/>
      <circle cx="620" cy="510" r="30" fill="#a855f7"/>
      <text x="250" y="410" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="16">Overflow: ${depthOrSize}</text>
    `;
  } else if (type === 'blocked_drain') {
    colorTheme = '#3b0764';
    innerArt = `
      <rect width="800" height="600" fill="#475569"/>
      <!-- Concrete kerb -->
      <rect x="0" y="260" width="800" height="90" fill="#94a3b8"/>
      <!-- Storm drain inlet grating -->
      <rect x="250" y="280" width="320" height="150" fill="#1e293b" rx="6"/>
      <line x1="290" y1="280" x2="290" y2="430" stroke="#64748b" stroke-width="12"/>
      <line x1="350" y1="280" x2="350" y2="430" stroke="#64748b" stroke-width="12"/>
      <line x1="410" y1="280" x2="410" y2="430" stroke="#64748b" stroke-width="12"/>
      <line x1="470" y1="280" x2="470" y2="430" stroke="#64748b" stroke-width="12"/>
      <line x1="530" y1="280" x2="530" y2="430" stroke="#64748b" stroke-width="12"/>
      <!-- Silt & polyethylene choking the inlet -->
      <path d="M220 410 Q410 320 600 420 L580 480 L230 480 Z" fill="#451a03" opacity="0.95"/>
      <ellipse cx="390" cy="400" rx="90" ry="30" fill="#0284c7" opacity="0.6"/>
      <text x="320" y="380" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="16">Blockage: 90%</text>
    `;
  } else {
    // Road / Sidewalk damage
    colorTheme = '#334155';
    innerArt = `
      <rect width="800" height="600" fill="#475569"/>
      <line x1="100" y1="120" x2="700" y2="480" stroke="#0f172a" stroke-width="18"/>
      <line x1="220" y1="160" x2="400" y2="420" stroke="#1e293b" stroke-width="12"/>
      <line x1="450" y1="280" x2="680" y2="350" stroke="#0f172a" stroke-width="14"/>
      <polygon points="340,260 480,240 520,380 380,420" fill="#1e293b"/>
      <text x="340" y="320" fill="#cbd5e1" font-family="sans-serif" font-weight="bold" font-size="16">Surface Rupture: ${depthOrSize}</text>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    ${innerArt}
    <!-- Overlay HUD / Sensor Metadata -->
    <rect x="20" y="20" width="760" height="48" rx="8" fill="rgba(15,23,42,0.85)"/>
    <circle cx="45" cy="44" r="7" fill="#22c55e"/>
    <text x="65" y="49" fill="#f8fafc" font-family="sans-serif" font-size="14" font-weight="600">NAGAR-EYE CAM • ${location.toUpperCase()}</text>
    <text x="630" y="49" fill="#94a3b8" font-family="sans-serif" font-size="13">GPS ACCURACY: ±2.8m</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Clean restored / after-repair evidence image
export function createResolvedImageSvg(type: string, location: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <!-- Smooth fresh asphalt -->
    <rect width="800" height="600" fill="#1e293b"/>
    <!-- Fresh road markings -->
    <line x1="0" y1="300" x2="800" y2="300" stroke="#f1f5f9" stroke-width="10" stroke-dasharray="60 40"/>
    <rect x="0" y="520" width="800" height="80" fill="#64748b"/>
    <!-- Clear storm drain or sidewalk -->
    <rect x="250" y="460" width="300" height="60" fill="#334155" rx="4"/>
    <line x1="280" y1="460" x2="280" y2="520" stroke="#94a3b8" stroke-width="8"/>
    <line x1="340" y1="460" x2="340" y2="520" stroke="#94a3b8" stroke-width="8"/>
    <line x1="400" y1="460" x2="400" y2="520" stroke="#94a3b8" stroke-width="8"/>
    <line x1="460" y1="460" x2="460" y2="520" stroke="#94a3b8" stroke-width="8"/>
    <line x1="520" y1="460" x2="520" y2="520" stroke="#94a3b8" stroke-width="8"/>
    <!-- Success Banner -->
    <rect x="20" y="20" width="760" height="52" rx="8" fill="rgba(6,78,59,0.92)"/>
    <circle cx="50" cy="46" r="12" fill="#22c55e"/>
    <path d="M44 46 L48 50 L56 42" stroke="#ffffff" stroke-width="3" fill="none"/>
    <text x="75" y="51" fill="#ffffff" font-family="sans-serif" font-size="15" font-weight="bold">VERIFIED REPAIR • PUBLIC WORKS CLEARANCE</text>
    <text x="640" y="51" fill="#a7f3d0" font-family="sans-serif" font-size="13">NO DEFECTS DETECTED</text>
    <rect x="260" y="220" width="280" height="40" rx="20" fill="rgba(34,197,94,0.2)" stroke="#22c55e" stroke-width="1.5"/>
    <text x="310" y="245" fill="#22c55e" font-family="sans-serif" font-size="14" font-weight="bold">RESTORATION CONFIRMED</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_DEMO_INCIDENTS: CivicIncident[] = [
  // 1. Mirpur Road - Primary Waterlogging Case (for Demo Story)
  {
    id: 'DHK-2026-0819',
    type: 'waterlogging',
    title: 'Severe Arterial Surface Waterlogging',
    description: 'Substantial standing monsoon water accumulation spanning three traffic lanes near Mirpur-10 intersection and Metro Rail Pillar 248. Flow completely arrested due to choked feeder conduits.',
    imageUrl: createCivicImageSvg('waterlogging', '~25 cm', 'Mirpur Road, Section 10'),
    afterImageUrl: createResolvedImageSvg('waterlogging', 'Mirpur Road, Section 10'),
    latitude: 23.8069,
    longitude: 90.3687,
    locationName: 'Mirpur Section 10 Roundabout',
    roadName: 'Mirpur Arterial Road',
    city: 'Dhaka',
    timestamp: '2026-09-29T19:42:00Z',
    severity: 87,
    priority: 'CRITICAL',
    confidence: 0.89,
    status: 'DETECTED',
    suggestedServiceCategory: 'Drainage / Public Works (WASA & DNCC)',
    roadImportance: 'PRIMARY_ARTERIAL',
    estimatedDepthCm: 25,
    affectedFeatures: ['Metro Pillar 248 Access', 'Pedestrian Walkway', 'Southbound Carriageway'],
    recommendedAction: 'Immediate high-capacity submersible pump deployment and clearing of choked culvert grates.',
    nearbyFacilities: [
      { type: 'school', name: 'Mirpur Girls Ideal Laboratory Institute', distanceMeters: 180 },
      { type: 'bus_stop', name: 'Mirpur 10 Metro & Bus Transit Hub', distanceMeters: 90 },
      { type: 'hospital', name: 'Al-Helal Specialized Hospital', distanceMeters: 310 },
    ],
    civicImpactChain: {
      problem: 'Severe waterlogging (~25cm depth)',
      exposure: 'Major arterial road • School (180m) • Bus stop (90m)',
      impact: 'Major thoroughfare paralysis & school commute disruption',
      priority: 'CRITICAL',
    },
    annotations: [
      { label: 'Surface Water Submersion', box: [15, 42, 70, 48], confidence: 0.91, highlightColor: '#0284c7' },
      { label: 'Submerged Curb & Footpath', box: [65, 52, 28, 38], confidence: 0.86, highlightColor: '#f59e0b' },
    ],
    reportCount: 14,
    isDuplicateCluster: true,
    clusterIncidentIds: ['DHK-2026-0820', 'DHK-2026-0821', 'DHK-2026-0822'],
    timeline: [
      { status: 'DETECTED', timestamp: '2026-09-29T19:42:00Z', note: 'AI multi-modal vision detected standing water exceeding 20cm threshold.' },
    ],
  },

  // 2. Dhanmondi 27 Pothole
  {
    id: 'DHK-2026-0742',
    type: 'pothole',
    title: 'Deep Multi-Crater Pothole Array',
    description: 'Cluster of 3 sharp-edged asphalt cavities spanning 1.8 meters across right driving lane. High risk of vehicle suspension damage and motorcycle overturn.',
    imageUrl: createCivicImageSvg('pothole', '~18 cm', 'Dhanmondi Road 27'),
    afterImageUrl: createResolvedImageSvg('pothole', 'Dhanmondi Road 27'),
    latitude: 23.7538,
    longitude: 90.3752,
    locationName: 'Dhanmondi Road 27 (Old) / Road 16',
    roadName: 'Mirpur Road Connector',
    city: 'Dhaka',
    timestamp: '2026-09-29T16:15:00Z',
    severity: 78,
    priority: 'HIGH',
    confidence: 0.92,
    status: 'VERIFIED',
    suggestedServiceCategory: 'Roads & Highways / Public Works Department',
    roadImportance: 'PRIMARY_ARTERIAL',
    estimatedDepthCm: 18,
    affectedFeatures: ['Right Vehicular Lane', 'Bicycle Lane'],
    recommendedAction: 'Rapid cold-mix asphalt patching followed by roller compaction before evening rush.',
    nearbyFacilities: [
      { type: 'school', name: 'Mastermind School Dhanmondi', distanceMeters: 140 },
      { type: 'hospital', name: 'Ibn Sina Medical College Hospital', distanceMeters: 280 },
      { type: 'market', name: 'Rapa Plaza Shopping Complex', distanceMeters: 120 },
    ],
    civicImpactChain: {
      problem: 'Deep road surface crater (18cm)',
      exposure: 'Major arterial road • Mastermind School (140m)',
      impact: 'Severe traffic bottleneck & cyclist hazard',
      priority: 'HIGH',
    },
    annotations: [
      { label: 'Deep Asphalt Crater', box: [26, 38, 48, 36], confidence: 0.94, highlightColor: '#ef4444' },
    ],
    reportCount: 7,
    timeline: [
      { status: 'DETECTED', timestamp: '2026-09-29T15:20:00Z' },
      { status: 'VERIFIED', timestamp: '2026-09-29T16:15:00Z', note: 'Field engineer verified depth and structural road base erosion.' },
    ],
  },

  // 3. Karwan Bazar Blocked Drain
  {
    id: 'DHK-2026-0690',
    type: 'blocked_drain',
    title: 'Arterial Storm Drain Siltation & Clog',
    description: 'Heavy market vegetable debris, polyethylene wrappers, and construction sediment completely choking main roadside curb storm inlet.',
    imageUrl: createCivicImageSvg('blocked_drain', '90% Clogged', 'Karwan Bazar Arterial'),
    afterImageUrl: createResolvedImageSvg('blocked_drain', 'Karwan Bazar Arterial'),
    latitude: 23.7516,
    longitude: 90.3934,
    locationName: 'Karwan Bazar Wholesale Market Frontage',
    roadName: 'Kazi Nazrul Islam Avenue',
    city: 'Dhaka',
    timestamp: '2026-09-29T14:10:00Z',
    severity: 82,
    priority: 'CRITICAL',
    confidence: 0.91,
    status: 'ASSIGNED',
    suggestedServiceCategory: 'Drainage / Public Works (WASA & City Corp)',
    roadImportance: 'PRIMARY_ARTERIAL',
    estimatedDepthCm: 35,
    affectedFeatures: ['Storm Drain Culvert', 'Pedestrian Promenade'],
    recommendedAction: 'Deploy mechanized suction jetting truck to evacuate dense sediment build-up.',
    nearbyFacilities: [
      { type: 'market', name: 'Karwan Bazar Central Market', distanceMeters: 40 },
      { type: 'bus_stop', name: 'Farmgate-Karwan Bazar Express Stop', distanceMeters: 110 },
      { type: 'hospital', name: 'Holy Family Red Crescent Hospital', distanceMeters: 450 },
    ],
    civicImpactChain: {
      problem: 'Obstructed storm drain (90% capacity loss)',
      exposure: 'Expressway feeder • Central Market (40m)',
      impact: 'Rapid flash waterlogging during rain events',
      priority: 'CRITICAL',
    },
    annotations: [
      { label: 'Obstructed Grate', box: [30, 45, 42, 32], confidence: 0.92, highlightColor: '#f97316' },
    ],
    reportCount: 9,
    timeline: [
      { status: 'DETECTED', timestamp: '2026-09-29T12:00:00Z' },
      { status: 'VERIFIED', timestamp: '2026-09-29T13:00:00Z' },
      { status: 'ASSIGNED', timestamp: '2026-09-29T14:10:00Z', note: 'Dispatched to Zone-5 Drainage Maintenance Crew #3.' },
    ],
  },

  // 4. Farmgate Garbage Accumulation
  {
    id: 'DHK-2026-0551',
    type: 'garbage',
    title: 'Severe Municipal Waste Overflow on Footpath',
    description: 'Uncollected refuse spilling across 12 meters of pedestrian sidewalk adjacent to busy pedestrian footbridge. Health hazard and severe sidewalk blockage.',
    imageUrl: createCivicImageSvg('garbage', '>2.5 Tons', 'Farmgate Footbridge North'),
    afterImageUrl: createResolvedImageSvg('garbage', 'Farmgate Footbridge North'),
    latitude: 23.7571,
    longitude: 90.3888,
    locationName: 'Farmgate Footbridge East Descent',
    roadName: 'Indira Road / Airport Road Connector',
    city: 'Dhaka',
    timestamp: '2026-09-29T11:30:00Z',
    severity: 75,
    priority: 'HIGH',
    confidence: 0.95,
    status: 'IN_PROGRESS',
    suggestedServiceCategory: 'Solid Waste Management Department',
    roadImportance: 'PRIMARY_ARTERIAL',
    estimatedDepthCm: 60,
    affectedFeatures: ['Pedestrian Footpath', 'Footbridge Ramp'],
    recommendedAction: 'Deploy compactor truck and apply bleaching powder / lime disinfectant.',
    nearbyFacilities: [
      { type: 'school', name: 'Tejgaon College', distanceMeters: 150 },
      { type: 'bus_stop', name: 'Farmgate Bus Interexchange', distanceMeters: 60 },
      { type: 'market', name: 'Farmgate Super Market', distanceMeters: 90 },
    ],
    civicImpactChain: {
      problem: 'Overflowing solid waste',
      exposure: 'Transit hub • Tejgaon College (150m)',
      impact: 'Forces 10,000+ pedestrians onto fast vehicular lanes',
      priority: 'HIGH',
    },
    annotations: [
      { label: 'Solid Waste Spillage', box: [18, 40, 64, 45], confidence: 0.96, highlightColor: '#84cc16' },
    ],
    reportCount: 16,
    timeline: [
      { status: 'DETECTED', timestamp: '2026-09-29T08:00:00Z' },
      { status: 'VERIFIED', timestamp: '2026-09-29T09:30:00Z' },
      { status: 'ASSIGNED', timestamp: '2026-09-29T10:15:00Z' },
      { status: 'IN_PROGRESS', timestamp: '2026-09-29T11:30:00Z', note: 'Compactor vehicle DNCC-31 arrived on site.' },
    ],
  },

  // 5. Mohakhali Flyover Road Surface Rupture
  {
    id: 'DHK-2026-0418',
    type: 'road_damage',
    title: 'Severe Asphalt Shear & Corrugation',
    description: 'Sub-base soil subsidence causing 4-meter wavy corrugation and jagged fissures at the base of Mohakhali Flyover ascending ramp.',
    imageUrl: createCivicImageSvg('road_damage', '4m Fissure', 'Mohakhali Flyover Ascent'),
    afterImageUrl: createResolvedImageSvg('road_damage', 'Mohakhali Flyover Ascent'),
    latitude: 23.7778,
    longitude: 90.4045,
    locationName: 'Mohakhali Flyover North Ramp',
    roadName: 'Bir Uttam AK Khandakar Road',
    city: 'Dhaka',
    timestamp: '2026-09-29T09:20:00Z',
    severity: 85,
    priority: 'CRITICAL',
    confidence: 0.88,
    status: 'IN_PROGRESS',
    suggestedServiceCategory: 'Roads & Highways / Public Works Department',
    roadImportance: 'EXPRESSWAY',
    estimatedDepthCm: 15,
    affectedFeatures: ['Ascending Ramp Lane', 'Highway Shoulder'],
    recommendedAction: 'Milling of damaged bituminous layer and deep base-course reinforcement.',
    nearbyFacilities: [
      { type: 'hospital', name: 'ICDDR,B Cholera Hospital', distanceMeters: 260 },
      { type: 'bus_stop', name: 'Mohakhali Inter-district Bus Terminal', distanceMeters: 380 },
    ],
    civicImpactChain: {
      problem: 'Extensive asphalt deterioration',
      exposure: 'Expressway corridor • ICDDR,B Hospital (260m)',
      impact: 'Extreme bottleneck on primary northern artery',
      priority: 'CRITICAL',
    },
    annotations: [
      { label: 'Surface Rupture & Shear', box: [22, 35, 56, 45], confidence: 0.89, highlightColor: '#f43f5e' },
    ],
    reportCount: 11,
    timeline: [
      { status: 'DETECTED', timestamp: '2026-09-28T22:00:00Z' },
      { status: 'VERIFIED', timestamp: '2026-09-29T06:00:00Z' },
      { status: 'ASSIGNED', timestamp: '2026-09-29T07:45:00Z' },
      { status: 'IN_PROGRESS', timestamp: '2026-09-29T09:20:00Z', note: 'Heavy milling machinery stationed.' },
    ],
  },

  // 6. Gulshan 1 Broken Footpath
  {
    id: 'DHK-2026-0312',
    type: 'sidewalk_damage',
    title: 'Collapsed Concrete Paver Slabs',
    description: 'Broken concrete pavers exposing an open 1.2-meter underground utility trench right in front of high-traffic commercial building.',
    imageUrl: createCivicImageSvg('road_damage', '1.2m Gap', 'Gulshan 1 Circle'),
    afterImageUrl: createResolvedImageSvg('road_damage', 'Gulshan 1 Circle'),
    latitude: 23.7785,
    longitude: 90.4172,
    locationName: 'Gulshan 1 Circle South',
    roadName: 'Gulshan Avenue',
    city: 'Dhaka',
    timestamp: '2026-09-28T18:40:00Z',
    severity: 68,
    priority: 'HIGH',
    confidence: 0.93,
    status: 'VERIFIED',
    suggestedServiceCategory: 'Urban Infrastructure & Footpath Engineering',
    roadImportance: 'PRIMARY_ARTERIAL',
    estimatedDepthCm: 45,
    affectedFeatures: ['Commercial Sidewalk', 'Optical Fiber Conduit'],
    recommendedAction: 'Install reinforced precast concrete trench cover with non-slip tactile finish.',
    nearbyFacilities: [
      { type: 'market', name: 'Gulshan 1 DCC Market', distanceMeters: 80 },
      { type: 'bus_stop', name: 'Gulshan 1 Hub', distanceMeters: 120 },
    ],
    civicImpactChain: {
      problem: 'Fractured pedestrian walkway',
      exposure: 'Commercial district • Gulshan 1 Market (80m)',
      impact: 'Severe tripping and fall hazard for elderly and children',
      priority: 'HIGH',
    },
    annotations: [
      { label: 'Exposed Utility Trench', box: [28, 44, 45, 36], confidence: 0.94, highlightColor: '#ea580c' },
    ],
    reportCount: 5,
    timeline: [
      { status: 'DETECTED', timestamp: '2026-09-28T17:10:00Z' },
      { status: 'VERIFIED', timestamp: '2026-09-28T18:40:00Z' },
    ],
  },

  // 7. Uttara Sector 3 Pothole (Resolved)
  {
    id: 'DHK-2026-0205',
    type: 'pothole',
    title: 'Sector 3 Residential Connector Cavity',
    description: 'Pothole repaired and sealed with hot-mix asphalt after citizen report. Verified with drone camera.',
    imageUrl: createCivicImageSvg('pothole', '~12 cm', 'Uttara Sector 3, Road 7'),
    afterImageUrl: createResolvedImageSvg('pothole', 'Uttara Sector 3, Road 7'),
    latitude: 23.8682,
    longitude: 90.3984,
    locationName: 'Uttara Sector 3, Road 7',
    roadName: 'Sector 3 Loop Road',
    city: 'Dhaka',
    timestamp: '2026-09-27T10:15:00Z',
    severity: 48,
    priority: 'MODERATE',
    confidence: 0.91,
    status: 'RESOLVED',
    suggestedServiceCategory: 'Roads & Highways / Public Works Department',
    roadImportance: 'LOCAL',
    estimatedDepthCm: 12,
    affectedFeatures: ['Residential Lane'],
    recommendedAction: 'Completed: Bituminous patching and edge sealing.',
    nearbyFacilities: [
      { type: 'school', name: 'Scholastica Junior Campus', distanceMeters: 220 },
      { type: 'hospital', name: 'Kuwait Bangladesh Friendship Hospital', distanceMeters: 480 },
    ],
    civicImpactChain: {
      problem: 'Deep road surface crater',
      exposure: 'Local neighborhood street • School (220m)',
      impact: 'Pedestrian inconvenience and lane narrowing',
      priority: 'MODERATE',
    },
    annotations: [
      { label: 'Repaired Patch', box: [30, 40, 40, 30], confidence: 0.96, highlightColor: '#22c55e' },
    ],
    reportCount: 3,
    resolutionEvidence: {
      afterImageUrl: createResolvedImageSvg('pothole', 'Uttara Sector 3, Road 7'),
      resolvedAt: '2026-09-28T14:30:00Z',
      confidence: 0.94,
      verificationNote: 'Defect Cleared: Road surface restored. No lingering hazard detected.',
    },
    timeline: [
      { status: 'DETECTED', timestamp: '2026-09-27T10:15:00Z' },
      { status: 'VERIFIED', timestamp: '2026-09-27T14:00:00Z' },
      { status: 'ASSIGNED', timestamp: '2026-09-27T18:00:00Z' },
      { status: 'IN_PROGRESS', timestamp: '2026-09-28T09:00:00Z' },
      { status: 'RESOLVED', timestamp: '2026-09-28T14:30:00Z', note: 'AI verification passed with 94% confidence. Asphalt smooth.' },
    ],
  },

  // 8. Old Dhaka / Lalbagh Waterlogging
  {
    id: 'DHK-2026-0188',
    type: 'waterlogging',
    title: 'Chaukbazar Narrow Alley Inundation',
    description: 'Historic heritage corridor submerged in 30cm dark runoff due to clogged medieval culvert.',
    imageUrl: createCivicImageSvg('waterlogging', '~30 cm', 'Lalbagh Chaukbazar'),
    afterImageUrl: createResolvedImageSvg('waterlogging', 'Lalbagh Chaukbazar'),
    latitude: 23.7188,
    longitude: 90.3882,
    locationName: 'Lalbagh Fort Road',
    roadName: 'Subedar Azim Street',
    city: 'Dhaka',
    timestamp: '2026-09-29T18:10:00Z',
    severity: 84,
    priority: 'CRITICAL',
    confidence: 0.9,
    status: 'DETECTED',
    suggestedServiceCategory: 'Drainage / Public Works (WASA & City Corp)',
    roadImportance: 'SECONDARY',
    estimatedDepthCm: 30,
    affectedFeatures: ['Historic Alleyway', 'Ground-floor Shops'],
    recommendedAction: 'Manual drain excavation and motorized pump clearing.',
    nearbyFacilities: [
      { type: 'school', name: 'Lalbagh Model High School', distanceMeters: 190 },
      { type: 'market', name: 'Chaukbazar Traditional Market', distanceMeters: 110 },
    ],
    civicImpactChain: {
      problem: 'Severe waterlogging (~30cm depth)',
      exposure: 'Connecting urban collector • School (190m)',
      impact: 'Ground-floor shop flooding & public health threat',
      priority: 'CRITICAL',
    },
    annotations: [
      { label: 'Submerged Alleyway', box: [10, 35, 80, 55], confidence: 0.92, highlightColor: '#0284c7' },
    ],
    reportCount: 8,
    timeline: [
      { status: 'DETECTED', timestamp: '2026-09-29T18:10:00Z' },
    ],
  },

  // 9. Motijheel C/A Accessibility Barrier
  {
    id: 'DHK-2026-0155',
    type: 'accessibility_barrier',
    title: 'Blocked Wheelchair Ramp at Commercial Crosswalk',
    description: 'Construction sandbags and illegal advertising billboard frame completely blocking tactile tactile ramp for visually impaired and wheelchair users.',
    imageUrl: createCivicImageSvg('road_damage', 'Obstruction', 'Motijheel Shapla Chottor'),
    afterImageUrl: createResolvedImageSvg('road_damage', 'Motijheel Shapla Chottor'),
    latitude: 23.7291,
    longitude: 90.4194,
    locationName: 'Motijheel Commercial Area',
    roadName: 'Dilkusha Commercial Avenue',
    city: 'Dhaka',
    timestamp: '2026-09-29T13:40:00Z',
    severity: 64,
    priority: 'HIGH',
    confidence: 0.89,
    status: 'VERIFIED',
    suggestedServiceCategory: 'Urban Infrastructure & Footpath Engineering',
    roadImportance: 'PRIMARY_ARTERIAL',
    estimatedDepthCm: 0,
    affectedFeatures: ['Tactile Paving Ramp', 'Pedestrian Crossing'],
    recommendedAction: 'Immediate eviction of illegal signpost and clearance of construction debris.',
    nearbyFacilities: [
      { type: 'government_office', name: 'Bangladesh Bank Headquarters', distanceMeters: 130 },
      { type: 'bus_stop', name: 'Shapla Chottor Bus Terminal', distanceMeters: 95 },
    ],
    civicImpactChain: {
      problem: 'Wheelchair / stroller obstruction',
      exposure: 'Major arterial road • Bangladesh Bank (130m)',
      impact: 'Total barrier for persons with disabilities',
      priority: 'HIGH',
    },
    annotations: [
      { label: 'Billboard Base Obstacle', box: [35, 40, 30, 45], confidence: 0.91, highlightColor: '#e11d48' },
    ],
    reportCount: 4,
    timeline: [
      { status: 'DETECTED', timestamp: '2026-09-29T11:00:00Z' },
      { status: 'VERIFIED', timestamp: '2026-09-29T13:40:00Z' },
    ],
  },

  // 10. Agargaon Broken Streetlight
  {
    id: 'DHK-2026-0144',
    type: 'broken_streetlight',
    title: 'Consecutive Dark Streetlight Array (4 Poles)',
    description: 'Underground wiring short circuit leaving 200m of passport office access road in complete darkness at night.',
    imageUrl: createCivicImageSvg('road_damage', '200m Dark', 'Agargaon Passport Office Road'),
    afterImageUrl: createResolvedImageSvg('road_damage', 'Agargaon Passport Office Road'),
    latitude: 23.7788,
    longitude: 90.3802,
    locationName: 'Agargaon Administrative Zone',
    roadName: 'Passport Office Access Boulevard',
    city: 'Dhaka',
    timestamp: '2026-09-28T21:30:00Z',
    severity: 58,
    priority: 'MODERATE',
    confidence: 0.87,
    status: 'ASSIGNED',
    suggestedServiceCategory: 'Electrical & Street Lighting Division',
    roadImportance: 'SECONDARY',
    estimatedDepthCm: 0,
    affectedFeatures: ['Night Illumination', 'CCTV Field of View'],
    recommendedAction: 'Trace underground cable fault and replace failed LED luminaire drivers.',
    nearbyFacilities: [
      { type: 'government_office', name: 'Department of Immigration & Passports', distanceMeters: 75 },
      { type: 'hospital', name: 'National Institute of Neurosciences', distanceMeters: 340 },
    ],
    civicImpactChain: {
      problem: 'Unlit thoroughfare at night',
      exposure: 'Connecting urban collector • Passport Office (75m)',
      impact: 'Heightened crime risk and low pedestrian safety',
      priority: 'MODERATE',
    },
    annotations: [
      { label: 'Unlit Luminaire', box: [40, 15, 20, 35], confidence: 0.88, highlightColor: '#eab308' },
    ],
    reportCount: 6,
    timeline: [
      { status: 'DETECTED', timestamp: '2026-09-28T21:30:00Z' },
      { status: 'ASSIGNED', timestamp: '2026-09-29T08:00:00Z' },
    ],
  },

  // 11. Badda Pragati Sarani Unsafe Crossing
  {
    id: 'DHK-2026-0112',
    type: 'unsafe_crossing',
    title: 'Damaged Zebra Crossing with Missing Divider Guardrails',
    description: 'Broken metal barrier allowing unregulated high-speed motorbike crossing into incoming pedestrian stream.',
    imageUrl: createCivicImageSvg('road_damage', 'Broken Railing', 'Badda Pragati Sarani'),
    afterImageUrl: createResolvedImageSvg('road_damage', 'Badda Pragati Sarani'),
    latitude: 23.7845,
    longitude: 90.4265,
    locationName: 'Middle Badda Link Road',
    roadName: 'Pragati Sarani',
    city: 'Dhaka',
    timestamp: '2026-09-29T10:15:00Z',
    severity: 76,
    priority: 'HIGH',
    confidence: 0.91,
    status: 'DETECTED',
    suggestedServiceCategory: 'Traffic Engineering & Municipal Safety',
    roadImportance: 'PRIMARY_ARTERIAL',
    estimatedDepthCm: 0,
    affectedFeatures: ['Median Guardrail', 'Pedestrian Crossing'],
    recommendedAction: 'Weld heavy galvanized steel barrier and repaint high-visibility thermo zebra stripes.',
    nearbyFacilities: [
      { type: 'school', name: 'Badda Alatunnessa Higher Secondary School', distanceMeters: 160 },
      { type: 'bus_stop', name: 'Middle Badda Bus Stand', distanceMeters: 50 },
    ],
    civicImpactChain: {
      problem: 'High-risk zebra crossing',
      exposure: 'Major arterial road • School (160m) • Bus stand (50m)',
      impact: 'Critical pedestrian collision hazard',
      priority: 'HIGH',
    },
    annotations: [
      { label: 'Severed Median Barrier', box: [30, 40, 40, 30], confidence: 0.92, highlightColor: '#dc2626' },
    ],
    reportCount: 8,
    timeline: [
      { status: 'DETECTED', timestamp: '2026-09-29T10:15:00Z' },
    ],
  },

  // 12. Hazaribagh Waste Burning
  {
    id: 'DHK-2026-0094',
    type: 'waste_burning',
    title: 'Illegal Open Leather & Poly Waste Incineration',
    description: 'Thick toxic black smoke billowing across residential settlement from unauthorized roadside garbage fire.',
    imageUrl: createCivicImageSvg('garbage', 'Toxic Smoke', 'Hazaribagh Tannery Area'),
    afterImageUrl: createResolvedImageSvg('garbage', 'Hazaribagh Tannery Area'),
    latitude: 23.7342,
    longitude: 90.3644,
    locationName: 'Old Hazaribagh Tannery Embankment',
    roadName: 'Beribadh Bund Road',
    city: 'Dhaka',
    timestamp: '2026-09-29T17:50:00Z',
    severity: 88,
    priority: 'CRITICAL',
    confidence: 0.96,
    status: 'DETECTED',
    suggestedServiceCategory: 'Environmental & Waste Enforcement',
    roadImportance: 'SECONDARY',
    estimatedDepthCm: 0,
    affectedFeatures: ['Air Quality Zone', 'Embankment Road'],
    recommendedAction: 'Immediate water tanker deployment to douse fire; issue municipal penal violation.',
    nearbyFacilities: [
      { type: 'school', name: 'Hazaribagh Girls High School', distanceMeters: 210 },
      { type: 'hospital', name: 'Dhaka Medical Sub-Center', distanceMeters: 390 },
    ],
    civicImpactChain: {
      problem: 'Open toxic waste incineration',
      exposure: 'Connecting urban collector • School (210m)',
      impact: 'Severe respiratory hazard & zero visibility',
      priority: 'CRITICAL',
    },
    annotations: [
      { label: 'Illegal Waste Combustion', box: [20, 30, 60, 50], confidence: 0.97, highlightColor: '#b91c1c' },
    ],
    reportCount: 12,
    timeline: [
      { status: 'DETECTED', timestamp: '2026-09-29T17:50:00Z' },
    ],
  },
];
