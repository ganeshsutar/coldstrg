import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Bank, CreateBankInput } from "../../types";

interface BankDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bank?: Bank | null;
  nextCode: string;
  organizationId: string;
  onSave: (input: CreateBankInput & { id?: string }) => void;
  isPending: boolean;
}

export function BankDialog({
  open,
  onOpenChange,
  bank,
  nextCode,
  organizationId,
  onSave,
  isPending,
}: BankDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {open && (
          <BankForm
            bank={bank}
            nextCode={nextCode}
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

interface BankFormProps {
  bank?: Bank | null;
  nextCode: string;
  organizationId: string;
  onSave: (input: CreateBankInput & { id?: string }) => void;
  onCancel: () => void;
  isPending: boolean;
}

function BankForm({
  bank,
  nextCode,
  organizationId,
  onSave,
  onCancel,
  isPending,
}: BankFormProps) {
  const isEdit = !!bank;

  const [name, setName] = useState(bank?.name ?? "");
  const [code, setCode] = useState(bank?.code ?? nextCode);
  const [ifscPattern, setIfscPattern] = useState(bank?.ifscPattern ?? "");
  const [isActive, setIsActive] = useState(bank?.isActive !== false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: CreateBankInput & { id?: string } = {
      organizationId,
      name,
      code,
      isActive,
      ...(isEdit && { id: bank!.id }),
      ...(ifscPattern && { ifscPattern }),
    };
    onSave(input);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Bank" : "Add Bank"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the bank details below."
            : "Fill in the details to add a new bank."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="bCode">Code</Label>
            <Input
              id="bCode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={isEdit}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="bStatus">Status</Label>
            <Select
              value={isActive ? "active" : "inactive"}
              onValueChange={(v) => setIsActive(v === "active")}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="bName">Bank Name</Label>
          <Input
            id="bName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="bIfsc">IFSC Pattern</Label>
          <Input
            id="bIfsc"
            value={ifscPattern}
            onChange={(e) => setIfscPattern(e.target.value)}
            placeholder="e.g., SBIN"
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || !name || !code}>
            {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
