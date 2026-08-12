import { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors, spacing } from '../constants/theme';

type Props = {
  icon: ReactNode;
  iconBg: string;
  current: string;
  goal: string;
};

export default function GoalStatRow({ icon, iconBg, current, goal }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>{icon}</View>
      <Text style={[styles.text, { color: colors.textPrimary }]}>
        {current}
        <Text style={{ color: colors.textMuted, fontWeight: '600' }}>/{goal}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 15, fontWeight: '700' },
});