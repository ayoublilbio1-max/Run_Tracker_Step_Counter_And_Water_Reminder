import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Activity = {
  id: string;
  date: string;
  distanceKm: number;
  durationLabel: string;
  paceLabel: string;
  kcal: number;
  intensity: { lowMin: string; moderateMin: string; highMin: string };
  route?: { latitude: number; longitude: number }[];
};

type ActivitiesState = {
  activities: Activity[];
  addActivity: (activity: Activity) => void;
  removeActivity: (id: string) => void;
  getActivityById: (id: string) => Activity | undefined;
};

export const useActivitiesStore = create<ActivitiesState>()(
  persist(
    (set, get) => ({
      activities: [],
      addActivity: (activity) =>
        set((state) => ({ activities: [activity, ...state.activities] })),
      removeActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((a) => a.id !== id),
        })),
      getActivityById: (id) => get().activities.find((a) => a.id === id),
    }),
    {
      name: "activities-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
