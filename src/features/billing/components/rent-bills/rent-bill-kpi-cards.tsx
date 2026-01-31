import {
  FileText,
  Clock,
  IndianRupee,
  Receipt,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BillingStats } from "../../types";
import { formatIndianRupees } from "../../utils";

interface RentBillKpiCardsProps {
  stats: BillingStats | undefined;
  isLoading?: boolean;
}

export function RentBillKpiCards({ stats, isLoading }: RentBillKpiCardsProps) {
  const kpiData = [
    {
      title: "Bills This Month",
      value: stats?.billsThisMonth ?? 0,
      subValue: stats ? formatIndianRupees(stats.billsThisMonthAmount) : "₹0",
      icon: FileText,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      testId: "rent-bill-kpi-bills-this-month",
    },
    {
      title: "Pending Bills",
      value: stats?.pendingBills ?? 0,
      subValue: stats ? formatIndianRupees(stats.pendingAmount) : "₹0",
      icon: Clock,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
      testId: "rent-bill-kpi-pending",
    },
    {
      title: "Collections This Month",
      value: null,
      subValue: stats ? formatIndianRupees(stats.collectionsThisMonth) : "₹0",
      icon: IndianRupee,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
      testId: "rent-bill-kpi-collections",
    },
    {
      title: "GST Payable",
      value: null,
      subValue: stats ? formatIndianRupees(stats.gstPayable) : "₹0",
      icon: Receipt,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
      testId: "rent-bill-kpi-gst",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              <div className="h-4 w-20 bg-muted animate-pulse rounded mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4" data-testid="rent-bill-kpi-cards">
      {kpiData.map((kpi) => (
        <Card key={kpi.title} data-testid={kpi.testId}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${kpi.bgColor}`}>
              <kpi.icon className={`h-4 w-4 ${kpi.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            {kpi.value !== null && (
              <div className="text-2xl font-bold">{kpi.value}</div>
            )}
            <p
              className={`text-sm ${kpi.value !== null ? "text-muted-foreground" : "text-2xl font-bold"}`}
            >
              {kpi.subValue}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
