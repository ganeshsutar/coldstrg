"use client"

import { useMemo } from "react"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { useAccountList } from "@/features/accounting/hooks/use-accounts"
import type { Account } from "@/features/accounting/types"

export interface PartySelectProps {
  organizationId: string
  value: string
  onValueChange: (id: string, party: Account | undefined) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
  "data-testid"?: string
}

export function PartySelect({
  organizationId,
  value,
  onValueChange,
  placeholder = "Select party...",
  searchPlaceholder = "Search by name or code...",
  emptyText = "No party found.",
  className,
  disabled,
  "data-testid": dataTestId,
}: PartySelectProps) {
  const { data: accounts = [], isLoading } = useAccountList(organizationId)

  // Filter to actual party accounts only (must have partyType and be active)
  const partyAccounts = useMemo(
    () => accounts.filter((a) => a.accountType === "ACCOUNT" && a.partyType && a.isActive !== false),
    [accounts]
  )

  // Transform accounts to combobox options with search terms
  const options: ComboboxOption[] = useMemo(
    () =>
      partyAccounts.map((account) => ({
        value: account.id,
        label: `${account.name} (${account.code})`,
        searchTerms: [
          account.code,
          account.nameHindi ?? "",
          account.city ?? "",
        ].filter(Boolean),
      })),
    [partyAccounts]
  )

  const handleValueChange = (id: string) => {
    const party = partyAccounts.find((a) => a.id === id)
    onValueChange(id, party)
  }

  return (
    <Combobox
      options={options}
      value={value}
      onValueChange={handleValueChange}
      placeholder={isLoading ? "Loading..." : placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyText={emptyText}
      className={className}
      disabled={disabled || isLoading}
      data-testid={dataTestId}
    />
  )
}
