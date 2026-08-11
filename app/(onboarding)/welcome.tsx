import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientButton from "../../components/GradientButton";
import Logo from "../../components/Logo";
import { spacing, typography, useThemeColors } from "../../constants/theme";

export default function Welcome() {
  const colors = useThemeColors();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.topSection}>
          <Logo />
        </View>

        <View style={styles.middleSection}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Welcome to Run Tracker
          </Text>
          <Text style={[styles.paragraph, { color: colors.textMuted }]}>
            Track your runs, count your daily steps, and stay on top of your
            hydration — all in one place. Let&apos;s set up your profile so we can
            personalize your goals.
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <GradientButton
            label="Get Started"
            fullWidth
            onPress={() => router.push("/(onboarding)/gender")}
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
    paddingTop: spacing.xl * 2,
    paddingBottom: spacing.xl,
    justifyContent: "space-between",
  },
  topSection: {
    alignItems: "center",
  },
  middleSection: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    ...typography.display,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  paragraph: {
    ...typography.body,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: spacing.sm,
  },
  bottomSection: {
    width: "100%",
  },
});
