"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { clearAllCredentials } from "@/lib/secureCartStorage";

export function useLogout() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    clearAllCredentials();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/");
      router.refresh();
      setIsLoggingOut(false);
    }
  }, [router]);

  return { logout, isLoggingOut };
}
