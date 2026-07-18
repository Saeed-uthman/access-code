import { useQuery } from '@tanstack/react-query';
import { transactionService } from '../services/transaction.service';
import type { TransactionListParams } from '../types';

export function useUserTransactions(params?: TransactionListParams) {
  return useQuery({
    queryKey: ['transactions', 'user', params],
    queryFn: () => transactionService.getUserTransactions(params),
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: () => transactionService.getTransaction(id),
    enabled: !!id,
  });
}

export function useAdminTransactions(params?: TransactionListParams) {
  return useQuery({
    queryKey: ['transactions', 'admin', params],
    queryFn: () => transactionService.getAdminTransactions(params),
  });
}

export function useTransactionStats() {
  return useQuery({
    queryKey: ['transactions', 'stats'],
    queryFn: () => transactionService.getTransactionStats(),
  });
}
