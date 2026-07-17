import { ArrowLeftRight } from 'lucide-react';

export default function TransactionsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="mt-1 text-gray-500">
          View your transaction history and payment records.
        </p>
      </div>

      <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
        <div>
          <ArrowLeftRight className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No Transactions
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Your transaction history will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
