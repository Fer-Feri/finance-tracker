import { AnimatedAuthPage } from "@/components/auth/animated-auth-page";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return <AnimatedAuthPage />;
}
