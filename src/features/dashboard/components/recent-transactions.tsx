import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AmadTransaction, NikasiTransaction, VoucherTransaction } from "../types";

interface RecentTransactionsProps {
  amad: AmadTransaction[];
  nikasi: NikasiTransaction[];
  vouchers: VoucherTransaction[];
}

const partyTypeColors = {
  kissan: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  vyapari: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  aarti: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

export function RecentTransactions({
  amad,
  nikasi,
  vouchers,
}: RecentTransactionsProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="amad" className="w-full">
          <div className="px-6">
            <TabsList className="w-full">
              <TabsTrigger value="amad" className="flex-1">
                Amad
              </TabsTrigger>
              <TabsTrigger value="nikasi" className="flex-1">
                Nikasi
              </TabsTrigger>
              <TabsTrigger value="vouchers" className="flex-1">
                Vouchers
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[260px]">
            <TabsContent value="amad" className="mt-0 px-6 pb-4">
              <div className="space-y-3 pt-3">
                {amad.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {item.partyName}
                        </p>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs capitalize",
                            partyTypeColors[item.partyType]
                          )}
                        >
                          {item.partyType}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.lots} lots • {item.quantity} • {item.room}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      {item.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="nikasi" className="mt-0 px-6 pb-4">
              <div className="space-y-3 pt-3">
                {nikasi.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {item.partyName}
                        </p>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs capitalize",
                            partyTypeColors[item.partyType]
                          )}
                        >
                          {item.partyType}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.lots} lots • {item.quantity} • {item.room}
                        {item.billNumber && ` • ${item.billNumber}`}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      {item.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="vouchers" className="mt-0 px-6 pb-4">
              <div className="space-y-3 pt-3">
                {vouchers.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-1.5 rounded-full",
                          item.type === "receipt"
                            ? "bg-green-100 dark:bg-green-900"
                            : "bg-red-100 dark:bg-red-900"
                        )}
                      >
                        {item.type === "receipt" ? (
                          <ArrowDownLeft
                            className={cn(
                              "h-4 w-4",
                              "text-green-600 dark:text-green-400"
                            )}
                          />
                        ) : (
                          <ArrowUpRight
                            className={cn(
                              "h-4 w-4",
                              "text-red-600 dark:text-red-400"
                            )}
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.partyName}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {item.mode}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          item.type === "receipt"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        )}
                      >
                        {item.type === "receipt" ? "+" : "-"}{"\u20B9"}{item.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
