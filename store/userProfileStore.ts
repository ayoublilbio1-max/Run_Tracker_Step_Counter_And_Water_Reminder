import { create } from "zustand";

export type Gender = "male" | "female";
export type WeightUnit = "kg" | "lbs";
export type HeightUnit = "cm" | "ft";

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
}));
