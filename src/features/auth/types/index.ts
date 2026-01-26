export type AuthView = "login" | "signup" | "confirm";

export interface UserInfo {
  email: string;
  name?: string;
}

export interface AuthState {
  isAuthenticated: boolean | null;
  userInfo: UserInfo;
  authView: AuthView;
  pendingEmail: string;
}

export interface AuthContextValue extends AuthState {
  setIsAuthenticated: (value: boolean) => void;
  setAuthView: (view: AuthView) => void;
  setPendingEmail: (email: string) => void;
  setUserInfo: (info: UserInfo) => void;
  handleSignOut: () => void;
}
