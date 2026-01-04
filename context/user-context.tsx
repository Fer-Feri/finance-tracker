"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import type { UserResource } from "@clerk/types";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useNotificationStore } from "@/store/useNotificationStore"; // ✅ اضافه شد

type ClerkUser = UserResource;

const DEMO_USER_ID = "guest-preview";

type DemoUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type AppUser = ClerkUser | DemoUser | null;

type UserState = {
  userId: string | null;
  isGuest: boolean;
  isLoaded: boolean;
  user: AppUser;
};

type UserContextValue = UserState & {
  enterDemo: () => void;
  exitDemo: () => void;
  getDisplayName: () => string;
  getUserEmail: () => string;
};

const UserContext = createContext<UserContextValue | null>(null);

function isDemoEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("demo") === "true";
}

export function UserContextProvider({ children }: { children: ReactNode }) {
  const clerk = useClerkUser();
  const [demoFlag, setDemoFlag] = useState(() => isDemoEnabled());
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addNotification, notifications } = useNotificationStore(); // ✅ اضافه شد

  // ✅ پاک کردن Cache هنگام تغییر userId
  const prevUserIdRef = useRef<string | null>(null);
  const hasShownWelcomeRef = useRef(false); // ✅ برای جلوگیری از تکرار

  // ✅ تابع نمایش پیام خوش‌آمد
  const showWelcomeNotification = useCallback(() => {
    // جلوگیری از نمایش مجدد
    if (hasShownWelcomeRef.current) return;

    // بررسی: آیا قبلاً پیام خوش‌آمد وجود دارد؟
    const hasWelcome = notifications.some((n) => n.id === "welcome-message");
    if (hasWelcome) return;

    hasShownWelcomeRef.current = true;

    // ایجاد پیام براساس نوع کاربر
    const welcomeMessage = demoFlag
      ? {
          id: "welcome-demo",
          title: "🎉 خوش آمدید به حالت دمو!",
          message:
            "شما در حال استفاده از نسخه آزمایشی هستید. برای ذخیره‌سازی دائم، لطفاً ثبت‌نام کنید.",
          isRead: false,
          createdAt: new Date().toISOString(),
        }
      : {
          id: "welcome-user",
          title: "👋 خوش آمدید!",
          message:
            "به سیستم مدیریت مالی خود خوش آمدید. برای شروع، اولین تراکنش خود را ثبت کنید.",
          isRead: false,
          createdAt: new Date().toISOString(),
        };

    // نمایش با تأخیر برای UX بهتر
    setTimeout(() => {
      addNotification(welcomeMessage);
    }, 1500);
  }, [demoFlag, notifications, addNotification]);

  // ✅ نمایش پیام خوش‌آمد (فقط یکبار بعد از لود شدن)
  useEffect(() => {
    const currentUserId = demoFlag ? DEMO_USER_ID : clerk.user?.id || null;

    // فقط وقتی userId معتبر باشه
    if (currentUserId && clerk.isLoaded) {
      showWelcomeNotification();
    }
  }, [clerk.isLoaded, clerk.user?.id, demoFlag, showWelcomeNotification]);

  // ✅ پاک کردن Cache و Reset هنگام تغییر کاربر
  useEffect(() => {
    const currentUserId = demoFlag ? DEMO_USER_ID : clerk.user?.id || null;

    // اگر userId تغییر کرد
    if (
      prevUserIdRef.current !== null &&
      prevUserIdRef.current !== currentUserId
    ) {
      // پاک کردن Cache
      queryClient.invalidateQueries();
      queryClient.clear();

      // ریست کردن flag برای نمایش پیام جدید
      hasShownWelcomeRef.current = false;
    }

    prevUserIdRef.current = currentUserId;
  }, [demoFlag, clerk.user?.id, queryClient]);

  // گوش دادن به تغییرات localStorage از تب‌های دیگر
  useEffect(() => {
    const handleStorageChange = () => {
      setDemoFlag(isDemoEnabled());
      // ریست flag برای نمایش پیام جدید بعد از تغییر حالت
      hasShownWelcomeRef.current = false;
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const userState: UserState = useMemo(() => {
    if (demoFlag) {
      const demoUser: DemoUser = {
        id: DEMO_USER_ID,
        name: "کاربر دمو",
        email: "guest-user@email.com",
        image: null,
      };
      return {
        userId: DEMO_USER_ID,
        isGuest: true,
        isLoaded: true,
        user: demoUser,
      };
    }

    if (clerk.isLoaded && clerk.user) {
      return {
        userId: clerk.user.id,
        isGuest: false,
        isLoaded: clerk.isLoaded,
        user: clerk.user,
      };
    }

    return {
      userId: null,
      isGuest: false,
      isLoaded: clerk.isLoaded,
      user: null,
    };
  }, [clerk.isLoaded, clerk.user, demoFlag]);

  const getDisplayName = useCallback((): string => {
    const { user } = userState;
    if (!user) return "کاربر دمو";

    if ("firstName" in user) {
      const firstName = user.firstName || "";
      const lastName = user.lastName || "";
      return `${firstName} ${lastName}`.trim() || user.username || "";
    }

    return user.name;
  }, [userState]);

  const getUserEmail = useCallback((): string => {
    const { user } = userState;
    if (!user) return "";

    if ("emailAddresses" in user) {
      return (
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress ||
        ""
      );
    }
    return user.email;
  }, [userState]);

  const enterDemo = useCallback(() => {
    localStorage.setItem("demo", "true");
    setDemoFlag(true);
    hasShownWelcomeRef.current = false; // ✅ ریست برای نمایش پیام دمو
    router.push("/dashboard");
  }, [router]);

  const exitDemo = useCallback(() => {
    localStorage.removeItem("demo");
    setDemoFlag(false);
    hasShownWelcomeRef.current = false; // ✅ ریست برای نمایش پیام واقعی
    router.push("/");
  }, [router]);

  const value: UserContextValue = useMemo(
    () => ({
      ...userState,
      enterDemo,
      exitDemo,
      getDisplayName,
      getUserEmail,
    }),
    [userState, enterDemo, exitDemo, getDisplayName, getUserEmail],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within UserContextProvider");
  }
  return ctx;
}
