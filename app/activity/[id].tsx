import { router, useLocalSearchParams } from "expo-router";
import { Alert, Share, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import IconButton from "../../components/IconButton";
import IntensityBreakdown from "../../components/IntensityBreakdown";
import MapPlaceholder from "../../components/MapPlaceholder";
import RunStatsRow from "../../components/RunStatsRow";
import { spacing, typography, useThemeColors } from "../../constants/theme";
import { useActivitiesStore } from "../../store/activitiesStore";

export default function ActivityDetail() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const activity = useActivitiesStore((state) => state.getActivityById(id));
  const removeActivity = useActivitiesStore((state) => state.removeActivity);

  if (!activity) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <View style={styles.notFound}>
          <Text style={{ color: colors.textPrimary }}>Activity not found.</Text>
          <IconButton iconName="chevron-back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const route = activity.route ?? [];
  const hasRoute = route.length >= 1;

  const handleShare = async () => {
    await Share.share({
      message: `I ran ${activity.distanceKm.toFixed(2)}km in ${activity.durationLabel} on ${activity.date}. Pace: ${activity.paceLabel} min/km, ${activity.kcal} kcal burned. 🏃`,
    });
  };

  const handleDelete = () => {
    Alert.alert("Delete this run?", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          removeActivity(activity.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <View style={styles.mapSection}>
        {hasRoute ? (
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: route[0].latitude,
              longitude: route[0].longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {route.length > 1 && (
              <Polyline
                coordinates={route}
                strokeColor={colors.primary}
                strokeWidth={4}
              />
            )}
            <Marker coordinate={route[0]} pinColor="purple" />
            {route.length > 1 && (
              <Marker coordinate={route[route.length - 1]} pinColor="red" />
            )}
          </MapView>
        ) : (
          <MapPlaceholder />
        )}
        <View style={styles.mapHeader}>
          <IconButton iconName="chevron-back" onPress={() => router.back()} />
          <View style={styles.mapHeaderRight}>
            <IconButton
              iconName="trash-outline"
              color={colors.run}
              onPress={handleDelete}
            />
            <IconButton iconName="share-outline" onPress={handleShare} />
          </View>
        </View>
      </View>

      <View style={[styles.handle, { backgroundColor: colors.border }]} />

      <View style={styles.content}>
        <RunStatsRow
          durationLabel={activity.durationLabel}
          paceLabel={activity.paceLabel}
          kcal={activity.kcal}
        />

        <View style={styles.distanceSection}>
          <Text style={[styles.distanceValue, { color: colors.textPrimary }]}>
            {activity.distanceKm.toFixed(2)}
          </Text>
          <Text style={[styles.distanceCaption, { color: colors.textMuted }]}>
            Distance (Km)
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Intensity(MIN):
        </Text>
        <IntensityBreakdown
          lowMin={activity.intensity.lowMin}
          moderateMin={activity.intensity.moderateMin}
          highMin={activity.intensity.highMin}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  mapSection: { position: "relative", height: 260 },
  map: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  mapHeader: {
    position: "absolute",
    top: spacing.md,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mapHeaderRight: { flexDirection: "row", gap: spacing.sm },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: spacing.md,
  },
  content: { flex: 1, paddingHorizontal: spacing.lg },
  distanceSection: { alignItems: "center", paddingVertical: spacing.lg },
  distanceValue: { fontSize: 48, fontWeight: "800" },
  distanceCaption: { fontSize: 14, fontWeight: "500", marginTop: 4 },
  sectionTitle: { ...typography.h2, marginBottom: spacing.lg },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
});
