import { StyleSheet, Text, View } from "react-native";
import { spacing, useThemeColors } from "../constants/theme";

type DayData = { label: string; steps: number };

type Props = {
  days: DayData[];
  maxSteps: number;
};

const CHART_HEIGHT = 160;

export default function WeeklyStepsChart({ days, maxSteps }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={styles.gridLabels}>
        <Text style={[styles.gridLabel, { color: colors.textMuted }]}>10K</Text>
        <Text style={[styles.gridLabel, { color: colors.textMuted }]}>5K</Text>
        <Text style={[styles.gridLabel, { color: colors.textMuted }]}>0</Text>
      </View>
      <View style={styles.chartArea}>
        <View style={styles.barsRow}>
          {days.map((day, index) => {
            const ratio = maxSteps > 0 ? Math.min(1, day.steps / maxSteps) : 0;
            const barHeight = Math.max(4, ratio * CHART_HEIGHT);
            return (
              <View key={index} style={styles.barColumn}>
                <View style={[styles.track, { height: CHART_HEIGHT }]}>
                  <View
                    style={[
                      styles.fill,
                      { height: barHeight, backgroundColor: colors.steps },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.dayLabel,
                    { color: index === 0 ? colors.steps : colors.textMuted },
                  ]}
                >
                  {day.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row" },
  gridLabels: {
    justifyContent: "space-between",
    height: CHART_HEIGHT,
    marginRight: spacing.sm,
    paddingBottom: 20,
  },
  gridLabel: { fontSize: 11, fontWeight: "600" },
  chartArea: { flex: 1 },
  barsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  barColumn: { flex: 1, alignItems: "center", marginHorizontal: 2 },
  track: { width: 6, justifyContent: "flex-end" },
  fill: { width: "100%", borderRadius: 3 },
  dayLabel: { fontSize: 11, fontWeight: "600", marginTop: spacing.xs },
});
