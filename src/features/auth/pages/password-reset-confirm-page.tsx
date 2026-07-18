import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, Link } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components';
import { useConfirmPasswordReset } from '../hooks/use-auth';

const schema = z
  .object({
    new_password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type FormValues = z.infer<typeof schema>;

export default function PasswordResetConfirmPage() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid') || '';
  const token = searchParams.get('token') || '';
  const confirmResetMutation = useConfirmPasswordReset();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { new_password: '', confirm_password: '' },
  });

  const onSubmit = (data: FormValues) => {
    confirmResetMutation.mutate({
      uid,
      token,
      new_password: data.new_password,
    });
  };

  if (!uid || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600">Invalid Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired. Please request a new one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/password-reset">
              <Button variant="outline" className="w-full">Request New Link</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {confirmResetMutation.isError && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{confirmResetMutation.error?.message || 'Password reset failed. Please try again.'}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="new_password" className="text-sm font-medium text-gray-700">
                New Password
              </label>
              <Input
                id="new_password"
                type="password"
                placeholder="Create a strong password"
                icon={<Lock className="h-4 w-4" />}
                error={errors.new_password?.message}
                autoComplete="new-password"
                {...register('new_password')}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm_password" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Input
                id="confirm_password"
                type="password"
                placeholder="Repeat your password"
                icon={<Lock className="h-4 w-4" />}
                error={errors.confirm_password?.message}
                autoComplete="new-password"
                {...register('confirm_password')}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={confirmResetMutation.isPending}
            >
              {confirmResetMutation.isPending ? 'Resetting...' : 'Reset Password'}
            </Button>

            <Link to="/login">
              <Button variant="ghost" className="w-full">Back to Sign In</Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
