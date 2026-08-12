import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useThemeColors, spacing, typography } from '../../constants/theme';
import GradientButton from '../../components/GradientButton';

const logo = require('../../assets/images/logo.png');

export default function Welcome() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={{ ...typography.body, color: colors.textMuted, marginTop: spacing.sm }}>
            Go Faster & Smarter
          </Text>
        </View>

        <View style={styles.middleSection}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Welcome to Run Tracker
          </Text>
          <Text style={[styles.paragraph, { color: colors.textMuted }]}>
            Track your runs, count your daily steps, and stay on top of your hydration —
            all in one place. Let&apos;s set up your profile so we can personalize your goals.
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <GradientButton
            label="Get Started"
            fullWidth
            onPress={() => router.push('/(onboarding)/gender')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl * 2,
    paddingBottom: spacing.xl,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
  },
  logo: { width: 110, height: 60 },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...typography.display,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  paragraph: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.sm,
  },
  bottomSection: {
    width: '100%',
  },
});