export type GeoPoint = {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number | null;
};

export function haversineMeters(a: GeoPoint, b: GeoPoint) {
  const R = 6371000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function formatStopwatch(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function calcPaceMinPerKm(distanceKm: number, elapsedMs: number) {
  if (distanceKm <= 0) return 0;
  const minutes = elapsedMs / 60000;
  return minutes / distanceKm;
}

// MET values tuned to match the walking / jogging / running speed bands below.
const MET_BY_INTENSITY = { low: 3.5, moderate: 7, high: 11 };

export function calcSegmentCalories(
  intensity: "low" | "moderate" | "high",
  weightKg: number,
  deltaSeconds: number,
) {
  const met = MET_BY_INTENSITY[intensity];
  const hours = deltaSeconds / 3600;
  return met * weightKg * hours;
}

// low = walking, moderate = light jog/run, high = fast running and up.
const WALK_MAX_KMH = 6.5;
const JOG_MAX_KMH = 10;

export function classifySpeedIntensity(
  speedKmh: number,
): "low" | "moderate" | "high" {
  if (speedKmh < WALK_MAX_KMH) return "low";
  if (speedKmh < JOG_MAX_KMH) return "moderate";
  return "high";
}
