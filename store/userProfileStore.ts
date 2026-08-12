import { create } from "zustand";

export type Gender = "male" | "female";
export type WeightUnit = "kg" | "lbs";
export type HeightUnit = "cm" | "ft";
export type GoalType = "walking" | "run";
export type DistanceUnit = "km" | "mi";

type UserProfileState = {
  gender: Gender;
  setGender: (gender: Gender) => void;
  weightKg: number;
  weightUnit: WeightUnit;
  setWeightKg: (weightKg: number) => void;
  setWeightUnit: (unit: WeightUnit) => void;
  heightCm: number;
  heightUnit: HeightUnit;
  setHeightCm: (heightCm: number) => void;
  setHeightUnit: (unit: HeightUnit) => void;
  goalType: GoalType;
  setGoalType: (type: GoalType) => void;
  dailyStepGoal: number;
  setDailyStepGoal: (steps: number) => void;
  runDistanceMeters: number;
  setRunDistanceMeters: (meters: number) => void;
  distanceUnit: DistanceUnit;
  setDistanceUnit: (unit: DistanceUnit) => void;
};

export const useUserProfileStore = create<UserProfileState>((set) => ({
  gender: "male",
  setGender: (gender) => set({ gender }),
  weightKg: 70,
  weightUnit: "kg",
  setWeightKg: (weightKg) => set({ weightKg }),
  setWeightUnit: (unit) => set({ weightUnit: unit }),
  heightCm: 170,
  heightUnit: "cm",
  setHeightCm: (heightCm) => set({ heightCm }),
  setHeightUnit: (unit) => set({ heightUnit: unit }),
  goalType: "walking",
  setGoalType: (type) => set({ goalType: type }),
  dailyStepGoal: 10000,
  setDailyStepGoal: (steps) => set({ dailyStepGoal: steps }),
  runDistanceMeters: 5000,
  setRunDistanceMeters: (meters) => set({ runDistanceMeters: meters }),
  distanceUnit: "km",
  setDistanceUnit: (unit) => set({ distanceUnit: unit }),
}));
