import { PanelLeftClose, PanelLeft, Snowflake } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "./sidebar-nav"
import { navigationItems } from "@/config"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  activeItem: string
  onItemClick: (id: string) => void
  organizationName?: string
}

export function Sidebar({
  collapsed,
  onToggle,
  activeItem,
  onItemClick,
  organizationName = "Cold Storage",
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-14 z-30 hidden h-[calc(100vh-3.5rem)] flex-col border-r bg-sidebar-background transition-all duration-300 md:flex",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Branding Section */}
      <div className={cn("flex items-center gap-2 px-4 py-4", collapsed && "justify-center px-2")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Snowflake className="h-4 w-4" />
        </div>
        {!collapsed && (
          <span className="truncate font-semibold">{organizationName}</span>
        )}
      </div>
      <Separator />

      <ScrollArea className="flex-1 py-4">
        <div className={cn("px-3", collapsed && "px-2")}>
          <SidebarNav
            items={navigationItems}
            collapsed={collapsed}
            activeItem={activeItem}
            onItemClick={onItemClick}
          />
        </div>
      </ScrollArea>
      <Separator />
      <div className={cn("p-3", collapsed && "p-2")}>
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          className={cn("w-full", !collapsed && "justify-start gap-2")}
          onClick={onToggle}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
