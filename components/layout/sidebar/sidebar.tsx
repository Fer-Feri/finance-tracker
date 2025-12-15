"use client";
import SidebarContent from "./sidebar-content";

export default function Sidebar() {
  return (
    <aside className="border-sidebar-border bg-sidebar fixed top-0 right-0 hidden h-screen w-64 flex-col border-l lg:flex">
      <SidebarContent />
    </aside>
  );
}
