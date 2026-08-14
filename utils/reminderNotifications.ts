import * as Notifications from "expo-notifications";
import { useActivitiesStore } from "../store/activitiesStore";
import { ReminderSettings } from "../store/waterStore";

export async function setupReminderChannels() {
  await Notifications.setNotificationChannelAsync("water-reminders", {
    name: "Water Reminders",
    importance: Notifications.AndroidImportance.HIGH,
  });
  await Notifications.setNotificationChannelAsync("run-inactivity", {
    name: "Run Reminders",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

function parseTimeLabel(label: string): { hour: number; minute: number } {
  const [time, period] = label.split(" ");
  let [hour, minute] = time.split(":").map(Number);
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return { hour, minute };
}

async function cancelByType(type: string) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const toCancel = scheduled.filter((n) => n.content.data?.type === type);
  await Promise.all(
    toCancel.map((n) =>
      Notifications.cancelScheduledNotificationAsync(n.identifier),
    ),
  );
}

export async function scheduleWaterReminders(reminder: ReminderSettings) {
  await cancelByType("water-reminder");
  if (!reminder.enabled) return;

  const start = parseTimeLabel(reminder.startTime);
  const end = parseTimeLabel(reminder.endTime);
  const startMinutes = start.hour * 60 + start.minute;
  const endMinutes = end.hour * 60 + end.minute;
  const stepMinutes = Math.round(reminder.intervalHours * 60);
  if (stepMinutes <= 0 || endMinutes <= startMinutes) return;

  const slots: { hour: number; minute: number }[] = [];
  for (let m = startMinutes; m <= endMinutes; m += stepMinutes) {
    slots.push({ hour: Math.floor(m / 60), minute: m % 60 });
  }

  // Cap slot count — mainly protects iOS's 64-pending-notification limit
  // if a very short interval is chosen over a long window.
  const capped = slots.slice(0, 40);

  for (const slot of capped) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hydration Reminder 💧",
        body: reminder.message,
        data: { type: "water-reminder" },
        channelId: "water-reminders",
      } as any,
      trigger: {
        hour: slot.hour,
        minute: slot.minute,
        repeats: true,
      } as any,
    });
  }
}

const RUN_INACTIVITY_DAYS = 2;
const RUN_INACTIVITY_HOUR = 18; // 6 PM

function parseActivityDate(dateLabel: string): Date | null {
  const parsed = new Date(dateLabel);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export async function checkAndScheduleRunReminder() {
  await cancelByType("run-inactivity");

  const activities = useActivitiesStore.getState().activities;
  const lastDate =
    activities.length > 0 ? parseActivityDate(activities[0].date) : null;

  const now = new Date();
  const daysSinceLastRun = lastDate
    ? Math.floor((now.getTime() - lastDate.getTime()) / 86400000)
    : Infinity;

  if (daysSinceLastRun < RUN_INACTIVITY_DAYS) return;

  const fireDate = new Date();
  fireDate.setHours(RUN_INACTIVITY_HOUR, 0, 0, 0);
  if (fireDate.getTime() <= now.getTime()) {
    fireDate.setDate(fireDate.getDate() + 1);
  }
  const secondsUntilFire = Math.max(
    60,
    Math.round((fireDate.getTime() - now.getTime()) / 1000),
  );

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to move! 🏃",
      body: "You haven't run in a couple of days — lace up and get some exercise today.",
      data: { type: "run-inactivity" },
      channelId: "run-inactivity",
    } as any,
    trigger: { seconds: secondsUntilFire, repeats: false } as any,
  });
}
