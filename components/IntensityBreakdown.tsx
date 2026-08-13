import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { spacing, useThemeColors } from "../constants/theme";

type Props = {
  lowMin: string;
  moderateMin: string;
  highMin: string;
};

export default function IntensityBreakdown({
  lowMin,
  moderateMin,
  highMin,
}: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      <View style={styles.item}>
        <Ionicons name="walk" size={26} color={colors.water} />
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {lowMin}
        </Text>
        <Text style={[styles.label, { color: colors.textMuted }]}>LOW</Text>
      </View>
      <View style={styles.item}>
        <Ionicons name="walk" size={26} color={colors.steps} />
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {moderateMin}
        </Text>
        <Text style={[styles.label, { color: colors.textMuted }]}>
          MODERATE
        </Text>
      </View>
      <View style={styles.item}>
        <MaterialCommunityIcons name="run" size={26} color={colors.run} />
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {highMin}
        </Text>
        <Text style={[styles.label, { color: colors.textMuted }]}>HIGH</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "center", gap: spacing.lg },
  item: { alignItems: "center", gap: spacing.xs, flexShrink: 1 },
  value: { fontSize: 14, fontWeight: "700" },
  label: { fontSize: 11, fontWeight: "600", letterSpacing: 0.5 },
});
