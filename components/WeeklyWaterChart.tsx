import { StyleSheet, Text, View } from "react-native";
import { spacing, useThemeColors } from "../constants/theme";

type DayData = { label: string; ml: number };

type Props = {
  days: DayData[];
  maxMl: number;
};

const CHART_HEIGHT = 140;

export default function WeeklyWaterChart({ days, maxMl }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={styles.barsRow}>
        {days.map((day, index) => {
          const heightRatio = maxMl > 0 ? Math.min(1, day.ml / maxMl) : 0;
          const barHeight = Math.max(8, heightRatio * CHART_HEIGHT);
          return (
            <View key={index} style={styles.barColumn}>
              <View
                style={[
                  styles.track,
                  { height: CHART_HEIGHT, backgroundColor: colors.surfaceAlt },
                ]}
              >
                <View
                  style={[
                    styles.fill,
                    { height: barHeight, backgroundColor: colors.water },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.labelsRow}>
        {days.map((day, index) => (
          <Text
            key={index}
            style={[
              styles.label,
              { color: index === 0 ? colors.water : colors.textMuted },
            ]}
          >
            {day.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  barsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  barColumn: { flex: 1, alignItems: "center", marginHorizontal: 4 },
  track: {
    width: "100%",
    borderRadius: 8,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  fill: { width: "100%", borderRadius: 8 },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  label: { flex: 1, textAlign: "center", fontSize: 12, fontWeight: "600" },
});
