import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { Account, CreateAccountInput, UpdateAccountInput } from "../types";
import { SEED_CHART_OF_ACCOUNTS } from "@/config/constants";

const client = generateClient<Schema>();

export async function fetchAccountList(organizationId: string): Promise<Account[]> {
  const { data, errors } =
    await client.models.Account.listAccountByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Account[];
}

export async function fetchAccountById(id: string): Promise<Account> {
  const { data, errors } = await client.models.Account.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Account not found");
  }

  return data as unknown as Account;
}

export async function createAccount(input: CreateAccountInput): Promise<Account> {
  const { data, errors } = await client.models.Account.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create account");
  }

  return data as unknown as Account;
}

export async function updateAccount(input: UpdateAccountInput): Promise<Account> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.Account.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update account");
  }

  return data as unknown as Account;
}

export async function deleteAccount(id: string): Promise<void> {
  const { errors } = await client.models.Account.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function getNextAccountCode(organizationId: string, prefix: string = "P"): Promise<string> {
  const accounts = await fetchAccountList(organizationId);
  const codes = accounts
    .filter((a) => a.code.startsWith(prefix))
    .map((a) => parseInt(a.code.replace(prefix, ""), 10))
    .filter((n) => !isNaN(n));

  const maxNo = codes.length > 0 ? Math.max(...codes) : 0;
  return `${prefix}${String(maxNo + 1).padStart(4, "0")}`;
}

// Fetch only party accounts (non-group accounts used for transactions)
export async function fetchPartyAccounts(organizationId: string): Promise<Account[]> {
  const accounts = await fetchAccountList(organizationId);
  return accounts.filter((a) => a.accountType === "ACCOUNT" && a.isActive !== false);
}

// Fetch accounts by parent for tree view
export async function fetchChildAccounts(organizationId: string, parentId: string | null): Promise<Account[]> {
  const accounts = await fetchAccountList(organizationId);
  return accounts.filter((a) =>
    parentId ? a.parentId === parentId : !a.parentId
  );
}

// Seed chart of accounts with hierarchical parent-child relationships
export async function seedAccounts(organizationId: string): Promise<Account[]> {
  const results: Account[] = [];
  const codeToIdMap: Record<string, string> = {};

  // Create accounts in order - the SEED_CHART_OF_ACCOUNTS array is ordered
  // so that parent groups come before their children
  for (const account of SEED_CHART_OF_ACCOUNTS) {
    const under = "under" in account ? account.under : undefined;
    const parentId = under ? codeToIdMap[under] : undefined;

    const { data, errors } = await client.models.Account.create({
      organizationId,
      code: account.code,
      name: account.name,
      accountType: account.accountType,
      nature: account.nature,
      level: account.level,
      under,
      parentId,
      isActive: true,
    });

    if (errors && errors.length > 0) {
      console.error(`Failed to seed account ${account.name}:`, errors[0].message);
      continue;
    }

    if (data) {
      codeToIdMap[account.code] = data.id;
      results.push(data as unknown as Account);
    }
  }

  return results;
}

export type ProgressCallback = (completed: number, currentItem: string, skipped?: number) => void;

export async function seedAccountsWithProgress(
  organizationId: string,
  onProgress?: ProgressCallback
): Promise<{ results: Account[]; skipped: number }> {
  const results: Account[] = [];
  const codeToIdMap: Record<string, string> = {};

  // Fetch existing accounts to check which codes already exist
  onProgress?.(0, "Checking existing accounts...");
  const existingAccounts = await fetchAccountList(organizationId);
  const existingCodeMap = new Map<string, Account>();
  for (const acc of existingAccounts) {
    existingCodeMap.set(acc.code, acc);
    codeToIdMap[acc.code] = acc.id;
  }

  let skippedCount = 0;
  let completed = 0;

  for (let i = 0; i < SEED_CHART_OF_ACCOUNTS.length; i++) {
    const account = SEED_CHART_OF_ACCOUNTS[i];
    const under = "under" in account ? account.under : undefined;
    const parentId = under ? codeToIdMap[under] : undefined;

    // Skip if account with this code already exists
    const existingAccount = existingCodeMap.get(account.code);
    if (existingAccount) {
      skippedCount++;
      completed++;
      results.push(existingAccount);
      onProgress?.(completed, `${account.name} (already exists)`, skippedCount);
      continue;
    }

    onProgress?.(completed, account.name);

    const { data, errors } = await client.models.Account.create({
      organizationId,
      code: account.code,
      name: account.name,
      accountType: account.accountType,
      nature: account.nature,
      level: account.level,
      under,
      parentId,
      isActive: true,
    });

    if (errors && errors.length > 0) {
      console.error(`Failed to seed account ${account.name}:`, errors[0].message);
      continue;
    }

    if (data) {
      codeToIdMap[account.code] = data.id;
      results.push(data as unknown as Account);
      completed++;
      onProgress?.(completed, account.name, skippedCount);
    }
  }

  return { results, skipped: skippedCount };
}
