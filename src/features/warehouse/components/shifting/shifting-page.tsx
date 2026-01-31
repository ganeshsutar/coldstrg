import { useOrganization } from "@/features/organizations";
import { ShiftingList } from "./shifting-list";

export function ShiftingPage() {
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
    <div className="flex flex-col gap-4 md:gap-6" data-testid="shifting-page">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Shifting</h1>
        <p className="text-sm text-muted-foreground">
          Move goods between chambers and racks
        </p>
      </div>

      <ShiftingList organizationId={orgId} />
    </div>
  );
}
