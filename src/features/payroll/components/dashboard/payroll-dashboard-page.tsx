import { useOrganization } from "@/features/organizations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PayrollKpiCards } from "./payroll-kpi-cards";
import { SalaryTrendChart } from "./salary-trend-chart";
import { usePayrollStats, useSalaryTrend } from "../../hooks";

export function PayrollDashboardPage() {
  const { currentOrganization } = useOrganization();
  const organizationId = currentOrganization?.id;

  const { data: stats, isLoading: statsLoading } = usePayrollStats(organizationId);
  const { data: trendData, isLoading: trendLoading } = useSalaryTrend(organizationId, 6);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payroll</h1>
        <p className="text-sm text-muted-foreground">
          Manage employee salaries, attendance, and loans
        </p>
      </div>

      {/* KPI Cards */}
      {statsLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : stats ? (
        <PayrollKpiCards
          totalEmployees={stats.totalEmployees}
          activeEmployees={stats.activeEmployees}
          presentToday={stats.presentToday}
          salaryPayable={stats.salaryPayable}
          loanOutstanding={stats.loanOutstanding}
        />
      ) : null}

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Salary Trend Chart */}
            {trendLoading ? (
              <Skeleton className="h-[400px]" />
            ) : trendData ? (
              <SalaryTrendChart data={trendData} />
            ) : null}

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a
                    href="/payroll/employees"
                    className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors"
                  >
                    <span>Manage Employees</span>
                    <span className="text-muted-foreground">&rarr;</span>
                  </a>
                  <a
                    href="/payroll/attendance"
                    className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors"
                  >
                    <span>Mark Attendance</span>
                    <span className="text-muted-foreground">&rarr;</span>
                  </a>
                  <a
                    href="/payroll/salary"
                    className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors"
                  >
                    <span>Process Salary</span>
                    <span className="text-muted-foreground">&rarr;</span>
                  </a>
                  <a
                    href="/payroll/loans"
                    className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors"
                  >
                    <span>Staff Loans</span>
                    <span className="text-muted-foreground">&rarr;</span>
                  </a>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold mb-4">This Month</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Working Days</span>
                    <span className="font-medium">
                      {new Date().getDate()} / {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Salaries Processed</span>
                    <span className="font-medium">
                      {stats?.activeEmployees ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending Payments</span>
                    <span className="font-medium text-destructive">
                      {stats?.activeEmployees ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="rounded-lg border bg-card p-6">
            <p className="text-muted-foreground text-center py-8">
              Recent payroll activity will appear here
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
