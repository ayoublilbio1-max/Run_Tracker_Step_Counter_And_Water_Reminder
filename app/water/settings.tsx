import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectField from "../../components/SelectField";
import SelectModal from "../../components/SelectModal";
import { spacing, typography, useThemeColors } from "../../constants/theme";
import { useWaterStore } from "../../store/waterStore";

const TARGET_OPTIONS = Array.from({ length: 17 }, (_, i) => 1000 + i * 250); // 1000–5000ml

export default function WaterSettings() {
  const colors = useThemeColors();
  const targetMl = useWaterStore((s) => s.targetMl);
  const setTargetMl = useWaterStore((s) => s.setTargetMl);
  const [targetModalVisible, setTargetModalVisible] = useState(false);

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
          Settings
        </Text>
      </View>

      <View style={styles.content}>
        <SelectField
          label="Target"
          value={`${targetMl} ml`}
          caption="Most people need 2000 ml a day."
          chevronType="down"
          onPress={() => setTargetModalVisible(true)}
        />
        <SelectField
          label="Reminder"
          value=""
          chevronType="forward"
          onPress={() => router.push("/water/reminder")}
        />
      </View>

      <SelectModal
        visible={targetModalVisible}
        title="Daily Target"
        options={TARGET_OPTIONS.map((ml) => ({
          label: `${ml} ml`,
          value: String(ml),
        }))}
        selectedValue={String(targetMl)}
        onSelect={(value) => setTargetMl(Number(value))}
        onClose={() => setTargetModalVisible(false)}
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
  title: { ...typography.h1 },
  content: { paddingHorizontal: spacing.lg },
});
