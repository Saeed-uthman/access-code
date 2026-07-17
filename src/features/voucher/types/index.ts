import type { AccessCode } from '@/types/models';
import type { PaginationParams } from '@/types/api';

export interface AccessCodeListParams extends PaginationParams {
  status?: string;
  plan?: string;
  search?: string;
}

export interface BulkUploadRequest {
  codes: string[];
}

export interface AccessCodeStats {
  total: number;
  available: number;
  assigned: number;
  used: number;
  expired: number;
}

export interface AssignCodeRequest {
  access_code_id: string;
  user_email: string;
}

export type { AccessCode };
