import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function AppProvider() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    // Check authentication status on app load
    checkAuth();
  }, [checkAuth]);

  return <RouterProvider router={router} />;
}
