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

export function BardanaTypeDialog({
  open,
  onOpenChange,
  bardanaType,
  organizationId,
  onSave,
  isPending,
}: BardanaTypeDialogProps) {
  const isEditing = !!bardanaType;

  const {
    register,
    handleSubmit,
    reset,
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

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      reset();
    }
    onOpenChange(newOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Bardana Type" : "Add Bardana Type"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                placeholder="e.g., JUTE"
                {...register("code", { required: "Code is required" })}
              />
              {errors.code && (
                <p className="text-xs text-destructive">{errors.code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Jute Bags"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameHindi">Name (Hindi)</Label>
            <Input
              id="nameHindi"
              placeholder="e.g., जूट बोरी"
              {...register("nameHindi")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultRate">Default Rate (Rs)</Label>
              <Input
                id="defaultRate"
                type="number"
                step="0.01"
                {...register("defaultRate", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                placeholder="bags"
                {...register("unit")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="openingStock">Opening Stock</Label>
            <Input
              id="openingStock"
              type="number"
              {...register("openingStock", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
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
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
