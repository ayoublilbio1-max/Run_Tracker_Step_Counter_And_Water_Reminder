import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";
import { radius, spacing, typography } from "../constants/theme";

type Props = {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  onPress?: () => void;
};

export default function QuickActionCard({
  label,
  iconName,
  backgroundColor,
  onPress,
}: Props) {
  return (
    <Pressable style={[styles.card, { backgroundColor }]} onPress={onPress}>
      <Ionicons name={iconName} size={22} color="#FFFFFF" />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.lg,
  },
  label: { ...typography.h2, color: "#FFFFFF" },
});
