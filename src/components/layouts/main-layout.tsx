import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Building2,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { Logo } from '@/components/common/logo';
import { LanguageToggle } from '@/components/common/language-toggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OrganizationSelector } from '@/features/auth/components/organization-selector';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function MainLayout() {
  const navigate = useNavigate();
  const {
    user,
    organizations,
    currentOrganization,
    switchOrganization,
    logout,
  } = useAuth();
  const [orgSelectorOpen, setOrgSelectorOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Logo */}
          <Logo size="sm" showTagline={false} />

          {/* Organization Switcher */}
          {currentOrganization && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setOrgSelectorOpen(true)}
            >
              <Building2 className="size-4" />
              <span className="max-w-[200px] truncate">
                {currentOrganization.name}
              </span>
              {organizations.length > 1 && (
                <ChevronDown className="size-4 opacity-50" />
              )}
            </Button>
          )}

          {/* Right section */}
          <div className="flex items-center gap-4">
            <LanguageToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative size-8 rounded-full">
                  <Avatar className="size-8">
                    <AvatarFallback>
                      {user?.fullName ? getInitials(user.fullName) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.fullName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <User className="mr-2 size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Settings className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main content area with sidebar placeholder */}
      <div className="flex-1 flex">
        {/* Sidebar placeholder */}
        <aside className="hidden md:flex w-64 flex-col border-r bg-muted/40">
          <div className="flex-1 p-4">
            <p className="text-sm text-muted-foreground">
              Sidebar placeholder - navigation will be added here
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Organization Selector Modal */}
      <OrganizationSelector
        open={orgSelectorOpen}
        onOpenChange={setOrgSelectorOpen}
        organizations={organizations}
        currentOrganization={currentOrganization}
        onSelect={switchOrganization}
      />
    </div>
  );
}
