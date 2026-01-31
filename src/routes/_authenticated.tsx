import { createFileRoute, redirect, Outlet, useNavigate, useMatchRoute, useLocation, Navigate } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/features/auth";
import {
  useOrganization,
  OrganizationSetup,
  OrganizationProvider,
} from "@/features/organizations";
import { AppShell } from "@/components/layout/app-shell";
import { BreadcrumbItemData } from "@/components/layout/header";
import { AuthLoadingSkeleton } from "@/components/loading";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context }) => {
    if (context.auth?.isAuthenticated === false) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { isAuthenticated } = useAuth();

  // Show loading while auth is being determined
  if (isAuthenticated === null) {
    return <AuthLoadingSkeleton />;
  }

  // Redirect to login if not authenticated (e.g., after logout)
  if (isAuthenticated === false) {
    return <Navigate to="/login" />;
  }

  return (
    <OrganizationProvider>
      <AuthenticatedContent />
    </OrganizationProvider>
  );
}

function AuthenticatedContent() {
  const { handleSignOut, userInfo } = useAuth();
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const location = useLocation();
  const {
    currentOrganization,
    memberships,
    isLoading,
    error,
    createDefaultOrganization,
  } = useOrganization();
  const [isAutoCreating, setIsAutoCreating] = useState(false);
  const hasTriedAutoCreate = useRef(false);

  // Check if currently on setup wizard route
  const isOnSetupWizard = location.pathname === "/setup-wizard";

  // Memoized auto-creation function to avoid lint warning
  const handleAutoCreate = useCallback(async () => {
    if (hasTriedAutoCreate.current) return;
    hasTriedAutoCreate.current = true;
    setIsAutoCreating(true);
    try {
      await createDefaultOrganization();
    } catch {
      // Error handled by context, will show OrganizationSetup as fallback
    } finally {
      setIsAutoCreating(false);
    }
  }, [createDefaultOrganization]);

  // Auto-create organization if user has no memberships
  useEffect(() => {
    if (
      !isLoading &&
      memberships.length === 0 &&
      !error &&
      !hasTriedAutoCreate.current
    ) {
      handleAutoCreate();
    }
  }, [isLoading, memberships.length, error, handleAutoCreate]);

  // Determine active nav item from current route
  function getActiveNavItem(): string {
    if (matchRoute({ to: "/settings" })) return "settings";
    if (matchRoute({ to: "/masters" })) return "masters";
    // Warehouse routes
    if (matchRoute({ to: "/warehouse/room-map" })) return "room-map";
    if (matchRoute({ to: "/warehouse/chambers" })) return "chambers";
    if (matchRoute({ to: "/warehouse/loading" })) return "loading";
    if (matchRoute({ to: "/warehouse/unloading" })) return "unloading";
    if (matchRoute({ to: "/warehouse/shifting" })) return "shifting";
    if (matchRoute({ to: "/warehouse/temperature" })) return "temperature";
    if (matchRoute({ to: "/warehouse/meter-reading" })) return "meter-reading";
    if (matchRoute({ to: "/inventory/amad", fuzzy: true })) return "amad";
    if (matchRoute({ to: "/inventory/nikasi" })) return "nikasi";
    if (matchRoute({ to: "/inventory/takpatti" })) return "takpatti";
    if (matchRoute({ to: "/inventory/stock-transfer" })) return "stock-transfer";
    if (matchRoute({ to: "/accounts/party-ledger", fuzzy: true })) return "party-ledger";
    if (matchRoute({ to: "/accounts/chart-of-accounts" })) return "chart-of-accounts";
    if (matchRoute({ to: "/accounts/vouchers" })) return "vouchers";
    if (matchRoute({ to: "/accounts/daybook" })) return "daybook";
    if (matchRoute({ to: "/accounts/interest" })) return "interest";
    // Bardana routes
    if (matchRoute({ to: "/bardana/issues" })) return "bardana-issues";
    if (matchRoute({ to: "/bardana/receipts" })) return "bardana-receipts";
    if (matchRoute({ to: "/bardana/outstanding" })) return "bardana-outstanding";
    if (matchRoute({ to: "/bardana/types" })) return "bardana-types";
    if (matchRoute({ to: "/bardana" })) return "bardana-stock";
    // Billing routes
    if (matchRoute({ to: "/billing/rent-bills" })) return "rent-bills";
    if (matchRoute({ to: "/billing/receipts" })) return "receipts";
    // Trading routes
    if (matchRoute({ to: "/trading/sauda" })) return "sauda";
    if (matchRoute({ to: "/trading/gate-pass" })) return "gate-pass";
    if (matchRoute({ to: "/trading/katai" })) return "katai";
    // Loans routes
    if (matchRoute({ to: "/loans/advances" })) return "advances";
    if (matchRoute({ to: "/loans/loans" })) return "loan-against-goods";
    if (matchRoute({ to: "/loans/interest-chart" })) return "interest-chart";
    if (matchRoute({ to: "/loans/ledger" })) return "loan-ledger";
    if (matchRoute({ to: "/loans" })) return "loan-dashboard";
    // Payroll routes
    if (matchRoute({ to: "/payroll/employees" })) return "employees";
    if (matchRoute({ to: "/payroll/attendance" })) return "attendance";
    if (matchRoute({ to: "/payroll/salary" })) return "salary";
    if (matchRoute({ to: "/payroll/payslip" })) return "payslip";
    if (matchRoute({ to: "/payroll/loans" })) return "staff-loans";
    if (matchRoute({ to: "/payroll/daily-wages" })) return "daily-wages";
    if (matchRoute({ to: "/payroll/masters" })) return "payroll-masters";
    if (matchRoute({ to: "/payroll" })) return "payroll-dashboard";
    if (matchRoute({ to: "/dashboard" })) return "dashboard";
    return "dashboard";
  }

  // Generate breadcrumbs based on current route
  function getBreadcrumbs(): BreadcrumbItemData[] {
    if (matchRoute({ to: "/settings" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Settings" },
      ];
    }
    if (matchRoute({ to: "/masters" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Masters" },
      ];
    }
    // Warehouse routes
    if (matchRoute({ to: "/warehouse/room-map" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Warehouse" },
        { label: "Room Map" },
      ];
    }
    if (matchRoute({ to: "/warehouse/chambers" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Warehouse" },
        { label: "Chambers" },
      ];
    }
    if (matchRoute({ to: "/warehouse/loading" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Warehouse" },
        { label: "Loading" },
      ];
    }
    if (matchRoute({ to: "/warehouse/unloading" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Warehouse" },
        { label: "Unloading" },
      ];
    }
    if (matchRoute({ to: "/warehouse/shifting" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Warehouse" },
        { label: "Shifting" },
      ];
    }
    if (matchRoute({ to: "/warehouse/temperature" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Warehouse" },
        { label: "Temperature" },
      ];
    }
    if (matchRoute({ to: "/warehouse/meter-reading" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Warehouse" },
        { label: "Meter Reading" },
      ];
    }
    if (matchRoute({ to: "/inventory/amad/$amadId" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Inventory" },
        { label: "Amad", href: "/inventory/amad" },
        { label: "Detail" },
      ];
    }
    if (matchRoute({ to: "/inventory/amad" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Inventory" },
        { label: "Amad" },
      ];
    }
    if (matchRoute({ to: "/inventory/nikasi" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Inventory" },
        { label: "Nikasi" },
      ];
    }
    if (matchRoute({ to: "/inventory/takpatti" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Inventory" },
        { label: "Takpatti" },
      ];
    }
    if (matchRoute({ to: "/inventory/stock-transfer" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Inventory" },
        { label: "Stock Transfer" },
      ];
    }
    if (matchRoute({ to: "/accounts/party-ledger" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Accounts" },
        { label: "Party Ledger" },
      ];
    }
    if (matchRoute({ to: "/accounts/chart-of-accounts" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Accounts" },
        { label: "Chart of Accounts" },
      ];
    }
    if (matchRoute({ to: "/accounts/vouchers" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Accounts" },
        { label: "Vouchers" },
      ];
    }
    if (matchRoute({ to: "/accounts/daybook" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Accounts" },
        { label: "Daybook" },
      ];
    }
    if (matchRoute({ to: "/accounts/interest" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Accounts" },
        { label: "Interest" },
      ];
    }
    if (matchRoute({ to: "/dashboard" })) {
      return [{ label: "Home" }];
    }
    // Bardana routes
    if (matchRoute({ to: "/bardana/issues" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Bardana", href: "/bardana" },
        { label: "Issues" },
      ];
    }
    if (matchRoute({ to: "/bardana/receipts" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Bardana", href: "/bardana" },
        { label: "Returns" },
      ];
    }
    if (matchRoute({ to: "/bardana/outstanding" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Bardana", href: "/bardana" },
        { label: "Outstanding" },
      ];
    }
    if (matchRoute({ to: "/bardana/types" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Bardana", href: "/bardana" },
        { label: "Types" },
      ];
    }
    if (matchRoute({ to: "/bardana" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Bardana" },
      ];
    }
    // Billing routes
    if (matchRoute({ to: "/billing/rent-bills" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Billing" },
        { label: "Rent Bills" },
      ];
    }
    if (matchRoute({ to: "/billing/receipts" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Billing" },
        { label: "Receipts" },
      ];
    }
    // Trading routes
    if (matchRoute({ to: "/trading/sauda" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Trading" },
        { label: "Deals (Sauda)" },
      ];
    }
    if (matchRoute({ to: "/trading/gate-pass" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Trading" },
        { label: "Gate Pass" },
      ];
    }
    if (matchRoute({ to: "/trading/katai" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Trading" },
        { label: "Grading (Katai)" },
      ];
    }
    // Loans routes
    if (matchRoute({ to: "/loans/advances" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Loans", href: "/loans" },
        { label: "Advances" },
      ];
    }
    if (matchRoute({ to: "/loans/loans" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Loans", href: "/loans" },
        { label: "Loans Against Goods" },
      ];
    }
    if (matchRoute({ to: "/loans/interest-chart" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Loans", href: "/loans" },
        { label: "Interest Chart" },
      ];
    }
    if (matchRoute({ to: "/loans/ledger" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Loans", href: "/loans" },
        { label: "Loan Ledger" },
      ];
    }
    if (matchRoute({ to: "/loans" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Loans" },
      ];
    }
    // Payroll routes
    if (matchRoute({ to: "/payroll/employees" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Payroll", href: "/payroll" },
        { label: "Employees" },
      ];
    }
    if (matchRoute({ to: "/payroll/attendance" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Payroll", href: "/payroll" },
        { label: "Attendance" },
      ];
    }
    if (matchRoute({ to: "/payroll/salary" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Payroll", href: "/payroll" },
        { label: "Salary Processing" },
      ];
    }
    if (matchRoute({ to: "/payroll/payslip" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Payroll", href: "/payroll" },
        { label: "Pay Slip" },
      ];
    }
    if (matchRoute({ to: "/payroll/loans" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Payroll", href: "/payroll" },
        { label: "Staff Loans" },
      ];
    }
    if (matchRoute({ to: "/payroll/daily-wages" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Payroll", href: "/payroll" },
        { label: "Daily Wages" },
      ];
    }
    if (matchRoute({ to: "/payroll/masters" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Payroll", href: "/payroll" },
        { label: "Masters" },
      ];
    }
    if (matchRoute({ to: "/payroll" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Payroll" },
      ];
    }
    // Default fallback
    return [{ label: "Home" }];
  }

  // Handle navigation item click
  function handleNavItemClick(id: string) {
    switch (id) {
      case "dashboard":
        navigate({ to: "/dashboard" });
        break;
      case "settings":
        navigate({ to: "/settings" });
        break;
      case "masters":
        navigate({ to: "/masters" });
        break;
      // Warehouse routes
      case "room-map":
        navigate({ to: "/warehouse/room-map" });
        break;
      case "chambers":
        navigate({ to: "/warehouse/chambers" });
        break;
      case "loading":
        navigate({ to: "/warehouse/loading" });
        break;
      case "unloading":
        navigate({ to: "/warehouse/unloading" });
        break;
      case "shifting":
        navigate({ to: "/warehouse/shifting" });
        break;
      case "temperature":
        navigate({ to: "/warehouse/temperature" });
        break;
      case "meter-reading":
        navigate({ to: "/warehouse/meter-reading" });
        break;
      case "amad":
        navigate({ to: "/inventory/amad" });
        break;
      case "nikasi":
        navigate({ to: "/inventory/nikasi" });
        break;
      case "takpatti":
        navigate({ to: "/inventory/takpatti" });
        break;
      case "stock-transfer":
        navigate({ to: "/inventory/stock-transfer" });
        break;
      case "party-ledger":
        navigate({ to: "/accounts/party-ledger" });
        break;
      case "chart-of-accounts":
        navigate({ to: "/accounts/chart-of-accounts" });
        break;
      case "vouchers":
        navigate({ to: "/accounts/vouchers" });
        break;
      case "daybook":
        navigate({ to: "/accounts/daybook" });
        break;
      case "interest":
        navigate({ to: "/accounts/interest" });
        break;
      // Bardana routes
      case "bardana-stock":
        navigate({ to: "/bardana" });
        break;
      case "bardana-issues":
        navigate({ to: "/bardana/issues" });
        break;
      case "bardana-receipts":
        navigate({ to: "/bardana/receipts" });
        break;
      case "bardana-outstanding":
        navigate({ to: "/bardana/outstanding" });
        break;
      case "bardana-types":
        navigate({ to: "/bardana/types" });
        break;
      // Billing routes
      case "rent-bills":
        navigate({ to: "/billing/rent-bills" });
        break;
      case "receipts":
        navigate({ to: "/billing/receipts" });
        break;
      // Trading routes
      case "sauda":
        navigate({ to: "/trading/sauda" });
        break;
      case "gate-pass":
        navigate({ to: "/trading/gate-pass" });
        break;
      case "katai":
        navigate({ to: "/trading/katai" });
        break;
      // Loans routes
      case "loan-dashboard":
        navigate({ to: "/loans" });
        break;
      case "advances":
        navigate({ to: "/loans/advances" });
        break;
      case "loan-against-goods":
        navigate({ to: "/loans/loans" });
        break;
      case "interest-chart":
        navigate({ to: "/loans/interest-chart" });
        break;
      case "loan-ledger":
        navigate({ to: "/loans/ledger" });
        break;
      // Payroll routes
      case "payroll-dashboard":
        navigate({ to: "/payroll" });
        break;
      case "employees":
        navigate({ to: "/payroll/employees" });
        break;
      case "attendance":
        navigate({ to: "/payroll/attendance" });
        break;
      case "salary":
        navigate({ to: "/payroll/salary" });
        break;
      case "payslip":
        navigate({ to: "/payroll/payslip" });
        break;
      case "staff-loans":
        navigate({ to: "/payroll/loans" });
        break;
      case "daily-wages":
        navigate({ to: "/payroll/daily-wages" });
        break;
      case "payroll-masters":
        navigate({ to: "/payroll/masters" });
        break;
      default:
        // Future routes will be added here
        navigate({ to: "/dashboard" });
    }
  }

  // Show loading state
  if (isLoading || isAutoCreating) {
    return <AuthLoadingSkeleton />;
  }

  // Show organization setup fallback if no org and there was an error
  if (!currentOrganization && error) {
    return <OrganizationSetup />;
  }

  // Show organization setup if no org (edge case)
  if (!currentOrganization) {
    return <OrganizationSetup />;
  }

  // Redirect to setup wizard if organization is not configured
  // (unless already on setup wizard)
  if (!currentOrganization.isConfigured && !isOnSetupWizard) {
    return <Navigate to="/setup-wizard" />;
  }

  // If organization is configured but user is on setup wizard, redirect to dashboard
  // (unless in reconfigure mode)
  const isReconfiguring = location.searchStr?.includes("mode=reconfigure") ?? false;
  if (currentOrganization.isConfigured && isOnSetupWizard && !isReconfiguring) {
    return <Navigate to="/dashboard" />;
  }

  // If on setup wizard route, render without AppShell
  if (isOnSetupWizard) {
    return <Outlet />;
  }

  return (
    <AppShell
      organizationName={currentOrganization.name}
      userEmail={userInfo.email}
      userName={userInfo.name}
      onSignOut={handleSignOut}
      breadcrumbs={getBreadcrumbs()}
      activeNavItem={getActiveNavItem()}
      onNavItemClick={handleNavItemClick}
    >
      <Outlet />
    </AppShell>
  );
}
