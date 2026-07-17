import { get } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api';
import type { TransactionListParams, TransactionDetail, TransactionStats } from '../types';
import type { Transaction } from '@/types/models';

export const transactionService = {
  getUserTransactions(params?: TransactionListParams): Promise<PaginatedResponse<Transaction>> {
    return get<PaginatedResponse<Transaction>>('/api/v1/transactions/', { params });
  },

  getTransaction(id: string): Promise<TransactionDetail> {
    return get<TransactionDetail>(`/api/v1/transactions/${id}/`);
  },

  getAdminTransactions(params?: TransactionListParams): Promise<PaginatedResponse<TransactionDetail>> {
    return get<PaginatedResponse<TransactionDetail>>('/api/v1/admin/transactions/', { params });
  },

  getTransactionStats(): Promise<TransactionStats> {
    return get<TransactionStats>('/api/v1/admin/transactions/stats/');
  },
};
