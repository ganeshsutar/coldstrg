import { useOrganization } from "@/features/organizations";
import { MeterReadingTab } from "./meter-reading-tab";

export function MeterReadingPage() {
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
        <h1 className="text-2xl font-semibold tracking-tight">Meter Reading</h1>
        <p className="text-sm text-muted-foreground">
          Record and track electricity consumption by chamber
        </p>
      </div>

      <MeterReadingTab organizationId={orgId} />
    </div>
  );
}
