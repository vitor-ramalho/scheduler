"use client";

import { useEffect, useRef } from "react";
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
import { useTranslations } from "next-intl";

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  interval?: string;
  popular?: boolean;
}

interface PricingCardProps {
  user: any;
  item: Plan;
  selectable?: boolean;
  selectedPlan?: Plan | null;
  onSelect?: (plan: Plan) => void;
  onDeselect?: () => void;
}

export default function PricingCard({
  user,
  item,
  selectable = false,
  selectedPlan,
  onSelect,
  onDeselect,
}: PricingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("Pricing");

  useEffect(() => {
    if (!selectable) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        if (selectedPlan?.id === item.id && onDeselect) {
          onDeselect();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectable, selectedPlan, item.id, onDeselect]);

  const handleCheckout = async (priceId: string) => {
    if (!user) {
      window.location.href = "/sign-in?redirect=pricing";
      return;
    }

    try {
      // Placeholder for checkout logic
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const getFeatures = (planName: string | undefined | null) => {
    const baseFeatures = [
      t("features.smartScheduling"),
      t("features.clientManagement"),
      t("features.emailReminders"),
    ];

    if (!planName) {
      return baseFeatures;
    }

    const planNameLower = planName.toLowerCase();

    if (planNameLower.includes("basic")) {
      return [
        ...baseFeatures,
        t("features.hundredClients"),
        t("features.oneProfessional"),
      ];
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
      ref={cardRef}
      className={`w-[350px] relative overflow-hidden cursor-pointer ${
        selectable && selectedPlan?.id === item.id
          ? "border-2 border-teal-500 shadow-xl scale-105"
          : "border border-gray-200"
      }`}
      onClick={() => selectable && onSelect && onSelect(item)}
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
          {t("plans." + item.name)}
        </CardTitle>
        <CardDescription className="flex items-baseline gap-2 mt-2">
          <span className="text-4xl font-bold text-gray-900">
            R${item?.price}
          </span>
          <span className="text-gray-600">
            / {t("interval." + item?.interval)}
          </span>
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
    </Card>
  );
}
