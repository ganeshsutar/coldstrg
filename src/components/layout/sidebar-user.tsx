import { signOut } from "aws-amplify/auth"
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Palette,
  Circle,
  Layers,
} from "lucide-react"
import { useMemo } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { useTheme, type NeutralColor, type RadiusSize, type ThemeMode, type StylePreset } from "@/hooks/use-theme"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { generateAvatarFromEmail, getInitials } from "@/lib/avatar"

interface SidebarUserProps {
  email: string
  name?: string
  onSignOut: () => void
}

const NEUTRAL_OPTIONS: { value: NeutralColor; label: string }[] = [
  { value: "gray", label: "Gray" },
  { value: "zinc", label: "Zinc" },
  { value: "neutral", label: "Neutral" },
  { value: "stone", label: "Stone" },
  { value: "slate", label: "Slate" },
]

const RADIUS_OPTIONS: { value: RadiusSize; label: string }[] = [
  { value: "none", label: "None" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "full", label: "Full" },
]

const STYLE_OPTIONS: { value: StylePreset; label: string; description: string }[] = [
  { value: "vega", label: "Vega", description: "Classic" },
  { value: "nova", label: "Nova", description: "Compact" },
  { value: "maia", label: "Maia", description: "Rounded" },
  { value: "lyra", label: "Lyra", description: "Sharp" },
  { value: "mira", label: "Mira", description: "Dense" },
]

export function SidebarUser({ email, name, onSignOut }: SidebarUserProps) {
  const { isMobile } = useSidebar()
  const { mode, neutral, radius, style, setMode, setNeutral, setRadius, setStyle } = useTheme()

  const avatarUrl = useMemo(() => generateAvatarFromEmail(email), [email])
  const displayName = name || email.split("@")[0]
  const initials = getInitials(displayName)

  const isDark = mode === "dark" || (mode === "system" && document.documentElement.classList.contains("dark"))

  async function handleSignOut() {
    await signOut()
    onSignOut()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              data-testid="user-menu-button"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* Style Preset */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Layers />
                  Style
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={style} onValueChange={(v) => setStyle(v as StylePreset)}>
                    {STYLE_OPTIONS.map((option) => (
                      <DropdownMenuRadioItem key={option.value} value={option.value}>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Theme Mode */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {isDark ? <Moon /> : <Sun />}
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={mode} onValueChange={(v) => setMode(v as ThemeMode)}>
                    <DropdownMenuRadioItem value="light">
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <Monitor className="mr-2 h-4 w-4" />
                      System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Neutral Color */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette />
                  Neutral
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={neutral} onValueChange={(v) => setNeutral(v as NeutralColor)}>
                    {NEUTRAL_OPTIONS.map((option) => (
                      <DropdownMenuRadioItem key={option.value} value={option.value}>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Border Radius */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Circle />
                  Radius
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={radius} onValueChange={(v) => setRadius(v as RadiusSize)}>
                    {RADIUS_OPTIONS.map((option) => (
                      <DropdownMenuRadioItem key={option.value} value={option.value}>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} data-testid="logout-button">
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
