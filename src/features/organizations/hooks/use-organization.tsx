/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { fetchMemberships, createOrganization } from "../api/organizations";
import type {
  Organization,
  OrganizationMembership,
  OrganizationContextValue,
} from "../types";

const OrganizationContext = createContext<OrganizationContextValue | null>(
  null
);

interface OrganizationProviderProps {
  children: ReactNode;
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null);
  const [memberships, setMemberships] = useState<OrganizationMembership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);

  const refreshMemberships = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { memberships: fetchedMemberships } = await fetchMemberships();
      setMemberships(fetchedMemberships);

      if (fetchedMemberships.length > 0) {
        // Find default membership or use first one
        const defaultMembership =
          fetchedMemberships.find((m) => m.isDefault) || fetchedMemberships[0];
        if (defaultMembership.organization) {
          setCurrentOrganization(defaultMembership.organization);
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch memberships";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDefaultOrganization = useCallback(async () => {
    if (isCreatingOrg) return;

    setIsCreatingOrg(true);
    setError(null);

    try {
      const { organization, membership } = await createOrganization();
      setCurrentOrganization(organization);
      setMemberships([membership]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create organization";
      setError(message);
      throw err;
    } finally {
      setIsCreatingOrg(false);
    }
  }, [isCreatingOrg]);

  // Initial load
  useEffect(() => {
    refreshMemberships();
  }, [refreshMemberships]);

  const value: OrganizationContextValue = {
    currentOrganization,
    memberships,
    isLoading,
    error,
    setCurrentOrganization,
    refreshMemberships,
    createDefaultOrganization,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization(): OrganizationContextValue {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider"
    );
  }
  return context;
}
