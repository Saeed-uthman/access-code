import { useState } from 'react';
import { SearchInput, Select, FullPageLoader } from '@/shared/components';
import { TransactionTable } from '../components/transaction-table';
import { useUserTransactions } from '../hooks/use-transactions';
import type { TransactionStatus } from '@/types/models';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TransactionStatus | ''>('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useUserTransactions({
    page,
    page_size: 10,
    search: search || undefined,
    status: (status as TransactionStatus) || undefined,
  });

  const transactions = data?.results || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="mt-1 text-sm text-gray-500">View your transaction history</p>
      </div>

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
          <TransactionTable transactions={transactions} />
          {data && data.count > 10 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, data.count)} of {data.count}
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
