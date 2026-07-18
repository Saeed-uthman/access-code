export type PlanType = 'house' | 'individual' | 'business';
export type Validity = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export type AccessCodeStatus = 'available' | 'assigned' | 'used' | 'expired';
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
export type PaymentMethod = 'paystack' | 'flutterwave' | 'bank_transfer' | 'card';
export type UserRole = 'user' | 'admin' | 'superadmin';
export type NotificationType = 'payment_success' | 'payment_failed' | 'payment_reminder' | 'codes_assigned' | 'expiry_warning' | 'low_stock' | 'system_announcement' | 'account_update' | 'general';
export type AudienceType = 'all_users' | 'admin_users' | 'regular_users' | 'house_plan_users' | 'individual_plan_users' | 'business_plan_users' | 'verified_users' | 'unverified_users';
export type BulkNotificationStatus = 'draft' | 'sending' | 'sent' | 'failed';

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
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  available_codes_count?: number;
  sold_codes_count?: number;
}

export interface AccessCode {
  id: string;
  code: string;
  plan: Plan | string;
  status: AccessCodeStatus;
  is_used: boolean;
  assigned_to: User | string | null;
  used_by: User | string | null;
  assigned_at: string | null;
  used_at: string | null;
  expires_at: string | null;
  days_until_expiry: number | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user: User | string | null;
  plan: Plan | string;
  access_code: string | null;
  amount: number;
  quantity: number;
  total_amount: number;
  status: TransactionStatus;
  payment_method: PaymentMethod;
  payment_reference: string;
  gateway_reference: string;
  description: string;
  notes: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user: string;
  notification_type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  action_url: string;
  action_text: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface BulkNotification {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  target_audience: AudienceType;
  status: BulkNotificationStatus;
  total_recipients: number;
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
  daily_transactions: Array<{ day: string; count: number; revenue: number }>;
  top_plans: Array<{ id: string; name: string; plan_type: string; cost: number; transaction_count: number }>;
  payment_methods: Array<{ payment_method: string; count: number; revenue: number }>;
  user_registrations: Array<{ day: string; count: number }>;
}

export interface SystemStats {
  users_stats: {
    total_users: number;
    admin_users: number;
    regular_users: number;
    blocked_users: number;
  };
  plans_stats: {
    total_plans: number;
    active_plans: number;
  };
  transactions_stats: {
    total_transactions: number;
    completed_transactions: number;
    total_revenue: number;
  };
  access_codes_stats: {
    total_codes: number;
    available_codes: number;
  };
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
  user: string | null;
  action_type: string;
  description: string;
  ip_address: string | null;
  user_agent: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryPhoto {
  id: string;
  photo: string;
  date_uploaded: string;
}
