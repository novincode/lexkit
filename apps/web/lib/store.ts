import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

interface AppStore {
  packageManager: PackageManager;
  setPackageManager: (manager: PackageManager) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      packageManager: "npm",
      setPackageManager: (manager) => set({ packageManager: manager }),
    }),
    {
      name: "lexkit-preferences",
    },
  ),
);
