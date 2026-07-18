import { useState } from 'react';
import { Modal, Button, Textarea, Select } from '@/shared/components';
import { useBulkUpload } from '../hooks/use-vouchers';
import { useAdminPlans } from '@/features/plans/hooks/use-plans';
import { Upload } from 'lucide-react';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulkUploadModal({ isOpen, onClose }: BulkUploadModalProps) {
  const [codeText, setCodeText] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const bulkUploadMutation = useBulkUpload();
  const { data: plansData } = useAdminPlans();

  const plans = plansData?.results || [];
  const planOptions = plans.map((p) => ({ value: p.id, label: `${p.name} (₦${p.cost})` }));

  const parseCodes = (text: string): string[] => {
    return text
      .split(/[\n,;]+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  const codes = parseCodes(codeText);

  const handleUpload = () => {
    if (codes.length === 0 || !selectedPlan) return;

    bulkUploadMutation.mutate(
      { codes: codes.join('\n'), plan_id: selectedPlan },
      {
        onSuccess: () => {
          setCodeText('');
          setSelectedPlan('');
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    setCodeText('');
    setSelectedPlan('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Bulk Upload Access Codes">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Plan</label>
          <Select
            options={[{ value: '', label: 'Select a plan...' }, ...planOptions]}
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
          />
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">
            Enter access codes below, one per line or separated by commas/semicolons.
          </p>
          <Textarea
            placeholder={"ABC123\nDEF456\nGHI789"}
            value={codeText}
            onChange={(e) => setCodeText(e.target.value)}
            rows={8}
            className="font-mono text-sm"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2">
          <span className="text-sm text-gray-600">Parsed codes:</span>
          <span className="text-sm font-semibold">{codes.length}</span>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={codes.length === 0 || !selectedPlan || bulkUploadMutation.isPending}
          >
            <Upload className="h-4 w-4 mr-2" />
            {bulkUploadMutation.isPending ? 'Uploading...' : `Upload ${codes.length} Codes`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
