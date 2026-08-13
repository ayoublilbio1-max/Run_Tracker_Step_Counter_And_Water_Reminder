export function calcStrideMeters(heightCm: number) {
  return (heightCm * 0.415) / 100;
}

export function calcDistanceKm(steps: number, heightCm: number) {
  return (steps * calcStrideMeters(heightCm)) / 1000;
}

export function calcCaloriesFromSteps(steps: number, weightKg: number) {
  return steps * weightKg * 0.0005;
}

export function formatDuration(ms: number) {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
}
