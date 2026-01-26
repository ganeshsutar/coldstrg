import { useEffect } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { LoginForm, checkAuth, useAuth } from "@/features/auth";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.auth?.isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, setUserInfo } = useAuth();

  // Redirect if already authenticated (handles async auth check completion)
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  async function handleLoginSuccess() {
    const result = await checkAuth();
    if (result.isAuthenticated) {
      setUserInfo(result.userInfo);
      setIsAuthenticated(true);
      navigate({ to: "/dashboard" });
    }
  }

  function handleSignUpClick() {
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
        <LoginForm onSuccess={handleLoginSuccess} onSignUpClick={handleSignUpClick} />
      </div>
    </div>
  );
}
