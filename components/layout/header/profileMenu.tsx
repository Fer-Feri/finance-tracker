"use client";

/* ===================== Imports ===================== */
import { User, Settings, Lock, LogOut } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

/* ===================== Menu Items ===================== */
const items = [
  {
    id: "profile",
    label: "پروفایل",
    icon: "User",
    href: "/dashboard/profile",
  },
  {
    id: "settings",
    label: "تنظیمات",
    icon: "Settings",
    href: "/dashboard/settings",
  },
  {
    id: "change-password",
    label: "تغییر رمز",
    icon: "Lock",
    href: "/dashboard/password",
  },
  {
    id: "logout",
    label: "خروج از حساب",
    icon: "LogOut",
    action: () => console.log("Logging out..."),
  },
];

/* ===================== Icon Map ===================== */
const iconMap = {
  User,
  Settings,
  Lock,
  LogOut,
};

/* ===================== Types ===================== */
interface ProfileMenuProps {
  user: {
    name: string;
    email?: string;
    image?: string;
  };
  setIsOpenMenuProfile: (open: boolean) => void;
}

/* ===================================================
   Profile Menu Component
=================================================== */
export default function ProfileMenu({
  user,
  setIsOpenMenuProfile,
}: ProfileMenuProps) {
  /* ---------- Ref (Menu Container) ---------- */
  const refElem = useRef<HTMLDivElement | null>(null);

  /* ---------- Close Menu on Outside Click ---------- */
  useClickOutside(refElem, () => setIsOpenMenuProfile(false));

  return (
    <AnimatePresence>
      {/* ================= Dropdown Container ================= */}
      <motion.div
        ref={refElem}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="border-border/50 bg-card absolute left-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl"
      >
        {/* ================= Header (User Info) ================= */}
        <div className="border-border/30 border-b px-4 py-4">
          <div className="flex items-center gap-3">
            {/* ---------- Avatar ---------- */}
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
                  {user.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              )}

              {/* ---------- Online Status Indicator ---------- */}
              <span className="border-card bg-secondary absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)]" />
            </div>

            {/* ---------- User Details ---------- */}
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

        {/* ================= Menu Items ================= */}
        <div className="py-2">
          {items.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isLogoutBtn = item.id === "logout";

            return (
              <button
                key={item.id}
                onClick={() => setIsOpenMenuProfile(false)}
                className="group relative flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200"
              >
                {/* ---------- Neon Side Indicator ---------- */}
                <span
                  className={`absolute top-1/2 right-0 h-0 w-1 -translate-y-1/2 rounded-r-full transition-all duration-300 group-hover:h-8 ${
                    isLogoutBtn ? "bg-red-600" : "bg-primary"
                  }`}
                />

                {/* ---------- Icon ---------- */}
                {Icon && (
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-all duration-200 group-hover:scale-110 ${
                      isLogoutBtn ? "text-red-600" : ""
                    }`}
                  />
                )}

                {/* ---------- Label ---------- */}
                <span
                  className={`flex-1 text-right ${
                    isLogoutBtn ? "text-red-500" : ""
                  }`}
                >
                  {item.label}
                </span>

                {/* ---------- Hover Glow Effect ---------- */}
                <span
                  className={`pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                    isLogoutBtn
                      ? "group-hover:bg-red-600/10"
                      : "group-hover:bg-secondary/10"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
