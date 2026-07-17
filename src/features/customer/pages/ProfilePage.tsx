import { UserCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-gray-500">
          Manage your account settings and personal information.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700">
            {user?.full_name?.[0]?.toUpperCase() ||
              user?.username?.[0]?.toUpperCase() ||
              'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.full_name || 'No Name'}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-sm text-gray-500">
              @{user?.username}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-500">Role</p>
            <p className="mt-1 text-sm text-gray-900 capitalize">
              {user?.role}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Email Verified
            </p>
            <p className="mt-1 text-sm text-gray-900">
              {user?.is_email_verified ? 'Yes' : 'No'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="mt-1 text-sm text-gray-900">
              {user?.phone_number || 'Not set'}
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8">
          <div className="text-center">
            <UserCircle className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">
              Edit profile form will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
