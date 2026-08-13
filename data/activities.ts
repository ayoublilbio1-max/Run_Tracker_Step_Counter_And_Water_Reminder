export type Activity = {
  id: string;
  date: string;
  distanceKm: number;
  durationLabel: string;
  paceLabel: string;
  kcal: number;
  intensity: { lowMin: string; moderateMin: string; highMin: string };
};

// TODO: replace with real run history from SQLite once run tracking (Phase 2/3) is wired up.
// Keep sorted newest-first so `.slice(0, N)` always returns the latest activities.
export const activities: Activity[] = [
  {
    id: "2",
    date: "Sep 27, 2021",
    distanceKm: 2.67,
    durationLabel: "00:02:46",
    paceLabel: "0.66",
    kcal: 3.0,
    intensity: {
      lowMin: "00:01:52",
      moderateMin: "00:00:18",
      highMin: "00:00:00",
    },
  },
  {
    id: "1",
    date: "Sep 27, 2021",
    distanceKm: 1.12,
    durationLabel: "00:01:05",
    paceLabel: "0.97",
    kcal: 1.87,
    intensity: {
      lowMin: "00:00:45",
      moderateMin: "00:00:15",
      highMin: "00:00:05",
    },
  },
];

export function getActivityById(id: string): Activity | undefined {
  return activities.find((activity) => activity.id === id);
}
