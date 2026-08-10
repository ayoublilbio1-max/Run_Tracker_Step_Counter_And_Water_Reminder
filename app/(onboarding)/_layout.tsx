import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="gender" />
      <Stack.Screen name="weight" />
      <Stack.Screen name="height" />
      <Stack.Screen name="goal" />
    </Stack>
  );
}