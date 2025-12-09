"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="group border-border/50 bg-background/50 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary relative flex h-9 w-9 items-center justify-center rounded-lg border transition-all hover:shadow-[0_0_12px_rgba(var(--primary-rgb),0.3)]"
      title="Dark | Light"
    >
      {/* آیکون Sun (در حالت دارک مخفی می‌شود) */}
      <Sun className="absolute h-[1.1rem] w-[1.1rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />

      {/* آیکون Moon (در حالت لایت مخفی می‌شود) */}
      <Moon className="absolute h-[1.1rem] w-[1.1rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />

      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
