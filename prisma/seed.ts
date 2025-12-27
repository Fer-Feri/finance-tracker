import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 شروع Seed کتگوری‌ها...");

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

  console.log(`✅ ${incomeCategories.length} کتگوری درآمد ساخته شد`);
  console.log(`✅ ${expenseCategories.length} کتگوری هزینه ساخته شد`);
}

main()
  .catch((e) => {
    console.error("❌ خطا:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
