import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { AmadForm } from "./amad-form";
import type { Amad, CreateAmadInput } from "../../types";

interface AmadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amad?: Amad | null;
  nextAmadNo: number;
  organizationId: string;
  onSave: (input: CreateAmadInput & { id?: string }) => void;
  isPending: boolean;
}

export function AmadFormDialog({
  open,
  onOpenChange,
  amad,
  nextAmadNo,
  organizationId,
  onSave,
  isPending,
}: AmadFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="amad-form-dialog">
        {open && (
          <AmadForm
            amad={amad}
            nextAmadNo={nextAmadNo}
            organizationId={organizationId}
            onSave={onSave}
            onCancel={() => onOpenChange(false)}
            isPending={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
