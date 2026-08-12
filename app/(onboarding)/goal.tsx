import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import GoalTabSwitcher from "../../components/GoalTabSwitcher";
import GradientButton from "../../components/GradientButton";
import OnboardingProgress from "../../components/OnboardingProgress";
import UnitToggle from "../../components/UnitToggle";
import WheelPicker from "../../components/WheelPicker";
import { spacing, typography, useThemeColors } from "../../constants/theme";
import { useUserProfileStore } from "../../store/userProfileStore";

const STEP_RANGE = Array.from({ length: 59 }, (_, i) => 1000 + i * 500); // 1,000–30,000
const DISTANCE_RANGE = Array.from({ length: 418 }, (_, i) => 500 + i * 100); // 500m–42,200m

function formatSteps(value: number) {
  return value.toLocaleString();
}

function formatDistance(meters: number, unit: "km" | "mi") {
  if (unit === "mi") {
    return `${(meters / 1609.34).toFixed(2)} mi`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

export default function Goal() {
  const colors = useThemeColors();
  const goalType = useUserProfileStore((state) => state.goalType);
  const setGoalType = useUserProfileStore((state) => state.setGoalType);
  const dailyStepGoal = useUserProfileStore((state) => state.dailyStepGoal);
  const setDailyStepGoal = useUserProfileStore(
    (state) => state.setDailyStepGoal,
  );
  const runDistanceMeters = useUserProfileStore(
    (state) => state.runDistanceMeters,
  );
  const setRunDistanceMeters = useUserProfileStore(
    (state) => state.setRunDistanceMeters,
  );
  const distanceUnit = useUserProfileStore((state) => state.distanceUnit);
  const setDistanceUnit = useUserProfileStore((state) => state.setDistanceUnit);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.backButtonWrapper}>
            <BackButton />
          </View>
          <OnboardingProgress step={4} total={4} />
        </View>

        <View style={styles.headerSection}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Your Weekly Goal is Ready
          </Text>
        </View>

        <GoalTabSwitcher
          options={[
            { label: "Walking", value: "walking" },
            { label: "Run", value: "run" },
          ]}
          selected={goalType}
          onChange={(value) => setGoalType(value as "walking" | "run")}
        />

        {goalType === "walking" ? (
          <View style={styles.pickerSection}>
            <WheelPicker
              data={STEP_RANGE}
              selectedValue={dailyStepGoal}
              onChange={setDailyStepGoal}
              formatLabel={formatSteps}
            />
            <Text style={[styles.pickerCaption, { color: colors.textMuted }]}>
              steps per day
            </Text>
          </View>
        ) : (
          <View style={styles.pickerSection}>
            <UnitToggle
              options={["km", "mi"]}
              selected={distanceUnit}
              onChange={(unit) => setDistanceUnit(unit as "km" | "mi")}
            />
            <WheelPicker
              data={DISTANCE_RANGE}
              selectedValue={runDistanceMeters}
              onChange={setRunDistanceMeters}
              formatLabel={(v) => formatDistance(v, distanceUnit)}
            />
            <Text style={[styles.pickerCaption, { color: colors.textMuted }]}>
              distance per run
            </Text>
          </View>
        )}

        <View style={styles.noteRow}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.textMuted}
          />
          <Text style={[styles.noteText, { color: colors.textMuted }]}>
            You can update your goal anytime from your profile.
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <GradientButton
            label="SET AS MY GOAL"
            fullWidth
            onPress={() => router.push("/(tabs)/home")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerRow: { position: "relative", justifyContent: "center" },
  backButtonWrapper: { position: "absolute", left: 0, top: 0, zIndex: 2 },
  headerSection: { marginTop: spacing.xl, marginBottom: spacing.lg },
  title: {
    ...typography.display,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  pickerSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  pickerCaption: { fontSize: 14, fontWeight: "500" },
  noteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.lg,
  },
  noteText: { flex: 1, fontSize: 13, lineHeight: 18 },
  bottomSection: { width: "100%" },
});
