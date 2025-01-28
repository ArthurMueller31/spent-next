import { create } from "zustand";

type SidebarState = {
  totalSpent: number;
  setTotalSpent: (value: number) => void;
};

const useSidebarStore = create<SidebarState>((set) => ({
  totalSpent: 0,
  setTotalSpent: (value: number) => set(() => ({ totalSpent: value }))
}));

export default useSidebarStore;
