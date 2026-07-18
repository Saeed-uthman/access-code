import type { AccessCode } from '@/types/models';
import type { PaginationParams } from '@/types/api';

export interface AccessCodeListParams extends PaginationParams {
  status?: string;
  plan?: string;
  search?: string;
}

export interface BulkUploadRequest {
  codes: string;
  plan_id: string;
}

export interface AccessCodeStats {
  total_codes: number;
  available_codes: number;
  assigned_codes: number;
  used_codes: number;
  expired_codes: number;
}

export interface AssignCodeRequest {
  code_id: string;
  user_id: string;
}

export type { AccessCode };
