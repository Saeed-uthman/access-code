import { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel, FullPageLoader, EmptyState } from '@/shared/components';
import { VoucherCard } from '../components/voucher-card';
import { useMyCodes } from '../hooks/use-vouchers';
import type { AccessCode } from '../types';

type StatusFilter = 'all' | 'available' | 'assigned' | 'expired';

export default function VouchersPage() {
  const [activeTab, setActiveTab] = useState<StatusFilter>('all');
  const { data, isLoading } = useMyCodes();

  if (isLoading) return <FullPageLoader />;

  const allCodes = data?.results || [];

  const filteredCodes = activeTab === 'all'
    ? allCodes
    : allCodes.filter((code) => code.status === activeTab);

  const tabCounts = {
    all: allCodes.length,
    available: allCodes.filter((c) => c.status === 'available').length,
    assigned: allCodes.filter((c) => c.status === 'assigned').length,
    expired: allCodes.filter((c) => c.status === 'expired' || c.status === 'used').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Access Codes</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage your access codes</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as StatusFilter)}>
        <TabList>
          <Tab value="all">All ({tabCounts.all})</Tab>
          <Tab value="available">Active ({tabCounts.available})</Tab>
          <Tab value="assigned">Assigned ({tabCounts.assigned})</Tab>
          <Tab value="expired">Expired ({tabCounts.expired})</Tab>
        </TabList>

        <TabPanel value="all" activeValue={activeTab}>
          <CodeGrid codes={filteredCodes} />
        </TabPanel>
        <TabPanel value="available" activeValue={activeTab}>
          <CodeGrid codes={filteredCodes} />
        </TabPanel>
        <TabPanel value="assigned" activeValue={activeTab}>
          <CodeGrid codes={filteredCodes} />
        </TabPanel>
        <TabPanel value="expired" activeValue={activeTab}>
          <CodeGrid codes={filteredCodes} />
        </TabPanel>
      </Tabs>
    </div>
  );
}

function CodeGrid({ codes }: { codes: AccessCode[] }) {
  if (codes.length === 0) {
    return (
      <EmptyState
        title="No codes found"
        description="You don't have any access codes in this category yet."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {codes.map((code) => (
        <VoucherCard key={code.id} code={code} />
      ))}
    </div>
  );
}
