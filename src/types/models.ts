export type PlanType = 'house' | 'individual' | 'business';
export type Validity = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
export type AccessCodeStatus = 'available' | 'assigned' | 'used' | 'expired';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
export type PaymentMethod = 'paystack' | 'manual' | 'bank_transfer';
export type UserRole = 'user' | 'admin' | 'superadmin';
export type NotificationType = string;
export type AudienceType = 'all' | 'verified' | 'unverified' | 'admin' | 'specific';
export type BulkNotificationStatus = 'pending' | 'sent' | 'failed';

export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  phone_number: string | null;
  role: UserRole;
  is_email_verified: boolean;
  is_blocked: boolean;
  created_at: string;
  profile?: UserProfile | null;
  is_admin?: boolean;
}

export interface UserProfile {
  id: string;
  user: string;
  address: string | null;
  date_of_birth: string | null;
}

export interface Plan {
  id: string;
  name: string;
  plan_type: PlanType;
  cost: number;
  validity: Validity;
  validity_days: number;
  is_active: boolean;
  created_at: string;
  available_codes_count?: number;
  sold_codes_count?: number;
}

export interface AccessCode {
  id: string;
  code: string;
  plan: string;
  status: AccessCodeStatus;
  assigned_to: string | null;
  used_by: string | null;
  assigned_at: string | null;
  used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  user: string | null;
  plan: string;
  access_code: string | null;
  amount: number;
  quantity: number;
  total_amount: number;
  status: TransactionStatus;
  payment_method: PaymentMethod;
  payment_reference: string;
  gateway_reference: string;
  paid_at: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user: string;
  notification_type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface BulkNotification {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  target_audience: AudienceType;
  status: BulkNotificationStatus;
  sent_count: number;
  failed_count: number;
  sent_at: string | null;
  created_at: string;
}

export interface DashboardStats {
  total_users: number;
  total_plans: number;
  total_codes: number;
  total_transactions: number;
  total_revenue: number;
  active_codes: number;
  used_codes: number;
  pending_transactions: number;
  recent_signups: number;
  recent_transactions: Transaction[];
}

export interface AnalyticsData {
  daily: Array<{ date: string; revenue: number; transactions: number; users: number }>;
  monthly: Array<{ month: string; revenue: number; transactions: number; users: number }>;
  plan_distribution: Array<{ plan_type: PlanType; count: number; revenue: number }>;
  payment_method_distribution: Array<{ method: PaymentMethod; count: number; amount: number }>;
}

export interface SystemStats {
  total_users: number;
  total_plans: number;
  total_codes: number;
  total_transactions: number;
  total_revenue: number;
  server_uptime: string;
  db_size: string;
  last_backup: string | null;
}

export interface RefundRequest {
  id: string;
  transaction: string;
  user: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  processed_at: string | null;
}

export interface PaymentLog {
  id: string;
  transaction: string;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, unknown>;
  ip_address: string;
  created_at: string;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryPhoto {
  id: string;
  image: string;
  caption: string | null;
  is_active: boolean;
  order: number;
  created_at: string;
}
