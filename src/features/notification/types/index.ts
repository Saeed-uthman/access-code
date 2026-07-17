import type { Notification } from '@/types/models';
import type { PaginationParams } from '@/types/api';

export interface NotificationListParams extends PaginationParams {
  is_read?: boolean;
  notification_type?: string;
}

export interface BulkNotificationRequest {
  notification_type: string;
  title: string;
  message: string;
  target_audience: 'all' | 'verified' | 'unverified' | 'admin' | 'specific';
}

export interface UnreadCountResponse {
  count: number;
}

export type { Notification };
