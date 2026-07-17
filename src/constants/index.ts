export const API_BASE_URL = '/api/v1';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
  RESEND_OTP: '/resend-otp',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',
  PLANS: '/plans',
  PLAN_DETAIL: '/plans/:planId',
  MY_CODES: '/my-codes',
  TRANSACTIONS: '/transactions',
  TRANSACTION_DETAIL: '/transactions/:transactionId',
  CHECKOUT: '/checkout',
  PAYMENT_SUCCESS: '/payment-success',
  PAYMENT_FAILED: '/payment-failed',
  NOTIFICATIONS: '/notifications',
  GALLERY: '/gallery',
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    USER_DETAIL: '/admin/users/:userId',
    PLANS: '/admin/plans',
    PLAN_CREATE: '/admin/plans/create',
    PLAN_EDIT: '/admin/plans/:planId/edit',
    ACCESS_CODES: '/admin/access-codes',
    ACCESS_CODE_DETAIL: '/admin/access-codes/:codeId',
    TRANSACTIONS: '/admin/transactions',
    TRANSACTION_DETAIL: '/admin/transactions/:transactionId',
    NOTIFICATIONS: '/admin/notifications',
    SETTINGS: '/admin/settings',
    ACTIVITIES: '/admin/activities',
    GALLERY: '/admin/gallery',
  },
} as const;

export const PLAN_TYPES = [
  { value: 'house', label: 'House' },
  { value: 'individual', label: 'Individual' },
  { value: 'business', label: 'Business' },
] as const;

export const PAYMENT_METHODS = [
  { value: 'paystack', label: 'Paystack' },
  { value: 'manual', label: 'Manual' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
] as const;

export const TRANSACTION_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'failed', label: 'Failed', color: 'red' },
  { value: 'cancelled', label: 'Cancelled', color: 'gray' },
  { value: 'refunded', label: 'Refunded', color: 'orange' },
] as const;

export const ACCESS_CODE_STATUSES = [
  { value: 'available', label: 'Available', color: 'green' },
  { value: 'assigned', label: 'Assigned', color: 'blue' },
  { value: 'used', label: 'Used', color: 'purple' },
  { value: 'expired', label: 'Expired', color: 'red' },
] as const;

export const NOTIFICATION_TYPES = [
  { value: 'system', label: 'System' },
  { value: 'transaction', label: 'Transaction' },
  { value: 'access_code', label: 'Access Code' },
  { value: 'account', label: 'Account' },
  { value: 'promotion', label: 'Promotion' },
] as const;

export const USER_ROLES = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'superadmin', label: 'Super Admin' },
] as const;
