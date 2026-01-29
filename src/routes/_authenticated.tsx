import { createFileRoute, redirect, Outlet, useNavigate, useMatchRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/features/auth";
import {
  useOrganization,
  OrganizationSetup,
  OrganizationProvider,
} from "@/features/organizations";
import { AppShell } from "@/components/layout/app-shell";
import { BreadcrumbItemData } from "@/components/layout/header";

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
    return (
      <div className="flex min-h-svh w-full items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
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
  const {
    currentOrganization,
    memberships,
    isLoading,
    error,
    createDefaultOrganization,
  } = useOrganization();
  const [isAutoCreating, setIsAutoCreating] = useState(false);
  const hasTriedAutoCreate = useRef(false);

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
    if (matchRoute({ to: "/chambers" })) return "chambers";
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
    if (matchRoute({ to: "/chambers" })) {
      return [
        { label: "Home", href: "/dashboard" },
        { label: "Chambers" },
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
      case "chambers":
        navigate({ to: "/chambers" });
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
      default:
        // Future routes will be added here
        navigate({ to: "/dashboard" });
    }
  }

  // Show loading state
  if (isLoading || isAutoCreating) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground">
            {isAutoCreating
              ? "Setting up your organization..."
              : "Loading..."}
          </div>
        </div>
      </div>
    );
  }

  // Show organization setup fallback if no org and there was an error
  if (!currentOrganization && error) {
    return <OrganizationSetup />;
  }

  // Show organization setup if no org (edge case)
  if (!currentOrganization) {
    return <OrganizationSetup />;
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
