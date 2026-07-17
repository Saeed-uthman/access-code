import { Ticket } from 'lucide-react';

export default function VouchersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Vouchers</h1>
        <p className="mt-1 text-gray-500">
          View and manage your WiFi access vouchers.
        </p>
      </div>

      <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
        <div>
          <Ticket className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No Vouchers Yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Your purchased vouchers will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
