import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { useThemeColors } from "../constants/theme";

export default function BackButton() {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={() => router.back()}
      style={[styles.button, { backgroundColor: colors.surfaceAlt }]}
    >
      <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
