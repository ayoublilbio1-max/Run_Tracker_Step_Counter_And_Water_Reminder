import { FlatList, Modal, Pressable, StyleSheet, Text } from "react-native";
import { radius, spacing, useThemeColors } from "../constants/theme";

type Option = { label: string; value: string };

type Props = {
  visible: boolean;
  title: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
};

export default function SelectModal({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: Props) {
  const colors = useThemeColors();

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
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            style={styles.list}
            renderItem={({ item }) => {
              const selected = item.value === selectedValue;
              return (
                <Pressable
                  style={[
                    styles.option,
                    selected && { backgroundColor: colors.surfaceAlt },
                  ]}
                  onPress={() => {
                    onSelect(item.value);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: selected ? colors.primary : colors.textPrimary },
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            }}
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
    maxHeight: "60%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: spacing.md,
  },
  list: { paddingHorizontal: spacing.lg },
  option: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  optionText: { fontSize: 16, fontWeight: "600" },
});
