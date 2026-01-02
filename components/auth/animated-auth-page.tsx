"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wallet, TrendingUp, BarChart3, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AnimatedAuthPage() {
  return (
    <div className="from-background via-background to-primary/5 relative min-h-screen overflow-hidden bg-gradient-to-br">
      {/* 🌟 پس‌زمینه ساده */}
      <div className="absolute inset-0">
        {/* Grid خفیف */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        {/* Gradient Blur */}
        <div className="bg-primary/20 absolute -top-40 -right-40 h-96 w-96 rounded-full blur-[120px]" />
        <div className="bg-secondary/20 absolute -bottom-40 -left-40 h-96 w-96 rounded-full blur-[120px]" />
      </div>

      {/* 📱 محتوای اصلی */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-5xl"
          >
            {/* 🎯 هدر */}
            <div className="mb-12 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="mb-4"
              >
                <div className="bg-primary/10 mx-auto mb-9 flex h-16 w-16 items-center justify-center rounded-2xl backdrop-blur-sm">
                  <Wallet className="text-primary h-8 w-8" />
                </div>
                <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  مدیریت مالی
                  <span className="from-primary/70 to-secondary/70 bg-gradient-to-l bg-clip-text text-transparent">
                    {" "}
                    هوشمند
                  </span>
                  <span className="from-primary to-secondary bg-gradient-to-l bg-clip-text text-transparent">
                    {" "}
                    ترازینو
                  </span>
                </h1>
                <p className="text-muted-foreground/50 mx-auto max-w-xl">
                  هزینه‌هات رو ثبت کن، آمارگیری کن و کنترل مالیت رو به دست بگیر
                </p>
              </motion.div>
            </div>
            {/* 🚀 دکمه‌های اصلی */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mb-4 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/sign-in">
                <Button
                  size="lg"
                  className="group bg-primary w-full px-8 text-base font-bold shadow-lg transition-all hover:shadow-xl sm:w-auto"
                >
                  <span className="flex items-center gap-2">
                    ورود / ثبت‌نام
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  </span>
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button
                  size="lg"
                  // variant="outline"
                  className="!bg-destructive text-muted !hover:text-prima w-full border-2 px-8 text-base font-bold transition-all sm:w-auto"
                >
                  مشاهده نسخه نمایشی
                </Button>
              </Link>
            </motion.div>
            {/* ✨ کارت‌های ویژگی */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mb-10 grid gap-4 sm:grid-cols-3"
            >
              {[
                { icon: Wallet, title: "ثبت تراکنش", desc: "ساده و سریع" },
                { icon: BarChart3, title: "نمودار زنده", desc: "آمار لحظه‌ای" },
                {
                  icon: TrendingUp,
                  title: "تحلیل هزینه",
                  desc: "هوشمند و دقیق",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
                  className="group border-border/50 bg-card/40 hover:border-primary/50 hover:bg-card/60 relative overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-all"
                >
                  <div className="bg-primary/10 mb-3 inline-flex rounded-xl p-2">
                    <item.icon className="text-primary h-5 w-5" />
                  </div>
                  <h3 className="mb-1 font-bold">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* 💬 توضیح کاربر مهمان */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="mt-8 text-center"
            >
              <p className="text-muted-foreground text-xs">
                برای استفاده از نسخه نمایشی نیاز به ثبت‌نام نیست
                <br />
                داده‌های نسخه نمایشی موقتی هستند
              </p>
            </motion.div>
          </motion.div>
          );
        </AnimatePresence>
      </div>
    </div>
  );
}
