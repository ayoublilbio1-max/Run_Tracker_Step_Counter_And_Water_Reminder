import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import GradientButton from "../../components/GradientButton";
import { spacing, typography, useThemeColors } from "../../constants/theme";

export default function Height() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Height</Text>
      <GradientButton
        label="Next"
        onPress={() => router.push("/(onboarding)/goal")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  title: { ...typography.display, marginBottom: spacing.xl },
});
