import { get } from '@/lib/api-client';
import type {
  AdminDashboardStats,
  UserDashboardStats,
  SystemHealthCheck,
  AnalyticsData,
} from '../types';

export const dashboardService = {
  getDashboardStats(): Promise<UserDashboardStats | AdminDashboardStats> {
    return get<UserDashboardStats | AdminDashboardStats>('/core/dashboard/');
  },

  getSystemStats(): Promise<SystemStatsResponse> {
    return get<SystemStatsResponse>('/core/system-stats/');
  },

  getSystemHealth(): Promise<SystemHealthCheck[]> {
    return get<SystemHealthCheck[]>('/core/system-health/');
  },

  getAnalytics(): Promise<AnalyticsData> {
    return get<AnalyticsData>('/core/analytics/');
  },
};

export interface SystemStatsResponse {
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
