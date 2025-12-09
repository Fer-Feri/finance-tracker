import { create } from "zustand";

export interface ProfileMenuItem {
  id: string;
  label: string;
  icon?: string; // مثلاً نام آیکون از Lucide یا HeroIcons
  href?: string; // اگر لینک مستقیم است
  action?: () => void; // یا تابع داخلی برای عملیات
}

interface MenuProfileState {
  isOpen: boolean;
  items: ProfileMenuItem[];
  toggleMenu: () => void;
  closeMenu: () => void;
  setItems: (items: ProfileMenuItem[]) => void;
  executeAction: (id: string) => void;
}

/**
 * Zustand store for managing Profile Menu
 */
export const useMenuProfileStore = create<MenuProfileState>((set, get) => ({
  isOpen: false,
  items: [
    {
      id: "profile",
      label: "پروفایل",
      icon: "User",
      href: "/dashboard/profile",
    },
    {
      id: "settings",
      label: "تنظیمات",
      icon: "Settings",
      href: "/dashboard/settings",
    },
    {
      id: "change-password",
      label: "تغییر رمز",
      icon: "Lock",
      href: "/dashboard/password",
    },
    {
      id: "logout",
      label: "خروج از حساب",
      icon: "LogOut",
      action: () => console.log("Logging out..."),
    },
  ],

  toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),

  closeMenu: () => set({ isOpen: false }),

  setItems: (items) => set({ items }),

  executeAction: (id) => {
    const item = get().items.find((i) => i.id === id);
    if (item?.action) item.action();
  },
}));
