import { Users } from 'lucide-react';
import { UserTable } from '../components/user-table';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Users className="h-6 w-6" />
          User Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">Manage users, block/unblock accounts, and create new users</p>
      </div>

      <UserTable />
    </div>
  );
}
