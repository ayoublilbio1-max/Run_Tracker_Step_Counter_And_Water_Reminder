import { create } from "zustand";

type StepsState = {
  todaySteps: number;
  isRunning: boolean;
  sessionStartedAt: number | null;
  accumulatedElapsedMs: number;
  start: () => void;
  pause: () => void;
  turnOff: () => void;
  reset: () => void;
  getElapsedMs: () => number;
};

let simulationInterval: ReturnType<typeof setInterval> | null = null;

function clearSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
}

export const useStepsStore = create<StepsState>((set, get) => ({
  todaySteps: 0,
  isRunning: false,
  sessionStartedAt: null,
  accumulatedElapsedMs: 0,
  start: () => {
    if (get().isRunning) return;
    set({ isRunning: true, sessionStartedAt: Date.now() });
    clearSimulation();
    simulationInterval = setInterval(() => {
      const increment = Math.floor(Math.random() * 4) + 2; // 2–5 simulated steps per tick
      set((state) => ({ todaySteps: state.todaySteps + increment }));
    }, 1500);
  },
  pause: () => {
    const { isRunning, sessionStartedAt, accumulatedElapsedMs } = get();
    if (!isRunning || sessionStartedAt === null) return;
    clearSimulation();
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
    clearSimulation();
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
}));
