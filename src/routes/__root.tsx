import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import type { AuthContextValue } from "@/features/auth";

export interface RouterContext {
  queryClient: QueryClient;
  auth: AuthContextValue | undefined;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return <Outlet />;
}
