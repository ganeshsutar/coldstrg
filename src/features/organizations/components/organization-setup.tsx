import { useState } from "react";
import { useOrganization } from "../hooks/use-organization";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function OrganizationSetup() {
  const { createDefaultOrganization, error } = useOrganization();
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreateOrganization() {
    setIsCreating(true);
    try {
      await createDefaultOrganization();
    } catch {
      // Error is handled by context
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome!</CardTitle>
          <CardDescription>
            Let's set up your organization to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click below to create your default organization. You can customize
            the details later.
          </p>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            onClick={handleCreateOrganization}
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? "Creating..." : "Create Organization"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
