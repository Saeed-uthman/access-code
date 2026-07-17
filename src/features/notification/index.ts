export { default as NotificationsPage } from './pages/notifications-page';

export { NotificationList } from './components/notification-list';
export { NotificationBell } from './components/notification-bell';

export { useNotifications, useMarkRead, useMarkAllRead, useUnreadCount, useSendBulkNotification } from './hooks/use-notifications';

export { notificationService } from './services/notification.service';

export type * from './types';
