import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button, Card, CardContent, Input, FullPageLoader } from '@/shared/components';
import { useSystemSettings, useUpdateSetting } from '../hooks/use-admin';
import { formatDateTime } from '@/utils/format';

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useSystemSettings();
  const updateSettingMutation = useUpdateSetting();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (id: string, currentValue: string) => {
    setEditingId(id);
    setEditValue(currentValue);
  };

  const handleSave = () => {
    if (!editingId) return;
    updateSettingMutation.mutate(
      { id: editingId, data: { value: editValue } },
      { onSuccess: () => { setEditingId(null); setEditValue(''); } }
    );
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  if (isLoading) return <FullPageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Settings className="h-6 w-6" />
          System Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">Manage system configuration and settings</p>
      </div>

      <div className="space-y-4">
        {settings && settings.length > 0 ? (
          settings.map((setting) => (
            <Card key={setting.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-mono text-sm font-semibold text-gray-900">{setting.key}</h3>
                    </div>
                    {setting.description && (
                      <p className="mt-1 text-sm text-gray-500">{setting.description}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">
                      Last updated: {formatDateTime(setting.updated_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {editingId === setting.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-64"
                        />
                        <Button size="sm" onClick={handleSave} disabled={updateSettingMutation.isPending}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <code className="rounded bg-gray-100 px-2 py-1 text-sm">{setting.value}</code>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(setting.id, setting.value)}>
                          Edit
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-sm text-gray-500">No settings configured</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
