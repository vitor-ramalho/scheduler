"use client";

import { useUserStore } from "@/store/userStore";
import { useAuth } from "@/hooks/useAuth";
import { ChevronDown, User, LogOut } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { user } = useUserStore();
  const { setLogout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-teal-600">
              {user?.organization?.name || 'Dashboard'}
            </h1>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-lg px-3 py-2"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-teal-600" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.email}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                    {user?.organization && (
                      <div className="text-xs text-gray-500 mt-1">
                        {user.organization.name}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      setLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
}