import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { spacing, useThemeColors } from "../constants/theme";
import GradientButton from "./GradientButton";

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function FinishConfirmModal({
  visible,
  onCancel,
  onConfirm,
}: Props) {
  const colors = useThemeColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Pressable onPress={onCancel} style={styles.closeButton}>
            <Ionicons name="close" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.emoji}>🏁</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            FINISH TRAINING?
          </Text>
          <GradientButton label="FINISH" fullWidth onPress={onConfirm} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  card: {
    width: "100%",
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: "center",
  },
  closeButton: { position: "absolute", top: spacing.md, left: spacing.md },
  emoji: { fontSize: 56, marginBottom: spacing.md },
  title: { fontSize: 20, fontWeight: "800", marginBottom: spacing.xl },
});
