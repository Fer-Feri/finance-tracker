// app/dashboard/layout.tsx (یا هر مسیری که هستید)
import { Metadata } from "next";
import MainLayoutClient from "@/components/layout/main-layout-client";

export const metadata: Metadata = {
  title: "Finance Tracker Dashboard",
  description: "A modern finance tracking application",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayoutClient>{children}</MainLayoutClient>;
}
