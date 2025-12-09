"use client";

import { usePathname } from "next/navigation";
import { useEffect, useCallback } from "react";
import { navigationGroups } from "@/config/navigation";
import { useSidebarStore } from "@/store/useSidebarStore";

export function useSidebarLogic() {
  const pathname = usePathname();
  const { setExpandedMenus, expandedMenus } = useSidebarStore();

  // 1. همگام‌سازی مسیر با منوهای باز (فقط هنگام لود اولیه یا تغییر مسیر اصلی)
  useEffect(() => {
    // فقط اگر منویی باز نیست چک کن (یا استراتژی دلخواه شما)
    // اینجا منطق شما رو اجرا می‌کنیم:
    const idsToOpen = new Set(expandedMenus); // استفاده از Set برای جلوگیری از تکرار

    navigationGroups.forEach((group) => {
      group.items.forEach((item) => {
        if (item.children) {
          const shouldBeOpen = item.children.some((child) =>
            pathname.startsWith(child.href),
          );
          if (shouldBeOpen) {
            idsToOpen.add(item.id);
          }
        }
      });
    });

    // آپدیت استور
    if (idsToOpen.size > expandedMenus.length) {
      setExpandedMenus(Array.from(idsToOpen));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // 2. تابع تشخیص اکتیو بودن
  const isActive = useCallback(
    (href: string) => {
      if (href === "/dashboard" || href === "/") return pathname === href;
      return pathname.startsWith(href);
    },
    [pathname],
  );

  return { isActive };
}
