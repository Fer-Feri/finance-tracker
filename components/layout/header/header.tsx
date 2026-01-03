"use client";

import HeaderRight from "./headerRight";
import HeaderLeft from "./headerLeft";
import { useUser } from "@/context/user-context";
import { useUser as useClerkUser } from "@clerk/nextjs";

export default function DashboardHeader({ title }: { title?: string }) {
  // ------------------------------------
  const { isGuest, userId } = useUser();
  const { user: clerkUser, isLoaded } = useClerkUser();

  let profileUser: {
    name: string;
    email?: string;
    image?: string;
  } | null = null;

  // 1️⃣ Demo Mode
  if (isGuest && userId === "guest-preview") {
    profileUser = {
      name: "Demo User",
      email: "demo@preview.app",
    };
  }
  // 2️⃣ Clerk
  if (!isGuest && isLoaded && clerkUser) {
    profileUser = {
      name: clerkUser.fullName ?? clerkUser.firstName ?? "User",
      email: clerkUser.primaryEmailAddress?.emailAddress,
      image: clerkUser.imageUrl,
    };
  }

  if (!profileUser) return null;

  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 z-40 w-full border-b backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-6">
        {/* Right Side: Menu Button (Mobile) + Title */}
        <HeaderRight title={title} />
        {/* Left Side: Actions */}
        <HeaderLeft user={profileUser} isGuest={isGuest} />
      </div>
    </header>
  );
}
