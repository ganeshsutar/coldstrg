import { useMemo } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Truck, Warehouse, PackageOpen, Clock } from "lucide-react";
import type { Amad } from "../../types";

interface AmadKpiCardsProps {
  amadList: Amad[];
}

export function AmadKpiCards({ amadList }: AmadKpiCardsProps) {
  const metrics = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayInward = amadList.filter((a) => a.date === today).length;
    const inStock = amadList.filter((a) => a.status === "IN_STOCK").length;
    const pending = amadList.filter((a) => a.status === "PENDING").length;
    const partialDispatch = amadList.filter(
      (a) => a.status === "PARTIAL_DISPATCH"
    ).length;

    const totalStockPackets = amadList
      .filter((a) => a.status === "IN_STOCK" || a.status === "PARTIAL_DISPATCH")
      .reduce((sum, a) => sum + (a.totalPackets ?? 0) - (a.dispatchedPackets ?? 0), 0);

    return { todayInward, inStock, pending, partialDispatch, totalStockPackets };
  }, [amadList]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
        <CardHeader className="relative">
          <CardDescription>Today's Inward</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {metrics.todayInward}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Truck className="h-4 w-4" />
            <span>Amad records today</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
        <CardHeader className="relative">
          <CardDescription>Total Stock</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {metrics.totalStockPackets.toLocaleString("en-IN")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Warehouse className="h-4 w-4" />
            <span>Packets in storage</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
        <CardHeader className="relative">
          <CardDescription>Partial Dispatch</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {metrics.partialDispatch}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <PackageOpen className="h-4 w-4" />
            <span>Pending full dispatch</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
        <CardHeader className="relative">
          <CardDescription>Pending</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {metrics.pending}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Due for Nikasi</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
