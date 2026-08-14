import * as NavigationBar from "expo-navigation-bar";
import { Redirect } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { darkColors } from "../constants/theme";
import { useUserProfileStore } from "../store/userProfileStore";

const backgroundPhoto = require("../assets/images/loading-background.jpg");

const DISPLAY_MS = 3000;
const IMAGE_ASPECT = 727 / 1646; // source image width / height
const DOTS_Y_FRACTION = 0.808; // where the dots sit within the source image

function Dot({ delay }: { delay: number }) {
  const anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.4,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.delay(400 - delay > 0 ? 400 - delay : 0),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          opacity: anim,
          transform: [
            {
              scale: anim.interpolate({
                inputRange: [0.4, 1],
                outputRange: [0.8, 1.3],
              }),
            },
          ],
        },
      ]}
    />
  );
}

export default function Index() {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const [hydrated, setHydrated] = useState(
    useUserProfileStore.persist.hasHydrated(),
  );
  const [timeElapsed, setTimeElapsed] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      const unsub = useUserProfileStore.persist.onFinishHydration(() =>
        setHydrated(true),
      );
      const timer = setTimeout(() => setTimeElapsed(true), DISPLAY_MS);
      return () => {
        unsub();
        clearTimeout(timer);
      };
    }
    const timer = setTimeout(() => setTimeElapsed(true), DISPLAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    NavigationBar.setVisibilityAsync("hidden").catch(() => {});
    return () => {
      NavigationBar.setVisibilityAsync("visible").catch(() => {});
    };
  }, []);

  const hasCompletedOnboarding = useUserProfileStore(
    (s) => s.hasCompletedOnboarding,
  );

  if (!hydrated || !timeElapsed) {
    const screenAspect = screenW / screenH;
    let renderedWidth: number,
      renderedHeight: number,
      offsetX: number,
      offsetY: number;

    if (screenAspect > IMAGE_ASPECT) {
      renderedHeight = screenH;
      renderedWidth = screenH * IMAGE_ASPECT;
      offsetX = (screenW - renderedWidth) / 2;
      offsetY = 0;
    } else {
      renderedWidth = screenW;
      renderedHeight = screenW / IMAGE_ASPECT;
      offsetX = 0;
      offsetY = (screenH - renderedHeight) / 2;
    }

    const dotsTop = offsetY + renderedHeight * DOTS_Y_FRACTION;

    return (
      <View style={styles.container}>
        <Image
          source={backgroundPhoto}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={[styles.dotsRow, { top: dotsTop }]}>
          <Dot delay={0} />
          <Dot delay={130} />
          <Dot delay={260} />
        </View>
      </View>
    );
  }

  return (
    <Redirect
      href={hasCompletedOnboarding ? "/(tabs)/home" : "/(onboarding)/welcome"}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkColors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: "100%", height: "100%" },
  dotsRow: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: darkColors.primary,
  },
});
