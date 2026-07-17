import { useState } from 'react';
import { Modal, Button, Textarea } from '@/shared/components';
import { useBulkUpload } from '../hooks/use-vouchers';
import { Upload } from 'lucide-react';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulkUploadModal({ isOpen, onClose }: BulkUploadModalProps) {
  const [codeText, setCodeText] = useState('');
  const bulkUploadMutation = useBulkUpload();

  const parseCodes = (text: string): string[] => {
    return text
      .split(/[\n,;]+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  const codes = parseCodes(codeText);

  const handleUpload = () => {
    if (codes.length === 0) return;

    bulkUploadMutation.mutate({ codes }, {
      onSuccess: () => {
        setCodeText('');
        onClose();
      },
    });
  };

  const handleClose = () => {
    setCodeText('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Bulk Upload Access Codes">
      <div className="space-y-4">
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
            disabled={codes.length === 0 || bulkUploadMutation.isPending}
          >
            <Upload className="h-4 w-4 mr-2" />
            {bulkUploadMutation.isPending ? 'Uploading...' : `Upload ${codes.length} Codes`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
