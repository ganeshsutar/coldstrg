import { useOrganization } from "@/features/organizations";
import { LoadingList } from "./loading-list";

export function LoadingPage() {
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
    <div className="flex flex-col gap-4 md:gap-6" data-testid="loading-page">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Loading</h1>
        <p className="text-sm text-muted-foreground">
          Track goods loaded into chamber racks
        </p>
      </div>

      <LoadingList organizationId={orgId} />
    </div>
  );
}
