import { useColorScheme } from 'react-native';

export const darkColors = {
  background: '#0B0A1A',
  surface: '#171432',
  surfaceAlt: '#1F1B42',
  primary: '#8B5CF6',
  primaryAlt: '#C026D3',
  gradientStart: '#8f3cfe',
  gradientEnd: '#bb40ff',
  steps: '#4ADE80',
  water: '#38BDF8',
  run: '#FB7185',
  textPrimary: '#F5F3FF',
  textMuted: '#9891B0',
  border: '#2A2550',
};

export const lightColors = {
  background: '#F7F5FC',
  surface: '#FFFFFF',
  surfaceAlt: '#EFEBFA',
  primary: '#8B5CF6',
  primaryAlt: '#C026D3',
  gradientStart: '#8f3cfe',
  gradientEnd: '#bb40ff',
  steps: '#22B573',
  water: '#0EA5E9',
  run: '#F43F5E',
  textPrimary: '#1A1625',
  textMuted: '#6B667E',
  border: '#E3DEF5',
};

export type ThemeColors = typeof darkColors;

export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  return scheme === 'light' ? lightColors : darkColors;
}

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const radius = { sm: 8, md: 16, lg: 24, pill: 999 };

export const typography = {
  display: { fontSize: 32, fontWeight: '800' as const },
  h1: { fontSize: 24, fontWeight: '700' as const },
  h2: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
};