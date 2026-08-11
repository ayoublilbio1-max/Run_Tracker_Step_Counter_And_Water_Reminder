import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../constants/theme";

export default function Logo() {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.badge}
      >
        <Text style={styles.badgeText}>Run</Text>
      </LinearGradient>
      <Text style={[styles.tagline, { color: colors.textMuted }]}>TRACKER</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  badge: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    fontStyle: "italic",
  },
  tagline: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 4,
  },
});
