"use client";

import React from "react";
import AdminGuard from "@/components/AdminGuard";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/userStore";

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setLogout } = useAuth();
  const { user } = useUserStore();

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-gray-900">Backoffice</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {user?.email} (Administrador)
                </span>
                <button
                  onClick={setLogout}
                  className="text-sm text-teal-600 hover:text-teal-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}