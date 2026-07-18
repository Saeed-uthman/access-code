import { get, post, put, del } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api';
import type { Plan, PlanListParams, PlanCreateRequest, PlanUpdateRequest, PlanStats } from '../types';

export const planService = {
  getPlans(params?: PlanListParams): Promise<PaginatedResponse<Plan>> {
    return get<PaginatedResponse<Plan>>('/plans/', { params });
  },

  getPlan(id: string): Promise<Plan> {
    return get<Plan>(`/plans/${id}/`);
  },

  getAdminPlans(params?: { search?: string; type?: string }): Promise<PaginatedResponse<Plan>> {
    return get<PaginatedResponse<Plan>>('/plans/admin/', { params });
  },

  createPlan(data: PlanCreateRequest): Promise<Plan> {
    return post<Plan>('/plans/admin/', data);
  },

  getAdminPlan(id: string): Promise<Plan> {
    return get<Plan>(`/plans/admin/${id}/`);
  },

  updatePlan(id: string, data: PlanUpdateRequest): Promise<Plan> {
    return put<Plan>(`/plans/admin/${id}/`, data);
  },

  deletePlan(id: string): Promise<void> {
    return del(`/plans/admin/${id}/`);
  },

  togglePlanStatus(id: string): Promise<{ message: string; is_active: boolean }> {
    return post(`/plans/admin/${id}/toggle-status/`);
  },

  getPlanStats(): Promise<PlanStats> {
    return get<PlanStats>('/plans/admin/stats/');
  },
};
