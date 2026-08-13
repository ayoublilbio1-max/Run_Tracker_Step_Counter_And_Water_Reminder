import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { spacing, useThemeColors } from "../constants/theme";

type Props = {
  label: string;
  value: string;
  caption?: string;
  onPress: () => void;
  chevronType?: "forward" | "down" | "none";
};

export default function SelectField({
  label,
  value,
  caption,
  onPress,
  chevronType = "down",
}: Props) {
  const colors = useThemeColors();

  return (
    <Pressable
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.left}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          {label}
        </Text>
        {caption ? (
          <Text style={[styles.caption, { color: colors.textMuted }]}>
            {caption}
          </Text>
        ) : null}
      </View>
      <View style={styles.right}>
        {value ? (
          <Text style={[styles.value, { color: colors.textMuted }]}>
            {value}
          </Text>
        ) : null}
        {chevronType !== "none" && (
          <Ionicons
            name={
              chevronType === "forward" ? "chevron-forward" : "chevron-down"
            }
            size={18}
            color={colors.textMuted}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  left: { flex: 1 },
  label: { fontSize: 16, fontWeight: "700" },
  caption: { fontSize: 12, marginTop: 2 },
  right: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  value: { fontSize: 15, fontWeight: "500" },
});
