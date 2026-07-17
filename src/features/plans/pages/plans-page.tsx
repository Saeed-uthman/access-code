import { useState } from 'react';
import { FullPageLoader } from '@/shared/components';
import { PlanCard } from '../components/plan-card';
import { usePlans } from '../hooks/use-plans';
import type { PlanType } from '@/types/models';

const filterOptions: Array<{ value: PlanType | 'all'; label: string }> = [
  { value: 'all', label: 'All Plans' },
  { value: 'individual', label: 'Individual' },
  { value: 'house', label: 'House' },
  { value: 'business', label: 'Business' },
];

export default function PlansPage() {
  const [activeFilter, setActiveFilter] = useState<PlanType | 'all'>('all');
  const params = activeFilter === 'all' ? {} : { plan_type: activeFilter };
  const { data, isLoading } = usePlans({ is_active: true, ...params });

  if (isLoading) return <FullPageLoader />;

  const plans = data?.results || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Available Plans</h1>
        <p className="mt-1 text-sm text-gray-500">Choose a plan that works best for you</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setActiveFilter(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {plans.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-500">No plans available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
