"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getSubscriptionStatus } from "@/services/subscriptionService";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isPlanActive, setIsPlanActive] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }

    const checkSubscription = async () => {
      if (user?.organization?.id) {
        try {
          const response = await getSubscriptionStatus(user.organization.id);
          setIsPlanActive(response.organization.isPlanActive);
        } catch (error) {
          console.error("Failed to check subscription:", error);
          // Default to inactive if check fails
          setIsPlanActive(false);
        }
      }
      setIsLoading(false);
    };

    checkSubscription();
  }, [isAuthenticated, router, user]);

  // Show nothing while redirecting or loading
  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect to onboarding if plan is not active
  if (isPlanActive === false) {
    router.push("/onboarding");
    return null;
  }

  return <>{children}</>;
}
