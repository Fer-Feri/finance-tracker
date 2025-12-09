// import { ThemeInitializer } from "@/components/layout/theme-toggle/theme-initializer";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "A modern finance tracking application with neon UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="bg-background">
        {/* <ThemeInitializer /> */}
        <ThemeProvider
          attribute="class" // کلاس dark را به تگ html اضافه می‌کند
          defaultTheme="system" // پیش‌فرض: تنظیمات سیستم
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
