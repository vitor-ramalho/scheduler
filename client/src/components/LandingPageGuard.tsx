"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/userStore";

export default function LandingPageGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { user } = useUserStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Só redireciona se estiver montado e autenticado
    if (mounted && isAuthenticated && user) {
      // Se for admin, vai para backoffice
      if (user.role === 'admin') {
        router.push("/backoffice");
        return;
      }
      
      // Se a organização estiver desabilitada, vai para página de organização desabilitada
      if (user.organization && !user.organization.enabled) {
        router.push("/organization-disabled");
        return;
      }
      
      // Se for usuário normal com organização habilitada, vai para dashboard
      router.push("/dashboard");
    }
  }, [mounted, isAuthenticated, user, router]);

  // Se não estiver montado ainda, mostra loading básico
  if (!mounted) {
    return <>{children}</>;
  }

  // Se estiver logado, não mostra a landing page (fica carregando até redirecionar)
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver logado, mostra a landing page normalmente
  return <>{children}</>;
}