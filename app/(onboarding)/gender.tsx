import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientButton from "../../components/GradientButton";
import OnboardingProgress from "../../components/OnboardingProgress";
import SelectableRow from "../../components/SelectableRow";
import { spacing, typography, useThemeColors } from "../../constants/theme";
import { useUserProfileStore } from "../../store/userProfileStore";

export default function Gender() {
  const colors = useThemeColors();
  const gender = useUserProfileStore((state) => state.gender);
  const setGender = useUserProfileStore((state) => state.setGender);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <OnboardingProgress step={1} total={4} />

        <View style={styles.headerSection}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            What&apos;s your gender?
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Calories & stride length calculation need it
          </Text>
        </View>

        <View style={styles.optionsSection}>
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
        </View>

        <View style={styles.bottomSection}>
          <GradientButton
            label="NEXT STEP"
            fullWidth
            onPress={() => router.push("/(onboarding)/weight")}
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
  headerSection: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl * 1.5,
  },
  title: {
    ...typography.display,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: { ...typography.body, textAlign: "center" },
  optionsSection: { flex: 1 },
  bottomSection: { width: "100%" },
});
