import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  BardanaIssueHeader,
  BardanaIssueItem,
  CreateBardanaIssueHeaderInput,
  CreateBardanaIssueItemInput,
  UpdateBardanaIssueHeaderInput,
  BardanaIssueFormInput,
} from "../types";
import { calculateIssueTotals, calculateItemAmount } from "../utils/calculations";
import { getNextIssueVoucherNo } from "../utils/voucher-number";
import { fetchBardanaStockByParty, upsertBardanaStock } from "./bardana-stock";

const client = generateClient<Schema>();

// ==================== Issue Header ====================

export async function fetchBardanaIssueList(organizationId: string): Promise<BardanaIssueHeader[]> {
  const { data, errors } =
    await client.models.BardanaIssueHeader.listBardanaIssueHeaderByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as BardanaIssueHeader[];
}

export async function fetchBardanaIssueById(id: string): Promise<BardanaIssueHeader> {
  const { data, errors } = await client.models.BardanaIssueHeader.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Bardana issue not found");
  }

  return data as unknown as BardanaIssueHeader;
}

export async function fetchBardanaIssueByParty(
  organizationId: string,
  partyId: string
): Promise<BardanaIssueHeader[]> {
  const { data, errors } =
    await client.models.BardanaIssueHeader.listBardanaIssueHeaderByPartyId({
      partyId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const filtered = (data || []).filter(
    (i) => i.organizationId === organizationId
  );

  return filtered as unknown as BardanaIssueHeader[];
}

export async function createBardanaIssueHeader(
  input: CreateBardanaIssueHeaderInput
): Promise<BardanaIssueHeader> {
  const { data, errors } = await client.models.BardanaIssueHeader.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create bardana issue");
  }

  return data as unknown as BardanaIssueHeader;
}

export async function updateBardanaIssueHeader(
  input: UpdateBardanaIssueHeaderInput
): Promise<BardanaIssueHeader> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.BardanaIssueHeader.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update bardana issue");
  }

  return data as unknown as BardanaIssueHeader;
}

export async function deleteBardanaIssueHeader(id: string): Promise<void> {
  const { errors } = await client.models.BardanaIssueHeader.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Issue Items ====================

export async function fetchBardanaIssueItems(
  issueHeaderId: string
): Promise<BardanaIssueItem[]> {
  const { data, errors } =
    await client.models.BardanaIssueItem.listBardanaIssueItemByIssueHeaderId({
      issueHeaderId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as BardanaIssueItem[];
}

export async function createBardanaIssueItem(
  input: CreateBardanaIssueItemInput
): Promise<BardanaIssueItem> {
  const { data, errors } = await client.models.BardanaIssueItem.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create bardana issue item");
  }

  return data as unknown as BardanaIssueItem;
}

export async function deleteBardanaIssueItem(id: string): Promise<void> {
  const { errors } = await client.models.BardanaIssueItem.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Combined Operations ====================

export async function getNextIssueNo(organizationId: string): Promise<number> {
  const issues = await fetchBardanaIssueList(organizationId);
  return getNextIssueVoucherNo(issues);
}

export async function createBardanaIssue(
  organizationId: string,
  formInput: BardanaIssueFormInput
): Promise<BardanaIssueHeader> {
  // Calculate totals
  const items = formInput.items.map((item) => ({
    ...item,
    amount: calculateItemAmount(item.quantity, item.rate),
  }));
  const totals = calculateIssueTotals(items);

  // Get next voucher number
  const voucherNo = await getNextIssueNo(organizationId);

  // Create header
  const header = await createBardanaIssueHeader({
    organizationId,
    voucherNo,
    issueDate: formInput.issueDate,
    partyId: formInput.partyId,
    partyName: formInput.partyName,
    partyVillage: formInput.partyVillage,
    issueType: formInput.issueType,
    interestRatePm: formInput.interestRatePm,
    expectedArrivalDate: formInput.expectedArrivalDate,
    expectedBags: formInput.expectedBags,
    referenceNo: formInput.referenceNo,
    amadId: formInput.amadId,
    amadNo: formInput.amadNo,
    totalQuantity: totals.totalQuantity,
    totalAmount: totals.totalAmount,
    status: "DRAFT",
    narration: formInput.narration,
  });

  // Create items
  for (const item of items) {
    await createBardanaIssueItem({
      organizationId,
      issueHeaderId: header.id,
      bardanaTypeId: item.bardanaTypeId,
      bardanaTypeName: item.bardanaTypeName,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount,
    });
  }

  return header;
}

export async function confirmBardanaIssue(
  organizationId: string,
  issueId: string,
  confirmedBy: string
): Promise<BardanaIssueHeader> {
  // Get issue header and items
  const header = await fetchBardanaIssueById(issueId);
  const items = await fetchBardanaIssueItems(issueId);

  if (header.status !== "DRAFT") {
    throw new Error("Only draft issues can be confirmed");
  }

  // Update stock for each item
  for (const item of items) {
    const existingStock = await fetchBardanaStockByParty(
      organizationId,
      header.partyId
    );
    const stockRecord = existingStock.find(
      (s) => s.bardanaTypeId === item.bardanaTypeId
    );

    const newIssued = (stockRecord?.totalIssued ?? 0) + item.quantity;
    const newBalance = newIssued - (stockRecord?.totalReturned ?? 0);
    const newValue = newBalance * item.rate;

    await upsertBardanaStock(
      organizationId,
      header.partyId,
      item.bardanaTypeId,
      {
        partyName: header.partyName ?? undefined,
        partyVillage: header.partyVillage ?? undefined,
        bardanaTypeName: item.bardanaTypeName ?? undefined,
        totalIssued: newIssued,
        balance: newBalance,
        totalValue: newValue,
        lastIssueDate: header.issueDate,
      }
    );
  }

  // Update header status
  return updateBardanaIssueHeader({
    id: issueId,
    status: "CONFIRMED",
    confirmedAt: new Date().toISOString(),
    confirmedBy,
  });
}

export async function cancelBardanaIssue(issueId: string): Promise<BardanaIssueHeader> {
  const header = await fetchBardanaIssueById(issueId);

  if (header.status !== "DRAFT") {
    throw new Error("Only draft issues can be cancelled");
  }

  return updateBardanaIssueHeader({
    id: issueId,
    status: "CANCELLED",
  });
}
