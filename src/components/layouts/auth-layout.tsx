import { Outlet } from 'react-router-dom';
import { Logo } from '@/components/common/logo';
import { LanguageToggle } from '@/components/common/language-toggle';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="absolute top-4 right-4">
        <LanguageToggle />
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <Logo size="lg" className="mb-8" />

          {/* Auth form outlet */}
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} COLDVAULT. All rights reserved.</p>
      </footer>
    </div>
  );
}
