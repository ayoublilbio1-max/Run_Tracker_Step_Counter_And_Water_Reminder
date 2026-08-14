import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import GradientButton from "../../components/GradientButton";
import UnitToggle from "../../components/UnitToggle";
import WheelPicker from "../../components/WheelPicker";
import { spacing, typography, useThemeColors } from "../../constants/theme";
import { useUserProfileStore } from "../../store/userProfileStore";

const CM_RANGE = Array.from({ length: 121 }, (_, i) => i + 100);
const IN_RANGE = Array.from({ length: 49 }, (_, i) => i + 40);

function cmToIn(cm: number) {
  return Math.round(cm / 2.54);
}
function inToCm(inches: number) {
  return Math.round(inches * 2.54);
}
function formatFeetInches(totalInches: number) {
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}'${inches}"`;
}

export default function EditHeight() {
  const colors = useThemeColors();
  const heightCm = useUserProfileStore((state) => state.heightCm);
  const heightUnit = useUserProfileStore((state) => state.heightUnit);
  const setHeightCm = useUserProfileStore((state) => state.setHeightCm);
  const setHeightUnit = useUserProfileStore((state) => state.setHeightUnit);

  const displayValue = heightUnit === "cm" ? heightCm : cmToIn(heightCm);
  const data = heightUnit === "cm" ? CM_RANGE : IN_RANGE;

  const handleChange = (value: number) => {
    setHeightCm(heightUnit === "cm" ? value : inToCm(value));
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
            Edit Height
          </Text>
        </View>

        <UnitToggle
          options={["cm", "ft"]}
          selected={heightUnit}
          onChange={(unit) => setHeightUnit(unit as "cm" | "ft")}
        />

        <View style={styles.pickerSection}>
          <WheelPicker
            data={data}
            selectedValue={displayValue}
            onChange={handleChange}
            formatLabel={heightUnit === "ft" ? formatFeetInches : undefined}
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
