"use client";

import { useClickOutside } from "@/hooks/useClickOutside";
import { useNotificationStore } from "@/store/useNotificationStore";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing } from "lucide-react";
import { useRef } from "react";

interface NotificationMenuProps {
  isOpenNotification: boolean;
  setIsOpenNotification: (open: boolean) => void;
}

export default function NotificationMenu({
  isOpenNotification,
  setIsOpenNotification,
}: NotificationMenuProps) {
  const { unreadCount, notifications, markAsRead, markAllAsRead } =
    useNotificationStore();

  const refElem = useRef(null);

  useClickOutside(refElem, () => setIsOpenNotification(false));

  return (
    <AnimatePresence>
      {isOpenNotification && (
        <motion.div
          ref={refElem}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="border-border/50 bg-card absolute top-full -left-10 z-50 mt-2 w-[calc(90vw-2rem)] max-w-[360px] min-w-[280px] overflow-hidden rounded-xl border shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl md:w-80"
        >
          {/* ================= Header ================= */}
          <div className="border-border/30 from-primary/5 to-secondary/5 flex items-center justify-between border-b bg-gradient-to-r px-4 py-3">
            <div className="flex items-center gap-2">
              <BellRing className="text-primary h-4 w-4" />
              <span className="text-foreground text-sm font-bold">
                اعلان‌ها
              </span>

              {unreadCount > 0 && (
                <span className="bg-destructive text-destructive-foreground flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-sm">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>

          {/* ================= Body ================= */}
          <div className="max-h-[320px] overflow-y-auto">
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
              /**
               * UI Placeholder
               * ----------------
               * بعداً اینجا map روی notifications واقعیت می‌زنی
               */
              <div className="space-y-3 p-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`border-border/30 cursor-pointer rounded-lg border p-3 transition ${
                      !notification.isRead
                        ? "bg-primary/5 hover:bg-primary/10"
                        : "opacity-60"
                    }`}
                  >
                    <p className="text-primary text-sm font-semibold">
                      {notification.title}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {notification.message}
                    </p>
                    <p className="text-muted-foreground/60 mt-2 text-left text-[10px]">
                      {new Date(notification.createdAt).toLocaleTimeString(
                        "fa-IR",
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ================= Footer ================= */}
          {unreadCount > 0 && (
            <div className="border-border/30 from-primary/5 to-secondary/5 border-t bg-gradient-to-r px-4 py-2.5">
              <button
                onClick={() => markAllAsRead()}
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
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
