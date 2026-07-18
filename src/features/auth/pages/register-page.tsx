import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components';
import { useRegister } from '../hooks/use-auth';

const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name is too long'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    phone_number: z
      .string()
      .min(1, 'Phone number is required')
      .min(10, 'Phone number must be at least 10 digits')
      .max(20, 'Phone number is too long'),
    username: z
      .string()
      .min(1, 'Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be at most 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      full_name: '',
      email: '',
      phone_number: '',
      username: '',
      password: '',
      confirm_password: '',
    },
  });

  const password = watch('password');

  const passwordChecks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
  ];

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Sign up to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {registerMutation.isError && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{registerMutation.error?.message || 'Registration failed. Please try again.'}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                id="full_name"
                placeholder="John Doe"
                icon={<User className="h-4 w-4" />}
                error={errors.full_name?.message}
                autoComplete="name"
                {...register('full_name')}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                autoComplete="email"
                {...register('email')}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input
                id="phone_number"
                type="tel"
                placeholder="+234 800 000 0000"
                icon={<Phone className="h-4 w-4" />}
                error={errors.phone_number?.message}
                autoComplete="tel"
                {...register('phone_number')}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </label>
              <Input
                id="username"
                placeholder="johndoe"
                icon={<User className="h-4 w-4" />}
                error={errors.username?.message}
                autoComplete="username"
                {...register('username')}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                icon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                autoComplete="new-password"
                {...register('password')}
              />
              {password && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-1 text-xs">
                      {check.met ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-gray-300" />
                      )}
                      <span className={check.met ? 'text-green-600' : 'text-gray-500'}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
