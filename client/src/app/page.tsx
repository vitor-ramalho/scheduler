"use client";

import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
// import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  Calendar,
  ClipboardCheck,
  Clock,
  Bell,
  Shield,
  Users,
  CalendarClock,
  UserRound,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  // const supabase = await createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // const { data: plans, error } = await supabase.functions.invoke(
  //   "supabase-functions-get-plans",
  // );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              {t("title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <CalendarClock className="w-6 h-6" />,
                title: t("features.smartScheduling.title"),
                description: t("features.smartScheduling.description"),
              },
              {
                icon: <UserRound className="w-6 h-6" />,
                title: t("features.patientRecords.title"),
                description: t("features.patientRecords.description"),
              },
              {
                icon: <ClipboardCheck className="w-6 h-6" />,
                title: t("features.consultationTypes.title"),
                description: t("features.consultationTypes.description"),
              },
              {
                icon: <Bell className="w-6 h-6" />,
                title: t("features.automatedReminders.title"),
                description: t("features.automatedReminders.description"),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-teal-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-teal-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">30%</div>
              <div className="text-teal-100">{t("stats.reductionNoShows")}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-teal-100">
                {t("stats.medicalProfessionals")}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-teal-100">{t("stats.hoursSaved")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              {t("pricing.title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("pricing.description")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                id: 1,
                name: "Basic Plan",
                amount: 2900, // $29.00
                interval: "month",
                popular: false,
              },
              {
                id: 2,
                name: "Pro Plan",
                amount: 5900, // $59.00
                interval: "month",
                popular: true,
              },
              {
                id: 3,
                name: "Enterprise Plan",
                amount: 0, // Custom pricing
                interval: "custom",
                popular: false,
              },
            ].map((item) => (
              <PricingCard key={item.id} item={item} user={{}} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("cta.description")}
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
          >
            {t("cta.button")}
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
