import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { PartyLedger, CreatePartyLedgerInput } from "../types";

const client = generateClient<Schema>();

export async function fetchPartyLedgerList(organizationId: string): Promise<PartyLedger[]> {
  const { data, errors } =
    await client.models.PartyLedger.listPartyLedgerByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as PartyLedger[];
}

export async function fetchPartyLedgerByAccount(
  organizationId: string,
  accountId: string
): Promise<PartyLedger[]> {
  const { data, errors } =
    await client.models.PartyLedger.listPartyLedgerByAccountId({
      accountId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  // Filter by organization as a safety measure
  return ((data || []) as unknown as PartyLedger[]).filter(
    (pl) => pl.organizationId === organizationId
  );
}

export async function fetchPartyLedgerById(id: string): Promise<PartyLedger> {
  const { data, errors } = await client.models.PartyLedger.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Party ledger entry not found");
  }

  return data as unknown as PartyLedger;
}

export async function createPartyLedger(input: CreatePartyLedgerInput): Promise<PartyLedger> {
  const { data, errors } = await client.models.PartyLedger.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create party ledger entry");
  }

  return data as unknown as PartyLedger;
}

export async function deletePartyLedger(id: string): Promise<void> {
  const { errors } = await client.models.PartyLedger.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function getNextPartyLedgerSrNo(organizationId: string): Promise<number> {
  const ledger = await fetchPartyLedgerList(organizationId);
  const numbers = ledger
    .map((pl) => pl.srNo)
    .filter((n) => !isNaN(n));

  const maxNo = numbers.length > 0 ? Math.max(...numbers) : 0;
  return maxNo + 1;
}
