import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { useThemeColors } from "../constants/theme";
import { ContainerType } from "../store/waterStore";

const CONTAINERS: {
  type: ContainerType;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  { type: "cup", icon: "coffee-outline" },
  { type: "glass", icon: "cup-water" },
  { type: "mug", icon: "cup-outline" },
  { type: "bottle", icon: "bottle-soda-classic-outline" },
];

type Props = {
  selected: ContainerType;
  onSelect: (type: ContainerType) => void;
};

export default function ContainerSelector({ selected, onSelect }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      {CONTAINERS.map(({ type, icon }) => {
        const active = type === selected;
        return (
          <Pressable
            key={type}
            onPress={() => onSelect(type)}
            style={[styles.button, active && { borderColor: colors.water }]}
          >
            <MaterialCommunityIcons
              name={icon}
              size={28}
              color={active ? colors.water : colors.textMuted}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-around", width: "100%" },
  button: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
});
