import { Ionicons } from "@expo/vector-icons";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import FinishConfirmModal from "../../components/FinishConfirmModal";
import { spacing, useThemeColors } from "../../constants/theme";
import { useActivitiesStore } from "../../store/activitiesStore";
import { useRunSessionStore } from "../../store/runSessionStore";
import { useUserProfileStore } from "../../store/userProfileStore";
import {
  requestLocationPermissions,
  startBackgroundTracking,
  stopBackgroundTracking,
  updateForegroundNotificationText,
} from "../../utils/backgroundLocation";
import { checkAndScheduleRunReminder } from "../../utils/reminderNotifications";
import {
  presentRunCompleteNotification,
  requestNotificationPermissions,
} from "../../utils/runNotifications";
import {
  calcPaceMinPerKm,
  calcSegmentCalories,
  classifySpeedIntensity,
  formatStopwatch,
  haversineMeters,
} from "../../utils/runTracking";

const STATIONARY_THRESHOLD_MS = 10000;
const NOTIFICATION_UPDATE_INTERVAL_MS = 5000;

export default function ActiveRun() {
  const colors = useThemeColors();
  const weightKg = useUserProfileStore((s) => s.weightKg);
  const addActivity = useActivitiesStore((s) => s.addActivity);

  const status = useRunSessionStore((s) => s.status);
  const route = useRunSessionStore((s) => s.route);
  const distanceMeters = useRunSessionStore((s) => s.distanceMeters);
  const kcal = useRunSessionStore((s) => s.kcal);
  const elapsedMs = useRunSessionStore((s) => s.elapsedMs);
  const start = useRunSessionStore((s) => s.start);
  const pause = useRunSessionStore((s) => s.pause);
  const resume = useRunSessionStore((s) => s.resume);
  const restart = useRunSessionStore((s) => s.restart);
  const finish = useRunSessionStore((s) => s.finish);
  const addPoint = useRunSessionStore((s) => s.addPoint);

  const [finishModalVisible, setFinishModalVisible] = useState(false);
  const [locked, setLocked] = useState(false);
  const [initialRegion, setInitialRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const mapRef = useRef<MapView>(null);
  const notificationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      const { status: fgStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== "granted") {
        Alert.alert(
          "Location needed",
          "Run Tracker needs location access to track your route.",
        );
        return;
      }

      try {
        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setInitialRegion({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      } catch {
        setInitialRegion({
          latitude: 37.78,
          longitude: -122.41,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }

      let backgroundGranted = false;
      try {
        backgroundGranted = await requestLocationPermissions();
      } catch {
        // Not available at all (e.g. old Expo Go) — treat as not granted below.
      }

      if (!backgroundGranted) {
        Alert.alert(
          "Background location not enabled",
          'To keep the live tracking notification running and track your route while the screen is locked, allow location access "All the time" for Run Tracker in your phone settings.',
          [
            { text: "Not now", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
      }

      try {
        await requestNotificationPermissions();
      } catch {
        // Ignore — notification is best-effort.
      }
      start();
    })();

    return () => {
      watchRef.current?.remove();
      if (notificationIntervalRef.current)
        clearInterval(notificationIntervalRef.current);
      stopBackgroundTracking().catch(() => {});
      deactivateKeepAwake();
    };
  }, []);

  useEffect(() => {
    if (status !== "running") {
      watchRef.current?.remove();
      watchRef.current = null;
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
        notificationIntervalRef.current = null;
      }
      deactivateKeepAwake();
      return;
    }

    activateKeepAwakeAsync();
    startBackgroundTracking().catch((err) => {
      console.log("[ActiveRun] startBackgroundTracking failed:", err);
    });

    notificationIntervalRef.current = setInterval(() => {
      const s = useRunSessionStore.getState();
      const km = s.distanceMeters / 1000;
      const pace = calcPaceMinPerKm(km, s.elapsedMs);
      const text = `${km.toFixed(2)} km · ${formatStopwatch(s.elapsedMs)} · ${pace.toFixed(2)} min/km`;
      updateForegroundNotificationText(text).catch(() => {});
    }, NOTIFICATION_UPDATE_INTERVAL_MS);

    (async () => {
      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 2000,
          distanceInterval: 3,
        },
        (loc) => {
          const point = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            timestamp: loc.timestamp,
            accuracy: loc.coords.accuracy,
          };
          const lastPoint = useRunSessionStore.getState().route.slice(-1)[0];
          if (!lastPoint) {
            addPoint(point, 0, "low", 0, 0);
            return;
          }
          if ((loc.coords.accuracy ?? 999) > 25) return;
          const distance = haversineMeters(lastPoint, point);
          if (distance < 3) return; // ignore GPS jitter
          const deltaSeconds = (point.timestamp - lastPoint.timestamp) / 1000;
          const speedKmh =
            deltaSeconds > 0 ? distance / 1000 / (deltaSeconds / 3600) : 0;
          const intensity = classifySpeedIntensity(speedKmh);
          const kcalDelta = calcSegmentCalories(
            intensity,
            weightKg,
            deltaSeconds,
          );
          addPoint(point, distance, intensity, deltaSeconds, kcalDelta);
        },
      );
    })();

    return () => {
      watchRef.current?.remove();
      watchRef.current = null;
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
        notificationIntervalRef.current = null;
      }
    };
  }, [status]);

  const distanceKm = distanceMeters / 1000;
  const pace = calcPaceMinPerKm(distanceKm, elapsedMs);
  const lastPoint = route.slice(-1)[0];

  const lastMovementAt = useRunSessionStore.getState().lastMovementAt;
  const isStationary =
    status === "running" &&
    lastMovementAt !== null &&
    Date.now() - lastMovementAt > STATIONARY_THRESHOLD_MS;

  const handleFinishConfirmed = async () => {
    finish();

    try {
      await stopBackgroundTracking();
    } catch {
      // Best-effort.
    }
    deactivateKeepAwake();

    const { intensitySeconds } = useRunSessionStore.getState();
    const fmtIntensity = (sec: number) => formatStopwatch(sec * 1000);
    const durationLabel = formatStopwatch(elapsedMs);
    const paceLabel = pace.toFixed(2);
    const roundedKcal = Math.round(kcal * 10) / 10;

    addActivity({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      distanceKm,
      durationLabel,
      paceLabel,
      kcal: roundedKcal,
      intensity: {
        lowMin: fmtIntensity(intensitySeconds.low),
        moderateMin: fmtIntensity(intensitySeconds.moderate),
        highMin: fmtIntensity(intensitySeconds.high),
      },
      route: route.map((p) => ({
        latitude: p.latitude,
        longitude: p.longitude,
      })),
    });

    try {
      await presentRunCompleteNotification({
        distanceKm,
        durationLabel,
        paceLabel,
        kcal: roundedKcal,
      });
    } catch {
      // Ignore — notification is best-effort.
    }

    checkAndScheduleRunReminder().catch(() => {});

    router.replace("/run/summary" as any);
  };

  if (!initialRegion) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Finding your location…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafeArea} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>RUN TRACKER</Text>
        </View>
        <Text style={styles.timer}>{formatStopwatch(elapsedMs)}</Text>
        <Text style={styles.timerLabel}>Min</Text>
        {isStationary && (
          <View style={styles.stationaryPill}>
            <View style={styles.stationaryDot} />
            <Text style={styles.stationaryText}>
              Stationary — timer keeps running
            </Text>
          </View>
        )}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{distanceKm.toFixed(2)}</Text>
            <Text style={styles.statLabel}>KM</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{pace.toFixed(2)}</Text>
            <Text style={styles.statLabel}>PACE (MIN/KM)</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{kcal.toFixed(2)}</Text>
            <Text style={styles.statLabel}>KCAL</Text>
          </View>
        </View>
      </SafeAreaView>

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        followsUserLocation
        initialRegion={initialRegion}
      >
        {route.length > 1 && (
          <Polyline
            coordinates={route}
            strokeColor={colors.primary}
            strokeWidth={4}
          />
        )}
        {route[0] && <Marker coordinate={route[0]} pinColor="purple" />}
        {route.length > 1 && (
          <Marker coordinate={route[route.length - 1]} pinColor="red" />
        )}
      </MapView>

      {!locked && (
        <SafeAreaView style={styles.controlsSafeArea} edges={["bottom"]}>
          {status === "running" ? (
            <Pressable
              style={[styles.pauseButton, { backgroundColor: colors.primary }]}
              onPress={pause}
            >
              <Text style={styles.pauseButtonText}>PAUSE</Text>
              <Ionicons name="pause" size={20} color="#FFFFFF" />
            </Pressable>
          ) : (
            <View style={styles.pausedControls}>
              <Pressable onPress={restart} style={styles.restartRow}>
                <Ionicons name="refresh" size={16} color="#FFFFFF" />
                <Text style={styles.restartText}>RESTART</Text>
              </Pressable>
              <View style={styles.circleButtonsRow}>
                <View style={styles.circleButtonWrapper}>
                  <Pressable
                    style={[
                      styles.circleButton,
                      { backgroundColor: colors.run },
                    ]}
                    onPress={() => setFinishModalVisible(true)}
                  >
                    <Ionicons name="stop" size={26} color="#FFFFFF" />
                  </Pressable>
                  <Text style={styles.circleButtonLabel}>STOP</Text>
                </View>
                <View style={styles.circleButtonWrapper}>
                  <Pressable
                    style={[
                      styles.circleButton,
                      { backgroundColor: colors.steps },
                    ]}
                    onPress={resume}
                  >
                    <Ionicons name="play" size={26} color="#FFFFFF" />
                  </Pressable>
                  <Text style={styles.circleButtonLabel}>RESUME</Text>
                </View>
              </View>
            </View>
          )}
        </SafeAreaView>
      )}

      <Pressable
        style={[
          styles.lockButton,
          { backgroundColor: locked ? colors.primary : "rgba(0,0,0,0.6)" },
        ]}
        onPress={() => setLocked((l) => !l)}
      >
        <Ionicons
          name={locked ? "lock-closed" : "lock-open"}
          size={22}
          color="#FFFFFF"
        />
      </Pressable>

      <FinishConfirmModal
        visible={finishModalVisible}
        onCancel={() => setFinishModalVisible(false)}
        onConfirm={handleFinishConfirmed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0A1A" },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  loadingText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
  },
  headerSafeArea: { backgroundColor: "#0B0A1A", paddingBottom: spacing.lg },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: spacing.sm,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },
  timer: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "800",
    textAlign: "center",
    marginTop: spacing.md,
  },
  timerLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  stationaryPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    marginBottom: spacing.md,
  },
  stationaryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FBBF24",
  },
  stationaryText: { color: "#FBBF24", fontSize: 12, fontWeight: "700" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: spacing.lg,
  },
  statItem: { alignItems: "center" },
  statValue: { color: "#FFFFFF", fontSize: 22, fontWeight: "800" },
  statLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  map: { flex: 1 },
  controlsSafeArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  pauseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: 999,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  pauseButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  pausedControls: { alignItems: "center" },
  restartRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  restartText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  circleButtonsRow: { flexDirection: "row", gap: spacing.xl * 1.5 },
  circleButtonWrapper: { alignItems: "center", gap: spacing.xs },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  circleButtonLabel: { color: "#FFFFFF", fontWeight: "700", fontSize: 12 },
  lockButton: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.lg,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
