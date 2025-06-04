"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { getPlans, IPlan } from "@/services/plansService";
import { toast } from "@/components/ui/use-toast";
import PlanCard from "@/components/plans/PlanCard";
import { useEffect } from "react";

export default function SubscriptionPage() {
  const { user } = useUserStore();
  const router = useRouter();
  const [availablePlans, setAvailablePlans] = useState<IPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [changingPlan, setChangingPlan] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    // Set the current plan as selected
    if (user.organization?.plan?.id) {
      setSelectedPlanId(user.organization.plan.id);
    }

    // Fetch available plans
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const plans = await getPlans();
        setAvailablePlans(plans);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load plans. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [user, router]);

  const handlePlanChange = async () => {
    if (selectedPlanId === user?.organization?.plan?.id) {
      toast({
        title: "Info",
        description: "You're already subscribed to this plan.",
      });
      return;
    }

    setChangingPlan(true);
    
    // Here you would typically call an API to change the plan
    // This is a placeholder for future implementation
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Your plan has been updated successfully.",
      });
      
      // In a real implementation, you'd update the user's plan in the store
      // and refresh the user data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setChangingPlan(false);
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Subscription Management</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
        {user.organization?.plan ? (
          <div className="border border-teal-200 bg-teal-50 rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{user.organization.plan.name}</h3>
                <p className="text-gray-600 mt-1">{user.organization.plan.description}</p>
                <p className="text-teal-700 font-medium mt-2">
                  ${Number(user.organization.plan.price).toFixed(2)}
                  <span className="text-gray-500 text-sm">/{user.organization.plan.interval}</span>
                </p>
              </div>
              <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                Active
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Features:</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {user.organization.plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-teal-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No active subscription.</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading available plans...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {availablePlans.map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isSelected={selectedPlanId === plan.id}
                  onSelect={() => setSelectedPlanId(plan.id)}
                />
              ))}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handlePlanChange}
                disabled={changingPlan || selectedPlanId === user?.organization?.plan?.id}
                className={`px-6 py-2 rounded-md ${
                  changingPlan || selectedPlanId === user?.organization?.plan?.id
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700 text-white"
                }`}
              >
                {changingPlan ? "Updating..." : "Change Plan"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
