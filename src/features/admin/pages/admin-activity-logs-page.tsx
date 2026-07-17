import { useState } from 'react';
import { Activity } from 'lucide-react';
import { FullPageLoader } from '@/shared/components';
import { ActivityLogTable } from '../components/activity-log-table';
import { useActivities } from '../hooks/use-admin';

export default function AdminActivityLogsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useActivities({ page, page_size: 20 });
  const activities = data?.results || [];

  if (isLoading) return <FullPageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Activity className="h-6 w-6" />
          Activity Logs
        </h1>
        <p className="mt-1 text-sm text-gray-500">Monitor system activities and user actions</p>
      </div>

      <ActivityLogTable activities={activities} isLoading={isLoading} />

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
