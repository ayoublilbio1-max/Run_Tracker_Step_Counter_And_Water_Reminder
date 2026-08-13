import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecentActivityCard from "../../components/RecentActivityCard";
import { spacing, typography, useThemeColors } from "../../constants/theme";
import { useActivitiesStore } from "../../store/activitiesStore";

export default function History() {
  const colors = useThemeColors();
  const activities = useActivitiesStore((state) => state.activities);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: colors.surfaceAlt }]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Recent Activities
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {activities.map((activity) => (
          <RecentActivityCard
            key={activity.id}
            date={activity.date}
            distanceKm={activity.distanceKm}
            durationLabel={activity.durationLabel}
            paceLabel={activity.paceLabel}
            kcal={activity.kcal}
            route={activity.route}
            onPress={() =>
              router.push({
                pathname: "/activity/[id]",
                params: { id: activity.id },
              })
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { ...typography.h1 },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
});
