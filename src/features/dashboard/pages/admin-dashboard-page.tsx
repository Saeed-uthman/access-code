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
          value={formatNumber(stats?.total_users || 0)}
          iconColor="text-blue-600"
        />
        <StatCard
          icon={Key}
          label="Total Codes"
          value={formatNumber(stats?.total_codes || 0)}
          iconColor="text-green-600"
        />
        <StatCard
          icon={CreditCard}
          label="Transactions"
          value={formatNumber(stats?.total_transactions || 0)}
          iconColor="text-purple-600"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatCurrency(stats?.total_revenue || 0)}
          iconColor="text-yellow-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-xl font-bold text-green-600">{stats?.active_users || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Blocked Users</p>
            <p className="text-xl font-bold text-red-600">{stats?.blocked_users || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Monthly Revenue</p>
            <p className="text-xl font-bold">{formatCurrency(stats?.monthly_revenue || 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Pending Transactions</p>
            <p className="text-xl font-bold text-yellow-600">{stats?.pending_transactions || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart
          data={analytics?.monthly || []}
          title="Monthly Revenue"
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.plan_distribution && analytics.plan_distribution.length > 0 ? (
              <div className="space-y-3">
                {analytics.plan_distribution.map((item) => (
                  <div key={item.plan_type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">{item.plan_type}</Badge>
                      <span className="text-sm text-gray-600">{item.count} codes</span>
                    </div>
                    <span className="text-sm font-medium">{formatCurrency(item.revenue)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {health && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Server className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge variant={health.status === 'healthy' ? 'success' : 'destructive'}>
                  {health.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Uptime</p>
                <p className="font-medium">{health.uptime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Version</p>
                <p className="font-medium">{health.version}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Database</p>
                <Badge variant={health.database === 'connected' ? 'success' : 'destructive'}>
                  {health.database}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
