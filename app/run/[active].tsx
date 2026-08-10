import { StyleSheet, Text, View } from "react-native";
import { typography, useThemeColors } from "../../constants/theme";

export default function ActiveRun() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Active Run
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { ...typography.display },
});
