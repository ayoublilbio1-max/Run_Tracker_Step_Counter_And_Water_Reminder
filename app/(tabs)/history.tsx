import { StyleSheet, Text, View } from "react-native";
import { typography, useThemeColors } from "../../constants/theme";

export default function History() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>History</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { ...typography.display },
});
