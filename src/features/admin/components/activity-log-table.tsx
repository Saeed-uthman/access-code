import { DataTable, type Column } from '@/shared/components';
import { formatDateTime } from '@/utils/format';
import type { ActivityLog } from '../types';

interface ActivityLogTableProps {
  activities: ActivityLog[];
  isLoading?: boolean;
}

export function ActivityLogTable({ activities, isLoading }: ActivityLogTableProps) {
  const columns: Column<ActivityLog>[] = [
    {
      key: 'action_type',
      header: 'Action',
      render: (log) => (
        <span className="font-medium capitalize">{log.action_type.replace('_', ' ')}</span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (log) => (
        <span className="text-sm text-gray-600">{log.description}</span>
      ),
    },
    {
      key: 'ip_address',
      header: 'IP Address',
      render: (log) => (
        <span className="font-mono text-xs">{log.ip_address || '-'}</span>
      ),
    },
    {
      key: 'created_at',
      header: 'Time',
      render: (log) => (
        <span className="text-sm text-gray-500">{formatDateTime(log.created_at)}</span>
      ),
    },
  ];

  return <DataTable columns={columns} data={activities} isLoading={isLoading} />;
}
