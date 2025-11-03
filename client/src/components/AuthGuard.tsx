"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/userStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { user } = useUserStore();
  const router = useRouter();

  console.log("AuthGuard isAuthenticated:", isAuthenticated);
  console.log("AuthGuard user:", user);
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }

    // Se for admin, redirecionar para backoffice
    if (user?.role === 'admin') {
      router.push("/backoffice");
      return;
    }

    // Se a organização estiver desabilitada, redirecionar para página de organização desabilitada
    if (user?.organization && !user.organization.enabled) {
      router.push("/organization-disabled");
      return;
    }
  }, [isAuthenticated, user, router]);

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Se for admin, não mostrar o dashboard
  if (user?.role === 'admin') {
    return null;
  }

  return <>{children}</>;
}
