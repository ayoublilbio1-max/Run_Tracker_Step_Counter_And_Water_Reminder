import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function setupNotificationChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("run-complete", {
    name: "Run Complete",
    importance: Notifications.AndroidImportance.HIGH,
  });
  await Notifications.setNotificationChannelAsync("steps-tracking", {
    name: "Steps Tracking",
    importance: Notifications.AndroidImportance.LOW,
  });
}

export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function presentRunCompleteNotification(params: {
  distanceKm: number;
  durationLabel: string;
  paceLabel: string;
  kcal: number;
}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Run Complete 🏁",
      body: `${params.distanceKm.toFixed(2)} km · ${params.durationLabel} · ${params.paceLabel} min/km · ${params.kcal} kcal`,
      data: { type: "run-complete" },
      channelId: "run-complete",
    } as any,
    trigger: null,
  });
}

const STEPS_NOTIFICATION_ID = "steps-tracking-live";

export async function updateStepsNotification(steps: number, kcal: number) {
  await Notifications.scheduleNotificationAsync({
    identifier: STEPS_NOTIFICATION_ID,
    content: {
      title: "Steps Today 👣",
      body: `${steps.toLocaleString()} steps · ${kcal.toFixed(0)} kcal burned`,
      data: { type: "steps-tracking" },
      channelId: "steps-tracking",
      sticky: true,
    } as any,
    trigger: null,
  });
}

export async function clearStepsNotification() {
  await Notifications.dismissNotificationAsync(STEPS_NOTIFICATION_ID).catch(
    () => {},
  );
}
