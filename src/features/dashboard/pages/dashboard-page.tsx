import { Wallet, ShoppingCart, Key, Clock } from 'lucide-react';
import { FullPageLoader } from '@/shared/components';
import { StatCard } from '../components/stat-card';
import { useDashboardStats } from '../hooks/use-dashboard';
import { formatCurrency } from '@/utils/format';
import type { UserDashboardStats } from '../types';

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) return <FullPageLoader />;

  const userStats = stats as UserDashboardStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back! Here's an overview of your account.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="Total Spent"
          value={formatCurrency(userStats?.total_spent || 0)}
          iconColor="text-green-600"
        />
        <StatCard
          icon={ShoppingCart}
          label="Total Purchases"
          value={userStats?.total_purchases || 0}
          iconColor="text-blue-600"
        />
        <StatCard
          icon={Key}
          label="Active Codes"
          value={userStats?.active_codes || 0}
          iconColor="text-purple-600"
        />
        <StatCard
          icon={Clock}
          label="Expired Codes"
          value={userStats?.expired_codes || 0}
          iconColor="text-red-600"
        />
      </div>
    </div>
  );
}
