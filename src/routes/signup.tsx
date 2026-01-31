import { useEffect } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { SignupForm, useAuth } from "@/features/auth";
import { AuthLoadingSkeleton } from "@/components/loading";

export const Route = createFileRoute("/signup")({
  beforeLoad: ({ context }) => {
    if (context.auth?.isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { isAuthenticated, setPendingEmail } = useAuth();

  // Redirect if already authenticated (handles async auth check completion)
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  function handleNeedConfirmation(email: string) {
    setPendingEmail(email);
    navigate({ to: "/confirm-signup", search: { email } });
  }

  function handleLoginClick() {
    navigate({ to: "/login" });
  }

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return <AuthLoadingSkeleton />;
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
        <SignupForm
          onNeedConfirmation={handleNeedConfirmation}
          onLoginClick={handleLoginClick}
        />
      </div>
    </div>
  );
}
