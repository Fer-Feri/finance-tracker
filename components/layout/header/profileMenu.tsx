"use client";

import { useMenuProfileStore } from "@/store/useMenuProfileStore";
import { useRouter } from "next/navigation";
import { User, Settings, Lock, LogOut } from "lucide-react";
import Image from "next/image";
import { useClickOutside } from "@/hooks/useClickOutside";
import { motion, AnimatePresence } from "framer-motion";

const iconMap = {
  User,
  Settings,
  Lock,
  LogOut,
};

interface ProfileMenuProps {
  user: {
    name: string;
    email?: string;
    image?: string;
  };
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
  const { items, executeAction, isOpen, closeMenu } = useMenuProfileStore();
  const router = useRouter();

  // ✅ اصلاح ترتیب آرگومان‌ها: اول تابع بستن، بعد وضعیت باز بودن
  const menuRef = useClickOutside<HTMLDivElement>(closeMenu, isOpen);

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef} // ✅ اتصال Ref به دیو اصلی
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="border-border/50 bg-card absolute left-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl"
        >
          {/* 👤 بخش هدر (پروفایل کاربر) */}
          <div className="border-border/30 border-b px-4 py-4">
            <div className="flex items-center gap-3">
              {/* آواتار */}
              <div className="relative h-12 w-12 shrink-0">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="ring-primary/20 rounded-full object-cover ring-2"
                  />
                ) : (
                  <div className="from-primary/30 to-secondary/30 text-primary ring-primary/20 flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br text-base font-bold ring-2">
                    {getInitials(user.name)}
                  </div>
                )}
                {/* نقطه وضعیت آنلاین */}
                <span className="border-card bg-secondary absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)]" />
              </div>

              {/* اطلاعات کاربر */}
              <div className="flex-1 overflow-hidden">
                <p className="text-foreground truncate text-sm font-bold">
                  {user.name}
                </p>
                {user.email && (
                  <p className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 📋 بخش منوها */}
          <div className="py-2">
            {items.map((item, index) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              const isLogout = item.id === "logout";

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      executeAction(item.id);
                    } else {
                      router.push(item.href!);
                      closeMenu(); // بستن منو بعد از کلیک روی لینک
                    }
                  }}
                  className={`group relative flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isLogout
                      ? "text-destructive hover:bg-destructive/10"
                      : "text-foreground hover:bg-accent/50"
                  } ${index === 0 ? "rounded-t-lg" : ""} ${index === items.length - 1 ? "rounded-b-lg" : ""} `}
                >
                  {/* خط نئونی سمت راست */}
                  <span
                    className={`absolute top-1/2 right-0 h-0 w-1 -translate-y-1/2 rounded-r-full transition-all duration-300 group-hover:h-8 ${
                      isLogout
                        ? "bg-destructive shadow-[0_0_12px_rgba(255,100,100,0.8)]"
                        : "bg-primary shadow-[0_0_12px_rgba(var(--primary-rgb),0.8)]"
                    } `}
                  />

                  {/* آیکن */}
                  {Icon && (
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-all duration-200 group-hover:scale-110 ${
                        isLogout
                          ? "text-destructive"
                          : "text-muted-foreground group-hover:text-primary"
                      } `}
                    />
                  )}

                  {/* متن */}
                  <span className="flex-1 text-right">{item.label}</span>

                  {/* افکت درخشش هاور */}
                  <span className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:shadow-[inset_0_0_20px_rgba(var(--primary-rgb),0.1)]" />
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
