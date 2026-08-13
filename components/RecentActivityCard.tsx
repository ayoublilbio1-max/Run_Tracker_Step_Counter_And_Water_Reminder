import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { radius, spacing, useThemeColors } from "../constants/theme";

type RoutePoint = { latitude: number; longitude: number };

type Props = {
  date: string;
  distanceKm: number;
  durationLabel: string;
  paceLabel: string;
  kcal: number;
  route?: RoutePoint[];
  onPress?: () => void;
};

export default function RecentActivityCard({
  date,
  distanceKm,
  durationLabel,
  paceLabel,
  kcal,
  route,
  onPress,
}: Props) {
  const colors = useThemeColors();
  const hasRoute = route && route.length >= 1;

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.surfaceAlt }]}
      onPress={onPress}
    >
      {hasRoute ? (
        <View style={styles.mapPlaceholder}>
          <MapView
            style={StyleSheet.absoluteFill}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: route![0].latitude,
              longitude: route![0].longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            pointerEvents="none"
          >
            {route!.length > 1 && (
              <Polyline
                coordinates={route!}
                strokeColor={colors.primary}
                strokeWidth={3}
              />
            )}
            <Marker coordinate={route![0]} pinColor="purple" />
          </MapView>
        </View>
      ) : (
        <View
          style={[
            styles.mapPlaceholder,
            {
              backgroundColor: colors.surface,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Ionicons name="location" size={20} color={colors.primary} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={[styles.date, { color: colors.textMuted }]}>{date}</Text>
        <Text style={[styles.distance, { color: colors.textPrimary }]}>
          {distanceKm.toFixed(2)} Km
        </Text>
        <View style={styles.statsRow}>
          <Text style={[styles.statText, { color: colors.textMuted }]}>
            {durationLabel}
          </Text>
          <Text style={[styles.statText, { color: colors.textMuted }]}>
            {paceLabel}
          </Text>
          <Text style={[styles.statText, { color: colors.textMuted }]}>
            {kcal} Kcal
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: radius.lg,
    padding: spacing.sm,
    alignItems: "center",
    gap: spacing.md,
  },
  mapPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  info: { flex: 1 },
  date: { fontSize: 12, fontWeight: "600", marginBottom: 2 },
  distance: { fontSize: 18, fontWeight: "800", marginBottom: 4 },
  statsRow: { flexDirection: "row", gap: spacing.md },
  statText: { fontSize: 12, fontWeight: "500" },
});
