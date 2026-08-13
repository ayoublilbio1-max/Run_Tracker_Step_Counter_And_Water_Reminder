import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { spacing, useThemeColors } from "../constants/theme";
import GradientButton from "./GradientButton";

type Props = {
  visible: boolean;
  onSubmit: (stars: number) => void;
  onClose: () => void;
};

export default function RatingModal({ visible, onSubmit, onClose }: Props) {
  const colors = useThemeColors();
  const [stars, setStars] = useState(4);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.surface }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.emoji}>😊</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Good
          </Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setStars(n)}>
                <Ionicons
                  name={n <= stars ? "star" : "star-outline"}
                  size={32}
                  color={colors.primary}
                />
              </Pressable>
            ))}
          </View>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            The best we can get :)
          </Text>
          <GradientButton
            label="RATE"
            fullWidth
            onPress={() => onSubmit(stars)}
          />
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
    padding: spacing.xl,
    alignItems: "center",
  },
  emoji: { fontSize: 48, marginBottom: spacing.sm },
  title: { fontSize: 20, fontWeight: "800", marginBottom: spacing.lg },
  starsRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  subtitle: { fontSize: 13, marginBottom: spacing.xl },
});
