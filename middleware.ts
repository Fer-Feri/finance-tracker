import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// مسیرهایی که نیاز به لاگین دارن
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/settings(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // اگر مسیر محافظت‌شده بود و لاگین نبود
  if (isProtectedRoute(req)) {
    const { userId } = await auth();

    // اگر لاگین نبود، ولی مهمان میتونه بره
    // (چون guest-preview داریم)
    if (!userId) {
      // اینجا هیچ کاری نکن، بذار بره
      // چون در dashboard خودش چک می‌کنیم
    }
  }
});

export const config = {
  matcher: [
    // همه مسیرها رو بگیر، بجز استاتیک فایل‌ها
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
