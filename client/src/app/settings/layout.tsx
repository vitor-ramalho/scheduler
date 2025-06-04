"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/settings/profile", label: "Profile" },
    { href: "/settings/subscription", label: "Subscription" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-2 rounded-md transition-colors ${
                      pathname === item.href
                        ? "bg-teal-50 text-teal-700 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
