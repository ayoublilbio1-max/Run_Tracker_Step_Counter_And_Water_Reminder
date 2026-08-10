import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs, router } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "../../constants/theme";

const homeIcon = require("../../assets/icons/home_icon.png");
const profileIcon = require("../../assets/icons/user_man.png");

function RunButton() {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/run/[active]", params: { active: "new" } })
      }
    >
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.runButton}
      >
        <Ionicons name="walk" size={33} color="#FFFFFF" />
      </LinearGradient>
    </Pressable>
  );
}

function TabIconPill({
  focused,
  source,
  size,
}: {
  focused: boolean;
  source: any;
  size: number;
}) {
  const colors = useThemeColors();

  if (focused) {
    return (
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.tabButtonPill}
      >
        <Image
          source={source}
          style={{ width: size, height: size, tintColor: "#FFFFFF" }}
          resizeMode="contain"
        />
      </LinearGradient>
    );
  }

  return (
    <View style={styles.tabButtonPill}>
      <Image
        source={source}
        style={{ width: size, height: size, tintColor: colors.textMuted }}
        resizeMode="contain"
      />
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 64 + insets.bottom,
            paddingBottom: insets.bottom + 8,
            paddingTop: 16,
          },
        ],
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIconPill focused={focused} source={homeIcon} size={38} />
          ),
        }}
      />
      <Tabs.Screen
        name="run-placeholder"
        options={{
          title: "",
          tabBarButton: () => (
            <View style={styles.runButtonWrapper}>
              <RunButton />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => e.preventDefault(),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIconPill focused={focused} source={profileIcon} size={38} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {},
  tabButtonPill: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  runButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  runButton: {
    width: 70,
    height: 70,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 110,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
