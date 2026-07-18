import { useState } from 'react';
import { DollarSign, CreditCard, Clock, XCircle } from 'lucide-react';
import { SearchInput, Select, FullPageLoader } from '@/shared/components';
import { TransactionTable } from '../components/transaction-table';
import { useAdminTransactions, useTransactionStats } from '../hooks/use-transactions';
import { StatCard } from '@/features/dashboard/components/stat-card';
import { formatCurrency } from '@/utils/format';
import type { TransactionStatus } from '@/types/models';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

export default function AdminTransactionsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TransactionStatus | ''>('');
  const [page, setPage] = useState(1);

  const { data: stats } = useTransactionStats();
  const { data, isLoading } = useAdminTransactions({
    page,
    page_size: 15,
    search: search || undefined,
    status: (status as TransactionStatus) || undefined,
  });

  const transactions = data?.results || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="mt-1 text-sm text-gray-500">Manage and review all transactions</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={DollarSign} label="Total Revenue" value={formatCurrency(stats.total_revenue)} iconColor="text-green-600" />
          <StatCard icon={CreditCard} label="Total Transactions" value={stats.total_transactions} iconColor="text-blue-600" />
          <StatCard icon={Clock} label="Pending" value={stats.pending_transactions} iconColor="text-yellow-600" />
          <StatCard icon={XCircle} label="Failed" value={stats.failed_transactions} iconColor="text-red-600" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <SearchInput
          placeholder="Search transactions..."
          value={search}
          onChange={(value) => { setSearch(value); setPage(1); }}
          className="max-w-sm"
        />
        <Select
          options={statusOptions}
          value={status}
          onChange={(e) => { setStatus(e.target.value as TransactionStatus | ''); setPage(1); }}
          className="w-48"
        />
      </div>

      {isLoading ? (
        <FullPageLoader />
      ) : (
        <>
          <TransactionTable transactions={transactions} isLoading={isLoading} isAdmin />
          {data && data.count > 15 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * 15 + 1} to {Math.min(page * 15, data.count)} of {data.count}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!data.previous}
                  className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!data.next}
                  className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
