import { get } from '@/lib/api-client';
import type {
  AdminDashboardStats,
  UserDashboardStats,
  SystemHealth,
  AnalyticsData,
} from '../types';

export const dashboardService = {
  getDashboardStats(): Promise<UserDashboardStats> {
    return get<UserDashboardStats>('/api/v1/dashboard/');
  },

  getSystemStats(): Promise<AdminDashboardStats> {
    return get<AdminDashboardStats>('/api/v1/admin/dashboard/stats/');
  },

  getSystemHealth(): Promise<SystemHealth> {
    return get<SystemHealth>('/api/v1/admin/dashboard/health/');
  },

  getAnalytics(): Promise<AnalyticsData> {
    return get<AnalyticsData>('/api/v1/admin/dashboard/analytics/');
  },
};
