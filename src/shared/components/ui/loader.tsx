import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

function FullPageLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex min-h-[400px] items-center justify-center', className)}>
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );
}

function InlineLoader({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
    </span>
  );
}

export { FullPageLoader, InlineLoader };
