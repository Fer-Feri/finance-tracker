import { useNotificationStore } from "@/store/useNotificationStore";
import NotificationMenu from "./notificationMenu";
import { Bell } from "lucide-react";
import { useState } from "react";

export default function Notification() {
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const { unreadCount } = useNotificationStore();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpenNotification(!isOpenNotification)}
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
      {isOpenNotification && (
        <NotificationMenu
          isOpenNotification={isOpenNotification}
          setIsOpenNotification={setIsOpenNotification}
        />
      )}
    </div>
  );
}
