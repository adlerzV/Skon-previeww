"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import AuthRefresher from "@/components/account/AuthRefresher";
import TopLoader from "@/components/ui/TopLoader";

export default function CommerceProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>
        <AuthRefresher />
        <TopLoader />
        {children}
      </CartProvider>
    </ToastProvider>
  );
}
