import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { scheduleWaterReminders } from "../utils/reminderNotifications";
import { useUserProfileStore } from "./userProfileStore";

export type ContainerType = "cup" | "glass" | "mug" | "bottle";

export type WaterLog = {
  id: string;
  amountMl: number;
  containerType: ContainerType;
  timestamp: number;
};

export type ReminderSettings = {
  enabled: boolean;
  startTime: string;
  endTime: string;
  intervalHours: number;
  message: string;
};

type WaterState = {
  targetMl: number;
  setTargetMl: (ml: number) => void;
  selectedContainer: ContainerType;
  setSelectedContainer: (type: ContainerType) => void;
  logs: WaterLog[];
  addLog: (amountMl: number, containerType: ContainerType) => void;
  removeLog: (id: string) => void;
  reminder: ReminderSettings;
  setReminder: (partial: Partial<ReminderSettings>) => void;
};

export const CONTAINER_PRESETS: Record<ContainerType, number> = {
  cup: 100,
  glass: 150,
  mug: 250,
  bottle: 500,
};

function computeSuggestedTarget(weightKg: number) {
  const raw = weightKg * 33;
  const rounded = Math.round(raw / 50) * 50;
  return Math.max(1500, Math.min(4000, rounded));
}

export const useWaterStore = create<WaterState>()(
  persist(
    (set, get) => ({
      targetMl: computeSuggestedTarget(useUserProfileStore.getState().weightKg),
      setTargetMl: (ml) => set({ targetMl: ml }),
      selectedContainer: "glass",
      setSelectedContainer: (type) => set({ selectedContainer: type }),
      logs: [],
      addLog: (amountMl, containerType) =>
        set((state) => ({
          logs: [
            {
              id: Date.now().toString(),
              amountMl,
              containerType,
              timestamp: Date.now(),
            },
            ...state.logs,
          ],
        })),
      removeLog: (id) =>
        set((state) => ({ logs: state.logs.filter((log) => log.id !== id) })),
      reminder: {
        enabled: true,
        startTime: "8:00 AM",
        endTime: "11:00 PM",
        intervalHours: 0.5,
        message: "It's Time to drink water",
      },
      setReminder: (partial) => {
        const updated = { ...get().reminder, ...partial };
        set({ reminder: updated });
        scheduleWaterReminders(updated).catch(() => {});
      },
    }),
    {
      name: "water-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
