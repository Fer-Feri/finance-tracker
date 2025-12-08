"use client";

import { useState } from "react";
import HeaderRight from "./headerRight";
import HeaderLeft from "./headerLeft";
interface DashboardLayoutProps {
  title?: string;
  onMenuClick: () => void;
}

export default function DashboardHeader({
  title = "داشبورد",
  onMenuClick,
}: DashboardLayoutProps) {
  const [notificationCount] = useState(3);

  // اطلاعات کاربر (بعداً از دیتابیس یا Auth Context می‌آید)
  const user = {
    name: "farshad bahari",
  };

  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-6">
        {/* Right Side: Menu Button (Mobile) + Title */}
        <HeaderRight title={title} onMenuClick={onMenuClick} />
        {/* Left Side: Actions */}
        <HeaderLeft notificationCount={notificationCount} user={user} />
      </div>
    </header>
  );
}
