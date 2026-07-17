import { LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.full_name || user?.username}!
        </h1>
        <p className="mt-1 text-gray-500">
          Here&apos;s an overview of your account.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Active Vouchers', value: '0' },
          { label: 'Plans Purchased', value: '0' },
          { label: 'Total Spent', value: '₦0' },
          { label: 'Days Remaining', value: '0' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
        <div>
          <LayoutDashboard className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Dashboard Content
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Charts, recent activity, and quick actions will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
