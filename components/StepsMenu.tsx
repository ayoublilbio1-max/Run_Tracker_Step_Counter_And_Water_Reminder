import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { spacing, useThemeColors } from "../constants/theme";

type Props = {
  onReset: () => void;
  onEditTarget: () => void;
  onTurnOff: () => void;
};

export default function StepsMenu({ onReset, onEditTarget, onTurnOff }: Props) {
  const colors = useThemeColors();
  const [visible, setVisible] = useState(false);

  const items: {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    action: () => void;
    danger?: boolean;
  }[] = [
    { label: "Reset", icon: "refresh", action: onReset },
    { label: "Edit target", icon: "pencil", action: onEditTarget },
    { label: "Turn off", icon: "power", action: onTurnOff, danger: true },
  ];

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={[styles.iconButton, { backgroundColor: colors.surfaceAlt }]}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={20}
          color={colors.textPrimary}
        />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <View style={[styles.menu, { backgroundColor: colors.surface }]}>
            {items.map((item) => (
              <Pressable
                key={item.label}
                style={styles.menuItem}
                onPress={() => {
                  setVisible(false);
                  item.action();
                }}
              >
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={item.danger ? colors.run : colors.textPrimary}
                />
                <Text
                  style={[
                    styles.menuText,
                    { color: item.danger ? colors.run : colors.textPrimary },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "flex-end",
    paddingTop: 100,
    paddingRight: spacing.lg,
  },
  menu: { borderRadius: 16, paddingVertical: spacing.xs, minWidth: 180 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuText: { fontSize: 15, fontWeight: "700" },
});
