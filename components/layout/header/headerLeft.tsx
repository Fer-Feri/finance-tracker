"use client";

import { HeaderLeftProps } from "@/types/user-profile";
import { ThemeToggle } from "../theme-toggle/theme-toggle";
import Notification from "./notification";
import Profile from "./profile";

export default function HeaderLeft({ user }: HeaderLeftProps) {
  return (
    <div className="flex items-center gap-2">
      {/* دکمه تم */}
      <ThemeToggle />

      {/* منوی اعلانات */}
      <Notification />

      {/* خط جداکننده */}
      <div className="bg-border mx-1 h-6 w-[1px]"></div>

      {/* دکمه پروفایل / آواتار */}
      <Profile user={user} />
    </div>
  );
}
