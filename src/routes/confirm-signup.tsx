import { useEffect } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { ConfirmSignupForm, useAuth } from "@/features/auth";

const confirmSignupSearchSchema = z.object({
  email: z.string().email().optional(),
});

export const Route = createFileRoute("/confirm-signup")({
  validateSearch: confirmSignupSearchSchema,
  beforeLoad: ({ context }) => {
    if (context.auth?.isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: ConfirmSignupPage,
});

function ConfirmSignupPage() {
  const navigate = useNavigate();
  const { email } = Route.useSearch();
  const { isAuthenticated, pendingEmail } = useAuth();

  // Use search param email or fallback to context pendingEmail
  const confirmationEmail = email || pendingEmail;

  // Redirect if already authenticated (handles async auth check completion)
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  function handleSuccess() {
    navigate({ to: "/login" });
  }

  function handleBackClick() {
    navigate({ to: "/signup" });
  }

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Already authenticated, will redirect via useEffect
  if (isAuthenticated) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center">
        <div className="text-muted-foreground">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ConfirmSignupForm
          email={confirmationEmail}
          onSuccess={handleSuccess}
          onBackClick={handleBackClick}
        />
      </div>
    </div>
  );
}
