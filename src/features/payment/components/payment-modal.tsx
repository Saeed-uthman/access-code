import { Modal, Button } from '@/shared/components';
import { formatCurrency } from '@/utils/format';
import { ExternalLink } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorizationUrl: string;
  amount: number;
  planName: string;
  quantity: number;
}

export function PaymentModal({
  isOpen,
  onClose,
  authorizationUrl,
  amount,
  planName,
  quantity,
}: PaymentModalProps) {
  const handlePay = () => {
    window.location.href = authorizationUrl;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Payment">
      <div className="space-y-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Plan</span>
            <span className="font-medium">{planName}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Quantity</span>
            <span className="font-medium">{quantity}</span>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(amount)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            You will be redirected to Paystack to complete your payment securely.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePay}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Pay with Paystack
          </Button>
        </div>
      </div>
    </Modal>
  );
}
