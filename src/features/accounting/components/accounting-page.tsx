import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartyListTab } from "./parties/party-list-tab";
import { ChartTab } from "./chart-of-accounts/chart-tab";
import { VoucherListTab } from "./vouchers/voucher-list-tab";
import { DaybookTab } from "./daybook/daybook-tab";

type AccountingTab = "parties" | "chart" | "vouchers" | "daybook" | "interest";

export function AccountingPage() {
  const [activeTab, setActiveTab] = useState<AccountingTab>("parties");

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>
        <p className="text-sm text-muted-foreground">
          Manage party ledgers, vouchers, and financial records
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AccountingTab)}>
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
          <TabsTrigger value="parties">Party Ledger</TabsTrigger>
          <TabsTrigger value="chart">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
          <TabsTrigger value="daybook">Daybook</TabsTrigger>
          <TabsTrigger value="interest">Interest</TabsTrigger>
        </TabsList>

        <TabsContent value="parties" className="mt-4">
          <PartyListTab />
        </TabsContent>

        <TabsContent value="chart" className="mt-4">
          <ChartTab />
        </TabsContent>

        <TabsContent value="vouchers" className="mt-4">
          <VoucherListTab />
        </TabsContent>

        <TabsContent value="daybook" className="mt-4">
          <DaybookTab />
        </TabsContent>

        <TabsContent value="interest" className="mt-4">
          <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">
              Interest calculation coming soon...
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
