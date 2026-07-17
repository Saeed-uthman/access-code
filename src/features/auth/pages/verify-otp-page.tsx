import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components';
import { useVerifyOtp, useResendOtp } from '../hooks/use-auth';

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export default function VerifyOtpPage() {
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || '';

  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = useCallback(() => {
    if (!email) return;
    resendOtpMutation.mutate(email);
    setCountdown(60);
    setCanResend(false);
  }, [email, resendOtpMutation]);

  const onSubmit = (data: OtpFormValues) => {
    verifyOtpMutation.mutate({ email, otp: data.otp });
  };

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
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <Input
                id="otp"
                placeholder="000000"
                maxLength={6}
                className="text-center text-lg tracking-[0.5em]"
                error={errors.otp?.message}
                {...register('otp')}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="text-center">
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
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
