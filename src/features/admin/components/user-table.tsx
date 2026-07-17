import { useState } from 'react';
import { Shield, ShieldOff, UserPlus } from 'lucide-react';
import { Badge, Button, DataTable, SearchInput, Modal, Input, Select, type Column } from '@/shared/components';
import { formatDateTime } from '@/utils/format';
import { useAdminUsers, useBlockUser, useUnblockUser, useCreateUser } from '../hooks/use-admin';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email('Invalid email'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  full_name: z.string().min(2, 'Name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['user', 'admin', 'superadmin']),
  phone_number: z.string().optional(),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

const roleOptions = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'superadmin', label: 'Super Admin' },
];

export function UserTable() {
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminUsers({
    page,
    page_size: 15,
    search: search || undefined,
  });
  const blockMutation = useBlockUser();
  const unblockMutation = useUnblockUser();
  const createUserMutation = useCreateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: 'user' },
  });

  const users = data?.results || [];

  const handleCreateUser = (formData: CreateUserFormValues) => {
    createUserMutation.mutate(formData, {
      onSuccess: () => {
        reset();
        setShowCreateModal(false);
      },
    });
  };

  const columns: Column<typeof users[0]>[] = [
    {
      key: 'full_name',
      header: 'Name',
      render: (user) => (
        <div>
          <p className="font-medium">{user.full_name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      ),
    },
    {
      key: 'username',
      header: 'Username',
      render: (user) => `@${user.username}`,
    },
    {
      key: 'role',
      header: 'Role',
      render: (user) => (
        <Badge variant={user.role === 'superadmin' ? 'destructive' : user.role === 'admin' ? 'default' : 'outline'}>
          {user.role}
        </Badge>
      ),
    },
    {
      key: 'is_blocked',
      header: 'Status',
      render: (user) => (
        <Badge variant={user.is_blocked ? 'destructive' : 'success'}>
          {user.is_blocked ? 'Blocked' : 'Active'}
        </Badge>
      ),
    },
    {
      key: 'date_joined',
      header: 'Joined',
      render: (user) => formatDateTime(user.date_joined),
    },
    {
      key: 'id',
      header: 'Actions',
      render: (user) => (
        <div className="flex items-center gap-2">
          {user.is_blocked ? (
            <button
              onClick={() => unblockMutation.mutate(user.id)}
              className="flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-200"
            >
              <ShieldOff className="h-3 w-3" />
              Unblock
            </button>
          ) : (
            <button
              onClick={() => blockMutation.mutate(user.id)}
              className="flex items-center gap-1 rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
            >
              <Shield className="h-3 w-3" />
              Block
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchInput
          placeholder="Search users..."
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          className="max-w-sm"
        />
        <Button onClick={() => setShowCreateModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>

      <DataTable columns={columns} data={users} isLoading={isLoading} />

      {data && data.count > 15 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * 15 + 1} to {Math.min(page * 15, data.count)} of {data.count}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!data.previous}
              className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.next}
              className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create User">
        <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input type="email" placeholder="user@example.com" error={errors.email?.message} {...register('email')} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <Input placeholder="John Doe" error={errors.full_name?.message} {...register('full_name')} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Username</label>
            <Input placeholder="johndoe" error={errors.username?.message} {...register('username')} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <Input type="password" placeholder="At least 8 characters" error={errors.password?.message} {...register('password')} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <Input type="tel" placeholder="+234 800 000 0000" {...register('phone_number')} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <Select options={roleOptions} error={errors.role?.message} {...register('role')} />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
