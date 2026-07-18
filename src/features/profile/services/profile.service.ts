import { get, put, post } from '@/lib/api-client';
import type { User } from '@/types/models';
import type { ProfileUpdateRequest, ProfileDetailsUpdateRequest, ChangePasswordRequest } from '../types';

export const profileService = {
  getProfile(): Promise<User> {
    return get<User>('/accounts/profile/');
  },

  updateProfile(data: ProfileUpdateRequest): Promise<User> {
    return put<User>('/accounts/profile/', data);
  },

  updateProfileDetails(data: ProfileDetailsUpdateRequest): Promise<User> {
    return put<User>('/accounts/profile/update/', data);
  },

  changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return post('/accounts/change-password/', data);
  },
};
