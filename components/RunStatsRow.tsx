import { StyleSheet, Text, View } from "react-native";
import { spacing, useThemeColors } from "../constants/theme";

type Props = {
  durationLabel: string;
  paceLabel: string;
  kcal: number;
};

export default function RunStatsRow({ durationLabel, paceLabel, kcal }: Props) {
  const colors = useThemeColors();

  return (
    <View style={[styles.row, { borderColor: colors.border }]}>
      <View style={styles.stat}>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {durationLabel}
        </Text>
        <Text style={[styles.label, { color: colors.textMuted }]}>
          TIME (MIN)
        </Text>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={styles.stat}>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {paceLabel}
        </Text>
        <Text style={[styles.label, { color: colors.textMuted }]}>
          PACE (MIN/KM)
        </Text>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={styles.stat}>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {kcal}
        </Text>
        <Text style={[styles.label, { color: colors.textMuted }]}>KCAL</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
  },
  stat: { flex: 1, alignItems: "center" },
  value: { fontSize: 18, fontWeight: "800", marginBottom: 4 },
  label: { fontSize: 11, fontWeight: "600", letterSpacing: 0.5 },
  divider: { width: 1 },
});
