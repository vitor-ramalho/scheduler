import api from './apiService';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  organizationId: string;
  userId?: string;
  additionalData?: Record<string, unknown>;
}

export async function getNotifications(): Promise<Notification[]> {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    throw new Error('Failed to fetch notifications');
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  try {
    await api.patch(`/notifications/${id}/read`);
  } catch (error) {
    console.error(`Failed to mark notification ${id} as read:`, error);
    throw new Error('Failed to mark notification as read');
  }
}

export async function deleteNotification(id: string): Promise<void> {
  try {
    await api.delete(`/notifications/${id}`);
  } catch (error) {
    console.error(`Failed to delete notification ${id}:`, error);
    throw new Error('Failed to delete notification');
  }
}

export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    await api.post('/notifications/read-all');
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    throw new Error('Failed to mark all notifications as read');
  }
}
