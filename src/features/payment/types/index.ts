import type { Transaction } from '@/types/models';

export interface PaymentInitRequest {
  plan_id: string;
  quantity: number;
  callback_url?: string;
}

export interface PaymentInitResponse {
  authorization_url: string;
  access_code: string;
  payment_reference: string;
  transaction_id: string;
}

export interface PaymentVerifyResponse {
  status: string;
  transaction: Transaction;
  message: string;
}

export interface TransactionCreateRequest {
  plan_id: string;
  quantity: number;
  payment_reference: string;
  gateway_reference: string;
  amount: number;
  total_amount: number;
}

export interface PaymentSummary {
  total_paid: number;
  total_transactions: number;
  successful_transactions: number;
  pending_transactions: number;
}

export type { Transaction };
