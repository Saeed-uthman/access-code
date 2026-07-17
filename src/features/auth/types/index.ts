import type { User } from '@/types/models';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  full_name: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

export interface RegisterResponse {
  message: string;
  user_id: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface VerifyOtpRequest {
  user_id: string;
  otp_code: string;
  otp_type: 'email';
}

export interface VerifyOtpResponse {
  message: string;
  data: {
    user: { id: string; email: string; username: string };
    token: string;
    refresh: string;
  };
}

export interface ResendOtpRequest {
  user_id: string;
  otp_type: 'email';
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  uid: string;
  token: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

export interface UpdateProfileRequest {
  address?: string;
  date_of_birth?: string;
}
