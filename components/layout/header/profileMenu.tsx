"use client";

/* ===================== Imports ===================== */
import { User, Settings, Lock, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useMemo } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useUser } from "@/context/user-context";
import { useClerk } from "@clerk/nextjs";

/* ===================== Types ===================== */
interface ProfileMenuProps {
  user: {
    name: string;
    email?: string;
    image?: string;
  };
  isGuest: boolean;
  setIsOpenMenuProfile: (open: boolean) => void;
}

type MenuItem =
  | {
      id: string;
      label: string;
      icon: keyof typeof iconMap;
      type: "link";
      href: string;
      disabled?: boolean;
    }
  | {
      id: string;
      label: string;
      icon: keyof typeof iconMap;
      type: "action";
      danger?: boolean;
      onClick: () => void;
    };

/* ===================== Icon Map ===================== */
const iconMap = {
  User,
  Settings,
  Lock,
  LogOut,
};

/* ===================================================
   Profile Menu Component
=================================================== */
export default function ProfileMenu({
  user,
  isGuest,
  setIsOpenMenuProfile,
}: ProfileMenuProps) {
  /* ---------- Refs ---------- */
  const refElem = useRef<HTMLDivElement | null>(null);

  /* ---------- Context / Clerk ---------- */
  const { exitDemo } = useUser();
  const { signOut } = useClerk();

  /* ---------- Close on outside click ---------- */
  useClickOutside(refElem, () => setIsOpenMenuProfile(false));

  /* ---------- Menu Items (Demo-aware) ---------- */
  const items: MenuItem[] = useMemo(
    () => [
      {
        id: "settings",
        label: "تنظیمات",
        icon: "Settings",
        type: "link",
        href: "/dashboard/settings",
        disabled: false,
      },
      {
        id: "logout",
        label: isGuest ? "خروج از دمو" : "خروج از حساب",
        icon: "LogOut",
        type: "action",
        danger: true,
        onClick: () => {
          setIsOpenMenuProfile(false);

          if (isGuest) {
            exitDemo();
          } else {
            signOut();
          }
        },
      },
    ],
    [isGuest, exitDemo, signOut, setIsOpenMenuProfile],
  );

  return (
    <AnimatePresence>
      <motion.div
        ref={refElem}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="border-border/50 bg-card absolute left-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl"
      >
        {/* ================= Header ================= */}
        <div className="border-border/30 border-b px-4 py-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative h-10 w-10 shrink-0">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="ring-primary/20 h-10 w-10 rounded-full object-cover ring-2"
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
              <span className="border-card bg-secondary absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)]" />
            </div>

            {/* User Info */}
            <div className="flex-1 overflow-hidden">
              <p className="text-foreground truncate text-sm font-bold">
                {user.name}
                {isGuest && (
                  <span className="ml-1 text-xs opacity-60">(Demo)</span>
                )}
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
            const Icon = iconMap[item.icon];
            const isDanger = "danger" in item && item.danger;

            if (item.type === "link") {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsOpenMenuProfile(false)}
                  className="group relative flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all"
                >
                  <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="flex-1 text-right">{item.label}</span>
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className="group relative flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all"
              >
                <span
                  className={`absolute top-1/2 right-0 h-0 w-1 -translate-y-1/2 rounded-r-full transition-all group-hover:h-8 ${
                    isDanger ? "bg-red-600" : "bg-primary"
                  }`}
                />
                <Icon
                  className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                    isDanger ? "text-red-600" : ""
                  }`}
                />
                <span
                  className={`flex-1 text-right ${
                    isDanger ? "text-red-500" : ""
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
