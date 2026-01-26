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
    if (matchRoute({ to: "/dashboard" })) {
      return [{ label: "Home" }];
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
