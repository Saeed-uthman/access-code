import { Link } from 'react-router-dom';
import { Badge, DataTable, type Column } from '@/shared/components';
import { formatCurrency, formatDateTime } from '@/utils/format';
import type { Transaction } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
  isAdmin?: boolean;
  basePath?: string;
}

const statusVariantMap: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
  completed: 'success',
  pending: 'warning',
  failed: 'destructive',
  cancelled: 'default',
  refunded: 'default',
};

export function TransactionTable({ transactions, isLoading, isAdmin = false, basePath }: TransactionTableProps) {
  const linkBase = basePath || (isAdmin ? '/admin/transactions' : '/transactions');

  const columns: Column<Transaction>[] = [
    {
      key: 'id',
      header: 'Reference',
      render: (tx) => (
        <Link
          to={`${linkBase}/${tx.id}`}
          className="font-mono text-sm text-blue-600 hover:underline"
        >
          {tx.payment_reference?.slice(0, 12) || tx.id.slice(0, 8)}
        </Link>
      ),
    },
    ...(isAdmin
      ? [
          {
            key: 'user',
            header: 'User',
            render: (tx: Transaction) => tx.user || '-',
          } as Column<Transaction>,
        ]
      : []),
    {
      key: 'amount',
      header: 'Amount',
      render: (tx) => formatCurrency(tx.total_amount),
    },
    {
      key: 'quantity',
      header: 'Qty',
      render: (tx) => tx.quantity,
    },
    {
      key: 'payment_method',
      header: 'Method',
      render: (tx) => (
        <span className="capitalize">{tx.payment_method.replace('_', ' ')}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (tx) => (
        <Badge variant={statusVariantMap[tx.status] || 'default'}>
          {tx.status}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (tx) => (
        <span className="text-sm text-gray-500">{formatDateTime(tx.created_at)}</span>
      ),
    },
  ];

  return <DataTable columns={columns} data={transactions} isLoading={isLoading} />;
}
