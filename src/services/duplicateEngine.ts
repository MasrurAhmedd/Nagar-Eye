import { CivicHotspot, CivicIncident, PriorityLevel, ProblemType } from '../types';

/**
 * Calculates Great-Circle distance between two coordinates in meters using the Haversine formula.
 */
export function getDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Radius of Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Checks if a newly reported incident is a duplicate of an existing active incident.
 * Rule: Same problem category AND within 300 meters distance.
 */
export function findPotentialDuplicates(
  newIncident: { latitude: number; longitude: number; type: ProblemType },
  existingIncidents: CivicIncident[]
): CivicIncident[] {
  return existingIncidents.filter((incident) => {
    if (incident.status === 'RESOLVED') return false;
    if (incident.type !== newIncident.type) return false;
    const distance = getDistanceMeters(
      newIncident.latitude,
      newIncident.longitude,
      incident.latitude,
      incident.longitude
    );
    return distance <= 350; // within 350m
  });
}

/**
 * Dynamically computes civic hotspots based on spatial density of stored incidents.
 */
export function computeCivicHotspots(incidents: CivicIncident[]): CivicHotspot[] {
  const activeIncidents = incidents.filter((inc) => inc.status !== 'RESOLVED');
  const visited = new Set<string>();
  const hotspots: CivicHotspot[] = [];

  for (let i = 0; i < activeIncidents.length; i++) {
    const parent = activeIncidents[i];
    if (visited.has(parent.id)) continue;

    const cluster: CivicIncident[] = [parent];
    visited.add(parent.id);

    for (let j = 0; j < activeIncidents.length; j++) {
      if (i === j) continue;
      const other = activeIncidents[j];
      if (visited.has(other.id)) continue;

      const dist = getDistanceMeters(
        parent.latitude,
        parent.longitude,
        other.latitude,
        other.longitude
      );

      // Within 450m belongs to same urban corridor hotspot
      if (dist <= 450) {
        cluster.push(other);
        visited.add(other.id);
      }
    }

    // Only promote to a Hotspot if at least 2 incidents or 5+ aggregated reports
    const totalReports = cluster.reduce((sum, item) => sum + (item.reportCount || 1), 0);

    if (cluster.length >= 2 || totalReports >= 4) {
      // Find center lat/lng
      const avgLat = cluster.reduce((sum, item) => sum + item.latitude, 0) / cluster.length;
      const avgLon = cluster.reduce((sum, item) => sum + item.longitude, 0) / cluster.length;

      // Find predominant problem type
      const typeCounts: Record<string, number> = {};
      let maxCount = 0;
      let primaryType: ProblemType = parent.type;
      let totalSeverity = 0;

      for (const item of cluster) {
        typeCounts[item.type] = (typeCounts[item.type] || 0) + (item.reportCount || 1);
        if (typeCounts[item.type] > maxCount) {
          maxCount = typeCounts[item.type];
          primaryType = item.type;
        }
        totalSeverity += item.severity * (item.reportCount || 1);
      }

      const avgSeverity = Math.round(totalSeverity / totalReports);
      let priority: PriorityLevel = 'MODERATE';
      if (avgSeverity >= 80) priority = 'CRITICAL';
      else if (avgSeverity >= 60) priority = 'HIGH';

      // Trend heuristic based on recent timestamps
      const trend: 'increasing' | 'stable' | 'decreasing' =
        cluster.some((c) => c.severity > 75) || totalReports >= 8 ? 'increasing' : 'stable';

      hotspots.push({
        id: `hotspot-${parent.id}`,
        name: `${parent.locationName || parent.roadName} Corridor`,
        latitude: avgLat,
        longitude: avgLon,
        radiusMeters: 400,
        reportCount: totalReports,
        primaryType,
        averageSeverity: avgSeverity,
        priority,
        trend,
        incidentIds: cluster.map((c) => c.id),
      });
    }
  }

  return hotspots.sort((a, b) => b.averageSeverity - a.averageSeverity);
}
