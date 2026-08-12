import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularProgress from "../../components/CircularProgress";
import GoalStatRow from "../../components/GoalStatRow";
import QuickActionCard from "../../components/QuickActionCard";
import RecentActivityCard from "../../components/RecentActivityCard";
import { spacing, typography, useThemeColors } from "../../constants/theme";
import { useUserProfileStore } from "../../store/userProfileStore";

const logo = require("../../assets/images/logo.png");

function formatDistance(meters: number) {
  return `${(meters / 1000).toFixed(1)}km`;
}

export default function Home() {
  const colors = useThemeColors();
  const goalType = useUserProfileStore((state) => state.goalType);
  const dailyStepGoal = useUserProfileStore((state) => state.dailyStepGoal);
  const runDistanceMeters = useUserProfileStore(
    (state) => state.runDistanceMeters,
  );

  // TODO: replace with real tracked data once step counter / GPS tracking (Phase 2/3) are wired up.
  const todaySteps = 0;
  const todayRunMeters = 0;

  const stepsPercent = (todaySteps / dailyStepGoal) * 100;
  const runPercent = (todayRunMeters / runDistanceMeters) * 100;
  const weeklyPercent = (stepsPercent + runPercent) / 2;

  const goalLabel = goalType === "walking" ? "Walking Goal" : "Run Goal";

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <View>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text
            style={{
              ...typography.body,
              color: colors.textMuted,
              marginTop: spacing.sm,
            }}
          >
            Go Faster & Smarter
          </Text>
        </View>
        <Pressable style={[styles.infoButton, { borderColor: colors.border }]}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.textMuted}
          />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={[styles.goalLabel, { color: colors.textPrimary }]}>
          {goalLabel}
        </Text>

        <View style={styles.ringSection}>
          <CircularProgress percent={weeklyPercent} caption="This Week" />
        </View>

        <View style={styles.statsRow}>
          <GoalStatRow
            icon={<Ionicons name="walk" size={18} color={colors.steps} />}
            iconBg={colors.steps + "22"}
            current={String(todaySteps)}
            goal={`${dailyStepGoal.toLocaleString()} steps`}
          />
          <GoalStatRow
            icon={
              <MaterialCommunityIcons name="run" size={18} color={colors.run} />
            }
            iconBg={colors.run + "22"}
            current={formatDistance(todayRunMeters)}
            goal={formatDistance(runDistanceMeters)}
          />
        </View>

        <View style={styles.actionsRow}>
          <QuickActionCard
            label="Steps"
            iconName="footsteps"
            backgroundColor={colors.steps}
          />
          <QuickActionCard
            label="Water"
            iconName="water"
            backgroundColor={colors.water}
          />
        </View>

        <View style={styles.activitiesHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Recent Activities
          </Text>
          <Pressable onPress={() => router.push("/(tabs)/history")}>
            <Text style={[styles.moreLink, { color: colors.primary }]}>
              More
            </Text>
          </Pressable>
        </View>

        <RecentActivityCard
          date="Sep 27, 2021"
          distanceKm={2.67}
          durationLabel="00:22:46"
          paceLabel="08:31/km"
          kcal={210}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  logo: { width: 84, height: 32, marginBottom: 2 },
  infoButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  goalLabel: {
    ...typography.h2,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  ringSection: { alignItems: "center", marginBottom: spacing.lg },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.xl,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  activitiesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.h1 },
  moreLink: { fontSize: 15, fontWeight: "700" },
});
