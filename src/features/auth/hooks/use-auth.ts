import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/store/auth-store';
import type {
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  PasswordResetConfirmRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from '../types';
import type { User } from '@/types/models';

export function useLogin() {
  const navigate = useNavigate();
  const { login: storeLogin } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      storeLogin(data.user, { access: data.access, refresh: data.refresh });
      toast.success('Login successful!');
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data, variables) => {
      toast.success('Registration successful! Please verify your email.');
      navigate('/verify-otp', { state: { email: variables.email, user_id: data.user_id } });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    },
  });
}

export function useVerifyOtp() {
  const navigate = useNavigate();
  const { login: storeLogin } = useAuthStore();

  return useMutation({
    mutationFn: (data: VerifyOtpRequest) => authService.verifyOtp(data),
    onSuccess: (data) => {
      const user: User = {
        id: data.data.user.id,
        email: data.data.user.email,
        username: data.data.user.username,
        full_name: '',
        phone_number: null,
        role: 'user',
        is_email_verified: true,
        is_blocked: false,
        created_at: new Date().toISOString(),
      };
      storeLogin(user, { access: data.data.token, refresh: data.data.refresh });
      toast.success('Email verified successfully!');
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'OTP verification failed');
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (data: { user_id: string; otp_type: 'email' }) =>
      authService.resendOtp(data),
    onSuccess: () => {
      toast.success('OTP resent successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to resend OTP');
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout: storeLogout, tokens } = useAuthStore();

  return useMutation({
    mutationFn: () => authService.logout(tokens?.refresh || ''),
    onSettled: () => {
      storeLogout();
      queryClient.clear();
      navigate('/login');
    },
  });
}

export function useProfile() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => authService.getProfile(),
    enabled: isAuthenticated,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser, user } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      if (user) {
        authService.getProfile().then((freshUser) => {
          setUser(freshUser);
        });
      }
      toast.success('Profile updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to change password');
    },
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) =>
      authService.requestPasswordReset({ email }),
    onSuccess: () => {
      toast.success('Password reset email sent!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send reset email');
    },
  });
}

export function useConfirmPasswordReset() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: PasswordResetConfirmRequest) =>
      authService.confirmPasswordReset(data),
    onSuccess: () => {
      toast.success('Password reset successful!');
      navigate('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Password reset failed');
    },
  });
}
