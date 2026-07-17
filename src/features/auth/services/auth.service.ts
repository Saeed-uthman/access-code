import { get, post, put } from '@/lib/api-client';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from '../types';
import type { User } from '@/types/models';

export const authService = {
  login(data: LoginRequest): Promise<AuthResponse> {
    return post<AuthResponse>('/api/v1/auth/login/', data);
  },

  register(data: RegisterRequest): Promise<{ message: string; email: string }> {
    return post('/api/v1/auth/register/', data);
  },

  verifyOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
    return post<AuthResponse>('/api/v1/auth/verify-otp/', data);
  },

  resendOtp(email: string): Promise<{ message: string }> {
    return post('/api/v1/auth/resend-otp/', { email });
  },

  logout(): Promise<void> {
    return post('/api/v1/auth/logout/', {});
  },

  requestPasswordReset(data: PasswordResetRequest): Promise<{ message: string }> {
    return post('/api/v1/auth/password-reset/', data);
  },

  confirmPasswordReset(data: PasswordResetConfirmRequest): Promise<{ message: string }> {
    return post('/api/v1/auth/password-reset-confirm/', data);
  },

  getProfile(): Promise<User> {
    return get<User>('/api/v1/auth/profile/');
  },

  updateProfile(data: UpdateProfileRequest): Promise<User> {
    return put<User>('/api/v1/auth/profile/', data);
  },

  changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return post('/api/v1/auth/change-password/', data);
  },
};
