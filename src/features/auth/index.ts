export { default as LoginPage } from './pages/login-page';
export { default as RegisterPage } from './pages/register-page';
export { default as VerifyOtpPage } from './pages/verify-otp-page';
export { default as PasswordResetRequestPage } from './pages/password-reset-request-page';
export { default as PasswordResetConfirmPage } from './pages/password-reset-confirm-page';

export { useLogin, useRegister, useVerifyOtp, useResendOtp, useLogout, useProfile, useUpdateProfile, useChangePassword, useRequestPasswordReset, useConfirmPasswordReset } from './hooks/use-auth';

export { authService } from './services/auth.service';

export type * from './types';
