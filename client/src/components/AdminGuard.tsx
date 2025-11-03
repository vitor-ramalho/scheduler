"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { Loader2 } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    // Se não há usuário, redirecionar para login
    if (!user) {
      router.push("/sign-in");
      return;
    }

    // Se não é admin, redirecionar para dashboard
    if (user.role !== 'admin') {
      router.push("/dashboard");
      return;
    }
  }, [user, router]);

  // Loading enquanto verifica
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  // Se não é admin, não mostrar nada (será redirecionado)
  if (user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Acesso negado - Apenas administradores</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}