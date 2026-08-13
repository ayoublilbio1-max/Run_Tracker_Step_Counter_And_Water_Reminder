import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing, radius, typography } from '../constants/theme';

type Props = {
  label: string;
  iconName: string;
  iconLibrary?: 'ionicons' | 'material';
  backgroundColor: string;
  onPress?: () => void;
};

export default function QuickActionCard({ label, iconName, iconLibrary = 'ionicons', backgroundColor, onPress }: Props) {
  return (
    <Pressable style={[styles.card, { backgroundColor }]} onPress={onPress}>
      {iconLibrary === 'material' ? (
        <MaterialCommunityIcons name={iconName as any} size={22} color="#FFFFFF" />
      ) : (
        <Ionicons name={iconName as any} size={22} color="#FFFFFF" />
      )}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.lg,
  },
  label: { ...typography.h2, color: '#FFFFFF' },
});