import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { radius, spacing, useThemeColors } from "../constants/theme";

type Props = {
  date: string;
  distanceKm: number;
  durationLabel: string;
  paceLabel: string;
  kcal: number;
};

export default function RecentActivityCard({
  date,
  distanceKm,
  durationLabel,
  paceLabel,
  kcal,
}: Props) {
  const colors = useThemeColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceAlt }]}>
      <View
        style={[styles.mapPlaceholder, { backgroundColor: colors.surface }]}
      >
        <Ionicons name="location" size={20} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.date, { color: colors.textMuted }]}>{date}</Text>
        <Text style={[styles.distance, { color: colors.textPrimary }]}>
          {distanceKm.toFixed(2)} Km
        </Text>
        <View style={styles.statsRow}>
          <Text style={[styles.statText, { color: colors.textMuted }]}>
            {durationLabel}
          </Text>
          <Text style={[styles.statText, { color: colors.textMuted }]}>
            {paceLabel}
          </Text>
          <Text style={[styles.statText, { color: colors.textMuted }]}>
            {kcal} Kcal
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: radius.lg,
    padding: spacing.sm,
    alignItems: "center",
    gap: spacing.md,
  },
  mapPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  date: { fontSize: 12, fontWeight: "600", marginBottom: 2 },
  distance: { fontSize: 18, fontWeight: "800", marginBottom: 4 },
  statsRow: { flexDirection: "row", gap: spacing.md },
  statText: { fontSize: 12, fontWeight: "500" },
});
