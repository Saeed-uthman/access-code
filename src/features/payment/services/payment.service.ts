import { get, post } from '@/lib/api-client';
import type {
  PaymentInitRequest,
  PaymentInitResponse,
  PaymentVerifyResponse,
} from '../types';
import type { Transaction } from '@/types/models';
import type { PaymentSummary } from '../types';

export const paymentService = {
  initializePayment(data: PaymentInitRequest): Promise<PaymentInitResponse> {
    return post<PaymentInitResponse>('/transactions/initialize-payment/', data);
  },

  verifyPayment(reference: string): Promise<PaymentVerifyResponse> {
    return post<PaymentVerifyResponse>('/transactions/verify-payment/', { reference });
  },

  createTransaction(data: { plan: string; quantity?: number; payment_method: string; description?: string }): Promise<Transaction> {
    return post<Transaction>('/transactions/create/', data);
  },

  getPaymentSummary(): Promise<PaymentSummary> {
    return get<PaymentSummary>('/transactions/admin/stats/');
  },
};
