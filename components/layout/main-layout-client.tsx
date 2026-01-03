"use client";

import Sidebar from "@/components/layout/sidebar/sidebar";
import MobileSidebar from "@/components/layout/sidebar/mobile-sidebar";
import DashboardHeader from "./header/header";
import { usePathname } from "next/navigation";
import { getPageTitle } from "@/config/page-titles";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const pageTitle = getPageTitle(pathname);

  const { exitDemo, isGuest, userId, isLoaded, user } = useUser();

  const handleExitDemo = () => {
    exitDemo();
  };

  useEffect(() => {
    // فقط وقتی isLoaded باشه تصمیم بگیر
    if (isLoaded) {
      if (!userId && !isGuest) {
        router.replace("/");
      }
    }
  }, [isGuest, userId, router, isLoaded]);

  useEffect(() => {
    async function syncUser() {
      if (isLoaded && user) {
        // فقط کاربر واقعی
        await fetch("/api/users/sync", { method: "POST" });
      }
    }
    syncUser();
  }, [isLoaded, user]);

  if (!userId && !isGuest) return null;

  return (
    <div className="bg-background flex min-h-screen">
      <Sidebar />
      <MobileSidebar />
      {/* Main Content Area */}
      <main className="flex min-w-0 flex-auto flex-col transition-all duration-300 lg:mr-64">
        <DashboardHeader title={pageTitle} />

        <div className="mx-auto w-full min-w-0 flex-auto p-6">
          {isGuest && (
            <>
              <div className="fixed bottom-10 left-4 z-50 rounded-full bg-yellow-500 px-3 py-1 text-xs font-medium text-black">
                <div className="relative h-full w-full">
                  <span>Demo Mode</span>
                  <span
                    onClick={handleExitDemo}
                    className="absolute right-0 bottom-full flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-600 font-bold text-gray-300"
                  >
                    X
                  </span>
                </div>
              </div>
            </>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
