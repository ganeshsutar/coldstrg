import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  BardanaReceiptHeader,
  BardanaReceiptItem,
  CreateBardanaReceiptHeaderInput,
  CreateBardanaReceiptItemInput,
  UpdateBardanaReceiptHeaderInput,
  BardanaReceiptFormInput,
} from "../types";
import {
  calculateReceiptItemAmounts,
  calculateReceiptTotals,
} from "../utils/calculations";
import { getNextReceiptVoucherNo } from "../utils/voucher-number";
import { fetchBardanaStockByParty, upsertBardanaStock } from "./bardana-stock";
import { fetchBardanaTypeById } from "./bardana-types";

const client = generateClient<Schema>();

// ==================== Receipt Header ====================

export async function fetchBardanaReceiptList(
  organizationId: string
): Promise<BardanaReceiptHeader[]> {
  const { data, errors } =
    await client.models.BardanaReceiptHeader.listBardanaReceiptHeaderByOrganizationId(
      {
        organizationId,
      }
    );

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as BardanaReceiptHeader[];
}

export async function fetchBardanaReceiptById(
  id: string
): Promise<BardanaReceiptHeader> {
  const { data, errors } = await client.models.BardanaReceiptHeader.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Bardana receipt not found");
  }

  return data as unknown as BardanaReceiptHeader;
}

export async function fetchBardanaReceiptByParty(
  organizationId: string,
  partyId: string
): Promise<BardanaReceiptHeader[]> {
  const { data, errors } =
    await client.models.BardanaReceiptHeader.listBardanaReceiptHeaderByPartyId({
      partyId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const filtered = (data || []).filter(
    (r) => r.organizationId === organizationId
  );

  return filtered as unknown as BardanaReceiptHeader[];
}

export async function createBardanaReceiptHeader(
  input: CreateBardanaReceiptHeaderInput
): Promise<BardanaReceiptHeader> {
  const { data, errors } = await client.models.BardanaReceiptHeader.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create bardana receipt");
  }

  return data as unknown as BardanaReceiptHeader;
}

export async function updateBardanaReceiptHeader(
  input: UpdateBardanaReceiptHeaderInput
): Promise<BardanaReceiptHeader> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.BardanaReceiptHeader.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update bardana receipt");
  }

  return data as unknown as BardanaReceiptHeader;
}

export async function deleteBardanaReceiptHeader(id: string): Promise<void> {
  const { errors } = await client.models.BardanaReceiptHeader.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Receipt Items ====================

export async function fetchBardanaReceiptItems(
  receiptHeaderId: string
): Promise<BardanaReceiptItem[]> {
  const { data, errors } =
    await client.models.BardanaReceiptItem.listBardanaReceiptItemByReceiptHeaderId(
      {
        receiptHeaderId,
      }
    );

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as BardanaReceiptItem[];
}

export async function createBardanaReceiptItem(
  input: CreateBardanaReceiptItemInput
): Promise<BardanaReceiptItem> {
  const { data, errors } = await client.models.BardanaReceiptItem.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create bardana receipt item");
  }

  return data as unknown as BardanaReceiptItem;
}

export async function deleteBardanaReceiptItem(id: string): Promise<void> {
  const { errors } = await client.models.BardanaReceiptItem.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Combined Operations ====================

export async function getNextReceiptNo(organizationId: string): Promise<number> {
  const receipts = await fetchBardanaReceiptList(organizationId);
  return getNextReceiptVoucherNo(receipts);
}

export async function createBardanaReceipt(
  organizationId: string,
  formInput: BardanaReceiptFormInput
): Promise<BardanaReceiptHeader> {
  // Calculate item amounts with condition adjustments
  const items = await Promise.all(
    formInput.items.map(async (item) => {
      const bardanaType = await fetchBardanaTypeById(item.bardanaTypeId);
      const rate = item.rate || bardanaType.defaultRate;
      const amounts = calculateReceiptItemAmounts(
        item.quantity,
        rate,
        item.condition
      );
      return {
        ...item,
        rate,
        ...amounts,
      };
    })
  );

  // Calculate totals
  const totals = calculateReceiptTotals(items);

  // Get next voucher number
  const voucherNo = await getNextReceiptNo(organizationId);

  // Create header
  const header = await createBardanaReceiptHeader({
    organizationId,
    voucherNo,
    receiptDate: formInput.receiptDate,
    partyId: formInput.partyId,
    partyName: formInput.partyName,
    partyVillage: formInput.partyVillage,
    rentId: formInput.rentId,
    rentSerialNo: formInput.rentSerialNo,
    totalQuantity: totals.totalQuantity,
    totalGoodQuantity: totals.totalGoodQuantity,
    totalFairQuantity: totals.totalFairQuantity,
    totalDamagedQuantity: totals.totalDamagedQuantity,
    totalAmount: totals.totalAmount,
    totalDeduction: totals.totalDeduction,
    netAmount: totals.netAmount,
    status: "DRAFT",
    narration: formInput.narration,
  });

  // Create items
  for (const item of items) {
    await createBardanaReceiptItem({
      organizationId,
      receiptHeaderId: header.id,
      bardanaTypeId: item.bardanaTypeId,
      bardanaTypeName: item.bardanaTypeName,
      quantity: item.quantity,
      condition: item.condition,
      rate: item.rate,
      creditRate: item.creditRate,
      amount: item.amount,
      deduction: item.deduction,
      netAmount: item.netAmount,
    });
  }

  return header;
}

export async function confirmBardanaReceipt(
  organizationId: string,
  receiptId: string,
  confirmedBy: string
): Promise<BardanaReceiptHeader> {
  // Get receipt header and items
  const header = await fetchBardanaReceiptById(receiptId);
  const items = await fetchBardanaReceiptItems(receiptId);

  if (header.status !== "DRAFT") {
    throw new Error("Only draft receipts can be confirmed");
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

    const newReturned = (stockRecord?.totalReturned ?? 0) + item.quantity;
    const newBalance = (stockRecord?.totalIssued ?? 0) - newReturned;
    const newValue = newBalance * item.rate;

    await upsertBardanaStock(
      organizationId,
      header.partyId,
      item.bardanaTypeId,
      {
        partyName: header.partyName ?? undefined,
        partyVillage: header.partyVillage ?? undefined,
        bardanaTypeName: item.bardanaTypeName ?? undefined,
        totalReturned: newReturned,
        balance: newBalance,
        totalValue: newValue,
        lastReturnDate: header.receiptDate,
      }
    );
  }

  // Update header status
  return updateBardanaReceiptHeader({
    id: receiptId,
    status: "CONFIRMED",
    confirmedAt: new Date().toISOString(),
    confirmedBy,
  });
}

export async function cancelBardanaReceipt(
  receiptId: string
): Promise<BardanaReceiptHeader> {
  const header = await fetchBardanaReceiptById(receiptId);

  if (header.status !== "DRAFT") {
    throw new Error("Only draft receipts can be cancelled");
  }

  return updateBardanaReceiptHeader({
    id: receiptId,
    status: "CANCELLED",
  });
}
