import { COMPONENT_COLORS } from "@/config/constants";
import type { Account } from "../../types";

interface PartyRowExpansionProps {
  account: Account;
}

export function PartyRowExpansion({ account }: PartyRowExpansionProps) {
  const formatCurrency = (value: number | null | undefined) => {
    if (value == null || value === 0) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  const components = [
    {
      label: "Rent",
      dr: account.rentDr ?? 0,
      cr: account.rentCr ?? 0,
      color: COMPONENT_COLORS.rent,
    },
    {
      label: "Loan",
      dr: account.loanDr ?? 0,
      cr: account.loanCr ?? 0,
      color: COMPONENT_COLORS.loan,
    },
    {
      label: "Bardana",
      dr: account.barDr ?? 0,
      cr: account.barCr ?? 0,
      color: COMPONENT_COLORS.bardana,
    },
    {
      label: "Interest",
      dr: account.intrstDr ?? 0,
      cr: account.intrstCr ?? 0,
      color: COMPONENT_COLORS.interest,
    },
    {
      label: "Other",
      dr: account.othDr ?? 0,
      cr: account.othCr ?? 0,
      color: COMPONENT_COLORS.other,
    },
  ];

  const totalBalance = account.balance ?? 0;
  const maxAmount = Math.max(
    ...components.map((c) => Math.max(c.dr, c.cr)),
    1
  );

  return (
    <div className="p-4 bg-muted/30 rounded-lg space-y-4">
      {/* Address info */}
      {(account.address1 || account.city || account.phone) && (
        <div className="flex flex-wrap gap-4 text-sm">
          {account.address1 && (
            <div>
              <span className="text-muted-foreground">Address: </span>
              <span>
                {account.address1}
                {account.address2 && `, ${account.address2}`}
              </span>
            </div>
          )}
          {account.city && (
            <div>
              <span className="text-muted-foreground">City: </span>
              <span>
                {account.city}
                {account.state && `, ${account.state}`}
              </span>
            </div>
          )}
          {account.phone && (
            <div>
              <span className="text-muted-foreground">Phone: </span>
              <span>{account.phone}</span>
            </div>
          )}
        </div>
      )}

      {/* Component balance breakdown */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">
          Balance Breakdown
        </h4>
        <div className="grid gap-2">
          {components.map((comp) => {
            const balance = comp.dr - comp.cr;
            const percentage = (Math.max(comp.dr, comp.cr) / maxAmount) * 100;

            return (
              <div key={comp.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className={comp.color.text}>{comp.label}</span>
                  <div className="flex items-center gap-4 tabular-nums">
                    <span className="text-green-600 dark:text-green-400 w-24 text-right">
                      {formatCurrency(comp.dr)}
                    </span>
                    <span className="text-red-600 dark:text-red-400 w-24 text-right">
                      {formatCurrency(comp.cr)}
                    </span>
                    <span
                      className={`w-24 text-right font-medium ${
                        balance > 0
                          ? "text-green-600 dark:text-green-400"
                          : balance < 0
                            ? "text-red-600 dark:text-red-400"
                            : "text-muted-foreground"
                      }`}
                    >
                      {balance !== 0 ? formatCurrency(balance) : "-"}
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${comp.color.bar} rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Packet summary */}
      <div className="flex gap-8 text-sm">
        <div>
          <span className="text-muted-foreground">Arrived: </span>
          <span className="font-medium">
            {(account.pkt1A ?? 0) +
              (account.pkt2A ?? 0) +
              (account.pkt3A ?? 0)}{" "}
            pkts
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Dispatched: </span>
          <span className="font-medium">
            {(account.pkt1N ?? 0) +
              (account.pkt2N ?? 0) +
              (account.pkt3N ?? 0)}{" "}
            pkts
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">In Stock: </span>
          <span className="font-medium">
            {(account.pkt1A ?? 0) +
              (account.pkt2A ?? 0) +
              (account.pkt3A ?? 0) -
              ((account.pkt1N ?? 0) +
                (account.pkt2N ?? 0) +
                (account.pkt3N ?? 0))}{" "}
            pkts
          </span>
        </div>
      </div>

      {/* Total Balance */}
      <div className="pt-2 border-t flex justify-end">
        <div className="text-right">
          <span className="text-muted-foreground text-sm">Net Balance: </span>
          <span
            className={`text-lg font-semibold tabular-nums ${
              totalBalance > 0
                ? "text-green-600 dark:text-green-400"
                : totalBalance < 0
                  ? "text-red-600 dark:text-red-400"
                  : ""
            }`}
          >
            {formatCurrency(totalBalance)}
            {totalBalance !== 0 && (
              <span className="ml-1 text-sm font-normal">
                {totalBalance > 0 ? "(DR)" : "(CR)"}
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
