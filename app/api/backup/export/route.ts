// import { NextResponse } from "next/server";
// import { db } from "@/db";
// import { auth } from "@clerk/nextjs/server"; // یا هر auth که دارید

// export async function GET() {
//   try {
//     // ✅ احراز هویت کاربر
//     // const { userId } = await auth();
//     const userId = "guest-preview";

//     if (!userId) {
//       return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
//     }

//     // ✅ دریافت همه داده‌های کاربر
//     const [transactions, categories] = await Promise.all([
//       // فقط تراکنش‌های خود کاربر
//       db.transaction.findMany({
//         where: { userId },
//         include: {
//           category: true, // برای داشتن نام دسته‌بندی
//         },
//         orderBy: { date: "desc" },
//       }),

//       // همه دسته‌بندی‌ها (برای بازیابی)
//       db.category.findMany({
//         orderBy: { order: "asc" },
//       }),
//     ]);

//     // ✅ ساختار نهایی JSON
//     const backup = {
//       version: "1.0.0", // برای سازگاری آینده
//       exportDate: new Date().toISOString(),
//       user: {
//         id: userId,
//       },
//       data: {
//         transactions,
//         categories,
//       },
//       metadata: {
//         transactionsCount: transactions.length,
//         categoriesCount: categories.length,
//       },
//     };

//     return NextResponse.json(backup);
//   } catch (error) {
//     console.error("Export Error:", error);
//     return NextResponse.json(
//       { error: "خطا در ایجاد پشتیبان" },
//       { status: 500 },
//     );
//   }
// }
