import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { profileService } from '../services/profile.service';
import type { ProfileUpdateRequest, ProfileDetailsUpdateRequest, ChangePasswordRequest } from '../types';
import { useAuthStore } from '@/store/auth-store';

export function useProfile() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
    enabled: isAuthenticated,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileUpdateRequest & ProfileDetailsUpdateRequest) => {
      const { address, date_of_birth, ...userData } = data;

      const userResult = await profileService.updateProfile(userData);

      if (address !== undefined || date_of_birth !== undefined) {
        await profileService.updateProfileDetails({ address, date_of_birth });
      }

      return userResult;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      queryClient.setQueryData(['auth', 'profile'], data);
      toast.success('Profile updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => profileService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to change password');
    },
  });
}
