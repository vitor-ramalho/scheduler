"use client";

import { Button } from "./ui/button";
import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function PricingCard({
  item,
  user,
}: {
  item: any;
  user: any | null;
}) {
  // Handle checkout process
  const handleCheckout = async (priceId: string) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = "/sign-in?redirect=pricing";
      return;
    }

    try {
      // const { data, error } = await supabase.functions.invoke(
      //   "supabase-functions-create-checkout",
      //   {
      //     body: {
      //       price_id: priceId,
      //       user_id: user.id,
      //       return_url: `${window.location.origin}/dashboard`,
      //     },
      //     headers: {
      //       "X-Customer-Email": user.email || "",
      //     },
      //   },
      // );

      // if (error) {
      //   throw error;
      // }

      // Redirect to Stripe checkout
      // if (data?.url) {
      //   window.location.href = data.url;
      // } else {
      //   throw new Error("No checkout URL returned");
      // }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  // Define features based on plan type
  const getFeatures = (planName: string | undefined | null) => {
    const baseFeatures = [
      "Patient appointment scheduling",
      "Calendar management",
      "Email reminders",
    ];

    if (!planName) {
      return baseFeatures;
    }

    const planNameLower = planName.toLowerCase();

    if (planNameLower.includes("basic")) {
      return [...baseFeatures, "Up to 100 patients", "1 practitioner"];
    } else if (planNameLower.includes("pro")) {
      return [
        ...baseFeatures,
        "Unlimited patients",
        "Up to 5 practitioners",
        "SMS reminders",
        "Custom appointment types",
      ];
    } else {
      return [
        ...baseFeatures,
        "Unlimited patients",
        "Unlimited practitioners",
        "SMS & WhatsApp reminders",
        "Custom appointment types",
        "API access",
        "Priority support",
      ];
    }
  };

  const features = getFeatures(item?.name);

  return (
    <Card
      className={`w-[350px] relative overflow-hidden ${item.popular ? "border-2 border-teal-500 shadow-xl scale-105" : "border border-gray-200"}`}
    >
      {item.popular && (
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-blue-50 opacity-30" />
      )}
      <CardHeader className="relative">
        {item.popular && (
          <div className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-blue-600 rounded-full w-fit mb-4">
            Most Popular
          </div>
        )}
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
          {item.name}
        </CardTitle>
        <CardDescription className="flex items-baseline gap-2 mt-2">
          <span className="text-4xl font-bold text-gray-900">
            ${item?.amount / 100}
          </span>
          <span className="text-gray-600">/{item?.interval}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <ul className="space-y-3 mt-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="relative">
        <Button
          onClick={async () => {
            await handleCheckout(item.id);
          }}
          className={`w-full py-6 text-lg font-medium bg-teal-600 hover:bg-teal-700`}
        >
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
}
