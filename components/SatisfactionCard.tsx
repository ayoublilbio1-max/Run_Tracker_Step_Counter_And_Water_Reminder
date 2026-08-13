import { Pressable, StyleSheet, Text, View } from "react-native";
import { radius, spacing } from "../constants/theme";

type Props = {
  onNotReally: () => void;
  onGood: () => void;
};

export default function SatisfactionCard({ onNotReally, onGood }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: "#22C55E" }]}>
      <Text style={styles.title}>
        Are you satisfied with the tracking results?
      </Text>
      <View style={styles.row}>
        <Pressable style={styles.button} onPress={onNotReally}>
          <Text style={styles.buttonText}>Not really</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onGood}>
          <Text style={styles.buttonText}>Good</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: spacing.lg, marginTop: spacing.xl },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  row: { flexDirection: "row", gap: spacing.md },
  button: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
});
