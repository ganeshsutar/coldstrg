import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { Spinner } from '@/components/common/spinner';

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Allow access to verify-email even when not authenticated
  const isVerifyPage = location.pathname === '/auth/verify-email';
  const isResetPage = location.pathname === '/auth/reset-password';

  if (isAuthenticated && !isVerifyPage && !isResetPage) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
