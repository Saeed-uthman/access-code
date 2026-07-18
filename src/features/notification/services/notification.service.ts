import { get, post } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api';
import type { Notification, NotificationListParams, BulkNotificationRequest, UnreadCountResponse } from '../types';

export const notificationService = {
  getNotifications(params?: NotificationListParams): Promise<PaginatedResponse<Notification>> {
    return get<PaginatedResponse<Notification>>('/notifications/', { params });
  },

  markRead(id: string): Promise<{ message: string }> {
    return post(`/notifications/${id}/read/`);
  },

  markAllRead(): Promise<{ message: string }> {
    return post('/notifications/read-all/');
  },

  getUnreadCount(): Promise<UnreadCountResponse> {
    return get<UnreadCountResponse>('/notifications/unread-count/');
  },

  getAdminNotifications(): Promise<PaginatedResponse<Notification>> {
    return get<PaginatedResponse<Notification>>('/notifications/admin/');
  },

  sendBulkNotification(data: BulkNotificationRequest): Promise<{ message: string }> {
    return post('/notifications/admin/bulk/', data);
  },
};
