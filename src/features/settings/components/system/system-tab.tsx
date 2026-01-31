import { useNavigate } from "@tanstack/react-router";
import { RefreshCw, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useOrganization } from "@/features/organizations";

export function SystemTab() {
  const navigate = useNavigate();
  const { currentOrganization } = useOrganization();

  const handleReconfigure = () => {
    navigate({ to: "/setup-wizard", search: { mode: "reconfigure" } });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            System Setup
          </CardTitle>
          <CardDescription>
            Re-run the setup wizard to update organization settings or reseed master data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-medium">Re-run Setup Wizard</h4>
                <p className="text-sm text-muted-foreground">
                  Update organization details, business registration, system configuration,
                  and re-seed any missing master data. Existing data will be preserved.
                </p>
                {currentOrganization?.configuredAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Last configured: {new Date(currentOrganization.configuredAt).toLocaleString()}
                  </p>
                )}
              </div>
              <Button
                onClick={handleReconfigure}
                variant="outline"
                className="shrink-0"
                data-testid="reconfigure-wizard-button"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reconfigure
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            <strong>What happens when you reconfigure:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Organization details can be updated</li>
              <li>Business registration info can be modified</li>
              <li>System configuration settings can be changed</li>
              <li>Missing master data records will be created</li>
              <li>Existing records will not be duplicated or overwritten</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
