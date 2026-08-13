import { create } from "zustand";
import { GeoPoint } from "../utils/runTracking";

export type RunStatus = "idle" | "running" | "paused" | "finished";

type RunSessionState = {
  status: RunStatus;
  route: GeoPoint[];
  distanceMeters: number;
  startedAt: number | null;
  accumulatedElapsedMs: number;
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
  ) => void;
  getElapsedMs: () => number;
};

export const useRunSessionStore = create<RunSessionState>((set, get) => ({
  status: "idle",
  route: [],
  distanceMeters: 0,
  startedAt: null,
  accumulatedElapsedMs: 0,
  intensitySeconds: { low: 0, moderate: 0, high: 0 },
  start: () =>
    set({
      status: "running",
      startedAt: Date.now(),
      route: [],
      distanceMeters: 0,
      accumulatedElapsedMs: 0,
      intensitySeconds: { low: 0, moderate: 0, high: 0 },
    }),
  pause: () => {
    const { startedAt, accumulatedElapsedMs } = get();
    if (startedAt === null) return;
    set({
      status: "paused",
      accumulatedElapsedMs: accumulatedElapsedMs + (Date.now() - startedAt),
      startedAt: null,
    });
  },
  resume: () => set({ status: "running", startedAt: Date.now() }),
  restart: () =>
    set({
      status: "running",
      startedAt: Date.now(),
      route: [],
      distanceMeters: 0,
      accumulatedElapsedMs: 0,
      intensitySeconds: { low: 0, moderate: 0, high: 0 },
    }),
  finish: () => set({ status: "finished" }),
  addPoint: (point, addedDistance, intensity, deltaSeconds) =>
    set((state) => ({
      route: [...state.route, point],
      distanceMeters: state.distanceMeters + addedDistance,
      intensitySeconds: {
        ...state.intensitySeconds,
        [intensity]: state.intensitySeconds[intensity] + deltaSeconds,
      },
    })),
  getElapsedMs: () => {
    const { status, startedAt, accumulatedElapsedMs } = get();
    if (status === "running" && startedAt !== null) {
      return accumulatedElapsedMs + (Date.now() - startedAt);
    }
    return accumulatedElapsedMs;
  },
}));
