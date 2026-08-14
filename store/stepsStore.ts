import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type DailyStepRecord = { date: string; steps: number };

type StepsState = {
  todaySteps: number;
  todayDate: string;
  history: DailyStepRecord[];
  isRunning: boolean;
  sessionStartedAt: number | null;
  accumulatedElapsedMs: number;
  start: () => void;
  pause: () => void;
  turnOff: () => void;
  reset: () => void;
  getElapsedMs: () => number;
  ensureTodayRollover: () => void;
};

function todayDateString() {
  return new Date().toISOString().slice(0, 10);
}

let pedometerSubscription: { remove: () => void } | null = null;

function clearPedometerWatch() {
  pedometerSubscription?.remove();
  pedometerSubscription = null;
}

export const useStepsStore = create<StepsState>()(
  persist(
    (set, get) => ({
      todaySteps: 0,
      todayDate: todayDateString(),
      history: [],
      isRunning: false,
      sessionStartedAt: null,
      accumulatedElapsedMs: 0,
      start: () => {
        get().ensureTodayRollover();
        if (get().isRunning) return;
        const baseline = get().todaySteps;
        set({ isRunning: true, sessionStartedAt: Date.now() });
        clearPedometerWatch();
        pedometerSubscription = Pedometer.watchStepCount((result) => {
          set({ todaySteps: baseline + result.steps });
        });
      },
      pause: () => {
        const { isRunning, sessionStartedAt, accumulatedElapsedMs } = get();
        if (!isRunning || sessionStartedAt === null) return;
        clearPedometerWatch();
        set({
          isRunning: false,
          accumulatedElapsedMs:
            accumulatedElapsedMs + (Date.now() - sessionStartedAt),
          sessionStartedAt: null,
        });
      },
      turnOff: () => {
        get().pause();
      },
      reset: () => {
        clearPedometerWatch();
        set({
          todaySteps: 0,
          isRunning: false,
          sessionStartedAt: null,
          accumulatedElapsedMs: 0,
        });
      },
      getElapsedMs: () => {
        const { isRunning, sessionStartedAt, accumulatedElapsedMs } = get();
        if (isRunning && sessionStartedAt !== null) {
          return accumulatedElapsedMs + (Date.now() - sessionStartedAt);
        }
        return accumulatedElapsedMs;
      },
      ensureTodayRollover: () => {
        const state = get();
        const todayStr = todayDateString();
        if (state.todayDate !== todayStr) {
          clearPedometerWatch();
          const archivedEntry = state.todayDate
            ? [{ date: state.todayDate, steps: state.todaySteps }]
            : [];
          set({
            todayDate: todayStr,
            todaySteps: 0,
            history: [...archivedEntry, ...state.history].slice(0, 30),
            isRunning: false,
            sessionStartedAt: null,
            accumulatedElapsedMs: 0,
          });
        }
      },
    }),
    {
      name: "steps-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        todaySteps: state.todaySteps,
        todayDate: state.todayDate,
        history: state.history,
        accumulatedElapsedMs: state.accumulatedElapsedMs,
      }),
    },
  ),
);
