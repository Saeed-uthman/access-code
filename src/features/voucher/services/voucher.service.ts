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
    return get<PaginatedResponse<AccessCode>>('/access-codes/my-codes/');
  },

  getAdminCodes(params?: AccessCodeListParams): Promise<PaginatedResponse<AccessCode>> {
    return get<PaginatedResponse<AccessCode>>('/access-codes/admin/', { params });
  },

  bulkUpload(data: BulkUploadRequest): Promise<{ message: string }> {
    return post('/access-codes/admin/bulk-upload/', data);
  },

  assignCode(data: AssignCodeRequest): Promise<{ message: string }> {
    return post('/access-codes/admin/assign/', data);
  },

  getAccessCodeStats(): Promise<AccessCodeStats> {
    return get<AccessCodeStats>('/access-codes/admin/stats/');
  },
};
