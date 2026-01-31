import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { getUserColumns } from "./user-columns";
import { UserDialog } from "./user-dialog";
import { useOrgMembers, useUpdateMember } from "../../hooks/use-members";
import { SearchSkeleton, TableSkeleton } from "@/components/loading";
import type { OrganizationMembership } from "@/features/organizations/types";
import type { UpdateMemberInput } from "../../types";

interface UsersTabProps {
  organizationId: string;
}

export function UsersTab({ organizationId }: UsersTabProps) {
  const { data: members = [], isLoading } = useOrgMembers(organizationId);
  const updateMutation = useUpdateMember();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<OrganizationMembership | null>(null);

  const filtered = useMemo(() => {
    if (!search) return members;
    const lower = search.toLowerCase();
    return members.filter(
      (m) =>
        (m.email || "").toLowerCase().includes(lower) ||
        m.role.toLowerCase().includes(lower) ||
        (m.status || "").toLowerCase().includes(lower)
    );
  }, [members, search]);

  function handleEdit(member: OrganizationMembership) {
    setEditingMember(member);
    setDialogOpen(true);
  }

  function handleSave(input: UpdateMemberInput) {
    updateMutation.mutate(input, {
      onSuccess: () => {
        setDialogOpen(false);
        setEditingMember(null);
      },
    });
  }

  const columns = useMemo(
    () => getUserColumns({ onEdit: handleEdit }),
    []
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SearchSkeleton />
        <TableSkeleton columns={4} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable columns={columns} data={filtered} />

      <UserDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingMember(null);
        }}
        member={editingMember}
        organizationId={organizationId}
        onSave={handleSave}
        isPending={updateMutation.isPending}
      />
    </div>
  );
}
