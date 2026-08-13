import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useThemeColors } from "../constants/theme";

type Props = {
  currentMl: number;
  targetMl: number;
  size?: number;
  strokeWidth?: number;
};

export default function WaterRing({
  currentMl,
  targetMl,
  size = 220,
  strokeWidth = 16,
}: Props) {
  const colors = useThemeColors();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent =
    targetMl > 0 ? Math.max(0, Math.min(100, (currentMl / targetMl) * 100)) : 0;
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
          stroke={colors.water}
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
        <Ionicons name="water" size={28} color={colors.water} />
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {currentMl}
        </Text>
        <Text style={[styles.target, { color: colors.textMuted }]}>
          /{targetMl}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { position: "absolute", alignItems: "center" },
  value: { fontSize: 40, fontWeight: "800", marginTop: 6 },
  target: { fontSize: 15, fontWeight: "600", marginTop: -2 },
});
