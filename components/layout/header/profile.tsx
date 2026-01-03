"use client";

import Image from "next/image";
import { ProfileProps } from "@/types/user-profile";
import ProfileMenu from "./profileMenu";
import { useState } from "react";

export default function Profile({ user, isGuest }: ProfileProps) {
  const [isOpenMenuProfile, setIsOpenMenuProfile] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpenMenuProfile(!isOpenMenuProfile)}
        className="group ring-border hover:ring-primary/50 focus-visible:ring-ring relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 transition-all duration-200 hover:ring-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            width={36}
            height={36}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          <div className="from-primary/20 to-secondary/20 text-primary group-hover:from-primary/30 group-hover:to-secondary/30 flex h-full w-full items-center justify-center bg-gradient-to-br text-sm font-medium transition-all duration-200">
            {user.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
        )}

        {/* حلقه نئونی هاور */}
        <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_12px_rgba(var(--primary-rgb),0.6)]" />
      </button>

      {/* Profile Menu */}
      {isOpenMenuProfile && (
        <ProfileMenu
          user={user}
          isGuest={isGuest}
          setIsOpenMenuProfile={setIsOpenMenuProfile}
        />
      )}
    </div>
  );
}
