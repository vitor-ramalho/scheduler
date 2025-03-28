"use client";

import React from "react";
// import Link from 'next/link';
import { useAuth } from "@/hooks/useAuth"; // Assuming you have a custom hook for authentication
import { useRouter } from "next/navigation";
import CalendarPage from "./calendar/page";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <CalendarPage />
    </div>
  );
}
