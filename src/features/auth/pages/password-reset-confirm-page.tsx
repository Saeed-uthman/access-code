import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components';
import { useConfirmPasswordReset } from '../hooks/use-auth';

const schema = z
  .object({
    new_password: z.string().min(8, 'Password must be at least 8 characters'),
    new_password_confirm: z.string(),
  })
  .refine((data) => data.new_password === data.new_password_confirm, {
    message: 'Passwords do not match',
    path: ['new_password_confirm'],
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
    defaultValues: {
      new_password: '',
      new_password_confirm: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    confirmResetMutation.mutate({
      uid,
      token,
      new_password: data.new_password,
      new_password_confirm: data.new_password_confirm,
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
            <div className="space-y-2">
              <label htmlFor="new_password" className="text-sm font-medium text-gray-700">
                New Password
              </label>
              <Input
                id="new_password"
                type="password"
                placeholder="At least 8 characters"
                icon={<Lock className="h-4 w-4" />}
                error={errors.new_password?.message}
                {...register('new_password')}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="new_password_confirm" className="text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <Input
                id="new_password_confirm"
                type="password"
                placeholder="Repeat your new password"
                icon={<Lock className="h-4 w-4" />}
                error={errors.new_password_confirm?.message}
                {...register('new_password_confirm')}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={confirmResetMutation.isPending}
            >
              {confirmResetMutation.isPending ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
