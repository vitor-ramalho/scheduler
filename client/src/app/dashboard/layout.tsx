"use client";

import React from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
