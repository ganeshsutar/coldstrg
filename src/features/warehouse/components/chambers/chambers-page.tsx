import { useOrganization } from "@/features/organizations";
import { ChambersTab } from "./chambers-tab";

export function ChambersPage() {
  const { currentOrganization } = useOrganization();
  const orgId = currentOrganization?.id;

  if (!orgId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No organization selected</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Chambers</h1>
        <p className="text-sm text-muted-foreground">
          Configure and manage cold storage chambers and floors
        </p>
      </div>

      <ChambersTab organizationId={orgId} />
    </div>
  );
}
