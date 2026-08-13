import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useThemeColors } from "../constants/theme";

type Props = {
  currentKm: number;
  targetKm: number;
  size?: number;
  strokeWidth?: number;
};

export default function RunRing({
  currentKm,
  targetKm,
  size = 220,
  strokeWidth = 18,
}: Props) {
  const colors = useThemeColors();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent =
    targetKm > 0 ? Math.max(0, Math.min(100, (currentKm / targetKm) * 100)) : 0;
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
          stroke={colors.run}
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
        <MaterialCommunityIcons name="run" size={26} color={colors.run} />
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {currentKm.toFixed(2)}
        </Text>
        <Text style={[styles.target, { color: colors.textMuted }]}>
          /{targetKm.toFixed(1)} km
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { position: "absolute", alignItems: "center" },
  value: { fontSize: 36, fontWeight: "800", marginTop: 4 },
  target: { fontSize: 14, fontWeight: "600", marginTop: -2 },
});
