import type { Transaction } from '@/types/models';

export interface PaymentInitRequest {
  transaction_id: string;
}

export interface PaymentInitResponse {
  message: string;
  payment_data: {
    authorization_url: string;
    access_code: string;
    payment_reference: string;
    transaction_id: string;
  };
}

export interface PaymentVerifyResponse {
  message: string;
  transaction: Transaction;
  success: boolean;
}

export interface PaymentSummary {
  total_revenue: number;
  total_transactions: number;
  completed_transactions: number;
  pending_transactions: number;
  failed_transactions: number;
}

export type { Transaction };
