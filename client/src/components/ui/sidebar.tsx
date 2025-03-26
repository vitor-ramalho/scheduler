"use client";

import Link from "next/link";
import { useState } from "react";
import { Calendar, Users, Bell, ClipboardList, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative text-gray-900">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-teal-600 text-white p-2 rounded-full shadow-lg"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-lg transform transition-transform duration-300 z-40",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:static md:w-64"
        )}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-teal-600 mb-6">MediSchedule</h2>
          <nav className="space-y-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 text-gray-900 hover:text-teal-600 font-medium"
            >
              <Calendar className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/calendar"
              className="flex items-center gap-3 text-gray-700 hover:text-teal-600 font-medium"
            >
              <ClipboardList className="h-5 w-5" />
              Calendar
            </Link>
            <Link
              href="/dashboard/patients"
              className="flex items-center gap-3 text-gray-700 hover:text-teal-600 font-medium"
            >
              <Users className="h-5 w-5" />
              Patients
            </Link>
            <Link
              href="/dashboard/book-appointment"
              className="flex items-center gap-3 text-gray-700 hover:text-teal-600 font-medium"
            >
              <ClipboardList className="h-5 w-5" />
              Book Appointment
            </Link>
            <Link
              href="/dashboard/reminders"
              className="flex items-center gap-3 text-gray-700 hover:text-teal-600 font-medium"
            >
              <Bell className="h-5 w-5" />
              Reminders
            </Link>
          </nav>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
