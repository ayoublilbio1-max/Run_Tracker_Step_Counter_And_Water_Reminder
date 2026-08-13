import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { useThemeColors } from "../constants/theme";

type Props = {
  iconName: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  color?: string;
};

export default function IconButton({ iconName, onPress, color }: Props) {
  const colors = useThemeColors();

  return (
    <Pressable
      style={[styles.button, { backgroundColor: colors.surfaceAlt }]}
      onPress={onPress}
    >
      <Ionicons name={iconName} size={20} color={color ?? colors.textPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
