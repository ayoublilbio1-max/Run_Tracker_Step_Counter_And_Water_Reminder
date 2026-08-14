import { router } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectableRow from "../../components/SelectableRow";
import SelectField from "../../components/SelectField";
import { spacing, typography, useThemeColors } from "../../constants/theme";
import { useUserProfileStore } from "../../store/userProfileStore";

function formatWeight(kg: number, unit: "kg" | "lbs") {
  if (unit === "lbs") return `${Math.round(kg * 2.20462)} lbs`;
  return `${kg} kg`;
}

function formatHeight(cm: number, unit: "cm" | "ft") {
  if (unit === "ft") {
    const totalInches = Math.round(cm / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}'${inches}"`;
  }
  return `${cm} cm`;
}

function formatGoal(
  goalType: "walking" | "run",
  dailyStepGoal: number,
  runDistanceMeters: number,
  distanceUnit: "km" | "mi",
) {
  if (goalType === "walking")
    return `${dailyStepGoal.toLocaleString()} steps/day`;
  if (distanceUnit === "mi")
    return `${(runDistanceMeters / 1609.34).toFixed(2)} mi/run`;
  return `${(runDistanceMeters / 1000).toFixed(1)} km/run`;
}

export default function Profile() {
  const colors = useThemeColors();
  const gender = useUserProfileStore((s) => s.gender);
  const setGender = useUserProfileStore((s) => s.setGender);
  const weightKg = useUserProfileStore((s) => s.weightKg);
  const weightUnit = useUserProfileStore((s) => s.weightUnit);
  const heightCm = useUserProfileStore((s) => s.heightCm);
  const heightUnit = useUserProfileStore((s) => s.heightUnit);
  const goalType = useUserProfileStore((s) => s.goalType);
  const dailyStepGoal = useUserProfileStore((s) => s.dailyStepGoal);
  const runDistanceMeters = useUserProfileStore((s) => s.runDistanceMeters);
  const distanceUnit = useUserProfileStore((s) => s.distanceUnit);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Profile
        </Text>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
          Gender
        </Text>
        <SelectableRow
          label="Male"
          iconName="man"
          selected={gender === "male"}
          onPress={() => setGender("male")}
        />
        <SelectableRow
          label="Female"
          iconName="woman"
          selected={gender === "female"}
          onPress={() => setGender("female")}
        />

        <Text
          style={[
            styles.sectionLabel,
            { color: colors.textMuted, marginTop: spacing.lg },
          ]}
        >
          Body
        </Text>
        <SelectField
          label="Weight"
          value={formatWeight(weightKg, weightUnit)}
          chevronType="forward"
          onPress={() => router.push("/profile/edit-weight" as any)}
        />
        <SelectField
          label="Height"
          value={formatHeight(heightCm, heightUnit)}
          chevronType="forward"
          onPress={() => router.push("/profile/edit-height" as any)}
        />

        <Text
          style={[
            styles.sectionLabel,
            { color: colors.textMuted, marginTop: spacing.lg },
          ]}
        >
          Goal
        </Text>
        <SelectField
          label={goalType === "walking" ? "Walking Goal" : "Run Goal"}
          value={formatGoal(
            goalType,
            dailyStepGoal,
            runDistanceMeters,
            distanceUnit,
          )}
          chevronType="forward"
          onPress={() => router.push("/profile/edit-goal" as any)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  title: { ...typography.display, marginBottom: spacing.lg },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
});
