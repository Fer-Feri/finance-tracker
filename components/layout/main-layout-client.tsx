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

  return (
    <div className="bg-background flex min-h-screen">
      {/* Sidebar ثابت دسکتاپ */}
      <Sidebar />

      {/* Sidebar کشویی موبایل (جدید) */}
      <MobileSidebar />

      {/* Main Content Area */}
      <main className="flex min-w-0 flex-auto flex-col transition-all duration-300 lg:mr-64">
        <DashboardHeader title="داشبورد" />

        <div className="mx-auto w-full min-w-0 flex-auto p-6">{children}</div>
      </main>
    </div>
  );
}
