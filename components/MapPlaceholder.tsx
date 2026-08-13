import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { spacing, useThemeColors } from "../constants/theme";

export default function MapPlaceholder() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceAlt }]}>
      <Ionicons name="map-outline" size={36} color={colors.textMuted} />
      <Text style={[styles.caption, { color: colors.textMuted }]}>
        Map view coming soon
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 260,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  caption: { fontSize: 13, fontWeight: "500" },
});
