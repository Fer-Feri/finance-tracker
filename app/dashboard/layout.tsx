import Sidebar from "@/components/layout/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finance Tracker Dashboard",
  description:
    "A modern finance tracking application with neon UI, Profile Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar ثابت برای تمام صفحات داشبورد */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex flex-auto flex-col lg:mr-64">
        {/* Header ثابت */}
        <header className="border-border bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur">
          <div className="flex h-16 items-center px-6">
            <h1 className="text-lg font-semibold">داشبورد مالی</h1>
          </div>
        </header>

        {/* محتوای متغیر (هر صفحه) */}
        <div className="mx-auto w-full flex-auto p-6">{children}</div>
      </main>
    </div>
  );
}
