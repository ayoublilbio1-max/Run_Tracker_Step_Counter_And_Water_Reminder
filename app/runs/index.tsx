import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientButton from "../../components/GradientButton";
import RecentActivityCard from "../../components/RecentActivityCard";
import RunRing from "../../components/RunRing";
import { spacing, typography, useThemeColors } from "../../constants/theme";
import { useActivitiesStore } from "../../store/activitiesStore";
import { useUserProfileStore } from "../../store/userProfileStore";

export default function RunsOverview() {
  const colors = useThemeColors();
  const runDistanceMeters = useUserProfileStore((s) => s.runDistanceMeters);
  const activities = useActivitiesStore((s) => s.activities);

  const latestActivity = activities[0];
  const targetKm = runDistanceMeters / 1000;

  const totals = useMemo(() => {
    const totalDistance = activities.reduce((sum, a) => sum + a.distanceKm, 0);
    const totalRuns = activities.length;
    const avgPace =
      totalRuns > 0
        ? activities.reduce((sum, a) => sum + parseFloat(a.paceLabel), 0) /
          totalRuns
        : 0;
    return { totalDistance, totalRuns, avgPace };
  }, [activities]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.iconButton, { backgroundColor: colors.surfaceAlt }]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          RUN TRACKER
        </Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ringSection}>
          <RunRing
            currentKm={latestActivity?.distanceKm ?? 0}
            targetKm={targetKm}
          />
        </View>
        <Text style={[styles.statusLabel, { color: colors.run }]}>
          Latest Run
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {totals.totalDistance.toFixed(2)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Total Km
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {totals.totalRuns}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Total Runs
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {totals.avgPace.toFixed(2)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Avg Pace
            </Text>
          </View>
        </View>

        <GradientButton
          label="Start New Run"
          fullWidth
          onPress={() =>
            router.push({
              pathname: "/run/[active]",
              params: { active: "new" },
            })
          }
          style={styles.startButton}
        />

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Recent Activity
        </Text>
        {latestActivity && (
          <RecentActivityCard
            date={latestActivity.date}
            distanceKm={latestActivity.distanceKm}
            durationLabel={latestActivity.durationLabel}
            paceLabel={latestActivity.paceLabel}
            kcal={latestActivity.kcal}
            onPress={() =>
              router.push({
                pathname: "/activity/[id]",
                params: { id: latestActivity.id },
              })
            }
          />
        )}

        <Pressable
          style={[styles.historyCard, { backgroundColor: colors.surfaceAlt }]}
          onPress={() => router.push("/(tabs)/history")}
        >
          <Text style={[styles.historyLabel, { color: colors.textPrimary }]}>
            View Run History
          </Text>
          <View
            style={[
              styles.historyChevron,
              { backgroundColor: colors.run + "33" },
            ]}
          >
            <Ionicons name="chevron-forward" size={18} color={colors.run} />
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 17, fontWeight: "800", letterSpacing: 0.5 },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  ringSection: { alignItems: "center", marginTop: spacing.lg },
  statusLabel: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.xl,
  },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 12, fontWeight: "500", marginTop: 2 },
  startButton: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.h2, marginBottom: spacing.md },
  historyCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  historyLabel: { fontSize: 16, fontWeight: "700" },
  historyChevron: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
