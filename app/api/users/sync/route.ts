import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId)
      return NextResponse.json({ error: "احراز هویت ناموفق" }, { status: 401 });

    const clerkUser = await currentUser();
    if (!clerkUser || !clerkUser.emailAddresses[0])
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 400 });

    const email = clerkUser.emailAddresses[0].emailAddress;
    const name = clerkUser.fullName || "کاربر ناشناس";

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { id: userId, email, name },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("خطا در همگام‌سازی کاربر:", error);
    return NextResponse.json({ error: "خطای سرور داخلی" }, { status: 500 });
  }
}
