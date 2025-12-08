import { Bell, Search } from "lucide-react";
import Image from "next/image";

interface UserProfile {
  name: string;
  image?: string; // اختیاری: شاید کاربر عکس نداشته باشد
}

interface HeaderLeftProps {
  notificationCount: number;
  user: UserProfile;
}

export default function HeaderLeft({
  notificationCount,
  user,
}: HeaderLeftProps) {
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
      {/* دکمه جستجو */}
      <button
        type="button"
        className="hover:bg-accent hover:text-accent-foreground text-muted-foreground focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors focus-visible:ring-1 focus-visible:outline-none"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* دکمه اعلانات */}
      <button
        type="button"
        className="hover:bg-accent hover:text-accent-foreground text-muted-foreground focus-visible:ring-ring relative inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors focus-visible:ring-1 focus-visible:outline-none"
      >
        <Bell className="h-5 w-5" />
        {notificationCount > 0 && (
          <span className="bg-destructive ring-background absolute top-2 right-2 h-2 w-2 rounded-full ring-2" />
        )}
      </button>

      {/* خط جداکننده کوچک (اختیاری برای زیبایی) */}
      <div className="bg-border mx-1 h-6 w-[1px]"></div>

      {/* دکمه پروفایل / آواتار */}
      <button
        type="button"
        className="ring-border focus-visible:ring-ring relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-sm font-medium">
            {getInitials(user.name)}
          </div>
        )}
      </button>
    </div>
  );
}
