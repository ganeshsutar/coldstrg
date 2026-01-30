import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  Advance,
  CreateAdvanceInput,
  UpdateAdvanceInput,
  AdvanceFormInput,
} from "../types";
import { getNextAdvanceNo } from "../utils/voucher-number";

const client = generateClient<Schema>();

// ==================== Advance CRUD ====================

export async function fetchAdvanceList(organizationId: string): Promise<Advance[]> {
  const { data, errors } =
    await client.models.Advance.listAdvanceByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter((a) => a.isActive !== false) as unknown as Advance[];
}

export async function fetchAdvanceById(id: string): Promise<Advance> {
  const { data, errors } = await client.models.Advance.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Advance not found");
  }

  return data as unknown as Advance;
}

export async function fetchAdvancesByParty(
  organizationId: string,
  partyId: string
): Promise<Advance[]> {
  const { data, errors } =
    await client.models.Advance.listAdvanceByPartyId({
      partyId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const filtered = (data || []).filter(
    (a) => a.organizationId === organizationId && a.isActive !== false
  );

  return filtered as unknown as Advance[];
}

export async function fetchPendingAdvancesByParty(
  organizationId: string,
  partyId: string
): Promise<Advance[]> {
  const advances = await fetchAdvancesByParty(organizationId, partyId);
  return advances.filter((a) => a.status === "PENDING");
}

export async function createAdvance(
  input: CreateAdvanceInput
): Promise<Advance> {
  const { data, errors } = await client.models.Advance.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create advance");
  }

  return data as unknown as Advance;
}

export async function updateAdvance(
  input: UpdateAdvanceInput
): Promise<Advance> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.Advance.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update advance");
  }

  return data as unknown as Advance;
}

export async function deleteAdvance(id: string): Promise<void> {
  // Soft delete
  const { errors } = await client.models.Advance.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Combined Operations ====================

export async function getNextAdvanceNumber(organizationId: string): Promise<number> {
  const advances = await fetchAdvanceList(organizationId);
  return getNextAdvanceNo(advances);
}

export async function createAdvanceFromForm(
  organizationId: string,
  formInput: AdvanceFormInput
): Promise<Advance> {
  // Get next voucher number
  const advanceNo = await getNextAdvanceNumber(organizationId);

  // Create advance
  return createAdvance({
    organizationId,
    advanceNo,
    date: formInput.date,
    expectedDate: formInput.expectedDate,
    partyId: formInput.partyId,
    partyName: formInput.partyName,
    expectedBags: formInput.expectedBags,
    amount: formInput.amount,
    interestRate: formInput.interestRate ?? 0,
    bardanaVoucherId: formInput.bardanaVoucherId,
    paymentMode: formInput.paymentMode,
    status: "PENDING",
    narration: formInput.narration,
  });
}

export async function convertAdvanceToLoan(
  advanceId: string,
  amadId: string
): Promise<Advance> {
  const advance = await fetchAdvanceById(advanceId);

  if (advance.status !== "PENDING") {
    throw new Error("Only pending advances can be converted");
  }

  return updateAdvance({
    id: advanceId,
    status: "CONVERTED",
    convertedAmadId: amadId,
  });
}

export async function adjustAdvance(advanceId: string): Promise<Advance> {
  const advance = await fetchAdvanceById(advanceId);

  if (advance.status !== "PENDING" && advance.status !== "CONVERTED") {
    throw new Error("Advance cannot be adjusted");
  }

  return updateAdvance({
    id: advanceId,
    status: "ADJUSTED",
  });
}

export async function closeAdvance(advanceId: string): Promise<Advance> {
  return updateAdvance({
    id: advanceId,
    status: "CLOSED",
  });
}

// ==================== Statistics ====================

export async function getAdvanceStats(organizationId: string): Promise<{
  totalAmount: number;
  count: number;
  pendingAmount: number;
  pendingCount: number;
}> {
  const advances = await fetchAdvanceList(organizationId);

  const pending = advances.filter((a) => a.status === "PENDING");

  return {
    totalAmount: advances.reduce((sum, a) => sum + a.amount, 0),
    count: advances.length,
    pendingAmount: pending.reduce((sum, a) => sum + a.amount, 0),
    pendingCount: pending.length,
  };
}
