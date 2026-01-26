import { type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { AuthProvider } from "@/features/auth";
import { OrganizationProvider } from "@/features/organizations";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}

interface AuthenticatedProvidersProps {
  children: ReactNode;
}

export function AuthenticatedProviders({ children }: AuthenticatedProvidersProps) {
  return <OrganizationProvider>{children}</OrganizationProvider>;
}
