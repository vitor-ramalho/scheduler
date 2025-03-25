"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Calendar } from "lucide-react";
import UserProfile from "./user-profile";
import { useUserStore } from "../store/userStore";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const user = useUserStore((state) => state.user);

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          prefetch
          className="text-xl font-bold text-teal-600 flex items-center gap-2"
        >
          <Calendar className="h-6 w-6" />
          <span>{t("brand")}</span>
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          <Link
            href="#features"
            className="text-sm font-medium text-gray-700 hover:text-teal-600"
          >
            {t("links.features")}
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-gray-700 hover:text-teal-600"
          >
            {t("links.pricing")}
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-teal-600"
          >
            {t("links.support")}
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/dashboard" className="px-4 py-2 text-sm font-medium">
                <Button className="bg-teal-600 hover:bg-teal-700">
                  {t("links.dashboard")}
                </Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600"
              >
                {t("links.signIn")}
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
              >
                {t("links.signUp")}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
