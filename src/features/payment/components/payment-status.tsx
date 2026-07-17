import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/shared/components';

interface PaymentStatusProps {
  status: 'success' | 'failure' | 'pending';
  transactionId?: string;
  message?: string;
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-100',
    title: 'Payment Successful',
    description: 'Your payment has been processed successfully. Your access code has been generated.',
    buttonVariant: 'default' as const,
  },
  failure: {
    icon: XCircle,
    iconColor: 'text-red-600',
    bgColor: 'bg-red-100',
    title: 'Payment Failed',
    description: 'Something went wrong processing your payment. Please try again.',
    buttonVariant: 'destructive' as const,
  },
  pending: {
    icon: Clock,
    iconColor: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    title: 'Payment Pending',
    description: 'Your payment is being processed. This may take a few minutes.',
    buttonVariant: 'outline' as const,
  },
};

export function PaymentStatus({ status, transactionId, message }: PaymentStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${config.bgColor}`}>
            <Icon className={`h-8 w-8 ${config.iconColor}`} />
          </div>
          <CardTitle className="text-2xl">{config.title}</CardTitle>
          <p className="mt-2 text-sm text-gray-500">{message || config.description}</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {status === 'success' && transactionId && (
              <Link to={`/transactions/${transactionId}`}>
                <Button className="w-full">View Transaction</Button>
              </Link>
            )}
            {status === 'failure' && (
              <Link to="/plans">
                <Button className="w-full">Try Again</Button>
              </Link>
            )}
            <Link to="/dashboard">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
