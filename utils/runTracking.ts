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

export function calcRunCalories(
  distanceKm: number,
  weightKg: number,
  elapsedMs: number,
) {
  const hours = elapsedMs / 3600000;
  if (hours <= 0) return 0;
  const speedKmh = distanceKm / hours;
  const met = speedKmh < 6 ? 6 : speedKmh < 9 ? 9.8 : 11.5; // walk / jog / run bands
  return met * weightKg * hours;
}

export function classifySpeedIntensity(
  speedKmh: number,
): "low" | "moderate" | "high" {
  if (speedKmh < 4) return "low";
  if (speedKmh < 8) return "moderate";
  return "high";
}
