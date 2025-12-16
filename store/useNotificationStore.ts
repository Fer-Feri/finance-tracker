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

// import { create } from "zustand";

// // ✉️ نوع اعلان اصلی
// export interface Notification {
//   id: string;
//   title: string;
//   message?: string;
//   read: boolean;
//   createdAt?: Date;
//   type?: "info" | "success" | "warning" | "error";
// }

// // 🧠 State و Actions
// interface NotificationState {
//   notifications: Notification[];
//   unreadCount: number;
//   isMenuOpen: boolean;
//   toggleMenu: () => void;
//   closeMenu: () => void;
//   setNotifications: (n: Notification[]) => void;
//   addNotification: (n: Omit<Notification, "id" | "createdAt" | "read">) => void;
//   markAsRead: (id: string) => void;
//   markAllAsRead: () => void;
//   clearAll: () => void;
// }

// // 🧩 تعریف Store
// export const useNotificationStore = create<NotificationState>((set, get) => ({
//   notifications: [],
//   unreadCount: 3,
//   isMenuOpen: false,

//   toggleMenu: () => set((s) => ({ isMenuOpen: !s.isMenuOpen })),

//   closeMenu: () => set({ isMenuOpen: false }),

//   clearAll: () => set({ notifications: [], unreadCount: 0 }),

//   setNotifications: (list) =>
//     set({
//       notifications: list,
//       unreadCount: list.filter((n) => !n.read).length,
//     }),

//   addNotification: (data) => {
//     const newItem: Notification = {
//       id: crypto.randomUUID(),
//       createdAt: new Date(),
//       read: false,
//       ...data,
//     };
//     const newList = [newItem, ...get().notifications];
//     set({
//       notifications: newList,
//       unreadCount: newList.filter((n) => !n.read).length,
//     });
//   },

//   markAsRead: (id) => {
//     const newList = get().notifications.map((item) =>
//       item.id === id ? { ...item, read: true } : item,
//     );
//     set({
//       notifications: newList,
//       unreadCount: newList.filter((n) => !n.read).length,
//     });
//   },

//   markAllAsRead: () => {
//     const newList = get().notifications.map((item) => ({
//       ...item,
//       read: true,
//     }));
//     set({ notifications: newList, unreadCount: 0 });
//   },
// }));
