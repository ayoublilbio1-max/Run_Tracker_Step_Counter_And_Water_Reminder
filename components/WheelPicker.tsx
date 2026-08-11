import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../constants/theme";

const ITEM_HEIGHT = 56;
const VISIBLE_ITEMS = 5;

type Props = {
  data: number[];
  selectedValue: number;
  onChange: (value: number) => void;
  formatLabel?: (value: number) => string;
};

export default function WheelPicker({
  data,
  selectedValue,
  onChange,
  formatLabel,
}: Props) {
  const colors = useThemeColors();
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<any>(null);
  const initialIndex = Math.max(0, data.indexOf(selectedValue));

  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: initialIndex * ITEM_HEIGHT,
      animated: false,
    });
  }, []);

  const handleMomentumEnd = (e: any) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(data.length - 1, index));
    onChange(data[clamped]);
  };

  return (
    <View style={[styles.container, { height: ITEM_HEIGHT * VISIBLE_ITEMS }]}>
      <View
        pointerEvents="none"
        style={[styles.centerIndicator, { top: ITEM_HEIGHT * 2 }]}
      >
        <View style={[styles.arrow, { borderRightColor: colors.primary }]} />
      </View>
      <Animated.ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumEnd}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
      >
        {data.map((value, index) => {
          const inputRange = [
            (index - 2) * ITEM_HEIGHT,
            (index - 1) * ITEM_HEIGHT,
            index * ITEM_HEIGHT,
            (index + 1) * ITEM_HEIGHT,
            (index + 2) * ITEM_HEIGHT,
          ];
          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.2, 0.4, 1, 0.4, 0.2],
            extrapolate: "clamp",
          });
          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.7, 0.85, 1.15, 0.85, 0.7],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={value}
              style={[
                styles.item,
                { height: ITEM_HEIGHT, opacity, transform: [{ scale }] },
              ]}
            >
              <Text style={[styles.itemText, { color: colors.textPrimary }]}>
                {formatLabel ? formatLabel(value) : value}
              </Text>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", justifyContent: "center" },
  item: { justifyContent: "center", alignItems: "center" },
  itemText: { fontSize: 28, fontWeight: "800" },
  centerIndicator: {
    position: "absolute",
    left: 30,
    height: ITEM_HEIGHT,
    justifyContent: "center",
    zIndex: 2,
  },
  arrow: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 12,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
});
