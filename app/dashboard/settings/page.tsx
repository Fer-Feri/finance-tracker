"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Moon,
  Sun,
  Download,
  Upload,
  Trash2,
  User,
  HelpCircle,
  ChevronLeft,
  Headset,
  PhoneCall,
  Instagram,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="container mx-auto max-w-4xl p-4">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="md:hidden"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">تنظیمات</h1>
      </div>

      <div className="space-y-6">
        {/* پروفایل */}
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <User className="h-5 w-5" />
            پروفایل کاربری
          </h2>

          <div className="space-y-4">
            {/* آواتار */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" alt="آواتار" />
                <AvatarFallback className="text-2xl">ک</AvatarFallback>
              </Avatar>
              <Button
                className="hover:bg-transparent"
                variant="outline"
                size="sm"
              >
                تغییر تصویر
              </Button>
            </div>

            {/* نام */}
            <div className="space-y-2">
              <Label htmlFor="name">نام و نام خانوادگی</Label>
              <Input
                id="name"
                placeholder="نام خود را وارد کنید"
                defaultValue="کاربر"
              />
            </div>

            {/* ایمیل */}
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                defaultValue=""
              />
            </div>

            <Button className="w-full">ذخیره تغییرات</Button>
          </div>
        </Card>

        {/* ظاهری */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">ظاهری</h2>

          <div className="space-y-4">
            {/* تم */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  {theme === "dark" ? (
                    <Moon className="text-primary h-5 w-5" />
                  ) : (
                    <Sun className="text-primary h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">حالت تاریک</p>
                  <p className="text-muted-foreground text-sm">
                    تم تاریک را فعال کنید
                  </p>
                </div>
              </div>

              <Switch
                checked={resolvedTheme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
                dir="ltr"
                id="dark-mode"
              />
            </div>
          </div>
        </Card>

        {/* مدیریت داده‌ها */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">مدیریت داده‌ها</h2>

          <div className="space-y-3">
            {/* دانلود پشتیبان */}
            <Button variant="outline" className="w-full justify-start gap-3">
              <Download className="h-5 w-5" />
              دانلود پشتیبان (JSON)
            </Button>

            {/* بازیابی */}
            <Button variant="outline" className="w-full justify-start gap-3">
              <Upload className="h-5 w-5" />
              بازیابی از فایل
            </Button>

            {/* پاک کردن */}
            <Button
              variant="destructive"
              className="w-full justify-start gap-3"
            >
              <Trash2 className="h-5 w-5" />
              پاک کردن همه داده‌ها
            </Button>
            <p className="text-muted-foreground px-2 text-xs">
              ⚠️ این عملیات غیرقابل بازگشت است
            </p>
          </div>
        </Card>

        {/* راهنما و پشتیبانی */}
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <HelpCircle className="h-5 w-5" />
            راهنما و پشتیبانی
          </h2>

          <div className="space-y-4">
            {/* راهنمای استفاده */}
            <div className="bg-muted/30 rounded-lg border p-4">
              <h3 className="mb-2 font-medium">💡 درباره اپلیکیشن</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                <strong className="text-foreground">ترازینو</strong> یک ابزار
                ساده و کاربردی برای ثبت و پیگیری هزینه‌های روزانه است. با
                امکاناتی مانند دسته‌بندی تراکنش‌ها، گزارش‌های تصویری، و
                نمودارهای تحلیلی، می‌توانید کنترل بهتری بر مخارج خود داشته
                باشید.
              </p>

              <div className="mt-3 space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-muted-foreground">
                    ثبت سریع تراکنش‌های مالی
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-muted-foreground">
                    گزارش‌های گرافیکی پیشرفته
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-muted-foreground">
                    پشتیبان‌گیری و بازیابی داده
                  </span>
                </p>
              </div>
            </div>
            {/* تماس با پشتیبانی */}
            <div className="mt-9 space-y-3">
              <h3 className="flex gap-2 text-sm font-medium">
                <Headset className="text-primary h-5 w-5" />
                ارتباط با ما
              </h3>

              {/* تلفن */}
              <Button
                variant="outline"
                className="w-full justify-start gap-3 hover:bg-transparent"
                asChild
              >
                <a href="tel:09189800167">
                  <PhoneCall className="text-secondary h-5 w-5" />
                  <span>تماس تلفنی: 09189800167</span>
                </a>
              </Button>

              {/* اینستاگرام */}
              <Button
                variant="outline"
                className="w-full justify-start gap-3 hover:bg-transparent"
                asChild
              >
                <a
                  href="https://www.instagram.com/chakra_web/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="text-destructive h-5 w-5" />
                  اینستاگرام: @chakra_web
                </a>
              </Button>

              {/* تلگرام */}
              <Button
                variant="outline"
                className="w-full justify-start gap-3 hover:bg-transparent"
                asChild
              >
                <a
                  href="https://t.me/NARUTO36"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="h-5 w-5"
                    fill=" #0088cc"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                  </svg>
                  تلگرام: NARUTO36@
                </a>
              </Button>
            </div>
          </div>
        </Card>

        {/* درباره */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">درباره</h2>

          <div className="text-muted-foreground space-y-2 text-sm">
            <div className="flex justify-between">
              <span>نسخه اپلیکیشن</span>
              <span className="text-foreground font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>آخرین بروزرسانی</span>
              <span className="text-foreground font-medium">1404/10/05</span>
            </div>
            <p className="border-t pt-4 text-center">ساخته شده با ❤️</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
