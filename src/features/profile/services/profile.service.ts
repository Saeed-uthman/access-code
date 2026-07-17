import { get, put, post } from '@/lib/api-client';
import type { User } from '@/types/models';
import type { ProfileUpdateRequest, ChangePasswordRequest } from '../types';

export const profileService = {
  getProfile(): Promise<User> {
    return get<User>('/api/v1/auth/profile/');
  },

  updateProfile(data: ProfileUpdateRequest): Promise<User> {
    return put<User>('/api/v1/auth/profile/', data);
  },

  changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return post('/api/v1/auth/change-password/', data);
  },
};
