import { ChevronDown, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { quickCreateItems } from "@/config"

interface QuickCreateDropdownProps {
  onItemClick?: (id: string) => void
}

export function QuickCreateDropdown({ onItemClick }: QuickCreateDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          className="bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
          tooltip="Quick Create"
        >
          <Plus className="size-4" />
          <span className="flex-1 text-left">Quick Create</span>
          <ChevronDown className="size-4 opacity-50" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        {quickCreateItems.map((item) => {
          if (item.separator) {
            return <DropdownMenuSeparator key={item.id} />
          }
          return (
            <DropdownMenuItem
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
            >
              {item.label}
              {item.shortcut && (
                <DropdownMenuShortcut>⌘{item.shortcut}</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
