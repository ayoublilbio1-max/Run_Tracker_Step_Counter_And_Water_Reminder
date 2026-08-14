import { create } from "zustand";
import { GeoPoint } from "../utils/runTracking";

export type RunStatus = "idle" | "running" | "paused" | "finished";

type RunSessionState = {
  status: RunStatus;
  route: GeoPoint[];
  distanceMeters: number;
  kcal: number;
  elapsedMs: number;
  lastMovementAt: number | null;
  intensitySeconds: { low: number; moderate: number; high: number };
  start: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  finish: () => void;
  addPoint: (
    point: GeoPoint,
    addedDistance: number,
    intensity: "low" | "moderate" | "high",
    deltaSeconds: number,
    kcalDelta: number,
  ) => void;
};

let tickInterval: ReturnType<typeof setInterval> | null = null;

function clearTick() {
  if (tickInterval) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
}

function startTick(
  set: (fn: (state: RunSessionState) => Partial<RunSessionState>) => void,
) {
  clearTick();
  tickInterval = setInterval(() => {
    set((state) => ({ elapsedMs: state.elapsedMs + 1000 }));
  }, 1000);
}

export const useRunSessionStore = create<RunSessionState>((set, get) => ({
  status: "idle",
  route: [],
  distanceMeters: 0,
  kcal: 0,
  elapsedMs: 0,
  lastMovementAt: null,
  intensitySeconds: { low: 0, moderate: 0, high: 0 },
  start: () => {
    set({
      status: "running",
      route: [],
      distanceMeters: 0,
      kcal: 0,
      elapsedMs: 0,
      lastMovementAt: Date.now(),
      intensitySeconds: { low: 0, moderate: 0, high: 0 },
    });
    startTick(set);
  },
  pause: () => {
    clearTick();
    set({ status: "paused" });
  },
  resume: () => {
    set({ status: "running", lastMovementAt: Date.now() });
    startTick(set);
  },
  restart: () => {
    set({
      status: "running",
      route: [],
      distanceMeters: 0,
      kcal: 0,
      elapsedMs: 0,
      lastMovementAt: Date.now(),
      intensitySeconds: { low: 0, moderate: 0, high: 0 },
    });
    startTick(set);
  },
  finish: () => {
    clearTick();
    set({ status: "finished" });
  },
  addPoint: (point, addedDistance, intensity, deltaSeconds, kcalDelta) =>
    set((state) => ({
      route: [...state.route, point],
      distanceMeters: state.distanceMeters + addedDistance,
      kcal: state.kcal + kcalDelta,
      lastMovementAt: Date.now(),
      intensitySeconds: {
        ...state.intensitySeconds,
        [intensity]: state.intensitySeconds[intensity] + deltaSeconds,
      },
    })),
}));
