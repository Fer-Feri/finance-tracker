"use client";

import { navigationGroups } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/favicon.ico";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useSidebarStore } from "@/store/useSidebarStore";

export default function SidebarContent() {
  const pathname = usePathname();
  const [manualExpanded, setManualExpanded] = useState<string[]>([]);

  const { closeMobile } = useSidebarStore();

  // =================Toggle menu open/close manually by user click==================
  const toggleMenu = (menuId: string) => {
    setManualExpanded((prev) =>
      prev.includes(menuId)
        ? prev.filter((item) => item !== menuId)
        : [...prev, menuId],
    );
  };

  // =================Combine manual and auto-expanded menus based on current route==============
  const expandedMenus = useMemo(() => {
    const autoExpandedMenus = navigationGroups
      .flatMap((group) => group.items)
      .filter((item) => item.children && pathname.startsWith(item.href))
      .map((item) => item.id);

    return Array.from(new Set([...manualExpanded, ...autoExpandedMenus]));
  }, [pathname, manualExpanded]);

  // ===========================JSX=================================
  return (
    <div className="flex h-full flex-col">
      {/* Header Section */}
      <div className="border-sidebar-border flex h-16 shrink-0 items-center justify-between gap-2 border-b px-6">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="LOGO" className="h-11 w-11" />
          <span className="text-lg font-bold">ترازینو</span>
        </div>
        <button onClick={closeMobile} className="text-primary block md:hidden">
          X
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-6">
        {navigationGroups.map((group) => (
          <div key={group.title}>
            {/* Group Title Divider */}
            <div className="relative mb-4 flex items-center">
              <div className="border-sidebar-border/50 flex-1 border-t"></div>
              <span className="text-muted-foreground px-3 text-xs font-bold tracking-widest uppercase">
                {group.title}
              </span>
              <div className="border-sidebar-border/50 flex-1 border-t"></div>
            </div>

            {/* Navigation Items */}
            <div className="space-y-4">
              {group.items.map((item) => {
                const isCurrentPage = item.href === pathname;
                const isExpended = expandedMenus.includes(item.id);
                const isParentActive = pathname.startsWith(item.href);

                return (
                  <div key={item.id}>
                    {item.children ? (
                      <>
                        {/* Parent Button (with children) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            toggleMenu(item.id);
                            e.stopPropagation();
                          }}
                          className={cn(
                            "flex w-full items-center gap-4 rounded-md p-3 transition-colors",
                            isParentActive
                              ? "bg-primary/90 text-white"
                              : "hover:bg-primary/5",
                          )}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          <span className="flex-1 text-right">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="bg-primary/90 border-border flex items-center justify-center rounded-full border px-2 py-1 text-sm text-white">
                              {item.badge}
                            </span>
                          )}
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 shrink-0 transition-transform duration-300",
                              isExpended ? "rotate-180" : "",
                            )}
                          />
                        </button>

                        {/* Submenu Items (animated collapse) */}
                        <AnimatePresence>
                          {isExpended && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="border-border/40 mt-2 mr-5 space-y-1.5 border-r pr-3">
                                {item.children.map((child) => {
                                  const isChildActive = child.href === pathname;

                                  return (
                                    <Link
                                      key={child.id}
                                      href={child.href}
                                      onClick={closeMobile}
                                      className={`hover:bg-primary/5 flex gap-4 rounded-md p-3 ${isChildActive ? "bg-primary/30 hover:bg-primary/30" : ""}`}
                                    >
                                      <child.icon className="h-4 w-4 shrink-0" />
                                      <span className="flex-1 text-right">
                                        {child.title}
                                      </span>
                                      {child.badge && (
                                        <span className="">{child.badge}</span>
                                      )}
                                    </Link>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      // Simple Link (no children)
                      <Link
                        href={item.href}
                        onClick={closeMobile}
                        className={`hover:bg-primary/5 flex items-center gap-4 rounded-md p-3 ${isCurrentPage ? "bg-primary/90 hover:bg-primary/90 text-white" : ""}`}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className="flex-1 text-right">{item.title}</span>
                        {item.badge && (
                          <span className="bg-primary/90 border-border flex items-center justify-center rounded-full border px-2 py-1 text-sm text-white">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="border-sidebar-border shrink-0 border-t p-4">
        <Link
          href="/dashboard/settings"
          className="bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
        >
          <HelpCircle className="h-5 w-5 shrink-0" />
          <span className="flex-1 text-right">راهنما و پشتیبانی</span>
        </Link>
      </div>
    </div>
  );
}
