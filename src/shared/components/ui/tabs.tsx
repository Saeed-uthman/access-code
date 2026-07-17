import { type ReactNode, createContext, useContext, useState } from 'react';
import { cn } from '@/utils/cn';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs compound components must be used within <Tabs>');
  return ctx;
}

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

function Tabs({ defaultValue = '', value, onValueChange, children, className }: TabsProps) {
  const [internalTab, setInternalTab] = useState(defaultValue);
  const activeTab = value !== undefined ? value : internalTab;
  const setActiveTab = (id: string) => {
    setInternalTab(id);
    onValueChange?.(id);
  };
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn('flex gap-1 border-b border-gray-200', className)}
      role="tablist"
    >
      {children}
    </div>
  );
}

export interface TabProps {
  id?: string;
  value?: string;
  children: ReactNode;
  className?: string;
}

function Tab({ id, value, children, className }: TabProps) {
  const tabId = id || value || '';
  const { activeTab, setActiveTab } = useTabs();
  return (
    <button
      role="tab"
      aria-selected={activeTab === tabId}
      onClick={() => setActiveTab(tabId)}
      className={cn(
        'px-4 py-2.5 text-sm font-medium transition-colors',
        'border-b-2 -mb-px',
        activeTab === tabId
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700',
        className
      )}
    >
      {children}
    </button>
  );
}

export interface TabPanelProps {
  id?: string;
  value?: string;
  activeValue?: string;
  children: ReactNode;
  className?: string;
}

function TabPanel({ id, value, activeValue, children, className }: TabPanelProps) {
  const panelId = id || value || '';
  const { activeTab } = useTabs();
  const isActive = activeValue !== undefined ? activeValue === panelId : activeTab === panelId;
  if (!isActive) return null;
  return (
    <div role="tabpanel" className={cn('py-4', className)}>
      {children}
    </div>
  );
}

export { Tabs, TabList, Tab, TabPanel };
