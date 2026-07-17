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
      key: 'action',
      header: 'Action',
      render: (log) => (
        <span className="font-medium capitalize">{log.action.replace('_', ' ')}</span>
      ),
    },
    {
      key: 'resource_type',
      header: 'Resource',
      render: (log) => (
        <span className="capitalize">{log.resource_type.replace('_', ' ')}</span>
      ),
    },
    {
      key: 'resource_id',
      header: 'Resource ID',
      render: (log) => (
        <span className="font-mono text-xs text-gray-500">
          {log.resource_id ? log.resource_id.slice(0, 8) : '-'}
        </span>
      ),
    },
    {
      key: 'ip_address',
      header: 'IP Address',
      render: (log) => (
        <span className="font-mono text-xs">{log.ip_address}</span>
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
