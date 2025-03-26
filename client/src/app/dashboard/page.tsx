"use client";

import React from "react";
// import Link from 'next/link';
import { useAuth } from "@/hooks/useAuth"; // Assuming you have a custom hook for authentication
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/calendar">
          <a className="block p-4 bg-blue-100 rounded-lg shadow hover:bg-blue-200">
            <h2 className="text-xl font-semibold">View Calendar</h2>
            <p>Manage appointments and schedules.</p>
          </a>
        </Link>
        <Link href="/dashboard/patients">
          <a className="block p-4 bg-green-100 rounded-lg shadow hover:bg-green-200">
            <h2 className="text-xl font-semibold">Patient Management</h2>
            <p>Search, view, and manage patient records.</p>
          </a>
        </Link>
        <Link href="/dashboard/book-appointment">
          <a className="block p-4 bg-yellow-100 rounded-lg shadow hover:bg-yellow-200">
            <h2 className="text-xl font-semibold">Book Appointment</h2>
            <p>Schedule new appointments for patients.</p>
          </a>
        </Link>
        <Link href="/dashboard/reminders">
          <a className="block p-4 bg-purple-100 rounded-lg shadow hover:bg-purple-200">
            <h2 className="text-xl font-semibold">Reminders</h2>
            <p>View and manage appointment reminders.</p>
          </a>
        </Link>
      </div> */}
    </div>
  );
}
