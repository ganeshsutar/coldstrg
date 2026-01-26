/* eslint-disable react-hooks/static-components */
import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getIcon } from "@/lib/icons"
import type { NavItem } from "@/types"

interface SidebarNavProps {
  items: NavItem[]
  collapsed: boolean
  activeItem: string
  onItemClick: (id: string) => void
}

interface NavItemComponentProps {
  item: NavItem
  collapsed: boolean
  activeItem: string
  onItemClick: (id: string) => void
  depth?: number
}

function NavItemComponent({
  item,
  collapsed,
  activeItem,
  onItemClick,
  depth = 0,
}: NavItemComponentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const Icon = getIcon(item.icon)
  const hasChildren = item.children && item.children.length > 0
  const isActive = activeItem === item.id

  const buttonContent = (
    <>
      <Icon className={cn("h-4 w-4 shrink-0", collapsed && depth === 0 && "h-5 w-5")} />
      {!collapsed && (
        <>
          <span className="flex-1 truncate text-left">{item.label}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
              {item.badge}
            </Badge>
          )}
          {hasChildren && (
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          )}
        </>
      )}
    </>
  )

  if (collapsed && depth === 0) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            size="icon"
            className={cn(
              "h-10 w-10",
              isActive && "bg-accent text-accent-foreground"
            )}
            onClick={() => onItemClick(item.id)}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{item.label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {item.label}
          {item.badge && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {item.badge}
            </Badge>
          )}
        </TooltipContent>
      </Tooltip>
    )
  }

  if (hasChildren) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2",
              depth > 0 && "pl-8"
            )}
          >
            {buttonContent}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {item.children!.map((child) => (
            <NavItemComponent
              key={child.id}
              item={child}
              collapsed={collapsed}
              activeItem={activeItem}
              onItemClick={onItemClick}
              depth={depth + 1}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-2",
        depth > 0 && "pl-8",
        isActive && "bg-accent text-accent-foreground"
      )}
      onClick={() => onItemClick(item.id)}
    >
      {buttonContent}
    </Button>
  )
}

export function SidebarNav({ items, collapsed, activeItem, onItemClick }: SidebarNavProps) {
  return (
    <nav className={cn("space-y-1", collapsed && "flex flex-col items-center")}>
      {items.map((item) => (
        <NavItemComponent
          key={item.id}
          item={item}
          collapsed={collapsed}
          activeItem={activeItem}
          onItemClick={onItemClick}
        />
      ))}
    </nav>
  )
}
