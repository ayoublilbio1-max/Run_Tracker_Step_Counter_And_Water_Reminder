import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectField from "../../components/SelectField";
import SelectModal from "../../components/SelectModal";
import { spacing, useThemeColors } from "../../constants/theme";
import { useWaterStore } from "../../store/waterStore";

function generateTimeOptions() {
  const options: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const period = h < 12 ? "AM" : "PM";
      let hour12 = h % 12;
      if (hour12 === 0) hour12 = 12;
      const minuteLabel = m === 0 ? "00" : "30";
      options.push(`${hour12}:${minuteLabel} ${period}`);
    }
  }
  return options;
}

const TIME_OPTIONS = generateTimeOptions();
const INTERVAL_OPTIONS = [0.5, 1, 1.5, 2, 3];

export default function WaterReminder() {
  const colors = useThemeColors();
  const reminder = useWaterStore((s) => s.reminder);
  const setReminder = useWaterStore((s) => s.setReminder);

  const [startModalVisible, setStartModalVisible] = useState(false);
  const [endModalVisible, setEndModalVisible] = useState(false);
  const [intervalModalVisible, setIntervalModalVisible] = useState(false);

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
          Drink water reminder
        </Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.toggleRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.toggleLabel, { color: colors.textPrimary }]}>
            Notifications
          </Text>
          <Switch
            value={reminder.enabled}
            onValueChange={(value) => setReminder({ enabled: value })}
            trackColor={{ false: colors.surfaceAlt, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
          Schedule
        </Text>

        <SelectField
          label="Start"
          value={reminder.startTime}
          chevronType="down"
          onPress={() => setStartModalVisible(true)}
        />
        <SelectField
          label="End"
          value={reminder.endTime}
          chevronType="down"
          onPress={() => setEndModalVisible(true)}
        />
        <SelectField
          label="Interval"
          value={`Every ${reminder.intervalHours} hours`}
          chevronType="down"
          onPress={() => setIntervalModalVisible(true)}
        />

        <Text
          style={[
            styles.sectionLabel,
            { color: colors.textMuted, marginTop: spacing.lg },
          ]}
        >
          Message
        </Text>
        <TextInput
          style={[styles.messageInput, { color: colors.textPrimary }]}
          value={reminder.message}
          onChangeText={(text) => setReminder({ message: text })}
          placeholder="Reminder message"
          placeholderTextColor={colors.textMuted}
          multiline
        />
      </View>

      <SelectModal
        visible={startModalVisible}
        title="Start Time"
        options={TIME_OPTIONS.map((t) => ({ label: t, value: t }))}
        selectedValue={reminder.startTime}
        onSelect={(value) => setReminder({ startTime: value })}
        onClose={() => setStartModalVisible(false)}
      />
      <SelectModal
        visible={endModalVisible}
        title="End Time"
        options={TIME_OPTIONS.map((t) => ({ label: t, value: t }))}
        selectedValue={reminder.endTime}
        onSelect={(value) => setReminder({ endTime: value })}
        onClose={() => setEndModalVisible(false)}
      />
      <SelectModal
        visible={intervalModalVisible}
        title="Reminder Interval"
        options={INTERVAL_OPTIONS.map((h) => ({
          label: `Every ${h} hours`,
          value: String(h),
        }))}
        selectedValue={String(reminder.intervalHours)}
        onSelect={(value) => setReminder({ intervalHours: Number(value) })}
        onClose={() => setIntervalModalVisible(false)}
      />
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
  title: { fontSize: 19, fontWeight: "800", flexShrink: 1 },
  content: { paddingHorizontal: spacing.lg },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    marginBottom: spacing.lg,
  },
  toggleLabel: { fontSize: 16, fontWeight: "700" },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  messageInput: {
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: spacing.sm,
  },
});
