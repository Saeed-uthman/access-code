import { get, post, put, del } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api';
import type { Plan, PlanListParams, PlanCreateRequest, PlanUpdateRequest, PlanStats } from '../types';

export const planService = {
  getPlans(params?: PlanListParams): Promise<PaginatedResponse<Plan>> {
    return get<PaginatedResponse<Plan>>('/api/v1/plans/', { params });
  },

  getPlan(id: string): Promise<Plan> {
    return get<Plan>(`/api/v1/plans/${id}/`);
  },

  getAdminPlans(): Promise<PaginatedResponse<Plan>> {
    return get<PaginatedResponse<Plan>>('/api/v1/admin/plans/');
  },

  createPlan(data: PlanCreateRequest): Promise<Plan> {
    return post<Plan>('/api/v1/admin/plans/', data);
  },

  updatePlan(id: string, data: PlanUpdateRequest): Promise<Plan> {
    return put<Plan>(`/api/v1/admin/plans/${id}/`, data);
  },

  deletePlan(id: string): Promise<void> {
    return del(`/api/v1/admin/plans/${id}/`);
  },

  togglePlanStatus(id: string): Promise<Plan> {
    return put<Plan>(`/api/v1/admin/plans/${id}/toggle-status/`);
  },

  getPlanStats(): Promise<PlanStats> {
    return get<PlanStats>('/api/v1/admin/plans/stats/');
  },
};
