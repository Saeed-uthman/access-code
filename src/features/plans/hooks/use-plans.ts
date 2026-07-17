import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { planService } from '../services/plan.service';
import type { PlanListParams, PlanCreateRequest, PlanUpdateRequest } from '../types';

export function usePlans(params?: PlanListParams) {
  return useQuery({
    queryKey: ['plans', params],
    queryFn: () => planService.getPlans(params),
  });
}

export function usePlan(id: string) {
  return useQuery({
    queryKey: ['plans', id],
    queryFn: () => planService.getPlan(id),
    enabled: !!id,
  });
}

export function useAdminPlans() {
  return useQuery({
    queryKey: ['admin', 'plans'],
    queryFn: () => planService.getAdminPlans(),
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PlanCreateRequest) => planService.createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'plans', 'stats'] });
      toast.success('Plan created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create plan');
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PlanUpdateRequest }) =>
      planService.updatePlan(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] });
      queryClient.invalidateQueries({ queryKey: ['plans', variables.id] });
      toast.success('Plan updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update plan');
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => planService.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] });
      toast.success('Plan deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete plan');
    },
  });
}

export function useTogglePlanStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => planService.togglePlanStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] });
      toast.success('Plan status updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update plan status');
    },
  });
}

export function usePlanStats() {
  return useQuery({
    queryKey: ['admin', 'plans', 'stats'],
    queryFn: () => planService.getPlanStats(),
  });
}
