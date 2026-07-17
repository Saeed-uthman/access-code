export { default as DashboardPage } from './pages/dashboard-page';
export { default as AdminDashboardPage } from './pages/admin-dashboard-page';

export { StatCard } from './components/stat-card';
export { RevenueChart } from './components/revenue-chart';
export { RecentTransactions } from './components/recent-transactions';

export { useDashboardStats, useSystemStats, useSystemHealth, useAnalytics } from './hooks/use-dashboard';

export { dashboardService } from './services/dashboard.service';

export type * from './types';
