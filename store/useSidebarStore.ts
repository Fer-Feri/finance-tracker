import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarStore {
  // وضعیت موبایل
  isMobileOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;

  // وضعیت منوهای تاشو (Collapsible)
  expandedMenus: string[];
  toggleSubmenu: (id: string) => void;
  setExpandedMenus: (ids: string[]) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      // --- Mobile State ---
      isMobileOpen: false,
      toggleMobileMenu: () =>
        set((state) => ({ isMobileOpen: !state.isMobileOpen })),
      closeMobileMenu: () => set({ isMobileOpen: false }),

      // --- Collapsible Menus State ---
      expandedMenus: [],
      toggleSubmenu: (id) =>
        set((state) => {
          const isOpen = state.expandedMenus.includes(id);
          return {
            expandedMenus: isOpen
              ? state.expandedMenus.filter((item) => item !== id) // بستن
              : [...state.expandedMenus, id], // باز کردن
          };
        }),
      setExpandedMenus: (ids) => set({ expandedMenus: ids }),
    }),
    {
      name: "sidebar-storage", // اسم کلید در LocalStorage
      partialize: (state) => ({ expandedMenus: state.expandedMenus }), // فقط وضعیت منوها رو ذخیره کن، موبایل رو نه
    },
  ),
);
