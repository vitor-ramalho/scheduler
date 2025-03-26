"use client";

import React from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 p-4 border-r">
          <nav className="space-y-4">
            <Link
              href="/dashboard"
              className="block text-gray-700 hover:text-teal-600 font-medium"
            >
              Dashboard Home
            </Link>
            <Link
              href="/dashboard/calendar"
              className="block text-gray-700 hover:text-teal-600 font-medium"
            >
              Calendar
            </Link>
            <Link
              href="/dashboard/patients"
              className="block text-gray-700 hover:text-teal-600 font-medium"
            >
              Patients
            </Link>
            <Link
              href="/dashboard/book-appointment"
              className="block text-gray-700 hover:text-teal-600 font-medium"
            >
              Book Appointment
            </Link>
            <Link
              href="/dashboard/reminders"
              className="block text-gray-700 hover:text-teal-600 font-medium"
            >
              Reminders
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-white">{children}</main>
      </div>
    </AuthGuard>
  );
}
