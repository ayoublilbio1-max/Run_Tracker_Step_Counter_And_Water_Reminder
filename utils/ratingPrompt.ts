import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "rating_prompt_seen";

export async function hasSeenRatingPrompt(): Promise<boolean> {
  const value = await AsyncStorage.getItem(KEY);
  return value === "true";
}

export async function markRatingPromptSeen(): Promise<void> {
  await AsyncStorage.setItem(KEY, "true");
}
