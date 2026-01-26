/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  activeNavId: string;
}

interface UIContextValue extends UIState {
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setActiveNavId: (id: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

interface UIProviderProps {
  children: ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNavId, setActiveNavId] = useState("dashboard");

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const value: UIContextValue = {
    sidebarOpen,
    sidebarCollapsed,
    activeNavId,
    setSidebarOpen,
    setSidebarCollapsed,
    toggleSidebar,
    setActiveNavId,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
