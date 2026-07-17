import type { User, ActivityLog, SystemSettings, GalleryPhoto } from '@/types/models';
import type { PaginationParams } from '@/types/api';

export interface AdminUserListParams extends PaginationParams {
  role?: string;
  is_blocked?: boolean;
  search?: string;
}

export interface UserDetail extends User {
  profile?: {
    id: string;
    address: string | null;
    date_of_birth: string | null;
  };
  total_transactions: number;
  total_spent: number;
  active_codes: number;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  full_name: string;
  password: string;
  role: string;
  phone_number?: string;
}

export interface UpdateSettingRequest {
  value: string;
}

export interface UploadPhotoRequest {
  image: File;
  caption?: string;
  is_active?: boolean;
  order?: number;
}

export type { User, ActivityLog, SystemSettings, GalleryPhoto };
