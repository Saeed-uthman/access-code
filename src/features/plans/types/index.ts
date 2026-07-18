import type { Plan, PlanType, Validity } from '@/types/models';
import type { PaginationParams } from '@/types/api';

export interface PlanListParams extends PaginationParams {
  type?: PlanType;
}

export interface PlanCreateRequest {
  name: string;
  plan_type: PlanType;
  cost: number;
  validity: Validity;
  validity_days: number;
  description?: string;
  is_active?: boolean;
}

export interface PlanUpdateRequest {
  name?: string;
  plan_type?: PlanType;
  cost?: number;
  validity?: Validity;
  validity_days?: number;
  description?: string;
  is_active?: boolean;
}

export interface PlanStats {
  total_plans: number;
  active_plans: number;
  total_revenue: number;
}

export type { Plan };
