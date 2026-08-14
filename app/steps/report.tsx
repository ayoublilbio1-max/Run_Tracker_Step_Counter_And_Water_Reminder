import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WeeklyStepsChart from "../../components/WeeklyStepsChart";
import { spacing, useThemeColors } from "../../constants/theme";
import { useStepsStore } from "../../store/stepsStore";

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function StepsReport() {
  const colors = useThemeColors();
  const todaySteps = useStepsStore((s) => s.todaySteps);
  const history = useStepsStore((s) => s.history);
  const [range, setRange] = useState<"week" | "month">("week");

  const weekDays = useMemo(() => {
    const days = [{ label: "Today", steps: todaySteps }];
    for (let i = 1; i <= 6; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);
      const record = history.find((h) => h.date === dateStr);
      days.push({
        label: WEEKDAY_SHORT[date.getDay()],
        steps: record?.steps ?? 0,
      });
    }
    return days;
  }, [todaySteps, history]);

  const monthWeeks = useMemo(() => {
    const buckets: { label: string; steps: number }[] = [];
    const allDays = [todaySteps, ...history.slice(0, 27).map((h) => h.steps)];
    for (let w = 0; w < 4; w++) {
      const chunk = allDays.slice(w * 7, w * 7 + 7);
      const total = chunk.reduce((sum, v) => sum + v, 0);
      buckets.push({ label: w === 0 ? "This Wk" : `Wk -${w}`, steps: total });
    }
    return buckets;
  }, [todaySteps, history]);

  const activeData = range === "week" ? weekDays : monthWeeks;
  const total = activeData.reduce((sum, d) => sum + d.steps, 0);
  const average = Math.round(total / activeData.length);

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
          Report
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>
              Total
            </Text>
            <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
              {total.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>
              Average
            </Text>
            <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
              {average.toLocaleString()}
            </Text>
          </View>
        </View>

        <Text style={[styles.rangeTitle, { color: colors.textMuted }]}>
          {range === "week" ? "This Week" : "This Month"}
        </Text>

        <View style={styles.chartWrapper}>
          <WeeklyStepsChart days={activeData} maxSteps={10000} />
        </View>

        <View style={styles.toggleRow}>
          <Pressable
            style={[
              styles.toggleButton,
              {
                backgroundColor:
                  range === "week" ? colors.steps : colors.surfaceAlt,
              },
            ]}
            onPress={() => setRange("week")}
          >
            <Text
              style={[
                styles.toggleText,
                { color: range === "week" ? "#FFFFFF" : colors.textPrimary },
              ]}
            >
              Week
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.toggleButton,
              {
                backgroundColor:
                  range === "month" ? colors.steps : colors.surfaceAlt,
              },
            ]}
            onPress={() => setRange("month")}
          >
            <Text
              style={[
                styles.toggleText,
                { color: range === "month" ? "#FFFFFF" : colors.textPrimary },
              ]}
            >
              Month
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 19, fontWeight: "800" },
  content: { flex: 1, paddingHorizontal: spacing.lg },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.lg,
  },
  summaryItem: { alignItems: "center" },
  summaryLabel: { fontSize: 13, fontWeight: "600", marginBottom: 4 },
  summaryValue: { fontSize: 22, fontWeight: "800" },
  rangeTitle: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: spacing.xl,
  },
  chartWrapper: { flex: 1, justifyContent: "center" },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  toggleButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 1.5,
    borderRadius: 999,
  },
  toggleText: { fontSize: 15, fontWeight: "800" },
});
