import { get, post, put, del } from '@/lib/api-client';
import type { PaginatedResponse, PaginationParams } from '@/types/api';
import type {
  UserDetail,
  AdminUserListParams,
  CreateUserRequest,
  ActivityLog,
  SystemSettings,
  UpdateSettingRequest,
  GalleryPhoto,
} from '../types';

export const adminService = {
  getUsers(params?: AdminUserListParams): Promise<PaginatedResponse<UserDetail>> {
    return get<PaginatedResponse<UserDetail>>('/accounts/admin/users/', { params });
  },

  getUser(id: string): Promise<UserDetail> {
    return get<UserDetail>(`/accounts/admin/users/${id}/`);
  },

  blockUser(id: string): Promise<{ message: string }> {
    return post(`/accounts/admin/users/${id}/block/`, { action: 'block' });
  },

  unblockUser(id: string): Promise<{ message: string }> {
    return post(`/accounts/admin/users/${id}/block/`, { action: 'unblock' });
  },

  createUser(data: CreateUserRequest): Promise<UserDetail> {
    return post<UserDetail>('/accounts/admin/users/create/', data);
  },

  getActivities(params?: PaginationParams): Promise<PaginatedResponse<ActivityLog>> {
    return get<PaginatedResponse<ActivityLog>>('/core/admin/activities/', { params });
  },

  getSystemSettings(): Promise<SystemSettings[]> {
    return get<SystemSettings[]>('/core/admin/settings/');
  },

  updateSystemSetting(id: string, data: UpdateSettingRequest): Promise<SystemSettings> {
    return put<SystemSettings>(`/core/admin/settings/${id}/`, data);
  },

  getGalleryPhotos(): Promise<GalleryPhoto[]> {
    return get<GalleryPhoto[]>('/core/gallery-photos/');
  },

  uploadGalleryPhoto(data: FormData): Promise<GalleryPhoto> {
    return post<GalleryPhoto>('/core/admin/gallery-photos/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteGalleryPhoto(id: string): Promise<void> {
    return del(`/core/admin/gallery-photos/${id}/`);
  },
};
