import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { spacing, typography, useThemeColors } from "../../constants/theme";

export default function Home() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Home</Text>
      <Pressable
        style={[styles.historyButton, { backgroundColor: colors.surfaceAlt }]}
        onPress={() => router.push("/(tabs)/history")}
      >
        <Text style={[styles.historyButtonText, { color: colors.textPrimary }]}>
          View History
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { ...typography.display },
  historyButton: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 999,
  },
  historyButtonText: { ...typography.h2 },
});
