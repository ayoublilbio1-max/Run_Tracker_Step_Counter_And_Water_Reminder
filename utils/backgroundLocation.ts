import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useRunSessionStore } from "../store/runSessionStore";
import { classifySpeedIntensity, haversineMeters } from "./runTracking";

export const RUN_LOCATION_TASK = "run-location-task";

TaskManager.defineTask(RUN_LOCATION_TASK, async ({ data, error }) => {
  if (error || !data) return;
  const { locations } = data as { locations: Location.LocationObject[] };
  const store = useRunSessionStore.getState();
  if (store.status !== "running") return;

  for (const loc of locations) {
    const point = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      timestamp: loc.timestamp,
      accuracy: loc.coords.accuracy,
    };
    const lastPoint = useRunSessionStore.getState().route.slice(-1)[0];
    if (!lastPoint) {
      useRunSessionStore.getState().addPoint(point, 0, "low", 0);
      continue;
    }
    if ((loc.coords.accuracy ?? 999) > 25) continue; // skip low-accuracy noise

    const distance = haversineMeters(lastPoint, point);
    if (distance < 1) continue; // ignore GPS jitter

    const deltaSeconds = (point.timestamp - lastPoint.timestamp) / 1000;
    const speedKmh =
      deltaSeconds > 0 ? distance / 1000 / (deltaSeconds / 3600) : 0;
    const intensity = classifySpeedIntensity(speedKmh);

    useRunSessionStore
      .getState()
      .addPoint(point, distance, intensity, deltaSeconds);
  }
});

export async function requestLocationPermissions() {
  const fg = await Location.requestForegroundPermissionsAsync();
  if (fg.status !== "granted") return false;
  const bg = await Location.requestBackgroundPermissionsAsync();
  return bg.status === "granted";
}

export async function startBackgroundTracking() {
  const alreadyStarted = await Location.hasStartedLocationUpdatesAsync(
    RUN_LOCATION_TASK,
  ).catch(() => false);
  if (alreadyStarted) return;

  await Location.startLocationUpdatesAsync(RUN_LOCATION_TASK, {
    accuracy: Location.Accuracy.BestForNavigation,
    timeInterval: 2000,
    distanceInterval: 3,
    foregroundService: {
      notificationTitle: "Run Tracker",
      notificationBody: "Tracking your run…",
    },
    showsBackgroundLocationIndicator: true,
    pausesUpdatesAutomatically: false,
  });
}

export async function stopBackgroundTracking() {
  const started = await Location.hasStartedLocationUpdatesAsync(
    RUN_LOCATION_TASK,
  ).catch(() => false);
  if (started) {
    await Location.stopLocationUpdatesAsync(RUN_LOCATION_TASK);
  }
}
