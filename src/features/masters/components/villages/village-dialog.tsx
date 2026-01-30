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
import type { Village, CreateVillageInput } from "../../types";

interface VillageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  village?: Village | null;
  nextCode: string;
  organizationId: string;
  onSave: (input: CreateVillageInput & { id?: string }) => void;
  isPending: boolean;
}

export function VillageDialog({
  open,
  onOpenChange,
  village,
  nextCode,
  organizationId,
  onSave,
  isPending,
}: VillageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {open && (
          <VillageForm
            village={village}
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

interface VillageFormProps {
  village?: Village | null;
  nextCode: string;
  organizationId: string;
  onSave: (input: CreateVillageInput & { id?: string }) => void;
  onCancel: () => void;
  isPending: boolean;
}

function VillageForm({
  village,
  nextCode,
  organizationId,
  onSave,
  onCancel,
  isPending,
}: VillageFormProps) {
  const isEdit = !!village;

  const [name, setName] = useState(village?.name ?? "");
  const [nameHindi, setNameHindi] = useState(village?.nameHindi ?? "");
  const [code, setCode] = useState(village?.code ?? nextCode);
  const [stateName, setStateName] = useState(village?.stateName ?? "");
  const [districtName, setDistrictName] = useState(
    village?.districtName ?? ""
  );
  const [pincode, setPincode] = useState(village?.pincode ?? "");
  const [road, setRoad] = useState(village?.road ?? "");
  const [isActive, setIsActive] = useState(village?.isActive !== false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: CreateVillageInput & { id?: string } = {
      organizationId,
      name,
      code,
      stateName,
      districtName,
      isActive,
      ...(isEdit && { id: village!.id }),
      ...(nameHindi && { nameHindi }),
      ...(pincode && { pincode }),
      ...(road && { road }),
    };
    onSave(input);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Village" : "Add Village"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the village details below."
            : "Fill in the details to add a new village."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="vCode">Code</Label>
            <Input
              id="vCode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={isEdit}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="vStatus">Status</Label>
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

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="vName">Name (English)</Label>
            <Input
              id="vName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="vNameHindi">Name (Hindi)</Label>
            <Input
              id="vNameHindi"
              value={nameHindi}
              onChange={(e) => setNameHindi(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="vState">State</Label>
            <Input
              id="vState"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="vDistrict">District</Label>
            <Input
              id="vDistrict"
              value={districtName}
              onChange={(e) => setDistrictName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="vPincode">Pincode</Label>
            <Input
              id="vPincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="vRoad">Road</Label>
            <Input
              id="vRoad"
              value={road}
              onChange={(e) => setRoad(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              isPending || !name || !code || !stateName || !districtName
            }
          >
            {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
