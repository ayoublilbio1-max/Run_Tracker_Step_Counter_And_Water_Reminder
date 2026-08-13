import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { spacing, useThemeColors } from "../constants/theme";
import { ContainerType } from "../store/waterStore";

const ICONS: Record<
  ContainerType,
  keyof typeof MaterialCommunityIcons.glyphMap
> = {
  cup: "coffee-outline",
  glass: "cup-water",
  mug: "cup-outline",
  bottle: "bottle-soda-classic-outline",
};

type Props = {
  timeLabel: string;
  amountMl: number;
  containerType: ContainerType;
  onDelete: () => void;
};

export default function WaterRecordRow({
  timeLabel,
  amountMl,
  containerType,
  onDelete,
}: Props) {
  const colors = useThemeColors();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.row}>
      <MaterialCommunityIcons
        name={ICONS[containerType]}
        size={22}
        color={colors.water}
      />
      <Text style={[styles.time, { color: colors.textPrimary }]}>
        {timeLabel}
      </Text>
      <Text style={[styles.amount, { color: colors.textMuted }]}>
        {amountMl} ml
      </Text>
      <Pressable onPress={() => setMenuVisible(true)} hitSlop={8}>
        <Ionicons name="ellipsis-vertical" size={18} color={colors.textMuted} />
      </Pressable>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.menu, { backgroundColor: colors.surface }]}>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                onDelete();
              }}
            >
              <Ionicons name="trash-outline" size={18} color={colors.run} />
              <Text style={[styles.menuText, { color: colors.run }]}>
                Delete
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  time: { flex: 1, fontSize: 15, fontWeight: "700", marginLeft: spacing.xs },
  amount: { fontSize: 14, fontWeight: "500", marginRight: spacing.sm },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  menu: { borderRadius: 16, padding: spacing.sm, minWidth: 160 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuText: { fontSize: 15, fontWeight: "700" },
});
