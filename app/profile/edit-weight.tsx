import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import GradientButton from "../../components/GradientButton";
import UnitToggle from "../../components/UnitToggle";
import WheelPicker from "../../components/WheelPicker";
import { spacing, typography, useThemeColors } from "../../constants/theme";
import { useUserProfileStore } from "../../store/userProfileStore";

const KG_RANGE = Array.from({ length: 171 }, (_, i) => i + 30);
const LBS_RANGE = Array.from({ length: 375 }, (_, i) => i + 66);

function kgToLbs(kg: number) {
  return Math.round(kg * 2.20462);
}
function lbsToKg(lbs: number) {
  return Math.round(lbs / 2.20462);
}

export default function EditWeight() {
  const colors = useThemeColors();
  const weightKg = useUserProfileStore((state) => state.weightKg);
  const weightUnit = useUserProfileStore((state) => state.weightUnit);
  const setWeightKg = useUserProfileStore((state) => state.setWeightKg);
  const setWeightUnit = useUserProfileStore((state) => state.setWeightUnit);

  const displayValue = weightUnit === "kg" ? weightKg : kgToLbs(weightKg);
  const data = weightUnit === "kg" ? KG_RANGE : LBS_RANGE;

  const handleChange = (value: number) => {
    setWeightKg(weightUnit === "kg" ? value : lbsToKg(value));
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.backButtonWrapper}>
            <BackButton />
          </View>
        </View>

        <View style={styles.headerSection}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Edit Weight
          </Text>
        </View>

        <UnitToggle
          options={["kg", "lbs"]}
          selected={weightUnit}
          onChange={(unit) => setWeightUnit(unit as "kg" | "lbs")}
        />

        <View style={styles.pickerSection}>
          <WheelPicker
            data={data}
            selectedValue={displayValue}
            onChange={handleChange}
          />
        </View>

        <View style={styles.bottomSection}>
          <GradientButton
            label="Save"
            fullWidth
            onPress={() => router.back()}
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
  headerRow: { position: "relative", justifyContent: "center" },
  backButtonWrapper: { position: "absolute", left: 0, top: 0, zIndex: 2 },
  headerSection: { marginTop: spacing.xl, marginBottom: spacing.lg },
  title: {
    ...typography.display,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  pickerSection: { flex: 1, justifyContent: "center" },
  bottomSection: { width: "100%" },
});
