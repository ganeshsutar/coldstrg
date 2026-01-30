import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  Sauda,
  CreateSaudaInput,
  UpdateSaudaInput,
  SaudaFormInput,
  SaudaStats,
} from "../types";
import { getNextSaudaNo } from "../utils/format";

const client = generateClient<Schema>();

// ==================== Sauda CRUD ====================

export async function fetchSaudaList(organizationId: string): Promise<Sauda[]> {
  const { data, errors } =
    await client.models.Sauda.listSaudaByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter((s) => s.isActive !== false) as unknown as Sauda[];
}

export async function fetchSaudaById(id: string): Promise<Sauda> {
  const { data, errors } = await client.models.Sauda.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Sauda not found");
  }

  return data as unknown as Sauda;
}

export async function fetchSaudaBySeller(
  organizationId: string,
  sellerPartyId: string
): Promise<Sauda[]> {
  const { data, errors } =
    await client.models.Sauda.listSaudaBySellerPartyId({
      sellerPartyId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const filtered = (data || []).filter(
    (s) => s.organizationId === organizationId && s.isActive !== false
  );

  return filtered as unknown as Sauda[];
}

export async function fetchSaudaByBuyer(
  organizationId: string,
  buyerPartyId: string
): Promise<Sauda[]> {
  const { data, errors } =
    await client.models.Sauda.listSaudaByBuyerPartyId({
      buyerPartyId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const filtered = (data || []).filter(
    (s) => s.organizationId === organizationId && s.isActive !== false
  );

  return filtered as unknown as Sauda[];
}

export async function fetchOpenSaudas(organizationId: string): Promise<Sauda[]> {
  const all = await fetchSaudaList(organizationId);
  return all.filter((s) => s.status === "OPEN" || s.status === "PARTIAL");
}

export async function createSauda(input: CreateSaudaInput): Promise<Sauda> {
  const { data, errors } = await client.models.Sauda.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create sauda");
  }

  return data as unknown as Sauda;
}

export async function updateSauda(input: UpdateSaudaInput): Promise<Sauda> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.Sauda.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update sauda");
  }

  return data as unknown as Sauda;
}

export async function deleteSauda(id: string): Promise<void> {
  // Soft delete
  const { errors } = await client.models.Sauda.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Combined Operations ====================

export async function getNextSaudaNumber(organizationId: string): Promise<number> {
  const saudas = await fetchSaudaList(organizationId);
  return getNextSaudaNo(saudas);
}

export async function createSaudaFromForm(
  organizationId: string,
  formInput: SaudaFormInput
): Promise<Sauda> {
  // Get next voucher number
  const saudaNo = await getNextSaudaNumber(organizationId);

  // Calculate amount
  const amount = formInput.quantity * formInput.rate;

  // Create sauda
  return createSauda({
    organizationId,
    saudaNo,
    saudaDate: formInput.saudaDate,
    dueDate: formInput.dueDate,
    dueDays: formInput.dueDays ?? 30,
    sellerPartyId: formInput.sellerPartyId,
    sellerPartyName: formInput.sellerPartyName,
    sellerVillage: formInput.sellerVillage,
    buyerPartyId: formInput.buyerPartyId,
    buyerPartyName: formInput.buyerPartyName,
    buyerContact: formInput.buyerContact,
    buyerLocation: formInput.buyerLocation,
    commodityId: formInput.commodityId,
    commodityName: formInput.commodityName,
    variety: formInput.variety,
    quantity: formInput.quantity,
    rate: formInput.rate,
    amount,
    dispatchedQty: 0,
    balanceQty: formInput.quantity,
    paymentTerms: formInput.paymentTerms,
    deliveryLocation: formInput.deliveryLocation,
    status: "OPEN",
    remarks: formInput.remarks,
  });
}

export async function updateSaudaDispatch(
  saudaId: string,
  dispatchedBags: number
): Promise<Sauda> {
  const sauda = await fetchSaudaById(saudaId);

  const newDispatchedQty = sauda.dispatchedQty + dispatchedBags;
  const newBalanceQty = sauda.quantity - newDispatchedQty;

  // Determine new status
  let status = sauda.status;
  if (newBalanceQty <= 0) {
    status = "DISPATCHED";
  } else if (newDispatchedQty > 0) {
    status = "PARTIAL";
  }

  return updateSauda({
    id: saudaId,
    dispatchedQty: newDispatchedQty,
    balanceQty: newBalanceQty,
    status,
  });
}

export async function cancelSauda(saudaId: string): Promise<Sauda> {
  return updateSauda({
    id: saudaId,
    status: "CANCELLED",
  });
}

export async function completeSauda(saudaId: string): Promise<Sauda> {
  return updateSauda({
    id: saudaId,
    status: "COMPLETED",
  });
}

// ==================== Statistics ====================

export async function getSaudaStats(organizationId: string): Promise<SaudaStats> {
  const saudas = await fetchSaudaList(organizationId);

  const openDeals = saudas.filter((s) => s.status === "OPEN");
  const partialDeals = saudas.filter((s) => s.status === "PARTIAL");
  const completedDeals = saudas.filter(
    (s) => s.status === "COMPLETED" || s.status === "DISPATCHED"
  );

  const totalValue = saudas.reduce((sum, s) => sum + (s.amount || 0), 0);
  const dispatchedValue = saudas.reduce(
    (sum, s) => sum + (s.dispatchedQty || 0) * (s.rate || 0),
    0
  );
  const pendingValue = saudas
    .filter((s) => s.status === "OPEN" || s.status === "PARTIAL")
    .reduce((sum, s) => sum + (s.balanceQty || 0) * (s.rate || 0), 0);

  return {
    totalDeals: saudas.length,
    openDeals: openDeals.length,
    partialDeals: partialDeals.length,
    completedDeals: completedDeals.length,
    totalValue,
    dispatchedValue,
    pendingValue,
  };
}
