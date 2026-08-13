import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientButton from "../../components/GradientButton";
import IntensityBreakdown from "../../components/IntensityBreakdown";
import RatingModal from "../../components/RatingModal";
import SatisfactionCard from "../../components/SatisfactionCard";
import { spacing, useThemeColors } from "../../constants/theme";
import { useActivitiesStore } from "../../store/activitiesStore";
import {
    hasSeenRatingPrompt,
    markRatingPromptSeen,
} from "../../utils/ratingPrompt";

export default function RunSummary() {
  const colors = useThemeColors();
  const activities = useActivitiesStore((s) => s.activities);
  const removeActivity = useActivitiesStore((s) => s.removeActivity);
  const latest = activities[0];

  const [showSatisfaction, setShowSatisfaction] = useState(true);
  const [ratingVisible, setRatingVisible] = useState(false);

  if (!latest) {
    router.replace("/(tabs)/home");
    return null;
  }

  const handleGood = async () => {
    setShowSatisfaction(false);
    const seen = await hasSeenRatingPrompt();
    if (!seen) setRatingVisible(true);
  };

  const handleRate = async (stars: number) => {
    await markRatingPromptSeen();
    setRatingVisible(false);
  };

  const handleShare = async () => {
    await Share.share({
      message: `I just ran ${latest.distanceKm.toFixed(2)}km in ${latest.durationLabel} with Run Tracker! Pace: ${latest.paceLabel} min/km, ${latest.kcal} kcal burned.`,
    });
  };

  const handleClose = () => {
    router.replace("/runs" as any);
  };

  const handleDiscard = () => {
    removeActivity(latest.id);
    router.replace("/runs" as any);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={handleClose}
          style={[styles.iconButton, { backgroundColor: colors.surfaceAlt }]}
        >
          <Ionicons name="close" size={22} color={colors.textPrimary} />
        </Pressable>
        <Pressable
          onPress={handleDiscard}
          style={[styles.iconButton, { backgroundColor: colors.surfaceAlt }]}
        >
          <Ionicons name="trash-outline" size={20} color={colors.run} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.emoji}>👍</Text>
        <Text style={[styles.wellDone, { color: colors.textPrimary }]}>
          WELL DONE!
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {latest.durationLabel}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Duration
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {latest.distanceKm.toFixed(2)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Distance (KM)
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {latest.paceLabel}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Pace (Min/KM)
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {latest.kcal}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Kcal
            </Text>
          </View>
        </View>

        <IntensityBreakdown
          lowMin={latest.intensity.lowMin}
          moderateMin={latest.intensity.moderateMin}
          highMin={latest.intensity.highMin}
        />

        <GradientButton
          label="Share"
          fullWidth
          onPress={handleShare}
          style={styles.shareButton}
        />

        {showSatisfaction && (
          <SatisfactionCard
            onNotReally={() => setShowSatisfaction(false)}
            onGood={handleGood}
          />
        )}
      </ScrollView>

      <RatingModal
        visible={ratingVisible}
        onSubmit={handleRate}
        onClose={() => setRatingVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
    alignItems: "center",
  },
  emoji: { fontSize: 48, marginTop: spacing.md },
  wellDone: { fontSize: 22, fontWeight: "800", marginBottom: spacing.xl },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: spacing.xl,
    gap: spacing.lg,
  },
  statItem: { width: "40%", alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "800" },
  statLabel: { fontSize: 12, fontWeight: "500", marginTop: 2 },
  shareButton: { width: "100%", marginTop: spacing.xl },
});
