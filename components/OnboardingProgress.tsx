import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { spacing, useThemeColors } from "../constants/theme";

type Props = {
  step: number;
  total: number;
};

export default function OnboardingProgress({ step, total }: Props) {
  const colors = useThemeColors();
  const progress = step / total;

  return (
    <View style={styles.row}>
      <View style={[styles.track, { backgroundColor: colors.surfaceAlt }]}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${progress * 100}%` }]}
        />
      </View>
      <Text style={[styles.label, { color: colors.textMuted }]}>
        {step}/{total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  track: {
    width: 150,
    height: 9,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
});
