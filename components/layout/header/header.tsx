"use client";

import HeaderRight from "./headerRight";
import HeaderLeft from "./headerLeft";
import { UserProfile } from "@/types/user-profile";
interface DashboardLayoutProps {
  title?: string;
  onMenuClick: () => void;
}

export default function DashboardHeader({
  title = "داشبورد",
}: DashboardLayoutProps) {
  // ------------------------------------
  const user: UserProfile = {
    name: "Farshad Bahari",
  };

  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 z-40 w-full border-b backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-6">
        {/* Right Side: Menu Button (Mobile) + Title */}
        <HeaderRight title={title} />
        {/* Left Side: Actions */}
        <HeaderLeft user={user} />
      </div>
    </header>
  );
}
