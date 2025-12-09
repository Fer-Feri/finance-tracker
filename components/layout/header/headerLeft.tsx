"use client";

import { Bell, Search } from "lucide-react";
import Image from "next/image";
import NotificationMenu from "./notificationMenu";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useMenuProfileStore } from "@/store/useMenuProfileStore";
import ProfileMenu from "./profileMenu";

interface UserProfile {
  name: string;
  email?: string;
  image?: string;
}

interface HeaderLeftProps {
  user: UserProfile;
}

export default function HeaderLeft({ user }: HeaderLeftProps) {
  const { toggleMenu, isMenuOpen, unreadCount } = useNotificationStore();
  const { isOpen: isOpenProfile, toggleMenu: toggleMenuProfile } =
    useMenuProfileStore();

  // تابع کمکی برای گرفتن حروف اول اسم
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-2">
      {/* ------------------------------------ */}
      {/* ------------------------------------ */}
      {/* ------------------------------------ */}
      {/* دکمه جستجو */}
      <button
        type="button"
        className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors focus-visible:ring-1 focus-visible:outline-none"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* ------------------------------------ */}
      {/* ------------------------------------ */}
      {/* ------------------------------------ */}
      {/* ✅ منوی اعلانات را داخل div قرار دهید */}
      <div className="relative">
        <button
          type="button"
          onClick={toggleMenu}
          className="group text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring relative inline-flex h-9 w-9 items-center justify-center rounded-md transition-all duration-200 focus-visible:ring-1 focus-visible:outline-none"
        >
          <Bell className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />

          {/* نقطه قرمز اعلان‌های خوانده نشده */}
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center">
              <span className="bg-destructive absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span className="bg-destructive relative inline-flex h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
            </span>
          )}
        </button>

        {/* ✅ منو بیرون از button */}
        {isMenuOpen && <NotificationMenu />}
      </div>

      {/* ------------------------------------ */}
      {/* ------------------------------------ */}
      {/* ------------------------------------ */}
      {/* خط جداکننده */}
      <div className="bg-border mx-1 h-6 w-[1px]"></div>

      {/* دکمه پروفایل / آواتار */}
      <div className="relative">
        <button
          type="button"
          onClick={toggleMenuProfile}
          className="group ring-border hover:ring-primary/50 focus-visible:ring-ring relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 transition-all duration-200 hover:ring-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={36}
              height={36}
              className="aspect-square h-full w-full object-cover"
            />
          ) : (
            <div className="from-primary/20 to-secondary/20 text-primary group-hover:from-primary/30 group-hover:to-secondary/30 flex h-full w-full items-center justify-center bg-gradient-to-br text-sm font-medium transition-all duration-200">
              {getInitials(user.name)}
            </div>
          )}

          {/* حلقه نئونی هاور */}
          <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_12px_rgba(var(--primary-rgb),0.6)]" />
        </button>

        {/* Profile Menu */}
        {isOpenProfile && <ProfileMenu user={user} />}
      </div>
    </div>
  );
}
