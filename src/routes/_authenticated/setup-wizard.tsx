import { createFileRoute } from "@tanstack/react-router";
import { SetupWizard } from "@/features/organizations/components/setup-wizard";

export const Route = createFileRoute("/_authenticated/setup-wizard")({
  component: SetupWizardPage,
});

function SetupWizardPage() {
  return <SetupWizard />;
}
