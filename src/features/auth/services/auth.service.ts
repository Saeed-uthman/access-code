import { get, post, put } from '@/lib/api-client';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from '../types';
import type { User } from '@/types/models';

export const authService = {
  login(data: LoginRequest): Promise<AuthResponse> {
    return post<AuthResponse>('/auth/login/', data);
  },

  register(data: RegisterRequest): Promise<RegisterResponse> {
    return post<RegisterResponse>('/auth/register/', data);
  },

  verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    return post<VerifyOtpResponse>('/auth/verify-otp/', data);
  },

  resendOtp(data: ResendOtpRequest): Promise<{ message: string }> {
    return post('/auth/resend-otp/', data);
  },

  logout(refreshToken: string): Promise<{ message: string }> {
    return post('/auth/logout/', { refresh_token: refreshToken });
  },

  requestPasswordReset(data: PasswordResetRequest): Promise<{ message: string }> {
    return post('/auth/password-reset/', data);
  },

  confirmPasswordReset(data: PasswordResetConfirmRequest): Promise<{ message: string }> {
    return post('/auth/password-reset/confirm/', data);
  },

  getProfile(): Promise<User> {
    return get<User>('/auth/profile/');
  },

  updateProfile(data: UpdateProfileRequest): Promise<User> {
    return put<User>('/auth/profile/update/', data);
  },

  changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return post('/auth/change-password/', data);
  },
};
