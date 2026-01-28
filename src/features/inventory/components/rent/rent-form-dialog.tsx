import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { RentForm } from "./rent-form";
import type { Rent, CreateRentInput } from "../../types";

interface RentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rent?: Rent | null;
  nextSerialNo: number;
  organizationId: string;
  onSave: (input: CreateRentInput & { id?: string }) => void;
  isPending: boolean;
}

export function RentFormDialog({
  open,
  onOpenChange,
  rent,
  nextSerialNo,
  organizationId,
  onSave,
  isPending,
}: RentFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {open && (
          <RentForm
            rent={rent}
            nextSerialNo={nextSerialNo}
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
