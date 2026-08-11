import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
    radius,
    spacing,
    typography,
    useThemeColors,
} from "../constants/theme";

type Props = {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
};

export default function SelectableRow({
  label,
  iconName,
  selected,
  onPress,
}: Props) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.row,
        {
          backgroundColor: colors.surfaceAlt,
          borderColor: selected ? colors.primary : "transparent",
        },
      ]}
    >
      <Ionicons
        name={iconName}
        size={22}
        color={colors.primary}
        style={styles.icon}
      />
      <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
      <View
        style={[
          styles.radioOuter,
          { borderColor: selected ? colors.primary : colors.textMuted },
        ]}
      >
        {selected && (
          <View
            style={[styles.radioInner, { backgroundColor: colors.primary }]}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
  },
  icon: { marginRight: spacing.md },
  label: { ...typography.h2, flex: 1 },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
});
