import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EditTargetModal from "../../components/EditTargetModal";
import StepsMenu from "../../components/StepsMenu";
import StepsRing from "../../components/StepsRing";
import WeekdayCircles from "../../components/WeekdayCircles";
import { spacing, useThemeColors } from "../../constants/theme";
import { useStepsStore } from "../../store/stepsStore";
import { useUserProfileStore } from "../../store/userProfileStore";
import {
    calcCaloriesFromSteps,
    calcDistanceKm,
    formatDuration,
} from "../../utils/fitnessCalculations";

export default function StepsTracker() {
  const colors = useThemeColors();
  const todaySteps = useStepsStore((s) => s.todaySteps);
  const isRunning = useStepsStore((s) => s.isRunning);
  const start = useStepsStore((s) => s.start);
  const pause = useStepsStore((s) => s.pause);
  const turnOff = useStepsStore((s) => s.turnOff);
  const reset = useStepsStore((s) => s.reset);
  const getElapsedMs = useStepsStore((s) => s.getElapsedMs);

  const dailyStepGoal = useUserProfileStore((s) => s.dailyStepGoal);
  const setDailyStepGoal = useUserProfileStore((s) => s.setDailyStepGoal);
  const heightCm = useUserProfileStore((s) => s.heightCm);
  const weightKg = useUserProfileStore((s) => s.weightKg);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => forceTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const elapsedMs = getElapsedMs();
  const distanceKm = calcDistanceKm(todaySteps, heightCm);
  const kcal = calcCaloriesFromSteps(todaySteps, weightKg);
  const percent = dailyStepGoal > 0 ? (todaySteps / dailyStepGoal) * 100 : 0;
  const todayIndex = (new Date().getDay() + 6) % 7;

  const goToReport = () => {
    router.push("/steps/report" as any);
  };

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
          STEPS TRACKER
        </Text>
        <StepsMenu
          onReset={reset}
          onEditTarget={() => setEditModalVisible(true)}
          onTurnOff={turnOff}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ringSection}>
          <Pressable
            onPress={isRunning ? pause : start}
            style={[
              styles.sideButton,
              styles.sideButtonLeft,
              { backgroundColor: colors.surfaceAlt },
            ]}
          >
            <Ionicons
              name={isRunning ? "pause" : "play"}
              size={20}
              color={colors.textPrimary}
            />
          </Pressable>

          <StepsRing current={todaySteps} target={dailyStepGoal} />

          <Pressable
            onPress={goToReport}
            style={[
              styles.sideButton,
              styles.sideButtonRight,
              { backgroundColor: colors.surfaceAlt },
            ]}
          >
            <Ionicons
              name="bar-chart-outline"
              size={20}
              color={colors.textPrimary}
            />
          </Pressable>
        </View>

        <Text
          style={[
            styles.statusLabel,
            { color: isRunning ? colors.steps : colors.textMuted },
          ]}
        >
          {isRunning ? "Steps" : "Paused"}
        </Text>

        <View style={styles.weekdaySection}>
          <WeekdayCircles todayIndex={todayIndex} todayPercent={percent} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {formatDuration(elapsedMs)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Duration
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {kcal.toFixed(0)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Kcal
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {distanceKm.toFixed(2)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Km
            </Text>
          </View>
        </View>

        <Pressable
          style={[styles.summaryCard, { backgroundColor: colors.surfaceAlt }]}
          onPress={goToReport}
        >
          <View>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>
              Last 7 Days Steps:
            </Text>
            <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
              0
            </Text>
          </View>
          <View
            style={[
              styles.summaryChevron,
              { backgroundColor: colors.steps + "33" },
            ]}
          >
            <Ionicons name="chevron-forward" size={18} color={colors.steps} />
          </View>
        </Pressable>
      </ScrollView>

      <EditTargetModal
        visible={editModalVisible}
        currentTarget={dailyStepGoal}
        onCancel={() => setEditModalVisible(false)}
        onSave={(target: number) => {
          setDailyStepGoal(target);
          setEditModalVisible(false);
        }}
      />
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
  ringSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  sideButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  sideButtonLeft: { marginRight: 20, zIndex: 2 },
  sideButtonRight: { marginLeft: 20, zIndex: 2 },
  statusLabel: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  weekdaySection: { marginBottom: spacing.xl },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.xl,
  },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 12, fontWeight: "500", marginTop: 2 },
  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    padding: spacing.lg,
  },
  summaryLabel: { fontSize: 13, fontWeight: "600", marginBottom: spacing.xs },
  summaryValue: { fontSize: 28, fontWeight: "800" },
  summaryChevron: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
