import { create } from "zustand";
import type { TrainingFilters } from "@/types";

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  filters: TrainingFilters;
  setFilters: (f: Partial<TrainingFilters>) => void;
  resetFilters: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebar: (open) => set({ sidebarOpen: open }),
  filters: {},
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  resetFilters: () => set({ filters: {} }),
}));
