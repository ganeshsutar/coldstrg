import { Building2, Star, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { OrganizationWithRole } from '../types';

interface OrganizationSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizations: OrganizationWithRole[];
  currentOrganization: OrganizationWithRole | null;
  onSelect: (organization: OrganizationWithRole) => void;
}

export function OrganizationSelector({
  open,
  onOpenChange,
  organizations,
  currentOrganization,
  onSelect,
}: OrganizationSelectorProps) {
  const handleSelect = (org: OrganizationWithRole) => {
    onSelect(org);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Organization</DialogTitle>
          <DialogDescription>
            Choose an organization to continue working with
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          {organizations.map((org) => {
            const isSelected = currentOrganization?.id === org.id;

            return (
              <Button
                key={org.id}
                variant="outline"
                className={cn(
                  'w-full justify-start gap-3 h-auto py-3',
                  isSelected && 'border-primary bg-primary/5'
                )}
                onClick={() => handleSelect(org)}
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Building2 className="size-5 text-muted-foreground" />
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{org.name}</span>
                    {org.isDefault && (
                      <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {org.role === 'ADMIN' ? 'Administrator' : 'Operator'}
                  </div>
                </div>

                {isSelected && (
                  <Check className="size-5 text-primary" />
                )}
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
