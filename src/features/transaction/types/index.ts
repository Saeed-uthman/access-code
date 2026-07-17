import type { Transaction, TransactionStatus } from '@/types/models';
import type { PaginationParams } from '@/types/api';

export interface TransactionListParams extends PaginationParams {
  status?: TransactionStatus;
  payment_method?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface TransactionDetail extends Transaction {
  user_email?: string;
  user_name?: string;
  plan_name?: string;
  access_code_value?: string;
}

export interface TransactionStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  total_revenue: number;
  average_amount: number;
}

export type { Transaction };
