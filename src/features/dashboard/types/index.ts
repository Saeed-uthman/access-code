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
  recent_transactions: Transaction[];
}

export interface SystemHealth {
  status: string;
  uptime: string;
  version: string;
  database: string;
  cache: string;
}

export interface AnalyticsData {
  daily: Array<{ date: string; revenue: number; transactions: number; users: number }>;
  monthly: Array<{ month: string; revenue: number; transactions: number; users: number }>;
  plan_distribution: Array<{ plan_type: string; count: number; revenue: number }>;
  payment_method_distribution: Array<{ method: string; count: number; amount: number }>;
}

export type { Transaction };
