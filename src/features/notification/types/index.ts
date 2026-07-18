import type { Notification } from '@/types/models';
import type { PaginationParams } from '@/types/api';

export interface NotificationListParams extends PaginationParams {
  is_read?: boolean;
  notification_type?: string;
}

export type TargetAudience =
  | 'all_users' | 'admin_users' | 'regular_users'
  | 'house_plan_users' | 'individual_plan_users' | 'business_plan_users'
  | 'verified_users' | 'unverified_users';

export interface BulkNotificationRequest {
  notification_type: string;
  title: string;
  message: string;
  target_audience: TargetAudience;
}

export interface UnreadCountResponse {
  unread_count: number;
}

export type { Notification };
