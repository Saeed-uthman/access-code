import { get, post, put } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api';
import type { Notification, NotificationListParams, BulkNotificationRequest, UnreadCountResponse } from '../types';

export const notificationService = {
  getNotifications(params?: NotificationListParams): Promise<PaginatedResponse<Notification>> {
    return get<PaginatedResponse<Notification>>('/api/v1/notifications/', { params });
  },

  markRead(id: string): Promise<Notification> {
    return put<Notification>(`/api/v1/notifications/${id}/read/`);
  },

  markAllRead(): Promise<{ message: string }> {
    return put('/api/v1/notifications/read-all/');
  },

  getUnreadCount(): Promise<UnreadCountResponse> {
    return get<UnreadCountResponse>('/api/v1/notifications/unread-count/');
  },

  getAdminNotifications(): Promise<PaginatedResponse<Notification>> {
    return get<PaginatedResponse<Notification>>('/api/v1/admin/notifications/');
  },

  sendBulkNotification(data: BulkNotificationRequest): Promise<{ message: string; sent_count: number }> {
    return post('/api/v1/admin/notifications/send/', data);
  },
};
