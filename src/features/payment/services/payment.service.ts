import { get, post } from '@/lib/api-client';
import type {
  PaymentInitRequest,
  PaymentInitResponse,
  PaymentVerifyResponse,
  TransactionCreateRequest,
  Transaction,
  PaymentSummary,
} from '../types';

export const paymentService = {
  initializePayment(data: PaymentInitRequest): Promise<PaymentInitResponse> {
    return post<PaymentInitResponse>('/api/v1/payments/initialize/', data);
  },

  verifyPayment(reference: string): Promise<PaymentVerifyResponse> {
    return get<PaymentVerifyResponse>(`/api/v1/payments/verify/${reference}/`);
  },

  createTransaction(data: TransactionCreateRequest): Promise<Transaction> {
    return post<Transaction>('/api/v1/transactions/', data);
  },

  getPaymentSummary(): Promise<PaymentSummary> {
    return get<PaymentSummary>('/api/v1/payments/summary/');
  },
};
