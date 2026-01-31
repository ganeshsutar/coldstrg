import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BardanaType, CreateBardanaTypeInput } from "../../types";

interface BardanaTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bardanaType?: BardanaType | null;
  organizationId: string;
  onSave: (input: CreateBardanaTypeInput & { id?: string }) => void;
  isPending: boolean;
}

interface FormData {
  code: string;
  name: string;
  nameHindi: string;
  defaultRate: number;
  unit: string;
  openingStock: number;
  description: string;
}

interface BardanaTypeFormInnerProps {
  bardanaType?: BardanaType | null;
  organizationId: string;
  onSave: (input: CreateBardanaTypeInput & { id?: string }) => void;
  onCancel: () => void;
  isPending: boolean;
}

function BardanaTypeFormInner({
  bardanaType,
  organizationId,
  onSave,
  onCancel,
  isPending,
}: BardanaTypeFormInnerProps) {
  const isEditing = !!bardanaType;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      code: bardanaType?.code ?? "",
      name: bardanaType?.name ?? "",
      nameHindi: bardanaType?.nameHindi ?? "",
      defaultRate: bardanaType?.defaultRate ?? 0,
      unit: bardanaType?.unit ?? "bags",
      openingStock: bardanaType?.openingStock ?? 0,
      description: bardanaType?.description ?? "",
    },
  });

  function onSubmit(data: FormData) {
    onSave({
      ...(isEditing && { id: bardanaType.id }),
      organizationId,
      code: data.code,
      name: data.name,
      nameHindi: data.nameHindi || undefined,
      defaultRate: data.defaultRate,
      unit: data.unit,
      openingStock: data.openingStock,
      currentStock: isEditing ? undefined : data.openingStock,
      description: data.description || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="code">Code *</Label>
          <Input
            id="code"
            data-testid="bardana-types-form-code-input"
            placeholder="e.g., JUTE"
            {...register("code", { required: "Code is required" })}
          />
          {errors.code && (
            <p className="text-xs text-destructive">{errors.code.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            data-testid="bardana-types-form-name-input"
            placeholder="e.g., Jute Bags"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="nameHindi">Name (Hindi)</Label>
        <Input
          id="nameHindi"
          data-testid="bardana-types-form-name-hindi-input"
          placeholder="e.g., जूट बोरी"
          {...register("nameHindi")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="defaultRate">Default Rate (Rs)</Label>
          <Input
            id="defaultRate"
            data-testid="bardana-types-form-rate-input"
            type="number"
            step="0.01"
            {...register("defaultRate", { valueAsNumber: true })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            data-testid="bardana-types-form-unit-input"
            placeholder="bags"
            {...register("unit")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="openingStock">Opening Stock</Label>
        <Input
          id="openingStock"
          data-testid="bardana-types-form-opening-stock-input"
          type="number"
          {...register("openingStock", { valueAsNumber: true })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Additional details..."
          rows={2}
          {...register("description")}
        />
      </div>

      <DialogFooter>
        <Button
          type="button"
          data-testid="bardana-types-form-cancel-button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button data-testid="bardana-types-form-submit-button" type="submit" disabled={isPending}>
          {isPending ? "Saving..." : isEditing ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function BardanaTypeDialog({
  open,
  onOpenChange,
  bardanaType,
  organizationId,
  onSave,
  isPending,
}: BardanaTypeDialogProps) {
  const isEditing = !!bardanaType;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="bardana-types-form-dialog" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Bardana Type" : "Add Bardana Type"}
          </DialogTitle>
        </DialogHeader>

        {open && (
          <BardanaTypeFormInner
            bardanaType={bardanaType}
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
