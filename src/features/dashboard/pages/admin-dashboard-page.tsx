import { Users, Key, CreditCard, DollarSign, Server } from 'lucide-react';
import { FullPageLoader, Card, CardHeader, CardTitle, CardContent, Badge } from '@/shared/components';
import { StatCard } from '../components/stat-card';
import { RevenueChart } from '../components/revenue-chart';
import { useSystemStats, useAnalytics, useSystemHealth } from '../hooks/use-dashboard';
import { formatCurrency, formatNumber } from '@/utils/format';

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useSystemStats();
  const { data: analytics } = useAnalytics();
  const { data: health } = useSystemHealth();

  if (statsLoading) return <FullPageLoader />;

  const revenueData = (analytics?.daily_transactions || []).map((d) => ({
    month: d.day,
    revenue: d.revenue,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">System overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value={formatNumber(stats?.users_stats.total_users || 0)}
          iconColor="text-blue-600"
        />
        <StatCard
          icon={Key}
          label="Total Codes"
          value={formatNumber(stats?.access_codes_stats.total_codes || 0)}
          iconColor="text-green-600"
        />
        <StatCard
          icon={CreditCard}
          label="Transactions"
          value={formatNumber(stats?.transactions_stats.total_transactions || 0)}
          iconColor="text-purple-600"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatCurrency(stats?.transactions_stats.total_revenue || 0)}
          iconColor="text-yellow-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Admin Users</p>
            <p className="text-xl font-bold text-blue-600">{stats?.users_stats.admin_users || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Blocked Users</p>
            <p className="text-xl font-bold text-red-600">{stats?.users_stats.blocked_users || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Active Plans</p>
            <p className="text-xl font-bold text-green-600">{stats?.plans_stats.active_plans || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Available Codes</p>
            <p className="text-xl font-bold text-yellow-600">{stats?.access_codes_stats.available_codes || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart
          data={revenueData}
          title="Revenue (Last 30 Days)"
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Plans</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.top_plans && analytics.top_plans.length > 0 ? (
              <div className="space-y-3">
                {analytics.top_plans.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">{item.plan_type}</Badge>
                      <span className="text-sm text-gray-600">{item.name} ({item.transaction_count} sales)</span>
                    </div>
                    <span className="text-sm font-medium">{formatCurrency(item.cost)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {health && health.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Server className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {health.map((check) => (
                <div key={check.component}>
                  <p className="text-sm text-gray-500">{check.component}</p>
                  <Badge variant={check.status === 'healthy' ? 'success' : 'destructive'}>
                    {check.status}
                  </Badge>
                  <p className="mt-1 text-xs text-gray-400">{check.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
