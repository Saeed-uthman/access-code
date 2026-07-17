import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/shared/components';
import { formatCurrency, formatDateTime } from '@/utils/format';
import type { Transaction } from '../types';
import { ChevronRight } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
  isAdmin?: boolean;
}

const statusVariantMap: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
  completed: 'success',
  pending: 'warning',
  failed: 'destructive',
  cancelled: 'default',
  refunded: 'default',
};

export function RecentTransactions({ transactions, isAdmin = false }: RecentTransactionsProps) {
  const basePath = isAdmin ? '/admin/transactions' : '/transactions';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
        <Link
          to={basePath}
          className="text-sm text-blue-600 hover:text-blue-500 flex items-center gap-1"
        >
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">No transactions yet</p>
        ) : (
          <div className="divide-y">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    {tx.payment_method.charAt(0).toUpperCase() + tx.payment_method.slice(1)} Payment
                  </p>
                  <p className="text-xs text-gray-500">{formatDateTime(tx.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(tx.total_amount)}</p>
                  <Badge variant={statusVariantMap[tx.status] || 'default'}>
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
