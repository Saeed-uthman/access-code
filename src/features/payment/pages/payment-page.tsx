import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FullPageLoader } from '@/shared/components';
import { useInitializePayment, useVerifyPayment } from '../hooks/use-payment';
import { useCreateTransaction } from '../hooks/use-payment';
import { usePlan } from '@/features/plans/hooks/use-plans';
import { PaymentModal } from '../components/payment-modal';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/shared/components';
import { formatCurrency } from '@/utils/format';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

const checkoutSchema = z.object({
  quantity: z.number().min(1, 'Quantity must be at least 1').max(100, 'Maximum 100 per order'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get('planId') || '';
  const reference = searchParams.get('reference');

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    authorization_url: string;
    amount: number;
    planName: string;
    quantity: number;
  } | null>(null);

  const { data: plan, isLoading: planLoading } = usePlan(planId);
  const createTransactionMutation = useCreateTransaction();
  const initializePaymentMutation = useInitializePayment();
  const verifyPaymentMutation = useVerifyPayment();

  useEffect(() => {
    if (reference) {
      verifyPaymentMutation.mutate(reference);
    }
  }, [reference]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { quantity: 1 },
  });

  const quantity = watch('quantity');

  if (reference) return <FullPageLoader />;

  if (planLoading) return <FullPageLoader />;

  if (!plan) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Plan not found.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/plans')}>
            Browse Plans
          </Button>
        </div>
      </div>
    );
  }

  const totalAmount = plan.cost * quantity;

  const onSubmit = (data: CheckoutFormValues) => {
    createTransactionMutation.mutate(
      {
        plan: plan.id,
        quantity: data.quantity,
        payment_method: 'paystack',
      },
      {
        onSuccess: (transaction) => {
          initializePaymentMutation.mutate(
            { transaction_id: transaction.id },
            {
              onSuccess: (response) => {
                setPaymentData({
                  authorization_url: response.payment_data.authorization_url,
                  amount: totalAmount,
                  planName: plan.name,
                  quantity: data.quantity,
                });
                setShowPaymentModal(true);
              },
            }
          );
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Checkout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {plan.plan_type} · {plan.validity} ({plan.validity_days} days)
                  </p>
                </div>
                <span className="text-lg font-bold">{formatCurrency(plan.cost)}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Quantity (Number of Access Codes)
                </label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="100"
                  error={errors.quantity?.message}
                  {...register('quantity', { valueAsNumber: true })}
                />
                <p className="text-xs text-gray-500">You can order between 1 and 100 codes per transaction.</p>
              </div>

              <div className="rounded-lg border bg-white p-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Unit Price</span>
                  <span>{formatCurrency(plan.cost)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Quantity</span>
                  <span>{quantity}</span>
                </div>
                <div className="mt-2 border-t pt-2">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lg">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createTransactionMutation.isPending || initializePaymentMutation.isPending}
              >
                {createTransactionMutation.isPending || initializePaymentMutation.isPending
                  ? 'Processing...'
                  : 'Proceed to Payment'}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {paymentData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          authorizationUrl={paymentData.authorization_url}
          amount={paymentData.amount}
          planName={paymentData.planName}
          quantity={paymentData.quantity}
        />
      )}
    </div>
  );
}
