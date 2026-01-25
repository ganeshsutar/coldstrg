import { cn } from '@/lib/utils';
import { Snowflake } from 'lucide-react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, showTagline = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: {
      container: 'gap-1.5',
      icon: 'size-5',
      text: 'text-lg',
      tagline: 'text-xs',
    },
    md: {
      container: 'gap-2',
      icon: 'size-7',
      text: 'text-2xl',
      tagline: 'text-sm',
    },
    lg: {
      container: 'gap-3',
      icon: 'size-9',
      text: 'text-3xl',
      tagline: 'text-base',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className={cn('flex items-center', sizes.container)}>
        <Snowflake className={cn('text-primary', sizes.icon)} />
        <span className={cn('font-bold tracking-tight', sizes.text)}>COLDVAULT</span>
      </div>
      {showTagline && (
        <p className={cn('text-muted-foreground', sizes.tagline)}>
          Cold Storage Management
        </p>
      )}
    </div>
  );
}
