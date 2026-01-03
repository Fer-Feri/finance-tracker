"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "@/context/user-context";

export function ProfileAvatarSection() {
  const { user: clerkUser } = useClerkUser();
  const { isGuest } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (isGuest) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !clerkUser) return;

    // اعتبارسنجی
    if (!file.type.startsWith("image/")) {
      toast.error("لطفاً یک فایل تصویری انتخاب کنید");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم فایل باید کمتر از ۵ مگابایت باشد");
      return;
    }

    setIsUploading(true);
    try {
      // ✅ استفاده از setProfileImage که روی user object هست
      await clerkUser.setProfileImage({ file });

      toast.success("تصویر پروفایل با موفقیت به‌روز شد");

      // ✅ رفرش کردن داده‌های Clerk (بهتر از reload کل صفحه)
      await clerkUser.reload();
    } catch (error) {
      console.error("آپلود تصویر شکست خورد:", error);

      // ✅ نمایش پیام خطای دقیق‌تر
      const errorMessage =
        (error as { errors?: Array<{ message: string }> })?.errors?.[0]
          ?.message || "آپلود تصویر ناموفق بود";

      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // تعیین src تصویر
  const avatarSrc = clerkUser?.imageUrl || "";

  return (
    <div className="flex items-center gap-4">
      <Avatar
        className={`h-20 w-20 ${!isGuest ? "cursor-pointer" : ""} `}
        onClick={handleAvatarClick}
      >
        {isUploading ? (
          <AvatarFallback className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </AvatarFallback>
        ) : (
          <>
            <AvatarImage
              src={avatarSrc}
              alt="آواتار کاربر"
              className="h-full w-full object-cover"
            />
            <AvatarFallback className="text-2xl">
              {clerkUser?.firstName?.[0] || "ک"}
            </AvatarFallback>
          </>
        )}
      </Avatar>

      <Button
        className="hover:bg-transparent"
        variant="outline"
        size="sm"
        disabled={isGuest || isUploading}
        onClick={handleAvatarClick}
      >
        {isUploading ? "در حال آپلود..." : "تغییر تصویر"}
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
