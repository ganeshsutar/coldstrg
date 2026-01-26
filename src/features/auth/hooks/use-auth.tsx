/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { checkAuth, signOut } from "../api/auth";
import type { AuthView, UserInfo, AuthContextValue } from "../types";

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authView, setAuthView] = useState<AuthView>("login");
  const [pendingEmail, setPendingEmail] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo>({ email: "" });

  useEffect(() => {
    let cancelled = false;

    async function initAuth() {
      const result = await checkAuth();
      if (cancelled) return;

      setIsAuthenticated(result.isAuthenticated);
      if (result.isAuthenticated) {
        setUserInfo(result.userInfo);
      }
    }

    initAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch {
      // Ignore sign out errors
    }
    setIsAuthenticated(false);
    setUserInfo({ email: "" });
  }, []);

  const value: AuthContextValue = {
    isAuthenticated,
    userInfo,
    authView,
    pendingEmail,
    setIsAuthenticated,
    setAuthView,
    setPendingEmail,
    setUserInfo,
    handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
