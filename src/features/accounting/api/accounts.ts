import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { Account, CreateAccountInput, UpdateAccountInput } from "../types";

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
