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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MEMBERSHIP_ROLE_OPTIONS } from "@/config/constants";
import type { OrganizationMembership } from "@/features/organizations/types";
import type { UpdateMemberInput } from "../../types";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: OrganizationMembership | null;
  organizationId: string;
  onSave: (input: UpdateMemberInput) => void;
  isPending: boolean;
}

export function UserDialog({
  open,
  onOpenChange,
  member,
  organizationId,
  onSave,
  isPending,
}: UserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {open && member && (
          <UserForm
            member={member}
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

interface UserFormProps {
  member: OrganizationMembership;
  organizationId: string;
  onSave: (input: UpdateMemberInput) => void;
  onCancel: () => void;
  isPending: boolean;
}

function UserForm({ member, organizationId, onSave, onCancel, isPending }: UserFormProps) {
  const [role, setRole] = useState(member.role);
  const [status, setStatus] = useState<string>(member.status || "ACTIVE");
  const [moduleAccessAccounts, setModuleAccessAccounts] = useState(member.moduleAccessAccounts ?? false);
  const [moduleAccessColdStorageReports, setModuleAccessColdStorageReports] = useState(member.moduleAccessColdStorageReports ?? false);
  const [moduleAccessMISReports, setModuleAccessMISReports] = useState(member.moduleAccessMISReports ?? false);
  const [moduleAccessPayroll, setModuleAccessPayroll] = useState(member.moduleAccessPayroll ?? false);
  const [moduleAccessMultiRoom, setModuleAccessMultiRoom] = useState(member.moduleAccessMultiRoom ?? false);
  const [loanPerBagLimit, setLoanPerBagLimit] = useState(member.loanPerBagLimit?.toString() ?? "");
  const [backdateEntryDays, setBackdateEntryDays] = useState(member.backdateEntryDays?.toString() ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id: member.id,
      organizationId,
      role,
      status: status as "PENDING" | "ACTIVE" | "SUSPENDED",
      moduleAccessAccounts,
      moduleAccessColdStorageReports,
      moduleAccessMISReports,
      moduleAccessPayroll,
      moduleAccessMultiRoom,
      loanPerBagLimit: loanPerBagLimit ? parseFloat(loanPerBagLimit) : null,
      backdateEntryDays: backdateEntryDays ? parseInt(backdateEntryDays, 10) : null,
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Member</DialogTitle>
        <DialogDescription>
          Update role, module access, and limits for this member.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MEMBERSHIP_ROLE_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Module Access</Label>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="moduleAccounts" checked={moduleAccessAccounts} onCheckedChange={(c) => setModuleAccessAccounts(!!c)} />
              <Label htmlFor="moduleAccounts" className="font-normal">Accounts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="moduleColdStorage" checked={moduleAccessColdStorageReports} onCheckedChange={(c) => setModuleAccessColdStorageReports(!!c)} />
              <Label htmlFor="moduleColdStorage" className="font-normal">Cold Storage Reports</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="moduleMIS" checked={moduleAccessMISReports} onCheckedChange={(c) => setModuleAccessMISReports(!!c)} />
              <Label htmlFor="moduleMIS" className="font-normal">MIS Reports</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="modulePayroll" checked={moduleAccessPayroll} onCheckedChange={(c) => setModuleAccessPayroll(!!c)} />
              <Label htmlFor="modulePayroll" className="font-normal">Payroll</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="moduleMultiRoom" checked={moduleAccessMultiRoom} onCheckedChange={(c) => setModuleAccessMultiRoom(!!c)} />
              <Label htmlFor="moduleMultiRoom" className="font-normal">Multi-Room</Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="loanLimit">Loan Per Bag Limit</Label>
            <Input id="loanLimit" type="number" step="0.01" value={loanPerBagLimit} onChange={(e) => setLoanPerBagLimit(e.target.value)} placeholder="No limit" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="backdateDays">Backdate Entry Days</Label>
            <Input id="backdateDays" type="number" value={backdateEntryDays} onChange={(e) => setBackdateEntryDays(e.target.value)} placeholder="0" />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Update"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
