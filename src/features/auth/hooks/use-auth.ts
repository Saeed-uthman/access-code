import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/store/auth-store';
import { extractApiError } from '@/lib/extract-api-error';
import type {
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  PasswordResetConfirmRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from '../types';
import type { User } from '@/types/models';

function getDashboardPath(user: User): string {
  if (user.role === 'admin' || user.role === 'superadmin') return '/admin';
  return '/dashboard';
}

export function useLogin() {
  const navigate = useNavigate();
  const { login: storeLogin } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      storeLogin(data.user, { access: data.access, refresh: data.refresh });
      toast.success('Login successful!');
      navigate(getDashboardPath(data.user), { replace: true });
    },
    onError: (error: Error) => {
      const msg = extractApiError(error);
      toast.error(msg);
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data, variables) => {
      toast.success('Registration successful! Please verify your email.');
      navigate('/verify-otp', {
        state: { email: variables.email, user_id: data.user_id },
        replace: true,
      });
    },
    onError: (error: Error) => {
      const msg = extractApiError(error);
      toast.error(msg);
    },
  });
}

export function useVerifyOtp() {
  const navigate = useNavigate();
  const { login: storeLogin } = useAuthStore();

  return useMutation({
    mutationFn: (data: VerifyOtpRequest) => authService.verifyOtp(data),
    onSuccess: (data) => {
      const backendUser = data.data.user;
      const user: User = {
        id: backendUser.id,
        email: backendUser.email,
        username: backendUser.username,
        full_name: backendUser.full_name || '',
        phone_number: backendUser.phone_number || null,
        role: (backendUser.role as User['role']) || 'user',
        is_email_verified: true,
        is_blocked: false,
        created_at: backendUser.created_at || new Date().toISOString(),
      };
      storeLogin(user, { access: data.data.token, refresh: data.data.refresh });
      toast.success('Email verified successfully!');
      navigate(getDashboardPath(user), { replace: true });
    },
    onError: (error: Error) => {
      const msg = extractApiError(error);
      toast.error(msg);
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (data: { user_id: string; otp_type: 'email' }) =>
      authService.resendOtp(data),
    onSuccess: (data) => {
      toast.success(data.message || 'OTP resent successfully! Check your email.');
    },
    onError: (error: Error) => {
      const msg = extractApiError(error);
      toast.error(msg);
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
      navigate('/login', { replace: true });
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
      const msg = extractApiError(error);
      toast.error(msg);
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
      const msg = extractApiError(error);
      toast.error(msg);
    },
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) =>
      authService.requestPasswordReset({ email }),
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset email sent!');
    },
    onError: (error: Error) => {
      const msg = extractApiError(error);
      toast.error(msg);
    },
  });
}

export function useConfirmPasswordReset() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: PasswordResetConfirmRequest) =>
      authService.confirmPasswordReset(data),
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset successful!');
      navigate('/login', { replace: true });
    },
    onError: (error: Error) => {
      const msg = extractApiError(error);
      toast.error(msg);
    },
  });
}
