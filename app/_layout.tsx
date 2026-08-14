import * as NavigationBar from "expo-navigation-bar";
import * as Notifications from "expo-notifications";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import { useThemeColors } from "../constants/theme";
import { useStepsStore } from "../store/stepsStore";
import { useWaterStore } from "../store/waterStore";
import {
  checkAndScheduleRunReminder,
  scheduleWaterReminders,
  setupReminderChannels,
} from "../utils/reminderNotifications";
import { setupNotificationChannel } from "../utils/runNotifications";

export default function RootLayout() {
  const colors = useThemeColors();
  const scheme = useColorScheme();
  const isDark = scheme !== "light";

  useEffect(() => {
    (async () => {
      await setupNotificationChannel();
      await setupReminderChannels();
      await Notifications.requestPermissionsAsync().catch(() => {});

      useStepsStore.getState().ensureTodayRollover();

      const currentReminder = useWaterStore.getState().reminder;
      await scheduleWaterReminders(currentReminder).catch(() => {});
      await checkAndScheduleRunReminder().catch(() => {});
    })();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (data?.type === "run-complete") {
          router.push("/run/summary" as any);
        }
      },
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    NavigationBar.setButtonStyleAsync(isDark ? "light" : "dark").catch(
      () => {},
    );
  }, [isDark]);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="run/[active]"
          options={{ presentation: "fullScreenModal" }}
        />
      </Stack>
    </>
  );
}
