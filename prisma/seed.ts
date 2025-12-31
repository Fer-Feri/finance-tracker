import { PrismaClient, TransactionType } from "@prisma/client";
import moment from "jalali-moment";

const prisma = new PrismaClient();

// تبدیل تاریخ شمسی به میلادی (ساده)
function toGregorian(jDate: string): Date {
  const normalizedDate = jDate.replace(/-/g, "/");
  return moment(normalizedDate, "jYYYY/jMM/jDD").toDate();
}

async function main() {
  console.log("🌱 شروع Seed...\n");

  const incomeCategories = [
    { name: "حقوق و دستمزد", icon: "💰", type: "INCOME" as const, order: 1 },
    { name: "فریلنس و پروژه", icon: "💻", type: "INCOME" as const, order: 2 },
    { name: "سرمایه‌گذاری", icon: "📈", type: "INCOME" as const, order: 3 },
    { name: "فروش", icon: "🏪", type: "INCOME" as const, order: 4 },
    { name: "هدیه و قرض", icon: "🎁", type: "INCOME" as const, order: 5 },
    { name: "سایر درآمد", icon: "➕", type: "INCOME" as const, order: 6 },
  ];

  const expenseCategories = [
    { name: "خوراک و نوشیدنی", icon: "🍔", type: "EXPENSE" as const, order: 1 },
    { name: "حمل‌ونقل", icon: "🚗", type: "EXPENSE" as const, order: 2 },
    { name: "قبوض", icon: "📄", type: "EXPENSE" as const, order: 3 },
    {
      name: "خرید و سوپرمارکت",
      icon: "🛒",
      type: "EXPENSE" as const,
      order: 4,
    },
    { name: "پوشاک و لوازم", icon: "👕", type: "EXPENSE" as const, order: 5 },
    { name: "سرگرمی و تفریح", icon: "🎮", type: "EXPENSE" as const, order: 6 },
    { name: "بهداشت و درمان", icon: "🏥", type: "EXPENSE" as const, order: 7 },
    { name: "آموزش", icon: "📚", type: "EXPENSE" as const, order: 8 },
    { name: "اجاره و مسکن", icon: "🏠", type: "EXPENSE" as const, order: 9 },
    { name: "ورزش و تناسب", icon: "⚽", type: "EXPENSE" as const, order: 10 },
    { name: "زیبایی و آرایش", icon: "💄", type: "EXPENSE" as const, order: 11 },
    { name: "خانواده و بچه", icon: "👶", type: "EXPENSE" as const, order: 12 },
    { name: "حیوان خانگی", icon: "🐕", type: "EXPENSE" as const, order: 13 },
    { name: "هدیه و کمک", icon: "🎁", type: "EXPENSE" as const, order: 14 },
    { name: "سایر هزینه", icon: "➖", type: "EXPENSE" as const, order: 15 },
  ];

  for (const cat of [...incomeCategories, ...expenseCategories]) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  console.log("✅ Categories ساخته شد");

  // ========================================
  // 👤 ایجاد Guest User
  // ========================================

  const guest = await prisma.user.upsert({
    where: { id: "guest-preview" },
    update: {},
    create: {
      id: "guest-preview",
      email: "guest@app.com",
      name: "Guest User",
    },
  });

  console.log("✅ Guest User ساخته شد");

  // تراکنش‌های سال 1402 (سه ماه آخر - کامل)
  const tx1402 = [
    // دی
    {
      date: "1402-10-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 25000000,
    },
    {
      date: "1402-10-12",
      cat: "خوراک و نوشیدنی",
      type: "EXPENSE",
      amount: 4000000,
    },
    { date: "1402-10-18", cat: "حمل‌ونقل", type: "EXPENSE", amount: 1500000 },
    { date: "1402-10-25", cat: "قبوض", type: "EXPENSE", amount: 2500000 },

    // بهمن
    {
      date: "1402-11-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 25000000,
    },
    {
      date: "1402-11-10",
      cat: "خرید و سوپرمارکت",
      type: "EXPENSE",
      amount: 6000000,
    },
    {
      date: "1402-11-20",
      cat: "پوشاک و لوازم",
      type: "EXPENSE",
      amount: 8000000,
    },
    {
      date: "1402-11-28",
      cat: "سرگرمی و تفریح",
      type: "EXPENSE",
      amount: 3000000,
    },

    // اسفند
    {
      date: "1402-12-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 26000000,
    },
    {
      date: "1402-12-12",
      cat: "خوراک و نوشیدنی",
      type: "EXPENSE",
      amount: 5000000,
    },
    {
      date: "1402-12-18",
      cat: "هدیه و کمک",
      type: "EXPENSE",
      amount: 10000000,
    },
    { date: "1402-12-25", cat: "حمل‌ونقل", type: "EXPENSE", amount: 2000000 },
  ];

  // تراکنش‌های سال 1403 (کامل - همه ماه‌ها)
  const tx1403 = [
    // فروردین
    {
      date: "1403-01-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 26000000,
    },
    {
      date: "1403-01-10",
      cat: "خوراک و نوشیدنی",
      type: "EXPENSE",
      amount: 4500000,
    },
    { date: "1403-01-20", cat: "حمل‌ونقل", type: "EXPENSE", amount: 1800000 },
    {
      date: "1403-01-28",
      cat: "سرگرمی و تفریح",
      type: "EXPENSE",
      amount: 6000000,
    },

    // اردیبهشت
    {
      date: "1403-02-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 26000000,
    },
    { date: "1403-02-12", cat: "قبوض", type: "EXPENSE", amount: 2800000 },
    {
      date: "1403-02-18",
      cat: "خرید و سوپرمارکت",
      type: "EXPENSE",
      amount: 7000000,
    },
    {
      date: "1403-02-25",
      cat: "پوشاک و لوازم",
      type: "EXPENSE",
      amount: 10000000,
    },

    // خرداد
    {
      date: "1403-03-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 27000000,
    },
    {
      date: "1403-03-15",
      cat: "خوراک و نوشیدنی",
      type: "EXPENSE",
      amount: 5000000,
    },
    { date: "1403-03-20", cat: "حمل‌ونقل", type: "EXPENSE", amount: 2000000 },
    {
      date: "1403-03-28",
      cat: "فریلنس و پروژه",
      type: "INCOME",
      amount: 8000000,
    },

    // تیر
    {
      date: "1403-04-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 27000000,
    },
    { date: "1403-04-12", cat: "قبوض", type: "EXPENSE", amount: 3000000 },
    {
      date: "1403-04-18",
      cat: "سرگرمی و تفریح",
      type: "EXPENSE",
      amount: 7000000,
    },
    {
      date: "1403-04-25",
      cat: "خرید و سوپرمارکت",
      type: "EXPENSE",
      amount: 8000000,
    },

    // مرداد
    {
      date: "1403-05-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 28000000,
    },
    {
      date: "1403-05-12",
      cat: "خوراک و نوشیدنی",
      type: "EXPENSE",
      amount: 5500000,
    },
    { date: "1403-05-20", cat: "حمل‌ونقل", type: "EXPENSE", amount: 2200000 },
    {
      date: "1403-05-28",
      cat: "پوشاک و لوازم",
      type: "EXPENSE",
      amount: 11000000,
    },

    // شهریور
    {
      date: "1403-06-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 28000000,
    },
    { date: "1403-06-12", cat: "قبوض", type: "EXPENSE", amount: 3200000 },
    {
      date: "1403-06-18",
      cat: "خرید و سوپرمارکت",
      type: "EXPENSE",
      amount: 9000000,
    },
    {
      date: "1403-06-25",
      cat: "سرگرمی و تفریح",
      type: "EXPENSE",
      amount: 8000000,
    },

    // مهر
    {
      date: "1403-07-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 28000000,
    },
    {
      date: "1403-07-12",
      cat: "خوراک و نوشیدنی",
      type: "EXPENSE",
      amount: 5000000,
    },
    { date: "1403-07-20", cat: "حمل‌ونقل", type: "EXPENSE", amount: 2000000 },
    {
      date: "1403-07-28",
      cat: "فریلنس و پروژه",
      type: "INCOME",
      amount: 10000000,
    },

    // آبان
    {
      date: "1403-08-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 30000000,
    },
    { date: "1403-08-15", cat: "قبوض", type: "EXPENSE", amount: 3000000 },
    {
      date: "1403-08-20",
      cat: "پوشاک و لوازم",
      type: "EXPENSE",
      amount: 12000000,
    },
    {
      date: "1403-08-25",
      cat: "خرید و سوپرمارکت",
      type: "EXPENSE",
      amount: 8000000,
    },

    // آذر
    {
      date: "1403-09-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 30000000,
    },
    {
      date: "1403-09-10",
      cat: "خوراک و نوشیدنی",
      type: "EXPENSE",
      amount: 6000000,
    },
    { date: "1403-09-18", cat: "هدیه و قرض", type: "INCOME", amount: 10000000 },
    {
      date: "1403-09-25",
      cat: "سرگرمی و تفریح",
      type: "EXPENSE",
      amount: 9000000,
    },

    // دی
    {
      date: "1403-10-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 30000000,
    },
    { date: "1403-10-15", cat: "حمل‌ونقل", type: "EXPENSE", amount: 2500000 },
    {
      date: "1403-10-22",
      cat: "خوراک و نوشیدنی",
      type: "EXPENSE",
      amount: 6000000,
    },
    { date: "1403-10-28", cat: "قبوض", type: "EXPENSE", amount: 3500000 },

    // بهمن
    {
      date: "1403-11-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 32000000,
    },
    {
      date: "1403-11-12",
      cat: "خرید و سوپرمارکت",
      type: "EXPENSE",
      amount: 10000000,
    },
    {
      date: "1403-11-20",
      cat: "پوشاک و لوازم",
      type: "EXPENSE",
      amount: 14000000,
    },
    {
      date: "1403-11-28",
      cat: "سرگرمی و تفریح",
      type: "EXPENSE",
      amount: 10000000,
    },

    // اسفند
    {
      date: "1403-12-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 32000000,
    },
    {
      date: "1403-12-15",
      cat: "خوراک و نوشیدنی",
      type: "EXPENSE",
      amount: 7000000,
    },
    { date: "1403-12-20", cat: "حمل‌ونقل", type: "EXPENSE", amount: 3000000 },
    {
      date: "1403-12-25",
      cat: "فریلنس و پروژه",
      type: "INCOME",
      amount: 12000000,
    },
  ];

  // تراکنش‌های سال 1404 (کامل تا اسفند)
  const tx1404 = [
    // فروردین
    {
      date: "1404-01-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 35000000,
    },
    {
      date: "1404-01-10",
      cat: "خوراک و نوشیدنی",
      type: "EXPENSE",
      amount: 7000000,
    },
    { date: "1404-01-20", cat: "حمل‌ونقل", type: "EXPENSE", amount: 3000000 },
    {
      date: "1404-01-28",
      cat: "سرگرمی و تفریح",
      type: "EXPENSE",
      amount: 8000000,
    },

    // اردیبهشت
    {
      date: "1404-02-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 35000000,
    },
    { date: "1404-02-12", cat: "قبوض", type: "EXPENSE", amount: 4000000 },
    {
      date: "1404-02-18",
      cat: "خرید و سوپرمارکت",
      type: "EXPENSE",
      amount: 9000000,
    },
    {
      date: "1404-02-25",
      cat: "فریلنس و پروژه",
      type: "INCOME",
      amount: 15000000,
    },

    // خرداد
    {
      date: "1404-03-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 35000000,
    },
    {
      date: "1404-03-15",
      cat: "پوشاک و لوازم",
      type: "EXPENSE",
      amount: 18000000,
    },
    {
      date: "1404-03-22",
      cat: "خوراک و نوشیدنی",
      type: "EXPENSE",
      amount: 8000000,
    },
    { date: "1404-03-28", cat: "حمل‌ونقل", type: "EXPENSE", amount: 3500000 },

    // تیر
    {
      date: "1404-04-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 38000000,
    },
    { date: "1404-04-12", cat: "قبوض", type: "EXPENSE", amount: 4500000 },
    {
      date: "1404-04-20",
      cat: "سرگرمی و تفریح",
      type: "EXPENSE",
      amount: 12000000,
    },
    {
      date: "1404-04-28",
      cat: "خرید و سوپرمارکت",
      type: "EXPENSE",
      amount: 10000000,
    },

    // مرداد
    {
      date: "1404-05-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 38000000,
    },
    {
      date: "1404-05-15",
      cat: "خوراک و نوشیدنی",
      type: "EXPENSE",
      amount: 8500000,
    },
    { date: "1404-05-22", cat: "حمل‌ونقل", type: "EXPENSE", amount: 4000000 },
    {
      date: "1404-05-28",
      cat: "پوشاک و لوازم",
      type: "EXPENSE",
      amount: 20000000,
    },

    // شهریور
    {
      date: "1404-06-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 40000000,
    },
    { date: "1404-06-12", cat: "قبوض", type: "EXPENSE", amount: 5000000 },
    {
      date: "1404-06-18",
      cat: "خرید و سوپرمارکت",
      type: "EXPENSE",
      amount: 11000000,
    },
    {
      date: "1404-06-25",
      cat: "سرگرمی و تفریح",
      type: "EXPENSE",
      amount: 13000000,
    },

    // مهر
    {
      date: "1404-07-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 40000000,
    },
    {
      date: "1404-07-15",
      cat: "خوراک و نوشیدنی",
      type: "EXPENSE",
      amount: 9000000,
    },
    { date: "1404-07-22", cat: "حمل‌ونقل", type: "EXPENSE", amount: 4000000 },
    {
      date: "1404-07-28",
      cat: "فریلنس و پروژه",
      type: "INCOME",
      amount: 18000000,
    },

    // آبان
    {
      date: "1404-08-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 42000000,
    },
    { date: "1404-08-12", cat: "قبوض", type: "EXPENSE", amount: 5000000 },
    {
      date: "1404-08-18",
      cat: "پوشاک و لوازم",
      type: "EXPENSE",
      amount: 22000000,
    },
    {
      date: "1404-08-25",
      cat: "خرید و سوپرمارکت",
      type: "EXPENSE",
      amount: 12000000,
    },

    // آذر
    {
      date: "1404-09-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 42000000,
    },
    {
      date: "1404-09-12",
      cat: "خوراک و نوشیدنی",
      type: "EXPENSE",
      amount: 10000000,
    },
    {
      date: "1404-09-20",
      cat: "سرگرمی و تفریح",
      type: "EXPENSE",
      amount: 15000000,
    },
    { date: "1404-09-28", cat: "حمل‌ونقل", type: "EXPENSE", amount: 4500000 },

    // دی (ماه جاری)
    {
      date: "1404-10-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 45000000,
    },
    {
      date: "1404-10-12",
      cat: "خوراک و نوشیدنی",
      type: "EXPENSE",
      amount: 10000000,
    },
    { date: "1404-10-18", cat: "قبوض", type: "EXPENSE", amount: 5500000 },
    { date: "1404-10-25", cat: "حمل‌ونقل", type: "EXPENSE", amount: 4500000 },

    // بهمن
    {
      date: "1404-11-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 45000000,
    },
    {
      date: "1404-11-12",
      cat: "خرید و سوپرمارکت",
      type: "EXPENSE",
      amount: 13000000,
    },
    {
      date: "1404-11-20",
      cat: "پوشاک و لوازم",
      type: "EXPENSE",
      amount: 25000000,
    },
    {
      date: "1404-11-28",
      cat: "سرگرمی و تفریح",
      type: "EXPENSE",
      amount: 16000000,
    },

    // اسفند
    {
      date: "1404-12-05",
      cat: "حقوق و دستمزد",
      type: "INCOME",
      amount: 48000000,
    },
    {
      date: "1404-12-12",
      cat: "خوراک و نوشیدنی",
      type: "EXPENSE",
      amount: 11000000,
    },
    {
      date: "1404-12-18",
      cat: "هدیه و کمک",
      type: "EXPENSE",
      amount: 15000000,
    },
    {
      date: "1404-12-25",
      cat: "فریلنس و پروژه",
      type: "INCOME",
      amount: 20000000,
    },
  ];

  for (const transaction of [...tx1402, ...tx1403, ...tx1404]) {
    const category = await prisma.category.findFirst({
      where: { name: transaction.cat },
    });

    await prisma.transaction.create({
      data: {
        userId: guest.id,
        categoryId: category!.id,
        date: new Date(toGregorian(transaction.date)),
        type: transaction.type as TransactionType,
        amount: transaction.amount,
        description: transaction.cat,
        paymentMethod: "ONLINE",
        status: "COMPLETED",
      },
    });
  }

  console.log("✅ موفقیت امیز بود همه چی ");
}

main()
  .catch((e) => {
    console.error("❌ خطا:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
