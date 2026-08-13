import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ContainerSelector from "../../components/ContainerSelector";
import WaterRecordRow from "../../components/WaterRecordRow";
import WaterRing from "../../components/WaterRing";
import WeeklyWaterChart from "../../components/WeeklyWaterChart";
import { spacing, typography, useThemeColors } from "../../constants/theme";
import { CONTAINER_PRESETS, useWaterStore } from "../../store/waterStore";

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatMonthDay(date: Date) {
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WaterTracker() {
  const colors = useThemeColors();
  const targetMl = useWaterStore((s) => s.targetMl);
  const selectedContainer = useWaterStore((s) => s.selectedContainer);
  const setSelectedContainer = useWaterStore((s) => s.setSelectedContainer);
  const logs = useWaterStore((s) => s.logs);
  const addLog = useWaterStore((s) => s.addLog);
  const removeLog = useWaterStore((s) => s.removeLog);

  const today = new Date();

  const todayLogs = useMemo(
    () => logs.filter((log) => isSameDay(new Date(log.timestamp), today)),
    [logs],
  );
  const todayTotal = todayLogs.reduce((sum, log) => sum + log.amountMl, 0);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      const dayLogs = logs.filter((log) =>
        isSameDay(new Date(log.timestamp), date),
      );
      const ml = dayLogs.reduce((sum, log) => sum + log.amountMl, 0);
      return { label: i === 0 ? "Today" : WEEKDAY_LABELS[date.getDay()], ml };
    });
  }, [logs]);

  const weeklyAverage = Math.round(
    weekDays.reduce((sum, d) => sum + d.ml, 0) / 7,
  );
  const rangeEnd = new Date();
  rangeEnd.setDate(today.getDate() + 6);
  const dateRangeLabel = `${formatMonthDay(today)} - ${formatMonthDay(rangeEnd)}`;
  const presetAmount = CONTAINER_PRESETS[selectedContainer];

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
        <View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Today
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            Drink Water
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/water/settings")}
          style={[styles.iconButton, { backgroundColor: colors.surfaceAlt }]}
        >
          <Ionicons
            name="settings-outline"
            size={20}
            color={colors.textPrimary}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ringSection}>
          <WaterRing currentMl={todayTotal} targetMl={targetMl} />
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => addLog(presetAmount, selectedContainer)}
        >
          <View
            style={[styles.addIconCircle, { backgroundColor: colors.water }]}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
          </View>
          <Text style={[styles.addLabel, { color: colors.textPrimary }]}>
            {presetAmount} ml
          </Text>
        </Pressable>

        <View style={styles.containerSection}>
          <ContainerSelector
            selected={selectedContainer}
            onSelect={setSelectedContainer}
          />
        </View>

        <Text style={[styles.weekTitle, { color: colors.textPrimary }]}>
          Week
        </Text>
        <Text style={[styles.dateRange, { color: colors.textMuted }]}>
          {dateRangeLabel}
        </Text>

        <View style={styles.chartSection}>
          <WeeklyWaterChart
            days={weekDays}
            maxMl={Math.max(targetMl, ...weekDays.map((d) => d.ml))}
          />
        </View>

        <Text style={[styles.average, { color: colors.water }]}>
          Weekly average : {weeklyAverage} ml
        </Text>

        <Text style={[styles.recordsTitle, { color: colors.textPrimary }]}>
          Today records
        </Text>

        {todayLogs.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            No water logged yet today.
          </Text>
        ) : (
          todayLogs.map((log) => (
            <WaterRecordRow
              key={log.id}
              timeLabel={formatTime(log.timestamp)}
              amountMl={log.amountMl}
              containerType={log.containerType}
              onDelete={() => removeLog(log.id)}
            />
          ))
        )}
      </ScrollView>
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
  headerTitle: { fontSize: 18, fontWeight: "800", textAlign: "center" },
  headerSubtitle: { fontSize: 12, fontWeight: "500", textAlign: "center" },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  ringSection: {
    alignItems: "center",
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  addButton: { alignItems: "center", marginBottom: spacing.lg },
  addIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  addLabel: { fontSize: 14, fontWeight: "700" },
  containerSection: { marginBottom: spacing.xl },
  weekTitle: { fontSize: 17, fontWeight: "800", textAlign: "center" },
  dateRange: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  chartSection: { marginBottom: spacing.sm },
  average: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  recordsTitle: { ...typography.h2, marginBottom: spacing.md },
  emptyText: { fontSize: 14, fontWeight: "500", marginBottom: spacing.lg },
});
