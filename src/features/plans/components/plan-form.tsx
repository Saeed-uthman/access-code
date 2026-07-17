import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select, Card, CardHeader, CardTitle, CardContent } from '@/shared/components';
import type { Plan, PlanCreateRequest, PlanUpdateRequest } from '../types';

const planSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  plan_type: z.enum(['house', 'individual', 'business'], {
    required_error: 'Plan type is required',
  }),
  cost: z.number().min(0, 'Cost must be a positive number'),
  validity: z.enum(['daily', 'weekly', 'biweekly', 'monthly', 'yearly'], {
    required_error: 'Validity is required',
  }),
  is_active: z.boolean().default(true),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface PlanFormProps {
  plan?: Plan;
  onSubmit: (data: PlanCreateRequest | PlanUpdateRequest) => void;
  isLoading?: boolean;
}

const planTypeOptions = [
  { value: 'house', label: 'House' },
  { value: 'individual', label: 'Individual' },
  { value: 'business', label: 'Business' },
];

const validityOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const validityDays: Record<string, number> = {
  daily: 1,
  weekly: 7,
  biweekly: 14,
  monthly: 30,
  yearly: 365,
};

export function PlanForm({ plan, onSubmit, isLoading }: PlanFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: plan?.name || '',
      plan_type: plan?.plan_type || 'individual',
      cost: plan?.cost || 0,
      validity: plan?.validity || 'monthly',
      is_active: plan?.is_active ?? true,
    },
  });

  const selectedValidity = watch('validity');

  const onFormSubmit = (data: PlanFormValues) => {
    const submitData = {
      ...data,
      validity_days: validityDays[data.validity],
    };
    onSubmit(submitData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{plan ? 'Edit Plan' : 'Create New Plan'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Plan Name
            </label>
            <Input
              id="name"
              placeholder="e.g., Premium Monthly"
              error={errors.name?.message}
              {...register('name')}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="plan_type" className="text-sm font-medium text-gray-700">
                Plan Type
              </label>
              <Select
                id="plan_type"
                options={planTypeOptions}
                error={errors.plan_type?.message}
                {...register('plan_type')}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="validity" className="text-sm font-medium text-gray-700">
                Validity
              </label>
              <Select
                id="validity"
                options={validityOptions}
                error={errors.validity?.message}
                {...register('validity')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="cost" className="text-sm font-medium text-gray-700">
              Cost (₦)
            </label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              error={errors.cost?.message}
              {...register('cost', { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Validity Duration
            </label>
            <p className="text-sm text-gray-500">
              {validityDays[selectedValidity]} day{validityDays[selectedValidity] !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              {...register('is_active')}
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Active (visible to users)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : plan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
