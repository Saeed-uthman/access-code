import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { voucherService } from '../services/voucher.service';
import type { AccessCodeListParams, BulkUploadRequest, AssignCodeRequest } from '../types';

export function useMyCodes() {
  return useQuery({
    queryKey: ['codes', 'my'],
    queryFn: () => voucherService.getMyCodes(),
  });
}

export function useAdminCodes(params?: AccessCodeListParams) {
  return useQuery({
    queryKey: ['admin', 'codes', params],
    queryFn: () => voucherService.getAdminCodes(params),
  });
}

export function useBulkUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkUploadRequest) => voucherService.bulkUpload(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'codes'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'codes', 'stats'] });
      toast.success(data.message || 'Codes uploaded successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload codes');
    },
  });
}

export function useAssignCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignCodeRequest) => voucherService.assignCode(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'codes'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'codes', 'stats'] });
      toast.success(data.message || 'Code assigned successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to assign code');
    },
  });
}

export function useAccessCodeStats() {
  return useQuery({
    queryKey: ['admin', 'codes', 'stats'],
    queryFn: () => voucherService.getAccessCodeStats(),
  });
}
