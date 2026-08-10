import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Image, ImageSourcePropType, Platform } from "react-native";
import { useThemeColors } from "../constants/theme";

type Props = {
  name?: keyof typeof Ionicons.glyphMap;
  source?: ImageSourcePropType;
  size: number;
};

export default function GradientIcon({ name, source, size }: Props) {
  const colors = useThemeColors();

  const maskElement = source ? (
    <Image
      source={source}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  ) : (
    <Ionicons name={name!} size={size} color="black" />
  );

  return (
    <MaskedView
      style={{ width: size, height: size }}
      androidRenderingMode={Platform.OS === "android" ? "software" : undefined}
      maskElement={maskElement}
    >
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: size, height: size }}
      />
    </MaskedView>
  );
}
