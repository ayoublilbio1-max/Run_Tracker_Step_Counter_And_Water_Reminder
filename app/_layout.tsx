import { Stack } from "expo-router";
import { useThemeColors } from "../constants/theme";

export default function RootLayout() {
  const colors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="run/[active]"
        options={{ presentation: "fullScreenModal" }}
      />
    </Stack>
  );
}
