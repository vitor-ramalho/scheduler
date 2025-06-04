"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubscriptionManagement from '@/components/admin/SubscriptionManagement';
import SubscriptionAnalytics from '@/components/admin/SubscriptionAnalytics';
import { useTranslations } from 'next-intl';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations('Admin');
  const [activeTab, setActiveTab] = React.useState('management');

  // Only allow superadmins to access this page
  React.useEffect(() => {
    if (user && user.role !== 'superadmin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'superadmin') {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">{t('adminDashboard')}</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="management">{t('subscriptionManagement')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('subscriptionAnalytics')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="management">
          <SubscriptionManagement />
        </TabsContent>
        
        <TabsContent value="analytics">
          <SubscriptionAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
