/* eslint-disable react-hooks/static-components */
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import type { QuickAction } from "../types";

interface QuickActionsProps {
  actions: QuickAction[];
  onAction?: (actionId: string) => void;
}

function QuickActionButton({
  action,
  onAction,
}: {
  action: QuickAction;
  onAction?: (actionId: string) => void;
}) {
  const Icon = getIcon(action.icon);

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "flex items-center gap-2",
        "hover:bg-accent hover:text-accent-foreground"
      )}
      onClick={() => onAction?.(action.id)}
    >
      <Icon className="h-4 w-4" />
      <span>{action.label}</span>
      {action.shortcut && (
        <kbd className="hidden sm:inline-flex h-5 items-center rounded border bg-muted px-1.5 text-xs font-medium text-muted-foreground ml-1">
          {action.shortcut}
        </kbd>
      )}
    </Button>
  );
}

export function QuickActions({ actions, onAction }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <QuickActionButton key={action.id} action={action} onAction={onAction} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
