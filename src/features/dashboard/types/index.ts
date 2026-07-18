import type { Transaction } from '@/types/models';

export interface AdminDashboardStats {
  total_users: number;
  active_users: number;
  blocked_users: number;
  total_plans: number;
  active_plans: number;
  total_codes: number;
  available_codes: number;
  assigned_codes: number;
  total_transactions: number;
  completed_transactions: number;
  pending_transactions: number;
  failed_transactions: number;
  total_revenue: number;
  monthly_revenue: number;
}

export interface UserDashboardStats {
  total_purchases: number;
  total_spent: number;
  active_codes: number;
  expired_codes: number;
}

export interface SystemHealthCheck {
  component: string;
  status: string;
  message: string;
}

export interface DailyTransaction {
  day: string;
  count: number;
  revenue: number;
}

export interface TopPlan {
  id: string;
  name: string;
  plan_type: string;
  cost: number;
  transaction_count: number;
}

export interface PaymentMethodStat {
  payment_method: string;
  count: number;
  revenue: number;
}

export interface UserRegistration {
  day: string;
  count: number;
}

export interface AnalyticsData {
  daily_transactions: DailyTransaction[];
  top_plans: TopPlan[];
  payment_methods: PaymentMethodStat[];
  user_registrations: UserRegistration[];
}

export type { Transaction };
