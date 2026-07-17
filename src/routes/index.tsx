import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';
import { CustomerLayout } from '@/layouts/customer-layout';
import { AdminLayout } from '@/layouts/admin-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

function lazyPage(factory: () => Promise<{ default: React.ComponentType }>) {
  const Component = lazy(factory);
  return (
    <SuspenseWrapper>
      <Component />
    </SuspenseWrapper>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: lazyPage(() => import('@/features/public/pages/HomePage')),
      },
      {
        path: 'pricing',
        element: lazyPage(() => import('@/features/public/pages/PricingPage')),
      },
      {
        path: 'login',
        element: lazyPage(() => import('@/features/auth/pages/login-page')),
      },
      {
        path: 'register',
        element: lazyPage(() => import('@/features/auth/pages/register-page')),
      },
      {
        path: 'verify-otp',
        element: lazyPage(() => import('@/features/auth/pages/verify-otp-page')),
      },
      {
        path: 'password-reset',
        element: lazyPage(
          () => import('@/features/auth/pages/password-reset-request-page')
        ),
      },
      {
        path: 'password-reset/confirm',
        element: lazyPage(
          () => import('@/features/auth/pages/password-reset-confirm-page')
        ),
      },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <CustomerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: lazyPage(
          () => import('@/features/dashboard/pages/dashboard-page')
        ),
      },
      {
        path: 'vouchers',
        element: lazyPage(
          () => import('@/features/voucher/pages/vouchers-page')
        ),
      },
      {
        path: 'plans',
        element: lazyPage(
          () => import('@/features/plans/pages/plans-page')
        ),
      },
      {
        path: 'transactions',
        element: lazyPage(
          () => import('@/features/transaction/pages/transactions-page')
        ),
      },
      {
        path: 'notifications',
        element: lazyPage(
          () => import('@/features/notification/pages/notifications-page')
        ),
      },
      {
        path: 'profile',
        element: lazyPage(
          () => import('@/features/profile/pages/profile-page')
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: lazyPage(
          () => import('@/features/dashboard/pages/admin-dashboard-page')
        ),
      },
      {
        path: 'users',
        element: lazyPage(
          () => import('@/features/admin/pages/admin-users-page')
        ),
      },
      {
        path: 'plans',
        element: lazyPage(
          () => import('@/features/plans/pages/admin-plans-page')
        ),
      },
      {
        path: 'access-codes',
        element: lazyPage(
          () => import('@/features/voucher/pages/admin-access-codes-page')
        ),
      },
      {
        path: 'transactions',
        element: lazyPage(
          () => import('@/features/transaction/pages/admin-transactions-page')
        ),
      },
      {
        path: 'notifications',
        element: lazyPage(
          () => import('@/features/admin/pages/admin-notifications-page')
        ),
      },
      {
        path: 'gallery',
        element: lazyPage(
          () => import('@/features/admin/pages/admin-gallery-page')
        ),
      },
      {
        path: 'settings',
        element: lazyPage(
          () => import('@/features/admin/pages/admin-settings-page')
        ),
      },
      {
        path: 'activity-logs',
        element: lazyPage(
          () => import('@/features/admin/pages/admin-activity-logs-page')
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
