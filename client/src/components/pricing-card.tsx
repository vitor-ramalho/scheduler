"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  popular?: boolean;
}

interface PricingCardProps {
  item: Plan;
  selectable?: boolean;
  selectedPlan?: Plan | null;
  onSelect?: (plan: Plan) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  item,
  selectable = false,
  selectedPlan,
  onSelect,
}) => {
  const isSelected = selectedPlan?.id === item.id;

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <Card
      className={`relative p-6 m-4 max-w-sm transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 border-blue-500" : "hover:shadow-lg"
      } ${selectable ? "cursor-pointer" : ""}`}
      onClick={selectable ? handleSelect : undefined}
    >
      {item.popular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
          Most Popular
        </Badge>
      )}
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">{item.name}</h3>
        <p className="text-gray-600 mb-4">{item.description}</p>
        <div className="mb-6">
          <span className="text-3xl font-bold">
            {item.currency === "USD" ? "$" : "R$"}
            {item.price}
          </span>
          <span className="text-gray-600">/{item.interval}</span>
        </div>
        <ul className="text-left space-y-2 mb-6">
          {item.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg
                className="w-4 h-4 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        {selectable && (
          <Button
            className={`w-full ${
              isSelected
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
            onClick={handleSelect}
          >
            {isSelected ? "Selected" : "Select Plan"}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default PricingCard;

  onSelect?: (plan: Plan) => void;

}interface PricingCardProps {

  item: Plan;

const PricingCard: React.FC<PricingCardProps> = ({   selectable?: boolean;

  item,   selectedPlan?: Plan | null;

  selectable = false,   onSelect?: (plan: Plan) => void;

  selectedPlan, }

  onSelect 

}) => {export default function PricingCard({

  const isSelected = selectedPlan?.id === item.id;  item,

  selectable = false,

  const handleSelect = () => {  selectedPlan,

    if (onSelect) {  onSelect,

      onSelect(item);}: PricingCardProps) {

    }  const t = useTranslations("Pricing");

  };

  const getFeatures = (planName: string | undefined | null) => {

  return (    const baseFeatures = [

    <Card       t("features.smartScheduling"),

      className={`relative p-6 m-4 max-w-sm transition-all duration-200 ${      t("features.clientManagement"),

        isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:shadow-lg'      t("features.emailReminders"),

      } ${selectable ? 'cursor-pointer' : ''}`}    ];

      onClick={selectable ? handleSelect : undefined}

    >    if (!planName) {

      {item.popular && (      return baseFeatures;

        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">    }

          Most Popular

        </Badge>    const planNameLower = planName.toLowerCase();

      )}

          if (planNameLower.includes("basic")) {

      <div className="text-center">      return [

        <h3 className="text-xl font-bold mb-2">{item.name}</h3>        ...baseFeatures,

        <p className="text-gray-600 mb-4">{item.description}</p>        t("features.hundredClients"),

                t("features.oneProfessional"),

        <div className="mb-6">      ];

          <span className="text-3xl font-bold">    } else if (planNameLower.includes("pro")) {

            {item.currency === 'USD' ? '$' : 'R$'}{item.price}      return [

          </span>        ...baseFeatures,

          <span className="text-gray-600">/{item.interval}</span>        "Unlimited patients",

        </div>        "Up to 5 practitioners",

        "SMS reminders",

        <ul className="text-left space-y-2 mb-6">        "Custom appointment types",

          {item.features.map((feature, index) => (      ];

            <li key={index} className="flex items-center">    } else {

              <svg       return [

                className="w-4 h-4 text-green-500 mr-2"         ...baseFeatures,

                fill="none"         "Unlimited patients",

                stroke="currentColor"         "Unlimited practitioners",

                viewBox="0 0 24 24"        "SMS & WhatsApp reminders",

              >        "Custom appointment types",

                <path         "API access",

                  strokeLinecap="round"         "Priority support",

                  strokeLinejoin="round"       ];

                  strokeWidth={2}     }

                  d="M5 13l4 4L19 7"   };

                />

              </svg>  const features = getFeatures(item?.name);

              {feature}

            </li>  return (

          ))}    <Card

        </ul>      className={`w-[350px] relative overflow-hidden cursor-pointer ${

        selectable && selectedPlan?.id === item.id

        {selectable && (          ? "border-2 border-teal-500 shadow-xl scale-105"

          <Button           : "border border-gray-200"

            className={`w-full ${      }`}

              isSelected       onClick={() => selectable && onSelect && onSelect(item)}

                ? 'bg-blue-600 hover:bg-blue-700'     >

                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'      {item.popular && (

            }`}        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-blue-50 opacity-30" />

            onClick={handleSelect}      )}

          >      <CardHeader className="relative">

            {isSelected ? 'Selected' : 'Select Plan'}        {item.popular && (

          </Button>          <div className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-blue-600 rounded-full w-fit mb-4">

        )}            Most Popular

      </div>          </div>

    </Card>        )}

  );        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">

};          {t("plans." + item.name)}

        </CardTitle>

export default PricingCard;        <CardDescription className="flex items-baseline gap-2 mt-2">
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
