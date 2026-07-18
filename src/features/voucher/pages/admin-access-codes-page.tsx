import { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { Button, Card, CardContent, Modal, Input, Select, SearchInput } from '@/shared/components';
import { useAdminCodes, useAccessCodeStats, useAssignCode } from '../hooks/use-vouchers';
import { VoucherTable } from '../components/voucher-table';
import { BulkUploadModal } from '../components/bulk-upload-modal';

export default function AdminAccessCodesPage() {
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [assignEmail, setAssignEmail] = useState('');
  const [assignCodeId, setAssignCodeId] = useState('');

  const { data: codesData, isLoading } = useAdminCodes({
    search: search || undefined,
    status: statusFilter || undefined,
  });
  const { data: stats } = useAccessCodeStats();
  const assignMutation = useAssignCode();

  const codes = codesData?.results || [];

  const handleAssign = () => {
    if (!assignCodeId || !assignEmail) return;
    assignMutation.mutate(
      { code_id: assignCodeId, user_id: assignEmail },
      {
        onSuccess: () => {
          setShowAssignModal(false);
          setAssignEmail('');
          setAssignCodeId('');
        },
      }
    );
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'available', label: 'Available' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'used', label: 'Used' },
    { value: 'expired', label: 'Expired' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Access Codes Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowBulkUpload(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={() => setShowAssignModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Assign Code
          </Button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold">{stats.total_codes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-2xl font-bold text-green-600">{stats.available_codes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Assigned</p>
              <p className="text-2xl font-bold text-blue-600">{stats.assigned_codes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Used</p>
              <p className="text-2xl font-bold text-purple-600">{stats.used_codes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Expired</p>
              <p className="text-2xl font-bold text-red-600">{stats.expired_codes}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex items-center gap-4">
        <SearchInput
          placeholder="Search codes..."
          value={search}
          onChange={setSearch}
          className="max-w-sm"
        />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48"
        />
      </div>

      <VoucherTable codes={codes} isLoading={isLoading} onSearch={setSearch} />

      <BulkUploadModal isOpen={showBulkUpload} onClose={() => setShowBulkUpload(false)} />

      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign Access Code">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Access Code ID</label>
            <Input
              placeholder="Enter code ID"
              value={assignCodeId}
              onChange={(e) => setAssignCodeId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">User Email</label>
            <Input
              type="email"
              placeholder="user@example.com"
              value={assignEmail}
              onChange={(e) => setAssignEmail(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!assignCodeId || !assignEmail || assignMutation.isPending}
            >
              {assignMutation.isPending ? 'Assigning...' : 'Assign Code'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
