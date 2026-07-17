import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { paymentService } from '../services/payment.service';
import type { PaymentInitRequest, TransactionCreateRequest } from '../types';

export function useInitializePayment() {
  return useMutation({
    mutationFn: (data: PaymentInitRequest) => paymentService.initializePayment(data),
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to initialize payment');
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reference: string) => paymentService.verifyPayment(reference),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'transactions'] });
      toast.success(data.message || 'Payment verified successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Payment verification failed');
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransactionCreateRequest) => paymentService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create transaction');
    },
  });
}

export function usePaymentSummary() {
  return useQuery({
    queryKey: ['payments', 'summary'],
    queryFn: () => paymentService.getPaymentSummary(),
  });
}
