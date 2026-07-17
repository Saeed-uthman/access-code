import { CreditCard } from 'lucide-react';

export default function PlansPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Plans</h1>
        <p className="mt-1 text-gray-500">
          Browse available WiFi plans and make a purchase.
        </p>
      </div>

      <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
        <div>
          <CreditCard className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Plans Marketplace
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Available plans and purchase options will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
