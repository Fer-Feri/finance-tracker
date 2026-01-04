"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function DemoEntry() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("demo") === "true") {
      localStorage.setItem("demo-mode", "true");
    }
  }, [searchParams]);

  return null;
}
