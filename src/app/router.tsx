import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { AuthLayout } from '@/components/layouts/auth-layout';
import { MainLayout } from '@/components/layouts/main-layout';

// Route guards
import { ProtectedRoute } from './routes/protected-route';
import { PublicRoute } from './routes/public-route';

// Common components
import { PageLoader } from '@/components/common/page-loader';

// Auth pages (eager load for better UX)
import { LoginForm } from '@/features/auth/components/login-form';
import { RegisterForm } from '@/features/auth/components/register-form';
import { VerifyEmailForm } from '@/features/auth/components/verify-email-form';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

// Lazy load dashboard for code splitting
const DashboardPage = lazy(() =>
  import('@/features/dashboard/components/dashboard-page').then((m) => ({
    default: m.DashboardPage,
  }))
);

export const router = createBrowserRouter([
  // Root redirect
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },

  // Auth routes (public)
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/auth/login',
            element: <LoginForm />,
          },
          {
            path: '/auth/register',
            element: <RegisterForm />,
          },
          {
            path: '/auth/verify-email',
            element: <VerifyEmailForm />,
          },
          {
            path: '/auth/forgot-password',
            element: <ForgotPasswordForm />,
          },
          {
            path: '/auth/reset-password',
            element: <ResetPasswordForm />,
          },
        ],
      },
    ],
  },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/dashboard',
            element: (
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  // Catch-all redirect
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
