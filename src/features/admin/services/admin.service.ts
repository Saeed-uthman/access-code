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
    return get<PaginatedResponse<UserDetail>>('/api/v1/admin/users/', { params });
  },

  getUser(id: string): Promise<UserDetail> {
    return get<UserDetail>(`/api/v1/admin/users/${id}/`);
  },

  blockUser(id: string): Promise<UserDetail> {
    return put<UserDetail>(`/api/v1/admin/users/${id}/block/`);
  },

  unblockUser(id: string): Promise<UserDetail> {
    return put<UserDetail>(`/api/v1/admin/users/${id}/unblock/`);
  },

  createUser(data: CreateUserRequest): Promise<UserDetail> {
    return post<UserDetail>('/api/v1/admin/users/', data);
  },

  getActivities(params?: PaginationParams): Promise<PaginatedResponse<ActivityLog>> {
    return get<PaginatedResponse<ActivityLog>>('/api/v1/admin/activities/', { params });
  },

  getSystemSettings(): Promise<SystemSettings[]> {
    return get<SystemSettings[]>('/api/v1/admin/settings/');
  },

  updateSystemSetting(id: string, data: UpdateSettingRequest): Promise<SystemSettings> {
    return put<SystemSettings>(`/api/v1/admin/settings/${id}/`, data);
  },

  getGalleryPhotos(): Promise<GalleryPhoto[]> {
    return get<GalleryPhoto[]>('/api/v1/gallery/');
  },

  uploadGalleryPhoto(data: FormData): Promise<GalleryPhoto> {
    return post<GalleryPhoto>('/api/v1/admin/gallery/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteGalleryPhoto(id: string): Promise<void> {
    return del(`/api/v1/admin/gallery/${id}/`);
  },
};
