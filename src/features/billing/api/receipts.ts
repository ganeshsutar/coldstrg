import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  Receipt,
  ReceiptAllocation,
  CreateReceiptInput,
  CreateReceiptAllocationInput,
  UpdateReceiptInput,
  ReceiptFormInput,
  PartyBillingSummary,
} from "../types";
import { getNextReceiptNo, convertAmountToWords } from "../utils";
import {
  fetchRentBillById,
  fetchRentBillByParty,
  updateRentBillHeader,
} from "./rent-bills";

const client = generateClient<Schema>();

// ==================== Receipt ====================

export async function fetchReceiptList(
  organizationId: string
): Promise<Receipt[]> {
  const { data, errors } =
    await client.models.Receipt.listReceiptByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Receipt[];
}

export async function fetchReceiptById(id: string): Promise<Receipt> {
  const { data, errors } = await client.models.Receipt.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Receipt not found");
  }

  return data as unknown as Receipt;
}

export async function fetchReceiptByParty(
  organizationId: string,
  partyId: string
): Promise<Receipt[]> {
  const { data, errors } = await client.models.Receipt.listReceiptByPartyId({
    partyId,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const filtered = (data || []).filter(
    (r) => r.organizationId === organizationId
  );

  return filtered as unknown as Receipt[];
}

export async function createReceipt(input: CreateReceiptInput): Promise<Receipt> {
  const { data, errors } = await client.models.Receipt.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create receipt");
  }

  return data as unknown as Receipt;
}

export async function updateReceipt(input: UpdateReceiptInput): Promise<Receipt> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.Receipt.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update receipt");
  }

  return data as unknown as Receipt;
}

export async function deleteReceipt(id: string): Promise<void> {
  const { errors } = await client.models.Receipt.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Receipt Allocation ====================

export async function fetchReceiptAllocations(
  receiptId: string
): Promise<ReceiptAllocation[]> {
  const { data, errors } =
    await client.models.ReceiptAllocation.listReceiptAllocationByReceiptId({
      receiptId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as ReceiptAllocation[];
}

export async function fetchBillAllocations(
  rentBillId: string
): Promise<ReceiptAllocation[]> {
  const { data, errors } =
    await client.models.ReceiptAllocation.listReceiptAllocationByRentBillId({
      rentBillId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as ReceiptAllocation[];
}

export async function createReceiptAllocation(
  input: CreateReceiptAllocationInput
): Promise<ReceiptAllocation> {
  const { data, errors } = await client.models.ReceiptAllocation.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create receipt allocation");
  }

  return data as unknown as ReceiptAllocation;
}

export async function deleteReceiptAllocation(id: string): Promise<void> {
  const { errors } = await client.models.ReceiptAllocation.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Combined Operations ====================

export async function getNextReceiptNumber(
  organizationId: string
): Promise<string> {
  const receipts = await fetchReceiptList(organizationId);
  return getNextReceiptNo(receipts, "RV");
}

export async function createReceiptWithAllocations(
  organizationId: string,
  formInput: ReceiptFormInput
): Promise<Receipt> {
  // Generate receipt number
  const receiptNo = await getNextReceiptNumber(organizationId);

  // Create receipt
  const receipt = await createReceipt({
    organizationId,
    receiptNo,
    receiptDate: formInput.receiptDate,
    partyId: formInput.partyId,
    partyName: formInput.partyName,
    paymentMode: formInput.paymentMode,
    amount: formInput.amount,
    amountInWords: convertAmountToWords(formInput.amount),
    chequeNo: formInput.chequeNo,
    chequeDate: formInput.chequeDate,
    bankName: formInput.bankName,
    branchName: formInput.branchName,
    isPdcCheque: formInput.isPdcCheque,
    upiRef: formInput.upiRef,
    bankRef: formInput.bankRef,
    narration: formInput.narration,
    status: "DRAFT",
  });

  // Create allocations
  for (const allocation of formInput.allocations) {
    await createReceiptAllocation({
      organizationId,
      receiptId: receipt.id,
      rentBillId: allocation.rentBillId,
      billNo: allocation.billNo,
      allocatedAmount: allocation.allocatedAmount,
    });
  }

  return receipt;
}

export async function confirmReceipt(
  _organizationId: string,
  receiptId: string,
  confirmedBy: string
): Promise<Receipt> {
  const receipt = await fetchReceiptById(receiptId);

  if (receipt.status !== "DRAFT") {
    throw new Error("Only draft receipts can be confirmed");
  }

  // Get allocations
  const allocations = await fetchReceiptAllocations(receiptId);

  // Update each bill's paid amount and status
  for (const allocation of allocations) {
    const bill = await fetchRentBillById(allocation.rentBillId);

    const newPaidAmount = bill.paidAmount + allocation.allocatedAmount;
    const newBalanceAmount = bill.roundedAmount - newPaidAmount;

    // Determine new status
    let newStatus: "PAID" | "PARTIAL_PAID" | undefined;
    if (newBalanceAmount <= 0) {
      newStatus = "PAID";
    } else if (newPaidAmount > 0) {
      newStatus = "PARTIAL_PAID";
    }

    await updateRentBillHeader({
      id: bill.id,
      paidAmount: newPaidAmount,
      balanceAmount: Math.max(0, newBalanceAmount),
      status: newStatus || bill.status || undefined,
    });
  }

  // Update receipt status
  return updateReceipt({
    id: receiptId,
    status: "CONFIRMED",
    confirmedAt: new Date().toISOString(),
    confirmedBy,
  });
}

export async function cancelReceipt(
  _organizationId: string,
  receiptId: string,
  cancelledBy: string,
  cancelReason?: string
): Promise<Receipt> {
  const receipt = await fetchReceiptById(receiptId);

  if (receipt.status === "CONFIRMED") {
    // Reverse the allocations
    const allocations = await fetchReceiptAllocations(receiptId);

    for (const allocation of allocations) {
      const bill = await fetchRentBillById(allocation.rentBillId);

      const newPaidAmount = Math.max(0, bill.paidAmount - allocation.allocatedAmount);
      const newBalanceAmount = bill.roundedAmount - newPaidAmount;

      // Determine new status
      let newStatus: "CONFIRMED" | "PARTIAL_PAID" | undefined;
      if (newPaidAmount === 0 && bill.status === "PAID") {
        newStatus = "CONFIRMED";
      } else if (newPaidAmount > 0 && newPaidAmount < bill.roundedAmount) {
        newStatus = "PARTIAL_PAID";
      }

      await updateRentBillHeader({
        id: bill.id,
        paidAmount: newPaidAmount,
        balanceAmount: newBalanceAmount,
        status: newStatus || bill.status || undefined,
      });
    }
  }

  return updateReceipt({
    id: receiptId,
    status: "CANCELLED",
    cancelledAt: new Date().toISOString(),
    cancelledBy,
    cancelReason,
  });
}

// ==================== Party Outstanding ====================

export async function fetchPartyOutstanding(
  organizationId: string,
  partyId: string
): Promise<number> {
  const bills = await fetchRentBillByParty(organizationId, partyId);

  return bills
    .filter(
      (b) =>
        b.status &&
        ["CONFIRMED", "PARTIAL_PAID", "OVERDUE"].includes(b.status)
    )
    .reduce((sum, b) => sum + b.balanceAmount, 0);
}

export async function fetchAllPartiesOutstanding(
  organizationId: string
): Promise<PartyBillingSummary[]> {
  const { data: bills, errors } =
    await client.models.RentBillHeader.listRentBillHeaderByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  // Group by party
  const partyMap = new Map<string, PartyBillingSummary>();

  for (const bill of bills || []) {
    if (bill.status === "CANCELLED") continue;

    const existing = partyMap.get(bill.partyId);
    if (existing) {
      existing.totalBilled += bill.roundedAmount || 0;
      existing.totalPaid += bill.paidAmount || 0;
      existing.totalOutstanding += bill.balanceAmount || 0;
      existing.billCount++;
      if ((bill.balanceAmount || 0) > 0) {
        existing.unpaidBillCount++;
      }
      if (!existing.lastBillDate || bill.billDate > existing.lastBillDate) {
        existing.lastBillDate = bill.billDate;
      }
    } else {
      partyMap.set(bill.partyId, {
        partyId: bill.partyId,
        partyName: bill.partyName || "",
        partyVillage: bill.partyVillage || undefined,
        totalBilled: bill.roundedAmount || 0,
        totalPaid: bill.paidAmount || 0,
        totalOutstanding: bill.balanceAmount || 0,
        billCount: 1,
        unpaidBillCount: (bill.balanceAmount || 0) > 0 ? 1 : 0,
        lastBillDate: bill.billDate,
      });
    }
  }

  // Sort by outstanding amount descending
  return Array.from(partyMap.values()).sort(
    (a, b) => b.totalOutstanding - a.totalOutstanding
  );
}
