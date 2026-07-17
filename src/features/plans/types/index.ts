import type { Plan, PlanType, Validity } from '@/types/models';
import type { PaginationParams } from '@/types/api';

export interface PlanListParams extends PaginationParams {
  plan_type?: PlanType;
  is_active?: boolean;
  search?: string;
}

export interface PlanCreateRequest {
  name: string;
  plan_type: PlanType;
  cost: number;
  validity: Validity;
  is_active?: boolean;
}

export interface PlanUpdateRequest {
  name?: string;
  plan_type?: PlanType;
  cost?: number;
  validity?: Validity;
  is_active?: boolean;
}

export interface PlanStats {
  total_plans: number;
  active_plans: number;
  inactive_plans: number;
  by_type: Array<{ plan_type: PlanType; count: number }>;
}

export type { Plan };
