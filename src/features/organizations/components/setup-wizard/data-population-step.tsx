import { CheckCircle, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { SeedingProgressCard } from "./seeding-progress-card";
import type { SeedingProgress } from "./wizard-types";
import { TOTAL_SEED_RECORDS } from "./wizard-types";

interface DataPopulationStepProps {
  isSeeding: boolean;
  seedingComplete: boolean;
  seedingProgress: SeedingProgress;
  onRetry?: (tableName: keyof SeedingProgress) => void;
  isReconfigureMode?: boolean;
}

const SEEDING_TABLES: Array<{
  key: keyof SeedingProgress;
  displayName: string;
  icon: string;
}> = [
  { key: "systemConfig", displayName: "System Configuration", icon: "⚙️" },
  { key: "rolePermissions", displayName: "Role Permissions", icon: "👥" },
  { key: "gstRates", displayName: "GST Rates", icon: "📑" },
  { key: "laborRates", displayName: "Labor Rates", icon: "👷" },
  { key: "accounts", displayName: "Chart of Accounts", icon: "📊" },
  { key: "banks", displayName: "Banks", icon: "🏦" },
  { key: "commodities", displayName: "Commodities", icon: "🥔" },
];

export function DataPopulationStep({
  isSeeding,
  seedingComplete,
  seedingProgress,
  onRetry,
  isReconfigureMode = false,
}: DataPopulationStepProps) {
  const completedRecords = Object.values(seedingProgress).reduce(
    (sum, p) => sum + p.completed,
    0
  );
  const progressPercent = Math.round((completedRecords / TOTAL_SEED_RECORDS) * 100);

  const hasErrors = Object.values(seedingProgress).some(
    (p) => p.status === "error"
  );

  // Calculate total skipped records
  const totalSkipped = Object.values(seedingProgress).reduce(
    (sum, p) => sum + (p.skipped || 0),
    0
  );

  if (seedingComplete && !hasErrors) {
    return (
      <div className="space-y-6" data-testid="wizard-step-4">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-semibold">
            {isReconfigureMode ? "Reconfiguration Complete!" : "Setup Complete!"}
          </h2>
          <p className="text-muted-foreground mt-1">
            {isReconfigureMode && totalSkipped > 0
              ? `${totalSkipped} records already existed, ${TOTAL_SEED_RECORDS - totalSkipped} created.`
              : "Your organization is ready to use!"}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {SEEDING_TABLES.map((table) => {
                const progress = seedingProgress[table.key];
                const skipped = progress.skipped || 0;
                const created = progress.total - skipped;
                return (
                  <div
                    key={table.key}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{table.icon}</span>
                      <span>{table.displayName}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {skipped > 0
                        ? `${created} created, ${skipped} existed`
                        : `${progress.total} records`}
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center justify-between py-2 pt-4 border-t font-medium">
                <span>Total</span>
                <span>
                  {totalSkipped > 0
                    ? `${TOTAL_SEED_RECORDS - totalSkipped} created, ${totalSkipped} existed`
                    : `${TOTAL_SEED_RECORDS} records`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSeeding) {
    return (
      <div className="space-y-6" data-testid="wizard-step-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">Setting Up Your Organization</h2>
          <p className="text-muted-foreground mt-1">
            Please wait while we configure your system...
          </p>
        </div>

        {/* Overall Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Overall Progress</span>
                <span className="text-muted-foreground">
                  {progressPercent}% ({completedRecords} of {TOTAL_SEED_RECORDS})
                </span>
              </div>
              <Progress value={progressPercent} data-testid="seeding-overall-progress" />
            </div>
          </CardContent>
        </Card>

        {/* Individual Progress Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {SEEDING_TABLES.map((table) => (
            <SeedingProgressCard
              key={table.key}
              name={table.key}
              displayName={table.displayName}
              icon={table.icon}
              progress={seedingProgress[table.key]}
              onRetry={
                seedingProgress[table.key].status === "error"
                  ? () => onRetry?.(table.key)
                  : undefined
              }
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4" />
          <span>Please don't close this page while setup is in progress</span>
        </div>
      </div>
    );
  }

  // Initial state - before seeding starts
  return (
    <div className="space-y-6" data-testid="wizard-step-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold">
          {isReconfigureMode ? "Re-seed Master Data" : "Setup Master Data"}
        </h2>
        <p className="text-muted-foreground mt-1">
          {isReconfigureMode
            ? "Step 4 of 4 - Only missing data will be created"
            : "Step 4 of 4 - We'll create the essential data for your system"}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="mb-4 text-sm text-muted-foreground">
            {isReconfigureMode
              ? "The following master data will be checked and any missing records will be created:"
              : "The following master data will be created:"}
          </p>

          <div className="space-y-3">
            {SEEDING_TABLES.map((table) => (
              <div
                key={table.key}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span>{table.icon}</span>
                  <span>{table.displayName}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {seedingProgress[table.key].total} records
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between py-2 pt-4 border-t font-medium">
              <span>Total</span>
              <span>{TOTAL_SEED_RECORDS} records</span>
            </div>
          </div>

          {isReconfigureMode && (
            <p className="mt-4 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              Existing records will be preserved. Only missing records will be created.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
