// src/app/not-found.tsx
import Link from "next/link";
import { FileQuestion, Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        {/* آیکون */}
        <div className="mb-8 flex justify-center">
          <div className="bg-primary/10 relative rounded-full p-6">
            <FileQuestion className="text-primary h-24 w-24" />
            <div className="bg-destructive absolute -top-2 -right-2 flex h-16 w-16 items-center justify-center rounded-full">
              <span className="text-destructive-foreground text-2xl font-bold">
                404
              </span>
            </div>
          </div>
        </div>

        {/* متن */}
        <h1 className="mb-4 text-4xl font-bold">صفحه مورد نظر یافت نشد</h1>
        <p className="text-muted-foreground mb-8 max-w-md text-lg">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
        </p>

        {/* دکمه‌ها */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors"
          >
            <Home className="h-5 w-5" />
            بازگشت به داشبورد
          </Link>

          <Link
            href="/"
            className="border-border text-foreground hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition-colors"
          >
            صفحه اصلی
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* لینک‌های پیشنهادی */}
        <div className="mt-12">
          <p className="text-muted-foreground mb-4 text-sm">
            یا می‌توانید به این صفحات مراجعه کنید:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/dashboard/transactions"
              className="text-primary text-sm hover:underline"
            >
              تراکنش‌ها
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/dashboard/reports"
              className="text-primary text-sm hover:underline"
            >
              گزارشات
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/dashboard/settings"
              className="text-primary text-sm hover:underline"
            >
              تنظیمات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
