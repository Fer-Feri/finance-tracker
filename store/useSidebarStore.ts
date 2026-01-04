import { create } from "zustand";

interface SidebarState {
  // mobile sidebar
  isMobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;

  // desktop / nested menus
  expandedMenus: string[];
  setExpandedMenus: (menus: string[]) => void;
  toggleMenu: (id: string) => void;
  resetExpandedMenus: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  // ===== Mobile =====
  isMobileOpen: false,
  openMobile: () => set({ isMobileOpen: true }),
  closeMobile: () => set({ isMobileOpen: false }),

  // ===== Nested menus =====
  expandedMenus: [],

  setExpandedMenus: (menus) => set({ expandedMenus: menus }),

  toggleMenu: (id) =>
    set((state) => ({
      expandedMenus: state.expandedMenus.includes(id)
        ? state.expandedMenus.filter((menuId) => menuId !== id)
        : [...state.expandedMenus, id],
    })),

  resetExpandedMenus: () => set({ expandedMenus: [] }),
}));
