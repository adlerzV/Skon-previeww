"use client";

import { Suspense, type ReactNode } from "react";
import { ToastProvider } from "@/context/ToastContext";
import AuthRefresher from "@/components/account/AuthRefresher";
import TopLoader from "@/components/ui/TopLoader";

export default function AccountProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthRefresher />
      <Suspense fallback={null}>
        <TopLoader />
      </Suspense>
      {children}
    </ToastProvider>
  );
}
