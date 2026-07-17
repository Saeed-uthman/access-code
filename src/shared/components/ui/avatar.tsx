import { cn } from '@/utils/cn';

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export interface AvatarProps {
  name?: string;
  src?: string;
  alt?: string;
  size?: keyof typeof sizes;
  className?: string;
}

function Avatar({ name = '', src, alt, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200',
        sizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt || name} className="h-full w-full object-cover" />
      ) : (
        <span className="font-medium text-gray-600">{getInitials(name)}</span>
      )}
    </div>
  );
}

export { Avatar };
