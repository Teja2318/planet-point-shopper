import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DangerWarningProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function DangerWarning({ className, size = 'md' }: DangerWarningProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn(
      "flex items-center justify-center rounded-full bg-danger text-white animate-pulse-glow",
      size === 'sm' && 'p-1.5',
      size === 'md' && 'p-2',
      size === 'lg' && 'p-3',
      className
    )}>
      <AlertTriangle className={sizeClasses[size]} />
    </div>
  );
}
