export { default as AdminUsersPage } from './pages/admin-users-page';
export { default as AdminSettingsPage } from './pages/admin-settings-page';
export { default as AdminGalleryPage } from './pages/admin-gallery-page';
export { default as AdminActivityLogsPage } from './pages/admin-activity-logs-page';
export { default as AdminNotificationsPage } from './pages/admin-notifications-page';

export { UserTable } from './components/user-table';
export { ActivityLogTable } from './components/activity-log-table';

export {
  useAdminUsers,
  useBlockUser,
  useUnblockUser,
  useCreateUser,
  useActivities,
  useSystemSettings,
  useUpdateSetting,
  useGalleryPhotos,
  useUploadPhoto,
  useDeletePhoto,
} from './hooks/use-admin';

export { adminService } from './services/admin.service';

export type * from './types';
