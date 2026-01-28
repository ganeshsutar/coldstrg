import { Search } from "lucide-react"
import { SidebarMenuButton } from "@/components/ui/sidebar"

interface SidebarSearchProps {
  onClick?: () => void
}

export function SidebarSearch({ onClick }: SidebarSearchProps) {
  return (
    <SidebarMenuButton
      onClick={onClick}
      tooltip="Search (⌘K)"
      className="justify-start"
    >
      <Search className="size-4" />
      <span className="flex-1 text-left">Search...</span>
      <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground group-data-[collapsible=icon]:hidden sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </SidebarMenuButton>
  )
}
