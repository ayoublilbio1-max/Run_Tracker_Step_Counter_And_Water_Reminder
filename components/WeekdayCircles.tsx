import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { spacing, useThemeColors } from "../constants/theme";

const LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const SIZE = 32;
const STROKE = 3;

type Props = {
  todayIndex: number;
  todayPercent: number;
};

export default function WeekdayCircles({ todayIndex, todayPercent }: Props) {
  const colors = useThemeColors();
  const radius = (SIZE - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={styles.row}>
      {LABELS.map((label, index) => {
        const isToday = index === todayIndex;
        const offset =
          circumference -
          (Math.max(0, Math.min(100, todayPercent)) / 100) * circumference;
        return (
          <View key={index} style={styles.item}>
            <Svg width={SIZE} height={SIZE}>
              <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={radius}
                stroke={colors.surfaceAlt}
                strokeWidth={STROKE}
                fill="none"
              />
              {isToday && (
                <Circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={radius}
                  stroke={colors.steps}
                  strokeWidth={STROKE}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  rotation="-90"
                  origin={`${SIZE / 2}, ${SIZE / 2}`}
                />
              )}
            </Svg>
            <Text
              style={[
                styles.label,
                { color: isToday ? colors.steps : colors.textMuted },
              ]}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  item: { alignItems: "center", gap: spacing.xs },
  label: { fontSize: 12, fontWeight: "700" },
});
