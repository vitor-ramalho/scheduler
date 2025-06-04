import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle, Clock, RefreshCcw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import { getOrganizations, updateOrganization } from '@/services/adminService';

interface Organization {
  id: string;
  name: string;
  isPlanActive: boolean;
  planExpiresAt?: string;
  plan?: {
    id: string;
    name: string;
    price: number;
  };
  paymentId?: string;
}

export default function SubscriptionManagement() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations('Admin');
  const { toast } = useToast();

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrganizations();
      setOrganizations(data);
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      toast({
        variant: "destructive",
        title: t('fetchError'),
        description: t('organizationsFetchError'),
      });
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    // Only super admins can access this page
    if (user?.role !== 'superadmin') {
      router.push('/dashboard');
      return;
    }

    fetchOrganizations();
  }, [user, router, fetchOrganizations]);

  const activateSubscription = async (organizationId: string) => {
    try {
      setActionLoading(organizationId);
      
      // Set expiration to 1 month from now
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      
      await updateOrganization(organizationId, {
        isPlanActive: true,
        planExpiresAt: expiresAt.toISOString(),
      });
      
      // Update local state
      setOrganizations(orgs => 
        orgs.map(org => 
          org.id === organizationId 
            ? { ...org, isPlanActive: true, planExpiresAt: expiresAt.toISOString() } 
            : org
        )
      );
      
      toast({
        title: t('success'),
        description: t('subscriptionActivated'),
      });
    } catch (error) {
      console.error('Failed to activate subscription:', error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('activationError'),
      });
    } finally {
      setActionLoading(null);
    }
  };

  const deactivateSubscription = async (organizationId: string) => {
    try {
      setActionLoading(organizationId);
      
      await updateOrganization(organizationId, {
        isPlanActive: false,
        planExpiresAt: null,
      });
      
      // Update local state
      setOrganizations(orgs => 
        orgs.map(org => 
          org.id === organizationId 
            ? { ...org, isPlanActive: false, planExpiresAt: undefined } 
            : org
        )
      );
      
      toast({
        title: t('success'),
        description: t('subscriptionDeactivated'),
      });
    } catch (error) {
      console.error('Failed to deactivate subscription:', error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('deactivationError'),
      });
    } finally {
      setActionLoading(null);
    }
  };

  const extendSubscription = async (organizationId: string) => {
    try {
      setActionLoading(organizationId);
      
      // Find the current organization
      const organization = organizations.find(org => org.id === organizationId);
      if (!organization) return;
      
      // Calculate new expiration date
      let newExpiresAt = new Date();
      if (organization.planExpiresAt) {
        newExpiresAt = new Date(organization.planExpiresAt);
      }
      newExpiresAt.setMonth(newExpiresAt.getMonth() + 1);
      
      await updateOrganization(organizationId, {
        isPlanActive: true,
        planExpiresAt: newExpiresAt.toISOString(),
      });
      
      // Update local state
      setOrganizations(orgs => 
        orgs.map(org => 
          org.id === organizationId 
            ? { ...org, isPlanActive: true, planExpiresAt: newExpiresAt.toISOString() } 
            : org
        )
      );
      
      toast({
        title: t('success'),
        description: t('subscriptionExtended'),
      });
    } catch (error) {
      console.error('Failed to extend subscription:', error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('extensionError'),
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>{t('subscriptionManagement')}</CardTitle>
          <CardDescription>{t('subscriptionManagementDescription')}</CardDescription>
          
          <div className="flex justify-end">
            <Button 
              onClick={fetchOrganizations}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              {t('refresh')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>{t('organizationsList')}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>{t('organization')}</TableHead>
                <TableHead>{t('plan')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('expiresAt')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>{org.plan?.name || t('noPlan')}</TableCell>
                  <TableCell>
                    {org.isPlanActive ? (
                      <Badge variant="success" className="flex items-center gap-1 w-fit">
                        <CheckCircle className="h-3 w-3" />
                        {t('active')}
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                        <AlertTriangle className="h-3 w-3" />
                        {t('inactive')}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {org.planExpiresAt ? (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(org.planExpiresAt), 'PP')}
                      </span>
                    ) : (
                      t('noExpiration')
                    )}
                  </TableCell>
                  <TableCell className="space-x-2">
                    {org.isPlanActive ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => extendSubscription(org.id)}
                          disabled={actionLoading === org.id}
                        >
                          {actionLoading === org.id ? t('extending') : t('extend')}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deactivateSubscription(org.id)}
                          disabled={actionLoading === org.id}
                        >
                          {actionLoading === org.id ? t('deactivating') : t('deactivate')}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => activateSubscription(org.id)}
                        disabled={actionLoading === org.id}
                      >
                        {actionLoading === org.id ? t('activating') : t('activate')}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              
              {organizations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {t('noOrganizations')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
