import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { UserContextProvider } from "@/context/user-context";

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "A modern finance tracking application with neon UI",
};

const customLocalization = {
  signIn: {
    start: {
      title: "ورود به حساب",
      subtitle: "به حساب خود وارد شوید",
      actionText: "حساب کاربری ندارید؟",
      actionLink: "ثبت‌نام",
    },
  },
  signUp: {
    start: {
      title: "ثبت‌نام",
      subtitle: "حساب کاربری خود را بسازید",
      actionText: "قبلاً ثبت‌نام کرده‌اید؟",
      actionLink: "ورود",
    },
    continue: {
      title: "تکمیل اطلاعات",
      subtitle: "لطفاً اطلاعات خود را تکمیل کنید",
      actionText: "قبلاً ثبت‌نام کرده‌اید؟",
      actionLink: "ورود",
    },
    verifyEmailAddress: {
      title: "تأیید ایمیل",
      subtitle: "کد تأیید را به ایمیل {{identifier}} ارسال کردیم",
      formTitle: "کد تأیید",
      formSubtitle: "کد ۶ رقمی ارسال شده به ایمیل خود را وارد کنید",
      resendButton: "ارسال مجدد کد",
    },
  },

  // 📧 لیبل‌های فیلدها
  formFieldLabel__emailAddress: "ایمیل",
  formFieldLabel__emailAddress_username: "ایمیل یا نام کاربری",
  formFieldLabel__username: "نام کاربری",
  formFieldLabel__password: "رمز عبور",
  formFieldLabel__confirmPassword: "تکرار رمز عبور",
  formFieldLabel__firstName: "نام",
  formFieldLabel__lastName: "نام خانوادگی",

  // 🔤 Placeholder ها
  formFieldInputPlaceholder__emailAddress: "example@email.com",
  formFieldInputPlaceholder__emailAddress_username:
    "ایمیل یا نام کاربری خود را وارد کنید",
  formFieldInputPlaceholder__username: "نام کاربری خود را وارد کنید",
  formFieldInputPlaceholder__password: "رمز عبور خود را وارد کنید",
  formFieldInputPlaceholder__confirmPassword: "رمز عبور را دوباره وارد کنید",
  formFieldInputPlaceholder__firstName: "نام",
  formFieldInputPlaceholder__lastName: "نام خانوادگی",

  // 🔘 دکمه‌ها
  formButtonPrimary: "ادامه",

  // 🌐 دکمه‌های شبکه اجتماعی
  socialButtonsBlockButton: "ادامه با {{provider}}",

  // ⚠️ پیام‌های خطا
  formFieldError__notMatch: "رمزهای عبور یکسان نیستند",
  formFieldError__matchingPasswords: "رمزهای عبور باید یکسان باشند",

  // 📱 کد تأیید
  formFieldLabel__code: "کد تأیید",
  formFieldInputPlaceholder__code: "کد ۶ رقمی را وارد کنید",

  // 🔙 دکمه بازگشت
  backButton: "بازگشت",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={customLocalization}>
      <html lang="fa" dir="rtl" className="dark" suppressHydrationWarning>
        <body className="bg-background">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <UserContextProvider>{children}</UserContextProvider>
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: "#10b981",
                      secondary: "#fff",
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "#fff",
                    },
                  },
                }}
              />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
