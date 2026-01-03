"use client";
import MainLayoutClient from "@/components/layout/main-layout-client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const isDemoFromUrl = searchParams.get("demo") === "true";

    if (isDemoFromUrl) localStorage.setItem("demo-mode", "true");
  }, [searchParams]);

  return <MainLayoutClient>{children}</MainLayoutClient>;
}
