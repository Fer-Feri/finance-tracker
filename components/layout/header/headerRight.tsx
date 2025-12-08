import { Menu } from "lucide-react";

interface HeaderRightProps {
  title?: string;
  onMenuClick: () => void;
}

export default function HeaderRight({ title, onMenuClick }: HeaderRightProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Hamburger Menu برای موبایل */}
      <button className="lg:hidden" onClick={onMenuClick} aria-label="منو">
        <Menu className="h-5 w-5" />
      </button>

      {/* عنوان صفحه */}
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
    </div>
  );
}
