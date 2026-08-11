import { LinearGradient } from "expo-linear-gradient";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import {
  radius,
  spacing,
  typography,
  useThemeColors,
} from "../constants/theme";

type Props = {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
};

export default function GradientButton({
  label,
  onPress,
  style,
  fullWidth,
}: Props) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.wrapper,
        { shadowColor: colors.gradientEnd },
        fullWidth && styles.wrapperFullWidth,
        style,
      ]}
    >
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, fullWidth && styles.buttonFullWidth]}
      >
        <Text style={styles.buttonText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...Platform.select({
      ios: {
        shadowOpacity: 0.3,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 20,
      },
    }),
    borderRadius: radius.pill,
  },
  wrapperFullWidth: {
    width: "100%",
  },
  button: {
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonFullWidth: {
    width: "100%",
  },
  buttonText: { ...typography.h2, color: "#FFFFFF" },
});
