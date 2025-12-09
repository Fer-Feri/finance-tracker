"use client";

import { navigationGroups } from "@/config/navigation";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useSidebarLogic } from "@/hooks/useSidebarLogic"; // هوکی که ساختیم
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/favicon.ico";

export default function SidebarContent() {
  // ✅ دریافت State و Actionها از Zustand
  const { expandedMenus, toggleSubmenu, closeMobileMenu } = useSidebarStore();

  // ✅ دریافت منطق اکتیو بودن از هوک کمکی
  const { isActive } = useSidebarLogic();

  return (
    <div className="flex h-full flex-col">
      {/* ========== Header ========== */}
      <div className="border-sidebar-border flex h-16 shrink-0 items-center gap-2 border-b px-6">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="LOGO" className="h-11 w-11" />
          <span className="text-lg font-bold">ترازینو</span>
        </div>
      </div>

      {/* ========== Navigation ========== */}
      <nav className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-6">
        {navigationGroups.map((group) => (
          <div key={group.title}>
            <div className="relative mb-4 flex items-center">
              <div className="border-sidebar-border/50 flex-1 border-t"></div>
              <span className="text-muted-foreground px-3 text-xs font-bold tracking-widest uppercase">
                {group.title}
              </span>
              <div className="border-sidebar-border/50 flex-1 border-t"></div>
            </div>

            <div className="space-y-2">
              {group.items.map((item) => (
                <div key={item.id}>
                  {item.children ? (
                    <>
                      {/* دکمه والد */}
                      <button
                        type="button"
                        onClick={() => toggleSubmenu(item.id)}
                        className={cn(
                          "sidebar-menu-item w-full",
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
                            expandedMenus.includes(item.id) && "rotate-180",
                          )}
                        />
                      </button>

                      {/* زیرمنوها */}
                      <AnimatePresence>
                        {expandedMenus.includes(item.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="border-border/40 mt-2 mr-5 space-y-1.5 border-r pr-3">
                              {item.children.map((child) => (
                                <Link
                                  key={child.id}
                                  href={child.href}
                                  onClick={closeMobileMenu} // ✅ بستن منو در موبایل
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
                    // لینک ساده بدون فرزند
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu} // ✅ بستن منو در موبایل
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
          onClick={closeMobileMenu}
          className="bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
        >
          <HelpCircle className="h-5 w-5 shrink-0" />
          <span className="flex-1 text-right">راهنما و پشتیبانی</span>
        </Link>
      </div>
    </div>
  );
}
