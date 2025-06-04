import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Bell, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getNotifications, markNotificationAsRead } from '@/services/notificationService';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const t = useTranslations('Notifications');

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    // This could be expanded with different icons for different notification types
    return <Bell className="h-4 w-4" />;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">{t('notifications')}</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} {t('new')}
            </Badge>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : notifications.length > 0 ? (
            <div>
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`
                    p-4 border-b flex justify-between items-start cursor-pointer hover:bg-gray-50
                    ${!notification.isRead ? 'bg-blue-50' : ''}
                  `}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 pt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              {t('noNotifications')}
            </div>
          )}
        </div>
        <div className="p-2 border-t">
          <Button variant="ghost" size="sm" className="w-full" onClick={fetchNotifications}>
            {t('refreshNotifications')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
