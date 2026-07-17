import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getDashboardStats(),
  });
}

export function useSystemStats() {
  return useQuery({
    queryKey: ['dashboard', 'system-stats'],
    queryFn: () => dashboardService.getSystemStats(),
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: ['dashboard', 'system-health'],
    queryFn: () => dashboardService.getSystemHealth(),
    refetchInterval: 30000,
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: ['dashboard', 'analytics'],
    queryFn: () => dashboardService.getAnalytics(),
  });
}
