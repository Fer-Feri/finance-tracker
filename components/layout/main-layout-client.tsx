// components/layout/main-layout-client.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar/sidebar";
import MobileSidebar from "@/components/layout/sidebar/mobile-sidebar";
import DashboardHeader from "./header/header";

export default function MainLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  // State برای باز/بسته بودن منوی موبایل
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-background flex min-h-screen">
      {/* Sidebar ثابت دسکتاپ */}
      <Sidebar />

      {/* Sidebar کشویی موبایل (جدید) */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex flex-auto flex-col transition-all duration-300 lg:mr-64">
        <DashboardHeader
          title="داشبورد"
          onMenuClick={() => setIsMobileMenuOpen(true)} // دکمه باز کردن
        />

        <div className="mx-auto w-full flex-auto p-6">{children}</div>
      </main>
    </div>
  );
}
