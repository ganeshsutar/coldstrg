/* eslint-disable react-hooks/static-components */
import * as React from "react"
import { ChevronRight, Snowflake } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SidebarUser } from "./sidebar-user"
import { Badge } from "@/components/ui/badge"
import { navigationItems, settingsNavItem } from "@/config"
import { getIcon } from "@/lib/icons"
import type { NavItem } from "@/types"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  organizationName: string
  userEmail: string
  userName?: string
  onSignOut: () => void
  activeItem: string
  onItemClick: (id: string) => void
}

export function AppSidebar({
  organizationName,
  userEmail,
  userName,
  onSignOut,
  activeItem,
  onItemClick,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              tooltip={organizationName}
            >
              <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Snowflake className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{organizationName}</span>
                <span className="truncate text-xs text-muted-foreground">Cold Storage</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <NavItemComponent
                key={item.id}
                item={item}
                activeItem={activeItem}
                onItemClick={onItemClick}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <NavItemComponent
            item={settingsNavItem}
            activeItem={activeItem}
            onItemClick={onItemClick}
          />
        </SidebarMenu>
        <SidebarUser
          email={userEmail}
          name={userName}
          onSignOut={onSignOut}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

interface NavItemComponentProps {
  item: NavItem
  activeItem: string
  onItemClick: (id: string) => void
}

function NavItemComponent({ item, activeItem, onItemClick }: NavItemComponentProps) {
  const Icon = getIcon(item.icon)
  const hasChildren = item.children && item.children.length > 0
  const isActive = activeItem === item.id

  if (hasChildren) {
    return (
      <Collapsible
        asChild
        defaultOpen={item.children?.some(child => child.id === activeItem)}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.label}>
              {Icon && <Icon />}
              <span>{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto h-5 min-w-5 px-1 text-xs">
                  {item.badge}
                </Badge>
              )}
              <ChevronRight className={cn(
                "ml-auto transition-transform duration-200",
                "group-data-[state=open]/collapsible:rotate-90",
                item.badge && "ml-1"
              )} />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children?.map((subItem) => {
                const SubIcon = getIcon(subItem.icon)
                const isSubActive = activeItem === subItem.id
                return (
                  <SidebarMenuSubItem key={subItem.id}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={isSubActive}
                    >
                      <button onClick={() => onItemClick(subItem.id)}>
                        {SubIcon && <SubIcon />}
                        <span>{subItem.label}</span>
                      </button>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                )
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.label}
        isActive={isActive}
        onClick={() => onItemClick(item.id)}
      >
        {Icon && <Icon />}
        <span>{item.label}</span>
        {item.badge && (
          <Badge variant="secondary" className="ml-auto h-5 min-w-5 px-1 text-xs">
            {item.badge}
          </Badge>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
