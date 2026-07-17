import { useState } from 'react';
import { Copy, Check, Clock } from 'lucide-react';
import { Badge } from '@/shared/components';
import { formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';
import type { AccessCode } from '../types';

interface VoucherCardProps {
  code: AccessCode;
  planName?: string;
}

const statusConfig: Record<string, { variant: 'success' | 'warning' | 'destructive' | 'default'; label: string }> = {
  available: { variant: 'success', label: 'Active' },
  assigned: { variant: 'warning', label: 'Assigned' },
  used: { variant: 'default', label: 'Used' },
  expired: { variant: 'destructive', label: 'Expired' },
};

export function VoucherCard({ code, planName }: VoucherCardProps) {
  const [copied, setCopied] = useState(false);
  const config = statusConfig[code.status] || statusConfig.available;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Access Code</span>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <code className="rounded bg-gray-100 px-3 py-1.5 font-mono text-sm font-bold tracking-wider text-gray-900">
              {code.code}
            </code>
            <button
              onClick={handleCopy}
              className={cn(
                'rounded p-1.5 transition-colors',
                copied ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-500'
              )}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        {planName && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Plan:</span> {planName}
          </p>
        )}
        {code.expires_at && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Expires: {formatDate(code.expires_at)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
