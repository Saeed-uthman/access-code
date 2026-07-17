import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/shared/components';
import { formatCurrency, formatDateTime } from '@/utils/format';
import toast from 'react-hot-toast';
import type { TransactionDetail } from '../types';

interface TransactionDetailProps {
  transaction: TransactionDetail;
  isAdmin?: boolean;
}

const statusVariantMap: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
  completed: 'success',
  pending: 'warning',
  failed: 'destructive',
  cancelled: 'default',
  refunded: 'default',
};

export function TransactionDetail({ transaction: tx, isAdmin = false }: TransactionDetailProps) {
  const [copied, setCopied] = useState(false);
  const basePath = isAdmin ? '/admin/transactions' : '/transactions';

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to={basePath}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to transactions
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction Details</CardTitle>
            <Badge variant={statusVariantMap[tx.status] || 'default'}>
              {tx.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-mono text-sm">{tx.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Reference</p>
                <p className="font-mono text-sm">{tx.payment_reference}</p>
              </div>
              {isAdmin && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">User</p>
                    <p className="text-sm">{tx.user_email || tx.user || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User Name</p>
                    <p className="text-sm">{tx.user_name || '-'}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm text-gray-500">Plan</p>
                <p className="text-sm font-medium">{tx.plan_name || tx.plan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="text-sm">{tx.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Unit Price</p>
                <p className="text-sm">{formatCurrency(tx.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-lg font-bold">{formatCurrency(tx.total_amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="text-sm capitalize">{tx.payment_method.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gateway Reference</p>
                <p className="font-mono text-sm">{tx.gateway_reference || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-sm">{formatDateTime(tx.created_at)}</p>
              </div>
              {tx.paid_at && (
                <div>
                  <p className="text-sm text-gray-500">Paid At</p>
                  <p className="text-sm">{formatDateTime(tx.paid_at)}</p>
                </div>
              )}
            </div>

            {tx.access_code_value && (
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Access Code</p>
                <div className="flex items-center gap-2">
                  <code className="rounded bg-white px-3 py-1.5 font-mono text-sm font-bold tracking-wider border">
                    {tx.access_code_value}
                  </code>
                  <button
                    onClick={() => handleCopyCode(tx.access_code_value!)}
                    className="rounded p-1.5 text-gray-500 hover:bg-gray-200"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
