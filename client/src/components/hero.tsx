import Link from "next/link";
import { ArrowUpRight, Calendar, Users, Clock, Bell } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50 opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              {t("title")}
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              {t("description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors text-lg font-medium"
              >
                {t("cta.dashboard")}
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="#pricing"
                className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                {t("cta.pricing")}
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 justify-center">
                <Calendar className="w-5 h-5 text-teal-500" />
                <span className="text-gray-600">
                  {t("features.smartScheduling")}
                </span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Users className="w-5 h-5 text-teal-500" />
                <span className="text-gray-600">
                  {t("features.patientManagement")}
                </span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Bell className="w-5 h-5 text-teal-500" />
                <span className="text-gray-600">
                  {t("features.automatedReminders")}
                </span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Clock className="w-5 h-5 text-teal-500" />
                <span className="text-gray-600">
                  {t("features.onlineBooking")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
