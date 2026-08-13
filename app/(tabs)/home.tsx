import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularProgress from "../../components/CircularProgress";
import GoalStatRow from "../../components/GoalStatRow";
import QuickActionCard from "../../components/QuickActionCard";
import RecentActivityCard from "../../components/RecentActivityCard";
import { spacing, typography, useThemeColors } from "../../constants/theme";
import { useActivitiesStore } from "../../store/activitiesStore";
import { useStepsStore } from "../../store/stepsStore";
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
  const todaySteps = useStepsStore((state) => state.todaySteps);
  const activities = useActivitiesStore((state) => state.activities);

  const todayRunMeters = 0;

  const stepsPercent = (todaySteps / dailyStepGoal) * 100;
  const runPercent = (todayRunMeters / runDistanceMeters) * 100;
  const weeklyPercent = (stepsPercent + runPercent) / 2;

  const goalLabel = goalType === "walking" ? "Walking Goal" : "Run Goal";
  const latestActivity = activities[0];

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
            onPress={() => router.push("/steps" as any)}
          />
          <QuickActionCard
            label="Water"
            iconName="water"
            backgroundColor={colors.water}
            onPress={() => router.push("/water" as any)}
          />
          <QuickActionCard
            label="Run"
            iconName="run"
            iconLibrary="material"
            backgroundColor={colors.run}
            onPress={() => router.push("/runs" as any)}
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

        {latestActivity && (
          <RecentActivityCard
            date={latestActivity.date}
            distanceKm={latestActivity.distanceKm}
            durationLabel={latestActivity.durationLabel}
            paceLabel={latestActivity.paceLabel}
            kcal={latestActivity.kcal}
            route={latestActivity.route}
            onPress={() =>
              router.push({
                pathname: "/activity/[id]",
                params: { id: latestActivity.id },
              })
            }
          />
        )}
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
    gap: spacing.sm,
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
