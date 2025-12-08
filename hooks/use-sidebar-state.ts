"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { navigationGroups } from "@/config/navigation";

export function useSidebarState() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  // 1. اثر جانبی: وقتی مسیر عوض شد، منوی والد مربوطه را پیدا و باز کن
  useEffect(() => {
    navigationGroups.forEach((group) => {
      group.items.forEach((item) => {
        if (item.children) {
          // اگر یکی از بچه‌ها فعال است، والدش را باز کن
          const shouldBeOpen = item.children.some((child) =>
            pathname.startsWith(child.href),
          );

          if (shouldBeOpen) {
            setOpenMenus((prev) => {
              // جلوگیری از تکرار
              if (prev.includes(item.id)) return prev;
              return [...prev, item.id];
            });
          }
        }
      });
    });
  }, [pathname]);

  // 2. تابع ساده برای باز/بسته کردن دستی (Toggle)
  const toggleMenu = useCallback((id: string) => {
    setOpenMenus(
      (prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id) // اگر باز بود، ببند
          : [...prev, id], // اگر بسته بود، باز کن
    );
  }, []);

  // 3. بررسی اکتیو بودن لینک
  const isActive = useCallback(
    (href: string) => {
      if (href === "/dashboard") return pathname === "/dashboard";
      return pathname.startsWith(href);
    },
    [pathname],
  );

  return { openMenus, toggleMenu, isActive };
}
