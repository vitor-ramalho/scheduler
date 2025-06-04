"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { user } = useUserStore();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    // Initialize form with user data
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setEmail(user.email || "");
  }, [user, router]);

  const handleSave = async () => {
    setSaving(true);
    
    // Here you would typically call an API to update the profile
    // This is a placeholder for future implementation
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <Input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full"
              disabled={saving}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <Input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full"
              disabled={saving}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              disabled={true} // Email usually cannot be changed
            />
            <p className="text-sm text-gray-500 mt-1">
              Email address cannot be changed. Contact support if you need to update your email.
            </p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization
            </label>
            <Input
              type="text"
              value={user.organization?.name || ""}
              className="w-full"
              disabled={true}
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2 rounded-md ${
              saving
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700 text-white"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
