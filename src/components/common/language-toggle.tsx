import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  // Placeholder - actual i18n implementation deferred
  return (
    <div className={cn('flex items-center gap-1 text-sm', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 font-medium"
        disabled
      >
        EN
      </Button>
      <span className="text-muted-foreground">|</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-muted-foreground"
        disabled
      >
        HI
      </Button>
    </div>
  );
}
