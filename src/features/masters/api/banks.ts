import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { Bank, CreateBankInput, UpdateBankInput } from "../types";
import { SEED_BANKS } from "@/config/constants";

const client = generateClient<Schema>();

export async function fetchBanks(organizationId: string): Promise<Bank[]> {
  const { data, errors } =
    await client.models.Bank.listBankByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Bank[];
}

export async function createBank(input: CreateBankInput): Promise<Bank> {
  const { data, errors } = await client.models.Bank.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create bank");
  }

  return data as unknown as Bank;
}

export async function updateBank(input: UpdateBankInput): Promise<Bank> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.Bank.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update bank");
  }

  return data as unknown as Bank;
}

export async function deleteBank(id: string): Promise<void> {
  const { errors } = await client.models.Bank.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function seedBanks(organizationId: string): Promise<Bank[]> {
  const results: Bank[] = [];

  for (let i = 0; i < SEED_BANKS.length; i++) {
    const bank = SEED_BANKS[i];
    const code = String(i + 1).padStart(3, "0");

    const { data, errors } = await client.models.Bank.create({
      organizationId,
      name: bank.name,
      code,
      ifscPattern: bank.ifscPattern,
      isActive: true,
    });

    if (errors && errors.length > 0) {
      console.error(`Failed to seed bank ${bank.name}:`, errors[0].message);
      continue;
    }

    if (data) {
      results.push(data as unknown as Bank);
    }
  }

  return results;
}
