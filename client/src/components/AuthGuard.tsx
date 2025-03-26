"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  console.log("AuthGuard isAuthenticated:", isAuthenticated);
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isAuthenticated, router]);

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
