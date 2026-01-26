import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Header, BreadcrumbItemData } from "./header"
import { AppSidebar } from "./app-sidebar"

interface AppShellProps {
  children: React.ReactNode
  organizationName: string
  userEmail: string
  userName?: string
  onSignOut: () => void
  breadcrumbs: BreadcrumbItemData[]
  activeNavItem: string
  onNavItemClick: (id: string) => void
}

export function AppShell({
  children,
  organizationName,
  userEmail,
  userName,
  onSignOut,
  breadcrumbs,
  activeNavItem,
  onNavItemClick,
}: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar
        organizationName={organizationName}
        userEmail={userEmail}
        userName={userName}
        onSignOut={onSignOut}
        activeItem={activeNavItem}
        onItemClick={onNavItemClick}
      />
      <SidebarInset>
        <Header breadcrumbs={breadcrumbs} />
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
