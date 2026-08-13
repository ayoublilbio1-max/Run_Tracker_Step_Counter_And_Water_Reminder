import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { radius, spacing, useThemeColors } from "../constants/theme";

type Props = {
  visible: boolean;
  currentTarget: number;
  onCancel: () => void;
  onSave: (target: number) => void;
};

export default function EditTargetModal({
  visible,
  currentTarget,
  onCancel,
  onSave,
}: Props) {
  const colors = useThemeColors();
  const [value, setValue] = useState(String(currentTarget));

  useEffect(() => {
    if (visible) setValue(String(currentTarget));
  }, [visible, currentTarget]);

  const handleSave = () => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed > 0) {
      onSave(parsed);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.surface }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Edit Target Steps
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Burned calories, walking distance & duration will be calculated
            accordingly.
          </Text>

          <View style={styles.inputRow}>
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
              Steps
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceAlt,
                  color: colors.textPrimary,
                },
              ]}
              value={value}
              onChangeText={setValue}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.buttonsRow}>
            <Pressable
              style={[styles.button, { backgroundColor: colors.run }]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>CANCEL</Text>
            </Pressable>
            <Pressable
              style={[styles.button, { backgroundColor: colors.steps }]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>SAVE</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: { fontSize: 20, fontWeight: "800", marginBottom: spacing.sm },
  subtitle: { fontSize: 13, lineHeight: 18, marginBottom: spacing.xl },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  inputLabel: { fontSize: 16, fontWeight: "700" },
  input: {
    width: 100,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  buttonsRow: { flexDirection: "row", gap: spacing.md },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: "center",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  buttonText: { fontSize: 15, fontWeight: "800", color: "#FFFFFF" },
});
