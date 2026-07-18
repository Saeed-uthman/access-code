import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Badge, DataTable, SearchInput, type Column } from '@/shared/components';
import { formatDate } from '@/utils/format';
import toast from 'react-hot-toast';
import type { AccessCode } from '../types';

interface VoucherTableProps {
  codes: AccessCode[];
  isLoading?: boolean;
  onSearch?: (search: string) => void;
}

const statusConfig: Record<string, { variant: 'success' | 'warning' | 'destructive' | 'default'; label: string }> = {
  available: { variant: 'success', label: 'Available' },
  assigned: { variant: 'warning', label: 'Assigned' },
  used: { variant: 'default', label: 'Used' },
  expired: { variant: 'destructive', label: 'Expired' },
};

function CopyableCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="flex items-center gap-1">
      <code className="font-mono text-sm">{code}</code>
      <button onClick={handleCopy} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
        {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
      </button>
    </div>
  );
}

export function VoucherTable({ codes, isLoading, onSearch }: VoucherTableProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const columns: Column<AccessCode>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (item) => <CopyableCode code={item.code} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => {
        const config = statusConfig[item.status] || statusConfig.available;
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: 'assigned_to',
      header: 'Assigned To',
      render: (item) => {
        if (!item.assigned_to) return '-';
        if (typeof item.assigned_to === 'string') return item.assigned_to;
        return item.assigned_to.email || item.assigned_to.full_name || '-';
      },
    },
    {
      key: 'expires_at',
      header: 'Expires',
      render: (item) => (item.expires_at ? formatDate(item.expires_at) : '-'),
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (item) => formatDate(item.created_at),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <SearchInput
          placeholder="Search codes..."
          value={searchValue}
          onChange={handleSearch}
          className="w-full max-w-sm"
        />
      </div>
      <DataTable columns={columns} data={codes} isLoading={isLoading} />
    </div>
  );
}
