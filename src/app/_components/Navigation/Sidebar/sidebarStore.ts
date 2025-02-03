import { create } from "zustand";

type SidebarState = {
  totalSpent: number | string;
  setTotalSpent: (value: number | string) => void;
};

const useSidebarStore = create<SidebarState>((set) => ({
  totalSpent: 0,
  setTotalSpent: (value: number | string) => set(() => ({ totalSpent: value }))
}));

export default useSidebarStore;
