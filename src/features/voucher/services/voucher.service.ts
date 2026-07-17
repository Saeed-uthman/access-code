import { get, post } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api';
import type {
  AccessCode,
  AccessCodeListParams,
  BulkUploadRequest,
  AccessCodeStats,
  AssignCodeRequest,
} from '../types';

export const voucherService = {
  getMyCodes(): Promise<PaginatedResponse<AccessCode>> {
    return get<PaginatedResponse<AccessCode>>('/api/v1/codes/my-codes/');
  },

  getAdminCodes(params?: AccessCodeListParams): Promise<PaginatedResponse<AccessCode>> {
    return get<PaginatedResponse<AccessCode>>('/api/v1/admin/codes/', { params });
  },

  getAccessCode(id: string): Promise<AccessCode> {
    return get<AccessCode>(`/api/v1/codes/${id}/`);
  },

  bulkUpload(data: BulkUploadRequest): Promise<{ created: number; message: string }> {
    return post('/api/v1/admin/codes/bulk-upload/', data);
  },

  assignCode(data: AssignCodeRequest): Promise<AccessCode> {
    return post<AccessCode>('/api/v1/admin/codes/assign/', data);
  },

  getAccessCodeStats(): Promise<AccessCodeStats> {
    return get<AccessCodeStats>('/api/v1/admin/codes/stats/');
  },
};
