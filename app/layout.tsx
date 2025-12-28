import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryProvider } from "@/components/providers/query-provider";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
