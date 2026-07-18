import type { Transaction } from '@/types/models';
import type { PaginationParams } from '@/types/api';

export interface TransactionListParams extends PaginationParams {
  status?: string;
  payment_method?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface TransactionStats {
  total_revenue: number;
  total_transactions: number;
  completed_transactions: number;
  pending_transactions: number;
  failed_transactions: number;
}

export type { Transaction };
