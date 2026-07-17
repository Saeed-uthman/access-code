import { Bell, MessageSquare, CreditCard, Key, Info, Gift } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDateTime } from '@/utils/format';
import { useMarkRead } from '../hooks/use-notifications';
import type { Notification } from '../types';

interface NotificationListProps {
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
}

const typeIcons: Record<string, typeof Bell> = {
  system: Info,
  transaction: CreditCard,
  access_code: Key,
  account: MessageSquare,
  promotion: Gift,
};

export function NotificationList({ notifications, onNotificationClick }: NotificationListProps) {
  const markReadMutation = useMarkRead();

  const handleClick = (notification: Notification) => {
    if (!notification.is_read) {
      markReadMutation.mutate(notification.id);
    }
    onNotificationClick?.(notification);
  };

  if (notifications.length === 0) {
    return (
      <div className="py-12 text-center">
        <Bell className="mx-auto h-8 w-8 text-gray-300" />
        <p className="mt-2 text-sm text-gray-500">No notifications</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {notifications.map((notification) => {
        const Icon = typeIcons[notification.notification_type] || Bell;

        return (
          <button
            key={notification.id}
            onClick={() => handleClick(notification)}
            className={cn(
              'flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-gray-50',
              !notification.is_read && 'bg-blue-50 hover:bg-blue-50/80'
            )}
          >
            <div
              className={cn(
                'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                !notification.is_read ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className={cn('text-sm', !notification.is_read ? 'font-semibold text-gray-900' : 'text-gray-700')}>
                  {notification.title}
                </p>
                {!notification.is_read && (
                  <span className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                )}
              </div>
              <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">{notification.message}</p>
              <p className="mt-1 text-xs text-gray-400">{formatDateTime(notification.created_at)}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
