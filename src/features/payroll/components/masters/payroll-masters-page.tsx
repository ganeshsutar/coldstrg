import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PositionsTab } from "./positions-tab";
import { AllowancesTab } from "./allowances-tab";
import { DeductionsTab } from "./deductions-tab";

export function PayrollMastersPage() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payroll Masters</h1>
        <p className="text-sm text-muted-foreground">
          Manage positions, allowances, and deductions
        </p>
      </div>

      <Tabs defaultValue="positions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="allowances">Allowances</TabsTrigger>
          <TabsTrigger value="deductions">Deductions</TabsTrigger>
        </TabsList>

        <TabsContent value="positions">
          <PositionsTab />
        </TabsContent>

        <TabsContent value="allowances">
          <AllowancesTab />
        </TabsContent>

        <TabsContent value="deductions">
          <DeductionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
