import { useMemo } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, UserCheck, IndianRupee, Landmark } from "lucide-react";
import { formatCurrency } from "../../utils";

interface PayrollKpiCardsProps {
  totalEmployees: number;
  activeEmployees: number;
  presentToday: number;
  salaryPayable: number;
  loanOutstanding: number;
}

export function PayrollKpiCards({
  totalEmployees,
  activeEmployees,
  presentToday,
  salaryPayable,
  loanOutstanding,
}: PayrollKpiCardsProps) {
  const attendancePercent = useMemo(() => {
    if (activeEmployees === 0) return 0;
    return Math.round((presentToday / activeEmployees) * 100);
  }, [presentToday, activeEmployees]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
        <CardHeader className="relative">
          <CardDescription>Total Employees</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {totalEmployees}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{activeEmployees} active</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
        <CardHeader className="relative">
          <CardDescription>Present Today</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {presentToday}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserCheck className="h-4 w-4" />
            <span>{attendancePercent}% attendance</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
        <CardHeader className="relative">
          <CardDescription>Salary Payable</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {formatCurrency(salaryPayable)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IndianRupee className="h-4 w-4" />
            <span>This month</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-gradient-to-t from-destructive/5 to-card">
        <CardHeader className="relative">
          <CardDescription>Loan Outstanding</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-destructive">
            {formatCurrency(loanOutstanding)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 text-destructive">
            <Landmark className="h-4 w-4" />
            <span>Staff loans</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
