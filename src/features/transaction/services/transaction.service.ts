import { get, post } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api';
import type { TransactionListParams, TransactionStats } from '../types';
import type { Transaction } from '@/types/models';

export interface CreateTransactionPayload {
  plan: string;
  quantity?: number;
  payment_method: string;
  description?: string;
}

export const transactionService = {
  getUserTransactions(params?: TransactionListParams): Promise<PaginatedResponse<Transaction>> {
    return get<PaginatedResponse<Transaction>>('/transactions/user/', { params });
  },

  getTransaction(id: string): Promise<Transaction> {
    return get<Transaction>(`/transactions/${id}/`);
  },

  createTransaction(payload: CreateTransactionPayload): Promise<Transaction> {
    return post<Transaction>('/transactions/create/', payload);
  },

  initializePayment(transactionId: string): Promise<{ message: string; payment_data: Record<string, unknown> }> {
    return post('/transactions/initialize-payment/', { transaction_id: transactionId });
  },

  verifyPayment(reference: string): Promise<{ message: string; transaction: Transaction; success: boolean }> {
    return post('/transactions/verify-payment/', { reference });
  },

  getAdminTransactions(params?: TransactionListParams): Promise<PaginatedResponse<Transaction>> {
    return get<PaginatedResponse<Transaction>>('/transactions/admin/', { params });
  },

  getTransactionStats(): Promise<TransactionStats> {
    return get<TransactionStats>('/transactions/admin/stats/');
  },
};
