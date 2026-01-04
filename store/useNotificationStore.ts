import { create } from "zustand";

export interface UserNotificationType {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotoficationStoreType {
  notifications: UserNotificationType[];
  unreadCount: number;

  setNotification: (items: UserNotificationType[]) => void;
  addNotification: (item: UserNotificationType) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotoficationStoreType>((set) => ({
  notifications: [],
  unreadCount: 1,

  // 🔄 جایگزینی کامل لیست
  setNotification: (items) =>
    set({
      notifications: items,
      unreadCount: items.filter((n) => !n.isRead).length,
    }),

  // ➕ اضافه کردن اعلان جدید
  addNotification: (item) =>
    set((state) => {
      // ✅ جلوگیری از تکرار
      const exists = state.notifications.some((n) => n.id === item.id);
      if (exists) return state;

      const notifications = [item, ...state.notifications];
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      };
    }),

  // ✅ خوانده‌شدن یک اعلان
  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      );

      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      };
    }),

  // ✅ خوانده‌شدن همه
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
}));
