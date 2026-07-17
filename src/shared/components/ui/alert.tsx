import { type ReactNode } from 'react';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

const variants = {
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: Info,
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: CheckCircle,
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: AlertTriangle,
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: XCircle,
  },
};

export interface AlertProps {
  variant?: keyof typeof variants;
  children: ReactNode;
  className?: string;
}

function Alert({ variant = 'info', children, className }: AlertProps) {
  const { container, icon: Icon } = variants[variant];
  return (
    <div
      role="alert"
      className={cn('flex items-start gap-3 rounded-lg border p-4 text-sm', container, className)}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export { Alert };
