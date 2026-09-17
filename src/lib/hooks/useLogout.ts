"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useCart } from "@/context/CartContext";

export function useLogout() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { clearSensitiveCredentials } = useCart();

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    clearSensitiveCredentials();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/");
      router.refresh();
      setIsLoggingOut(false);
    }
  }, [clearSensitiveCredentials, router]);

  return { logout, isLoggingOut };
}