"use client";

import { navigationGroups } from "@/config/navigation";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const [openMenus, setOpenMenus] = useState<string[]>(() => {
    const activeMenus: string[] = [];
    navigationGroups.forEach((group) => {
      group.items.forEach((item) => {
        if (item.children) {
          const hasActiveChild = item.children.some((child) =>
            pathname.startsWith(child.href),
          );
          if (hasActiveChild) {
            activeMenus.push(item.id);
          }
        }
      });
    });
    return activeMenus;
  });

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="border-sidebar-border bg-sidebar fixed top-0 right-0 hidden h-screen w-64 flex-col border-l lg:flex">
      {/* ========== Header ========== */}
      <div className="border-sidebar-border flex h-16 shrink-0 items-center gap-2 border-b px-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]">
            <span className="text-primary-foreground text-xl font-bold">$</span>
          </div>
          <span className="text-lg font-bold">ترازینو</span>
        </div>
      </div>

      {/* ========== Navigation Groups ========== */}
      <nav className="flex-1 space-y-8 overflow-y-auto p-6">
        {navigationGroups.map((group) => (
          <div key={group.title}>
            {/* عنوان گروه */}
            <div className="relative mb-4 flex items-center">
              <div className="border-sidebar-border/50 flex-1 border-t"></div>
              <span className="text-muted-foreground px-3 text-xs font-bold tracking-widest uppercase">
                {group.title}
              </span>
              <div className="border-sidebar-border/50 flex-1 border-t"></div>
            </div>

            {/* آیتم‌های گروه */}
            <div className="space-y-2">
              {group.items.map((item) => (
                <div key={item.id}>
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() => toggleMenu(item.id)}
                        className={cn(
                          "sidebar-menu-item",
                          isActive(item.href)
                            ? "sidebar-menu-item-active"
                            : "sidebar-menu-item-inactive",
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className="flex-1 text-right">{item.title}</span>
                        {item.badge && (
                          <span className="sidebar-badge-primary">
                            {item.badge}
                          </span>
                        )}
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 shrink-0 transition-transform duration-300",
                            openMenus.includes(item.id) && "rotate-180",
                          )}
                        />
                      </button>

                      <AnimatePresence>
                        {openMenus.includes(item.id) && item.children && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 mr-5 space-y-1.5">
                              {item.children.map((child) => (
                                <Link
                                  key={child.id}
                                  href={child.href}
                                  className={cn(
                                    "sidebar-submenu-item",
                                    isActive(child.href)
                                      ? "sidebar-submenu-item-active"
                                      : "sidebar-submenu-item-inactive",
                                  )}
                                >
                                  <child.icon className="h-4 w-4 shrink-0" />
                                  <span className="flex-1 text-right">
                                    {child.title}
                                  </span>
                                  {child.badge && (
                                    <span className="sidebar-badge-secondary">
                                      {child.badge}
                                    </span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "sidebar-menu-item",
                        isActive(item.href)
                          ? "sidebar-menu-item-active"
                          : "sidebar-menu-item-inactive",
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="flex-1 text-right">{item.title}</span>
                      {item.badge && (
                        <span className="sidebar-badge-primary">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ========== Footer ========== */}
      <div className="border-sidebar-border shrink-0 border-t p-4">
        <Link
          href="/dashboard/help"
          className="bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
        >
          <HelpCircle className="h-5 w-5 shrink-0" />
          <span className="flex-1 text-right">راهنما و پشتیبانی</span>
        </Link>
      </div>
    </aside>
  );
}
