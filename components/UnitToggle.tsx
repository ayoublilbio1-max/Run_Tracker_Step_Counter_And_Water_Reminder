import { Pressable, StyleSheet, Text, View } from "react-native";
import { radius, spacing, useThemeColors } from "../constants/theme";

type Props = {
  options: [string, string];
  selected: string;
  onChange: (value: string) => void;
};

export default function UnitToggle({ options, selected, onChange }: Props) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <Pressable onPress={() => onChange(options[0])} style={styles.option}>
        <Text
          style={[
            styles.text,
            {
              color:
                selected === options[0] ? colors.textPrimary : colors.textMuted,
            },
            selected === options[0] && styles.textActive,
          ]}
        >
          {options[0].toUpperCase()}
        </Text>
      </Pressable>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <Pressable onPress={() => onChange(options[1])} style={styles.option}>
        <Text
          style={[
            styles.text,
            {
              color:
                selected === options[1] ? colors.textPrimary : colors.textMuted,
            },
            selected === options[1] && styles.textActive,
          ]}
        >
          {options[1].toUpperCase()}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: radius.pill,
  },
  option: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  text: { fontSize: 14, letterSpacing: 1, fontWeight: "500" },
  textActive: { fontWeight: "800" },
  divider: { width: 1, height: 20 },
});
