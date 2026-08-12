import { Pressable, StyleSheet, Text, View } from "react-native";
import { spacing, useThemeColors } from "../constants/theme";

type Props = {
  options: { label: string; value: string }[];
  selected: string;
  onChange: (value: string) => void;
};

export default function GoalTabSwitcher({
  options,
  selected,
  onChange,
}: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = option.value === selected;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={styles.tab}
          >
            <Text
              style={[
                styles.label,
                { color: active ? colors.textPrimary : colors.textMuted },
                active && styles.labelActive,
              ]}
            >
              {option.label}
            </Text>
            {active && (
              <View
                style={[styles.underline, { backgroundColor: colors.primary }]}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.xl },
  tab: { alignItems: "flex-start" },
  label: { fontSize: 17, fontWeight: "600", marginBottom: spacing.xs },
  labelActive: { fontWeight: "800" },
  underline: { height: 3, width: 28, borderRadius: 2 },
});
