import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminService } from '../services/admin.service';
import type { AdminUserListParams, CreateUserRequest, UpdateSettingRequest } from '../types';
import type { PaginationParams } from '@/types/api';

export function useAdminUsers(params?: AdminUserListParams) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminService.getUsers(params),
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.blockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User blocked successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to block user');
    },
  });
}

export function useUnblockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.unblockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User unblocked successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to unblock user');
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => adminService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create user');
    },
  });
}

export function useActivities(params?: PaginationParams) {
  return useQuery({
    queryKey: ['admin', 'activities', params],
    queryFn: () => adminService.getActivities(params),
  });
}

export function useSystemSettings() {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => adminService.getSystemSettings(),
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSettingRequest }) =>
      adminService.updateSystemSetting(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      toast.success('Setting updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update setting');
    },
  });
}

export function useGalleryPhotos() {
  return useQuery({
    queryKey: ['admin', 'gallery'],
    queryFn: () => adminService.getGalleryPhotos(),
  });
}

export function useUploadPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => adminService.uploadGalleryPhoto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] });
      toast.success('Photo uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload photo');
    },
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteGalleryPhoto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] });
      toast.success('Photo deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete photo');
    },
  });
}
