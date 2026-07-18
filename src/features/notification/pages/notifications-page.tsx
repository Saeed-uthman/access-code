import { useState } from 'react';
import { CheckCheck } from 'lucide-react';
import { Button, FullPageLoader } from '@/shared/components';
import { NotificationList } from '../components/notification-list';
import { useNotifications, useMarkAllRead, useUnreadCount } from '../hooks/use-notifications';

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data: unreadData } = useUnreadCount();
  const { data, isLoading } = useNotifications({ page, page_size: 20 });
  const markAllReadMutation = useMarkAllRead();

  const notifications = data?.results || [];
  const unreadCount = unreadData?.unread_count || 0;

  if (isLoading) return <FullPageLoader />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="rounded-lg border bg-white">
        <NotificationList notifications={notifications} />
      </div>

      {data && data.count > 20 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, data.count)} of {data.count}
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
    </div>
  );
}
