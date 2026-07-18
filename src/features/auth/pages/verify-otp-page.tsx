import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components';
import { useVerifyOtp, useResendOtp } from '../hooks/use-auth';

const otpSchema = z.object({
  otp_code: z
    .string()
    .min(1, 'OTP is required')
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export default function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { email?: string; user_id?: string } | null;
  const email = state?.email || '';
  const userId = state?.user_id || '';

  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp_code: '' },
  });

  useEffect(() => {
    if (!userId) {
      navigate('/register', { replace: true });
    }
  }, [userId, navigate]);

  useEffect(() => {
    setFocus('otp_code');
  }, [setFocus]);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = useCallback(() => {
    if (!userId) return;
    resendOtpMutation.mutate(
      { user_id: userId, otp_type: 'email' },
      { onSuccess: () => { setCountdown(60); setCanResend(false); } }
    );
  }, [userId, resendOtpMutation]);

  const onSubmit = (data: OtpFormValues) => {
    verifyOtpMutation.mutate({
      user_id: userId,
      otp_code: data.otp_code,
      otp_type: 'email',
    });
  };

  if (!userId) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a 6-digit code to{' '}
            <span className="font-medium text-gray-900">{email || 'your email'}</span>.
            Enter it below to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {verifyOtpMutation.isError && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{verifyOtpMutation.error?.message || 'Invalid OTP. Please try again.'}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="otp_code" className="text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <Input
                id="otp_code"
                placeholder="000000"
                maxLength={6}
                inputMode="numeric"
                className="text-center text-lg tracking-[0.5em]"
                error={errors.otp_code?.message}
                {...register('otp_code')}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="flex flex-col items-center gap-2">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  disabled={resendOtpMutation.isPending}
                >
                  {resendOtpMutation.isPending ? 'Sending...' : 'Resend Code'}
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Resend code in {countdown}s
                </p>
              )}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to registration
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
