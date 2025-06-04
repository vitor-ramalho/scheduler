import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader } from 'lucide-react';
import { getSubscriptionAnalytics, getSubscriptionHistory } from '@/services/adminService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function SubscriptionAnalytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  const t = useTranslations('Admin');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (selectedOrganizationId) {
      fetchSubscriptionHistory(selectedOrganizationId);
    }
  }, [selectedOrganizationId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getSubscriptionAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch subscription analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionHistory = async (organizationId) => {
    try {
      setHistoryLoading(true);
      const data = await getSubscriptionHistory(organizationId);
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch subscription history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Format data for charts
  const prepareStatusData = () => {
    if (!analytics) return [];
    
    return [
      { name: t('active'), value: analytics.activeSubscriptions },
      { name: t('inactive'), value: analytics.totalOrganizations - analytics.activeSubscriptions },
    ];
  };

  const prepareRevenueData = () => {
    if (!analytics?.revenueMetrics) return [];
    
    return [
      { name: t('previousMonth'), amount: analytics.revenueMetrics.prevMonthRevenue },
      { name: t('currentMonth'), amount: analytics.revenueMetrics.currentMonthRevenue },
    ];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('subscriptionAnalytics')}</CardTitle>
          <CardDescription>{t('subscriptionAnalyticsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
              <TabsTrigger value="revenue">{t('revenue')}</TabsTrigger>
              <TabsTrigger value="history">{t('history')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t('totalOrganizations')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics?.totalOrganizations || 0}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t('activeSubscriptions')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {analytics?.activeSubscriptions || 0}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t('expiringSubscriptions')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-500">
                      {analytics?.expiringWithin30Days || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('expiringNext30Days')}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      {t('subscriptionStatus')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareStatusData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {prepareStatusData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      {t('subscriptionActivity')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>{t('renewedLast30Days')}</span>
                      <Badge variant="outline">{analytics?.renewedLast30Days || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t('cancelledLast30Days')}</span>
                      <Badge variant="outline">{analytics?.cancelledLast30Days || 0}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="revenue">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">{t('revenueComparison')}</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareRevenueData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                      <Bar dataKey="amount" name={t('revenue')} fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t('monthlyRecurringRevenue')}</span>
                      <span className="font-medium">${analytics?.revenueMetrics?.mrr || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('growthRate')}</span>
                      <span className={`font-medium ${analytics?.revenueMetrics?.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {analytics?.revenueMetrics?.growthRate >= 0 ? '+' : ''}
                        {analytics?.revenueMetrics?.growthRate?.toFixed(2) || 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <p className="mb-4">{t('selectOrganizationToViewHistory')}</p>
              {/* Organization selector would go here - simplified for now */}
              
              {historyLoading ? (
                <div className="flex items-center justify-center h-[200px]">
                  <Loader className="h-8 w-8 animate-spin" />
                </div>
              ) : history.length > 0 ? (
                <div className="border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('date')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('status')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('plan')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('amount')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {history.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant={
                                item.status === 'active'
                                  ? 'success'
                                  : item.status === 'pending'
                                  ? 'outline'
                                  : 'destructive'
                              }
                            >
                              {item.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.plan?.name || t('noPlan')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${item.plan?.price || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  {selectedOrganizationId ? t('noHistoryFound') : t('pleaseSelectOrganization')}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
