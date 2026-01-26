/* eslint-disable react-hooks/static-components */
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarNav } from "./sidebar-nav"
import { mobileNavItems, navigationItems } from "@/config"
import type { NavItem } from "@/types"
import { getIcon } from "@/lib/icons"

interface MobileNavProps {
  activeItem: string
  onItemClick: (id: string) => void
}

function MobileNavButton({ item, isActive, onClick }: { item: NavItem; isActive: boolean; onClick: () => void }) {
  const Icon = getIcon(item.icon)
  const isMore = item.id === "more"

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "flex h-14 flex-1 flex-col items-center justify-center gap-1 rounded-lg",
        isActive && !isMore && "bg-accent text-accent-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs">{item.label}</span>
    </Button>
  )
}

export function MobileNav({ activeItem, onItemClick }: MobileNavProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  function handleItemClick(id: string) {
    if (id === "more") {
      setSheetOpen(true)
    } else {
      onItemClick(id)
    }
  }

  function handleSheetItemClick(id: string) {
    setSheetOpen(false)
    onItemClick(id)
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-2 md:hidden">
        {mobileNavItems.map((item) => (
          <MobileNavButton
            key={item.id}
            item={item}
            isActive={activeItem === item.id}
            onClick={() => handleItemClick(item.id)}
          />
        ))}
      </nav>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <ScrollArea className="mt-4 h-[calc(80vh-6rem)]">
            <SidebarNav
              items={navigationItems}
              collapsed={false}
              activeItem={activeItem}
              onItemClick={handleSheetItemClick}
            />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}
