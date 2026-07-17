import { Link } from 'react-router-dom';
import { Clock, Check } from 'lucide-react';
import { Button, Badge } from '@/shared/components';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';
import type { Plan } from '../types';

interface PlanCardProps {
  plan: Plan;
  onSelect?: (plan: Plan) => void;
  showActions?: boolean;
}

const planTypeColors: Record<string, string> = {
  house: 'bg-blue-100 text-blue-800',
  individual: 'bg-green-100 text-green-800',
  business: 'bg-purple-100 text-purple-800',
};

export function PlanCard({ plan, onSelect, showActions = true }: PlanCardProps) {
  const features = [
    `${plan.validity_days} days validity`,
    `${plan.plan_type.charAt(0).toUpperCase() + plan.plan_type.slice(1)} access`,
  ];

  return (
    <div
      className={cn(
        'relative rounded-xl border-2 bg-white p-6 shadow-sm transition-all hover:shadow-md',
        plan.is_active ? 'border-gray-200 hover:border-blue-300' : 'border-gray-100 opacity-60'
      )}
    >
      {!plan.is_active && (
        <div className="absolute top-3 right-3">
          <Badge variant="secondary">Inactive</Badge>
        </div>
      )}

      <div className="mb-4">
        <span className={cn('inline-block rounded-full px-3 py-1 text-xs font-semibold', planTypeColors[plan.plan_type] || 'bg-gray-100 text-gray-800')}>
          {plan.plan_type}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>

      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-gray-900">{formatCurrency(plan.cost)}</span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <Clock className="h-4 w-4" />
        <span>{plan.validity.charAt(0).toUpperCase() + plan.validity.slice(1)} ({plan.validity_days} days)</span>
      </div>

      <ul className="mt-6 space-y-3">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
            <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {showActions && (
        <div className="mt-6">
          {onSelect ? (
            <Button
              className="w-full"
              onClick={() => onSelect(plan)}
              disabled={!plan.is_active}
            >
              Select Plan
            </Button>
          ) : (
            <Link to={`/plans/${plan.id}`}>
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
