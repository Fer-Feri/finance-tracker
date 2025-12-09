"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Check, BellRing, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export default function NotificationMenu() {
  const { isMenuOpen, notifications, closeMenu, markAllAsRead, markAsRead } =
    useNotificationStore();

  // ✅ استفاده از هوک برای بستن منو با کلیک بیرون
  const menuRef = useClickOutside<HTMLDivElement>(closeMenu, isMenuOpen);

  // ✅ محاسبه تعداد اعلان‌های خوانده نشده
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="border-border/50 bg-card absolute top-full left-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl"
        >
          {/* ========== Header ========== */}
          <div className="border-border/30 from-primary/5 to-secondary/5 flex items-center justify-between border-b bg-gradient-to-r px-4 py-3">
            <div className="flex items-center gap-2">
              <BellRing className="text-primary h-4 w-4" />
              <span className="text-foreground text-sm font-bold">
                اعلان‌ها
              </span>
              {unreadCount > 0 && (
                <span className="bg-destructive text-destructive-foreground flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                  {unreadCount}
                </span>
              )}
            </div>

            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="group text-primary hover:text-primary/80 flex items-center gap-1.5 text-xs font-medium transition-all duration-200"
              >
                <Check className="h-3 w-3 transition-transform duration-200 group-hover:scale-110" />
                خواندن همه
              </button>
            )}
          </div>

          {/* ========== Body ========== */}
          <div className="custom-scrollbar max-h-[320px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="from-primary/20 to-secondary/20 mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br">
                  <BellRing className="text-primary h-8 w-8" />
                </div>
                <p className="text-muted-foreground text-sm font-medium">
                  هیچ اعلان جدیدی نداری
                </p>
                <p className="text-muted-foreground/60 mt-1 text-xs">
                  اعلان‌های جدید اینجا نمایش داده می‌شود
                </p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`group border-border/30 relative border-b transition-all duration-200 last:border-none ${
                    notification.read
                      ? "hover:bg-accent/20 bg-transparent"
                      : "bg-primary/5 hover:bg-primary/10"
                  } `}
                >
                  {/* خط نئونی سمت راست */}
                  {!notification.read && (
                    <span className="bg-primary absolute top-1/2 right-0 h-0 w-1 -translate-y-1/2 rounded-r-full shadow-[0_0_12px_rgba(var(--primary-rgb),0.8)] transition-all duration-300 group-hover:h-12" />
                  )}

                  <div className="px-4 py-3">
                    {/* Header */}
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <p
                        className={`text-sm leading-snug font-semibold ${
                          notification.read
                            ? "text-foreground/70"
                            : "text-primary"
                        }`}
                      >
                        {notification.title}
                      </p>

                      {/* زمان */}
                      {notification.createdAt && (
                        <span className="text-muted-foreground mt-0.5 shrink-0 text-[10px]">
                          {new Date(notification.createdAt).toLocaleTimeString(
                            "fa-IR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      )}
                    </div>

                    {/* Message */}
                    {notification.message && (
                      <p
                        className={`mb-2 line-clamp-2 text-xs leading-relaxed ${
                          notification.read
                            ? "text-muted-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {notification.message}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all duration-200 hover:shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]"
                        >
                          <Eye className="h-3 w-3" />
                          خواندم
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ========== Footer ========== */}
          {notifications.length > 0 && (
            <div className="border-border/30 from-primary/5 to-secondary/5 border-t bg-gradient-to-r px-4 py-2.5">
              <Link
                href="/dashboard/notifications"
                onClick={closeMenu}
                className="group text-foreground/70 hover:text-primary flex w-full items-center justify-center gap-2 py-1 text-xs font-medium transition-all duration-200"
              >
                <span>مشاهده تمام اعلان‌ها</span>
                <svg
                  className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
