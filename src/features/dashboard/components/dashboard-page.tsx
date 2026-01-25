import { Building2, Users, Package, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function DashboardPage() {
  const { user, currentOrganization } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {user?.fullName?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your cold storage operations
        </p>
      </div>

      {/* Current Organization Card */}
      {currentOrganization && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="size-6 text-primary" />
            </div>
            <div>
              <CardTitle>{currentOrganization.name}</CardTitle>
              <CardDescription>
                {currentOrganization.role === 'ADMIN'
                  ? 'Administrator'
                  : 'Operator'}{' '}
                &bull; {currentOrganization.city || 'Location not set'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">GSTIN:</span>
                {currentOrganization.gstin || 'Not set'}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Phone:</span>
                {currentOrganization.phone || 'Not set'}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Email:</span>
                {currentOrganization.email || 'Not set'}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Status:</span>
                <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                  {currentOrganization.billingStatus || 'TRIAL'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Placeholder Feature Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parties</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Kissan, Vyapari, Aarti
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Lots</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Across all rooms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Building2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Amad & Nikasi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Notice */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <h3 className="text-lg font-semibold">More Features Coming Soon</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Party management, stock tracking, billing, and more features are being
            developed. Stay tuned for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
