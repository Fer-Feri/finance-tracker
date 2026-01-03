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
  const queryClient = useQueryClient(); // ✅ اضافه شد

  // ✅ پاک کردن Cache هنگام تغییر userId
  const prevUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const currentUserId = demoFlag ? DEMO_USER_ID : clerk.user?.id || null;

    // اگر userId تغییر کرد، همه Queries رو Invalidate کن
    if (
      prevUserIdRef.current !== null &&
      prevUserIdRef.current !== currentUserId
    ) {
      queryClient.invalidateQueries(); // پاک کردن همه Cache ها
      queryClient.clear(); // حذف کامل (اختیاری، برای اطمینان بیشتر)
    }

    prevUserIdRef.current = currentUserId;
  }, [demoFlag, clerk.user?.id, queryClient]);

  // گوش دادن به تغییرات localStorage از تب‌های دیگر
  useEffect(() => {
    const handleStorageChange = () => {
      setDemoFlag(isDemoEnabled());
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
    router.push("/dashboard");
  }, [router]);

  const exitDemo = useCallback(() => {
    localStorage.removeItem("demo");
    setDemoFlag(false);
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
