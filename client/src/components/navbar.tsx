"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const [mounted, setMounted] = useState(false);

  // Evita hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Renderiza versão não logada durante hydration
    return (
      <nav className="w-full border-b border-gray-200 bg-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link
            href="/"
            prefetch
            className="text-xl font-bold text-teal-600 flex items-center gap-2"
          >
            <Calendar className="h-6 w-6" />
            <span>Scheduler</span>
          </Link>

          <div className="hidden md:flex gap-6 items-center">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-700 hover:text-teal-600"
            >
              Funcionalidades
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-gray-700 hover:text-teal-600"
            >
              Preços
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-teal-600"
            >
              Suporte
            </Link>
          </div>

          <div className="flex gap-4 items-center">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600"
            >
              Entrar
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
            >
              Cadastrar
            </Link>
          </div>
        </div>
      </nav>
    );
  }

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
          {/* Sempre mostra login/registro na landing page */}
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
        </div>
      </div>
    </nav>
  );
}
