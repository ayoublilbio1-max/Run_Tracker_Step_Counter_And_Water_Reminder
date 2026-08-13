import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useThemeColors } from "../constants/theme";

type Props = {
  current: number;
  target: number;
  size?: number;
  strokeWidth?: number;
};

export default function StepsRing({
  current,
  target,
  size = 220,
  strokeWidth = 18,
}: Props) {
  const colors = useThemeColors();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent =
    target > 0 ? Math.max(0, Math.min(100, (current / target) * 100)) : 0;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.surfaceAlt}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.steps}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {current}
        </Text>
        <Text style={[styles.target, { color: colors.textMuted }]}>
          /{target}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { position: "absolute", alignItems: "center" },
  value: { fontSize: 44, fontWeight: "800" },
  target: { fontSize: 15, fontWeight: "600", marginTop: -4 },
});
