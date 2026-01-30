import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  RentBillHeader,
  RentBillItem,
  PriceBreakup,
  CreateRentBillHeaderInput,
  CreateRentBillItemInput,
  CreatePriceBreakupInput,
  UpdateRentBillHeaderInput,
  RentBillFormInput,
  BillingStats,
  BillingTrendData,
  BillableAmad,
} from "../types";
import {
  getNextBillNo,
  calculateBillAmounts,
  convertAmountToWords,
  roundBillAmount,
  calculateStorageDays,
} from "../utils";

const client = generateClient<Schema>();

// ==================== Rent Bill Header ====================

export async function fetchRentBillList(
  organizationId: string
): Promise<RentBillHeader[]> {
  const { data, errors } =
    await client.models.RentBillHeader.listRentBillHeaderByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as RentBillHeader[];
}

export async function fetchRentBillById(id: string): Promise<RentBillHeader> {
  const { data, errors } = await client.models.RentBillHeader.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Rent bill not found");
  }

  return data as unknown as RentBillHeader;
}

export async function fetchRentBillByParty(
  organizationId: string,
  partyId: string
): Promise<RentBillHeader[]> {
  const { data, errors } =
    await client.models.RentBillHeader.listRentBillHeaderByPartyId({
      partyId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const filtered = (data || []).filter(
    (b) => b.organizationId === organizationId
  );

  return filtered as unknown as RentBillHeader[];
}

export async function fetchUnpaidBillsByParty(
  organizationId: string,
  partyId: string
): Promise<RentBillHeader[]> {
  const bills = await fetchRentBillByParty(organizationId, partyId);
  return bills.filter(
    (b) =>
      b.status &&
      ["CONFIRMED", "PARTIAL_PAID", "OVERDUE"].includes(b.status) &&
      b.balanceAmount > 0
  );
}

export async function createRentBillHeader(
  input: CreateRentBillHeaderInput
): Promise<RentBillHeader> {
  const { data, errors } = await client.models.RentBillHeader.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create rent bill");
  }

  return data as unknown as RentBillHeader;
}

export async function updateRentBillHeader(
  input: UpdateRentBillHeaderInput
): Promise<RentBillHeader> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.RentBillHeader.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update rent bill");
  }

  return data as unknown as RentBillHeader;
}

export async function deleteRentBillHeader(id: string): Promise<void> {
  const { errors } = await client.models.RentBillHeader.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Rent Bill Items ====================

export async function fetchRentBillItems(
  rentBillId: string
): Promise<RentBillItem[]> {
  const { data, errors } =
    await client.models.RentBillItem.listRentBillItemByRentBillId({
      rentBillId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as RentBillItem[];
}

export async function createRentBillItem(
  input: CreateRentBillItemInput
): Promise<RentBillItem> {
  const { data, errors } = await client.models.RentBillItem.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create rent bill item");
  }

  return data as unknown as RentBillItem;
}

export async function deleteRentBillItem(id: string): Promise<void> {
  const { errors } = await client.models.RentBillItem.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Price Breakup ====================

export async function fetchPriceBreakups(
  rentBillId: string
): Promise<PriceBreakup[]> {
  const { data, errors } =
    await client.models.PriceBreakup.listPriceBreakupByRentBillId({
      rentBillId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as PriceBreakup[];
}

export async function createPriceBreakup(
  input: CreatePriceBreakupInput
): Promise<PriceBreakup> {
  const { data, errors } = await client.models.PriceBreakup.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create price breakup");
  }

  return data as unknown as PriceBreakup;
}

export async function deletePriceBreakup(id: string): Promise<void> {
  const { errors } = await client.models.PriceBreakup.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Combined Operations ====================

export async function getNextRentBillNo(
  organizationId: string
): Promise<string> {
  const bills = await fetchRentBillList(organizationId);
  return getNextBillNo(bills, "KB");
}

export async function createRentBill(
  organizationId: string,
  formInput: RentBillFormInput
): Promise<RentBillHeader> {
  // Calculate total rent amount
  const totalRentAmount = formInput.items.reduce(
    (sum, item) => sum + item.rentAmount,
    0
  );

  // Calculate total charges from breakup
  const chargesByComponent = formInput.charges.reduce(
    (acc, charge) => {
      acc[charge.component] = (acc[charge.component] || 0) + charge.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  // Calculate bill amounts with GST
  const gstType = formInput.gstType || "INTRA_STATE";
  const billAmounts = calculateBillAmounts({
    rentAmount: totalRentAmount,
    loadingCharges: chargesByComponent["LOADING"] || 0,
    unloadingCharges: chargesByComponent["UNLOADING"] || 0,
    dalaCharges: chargesByComponent["DALA"] || 0,
    kataiCharges: chargesByComponent["KATAI"] || 0,
    insuranceAmount: chargesByComponent["INSURANCE"] || 0,
    reloadCharges: chargesByComponent["RELOAD"] || 0,
    dumpCharges: chargesByComponent["DUMP"] || 0,
    otherCharges: chargesByComponent["OTHER"] || 0,
    discountAmount: formInput.discountAmount || 0,
    gstType,
    gstRate: formInput.cgstRate
      ? formInput.cgstRate * 2
      : formInput.igstRate || 18,
    tdsRate: formInput.tdsRate,
    applyTds: (formInput.tdsRate || 0) > 0,
  });

  // Round the total amount
  const { roundedAmount, roundOffAmount } = roundBillAmount(
    billAmounts.totalAmount
  );

  // Generate bill number
  const billNo = await getNextRentBillNo(organizationId);

  // Create header
  const header = await createRentBillHeader({
    organizationId,
    billNo,
    billDate: formInput.billDate,
    partyId: formInput.partyId,
    partyName: formInput.partyName,
    partyVillage: formInput.partyVillage,
    partyGstin: formInput.partyGstin,
    partyState: formInput.partyState,
    gstType,
    rentAmount: totalRentAmount,
    loadingCharges: chargesByComponent["LOADING"] || 0,
    unloadingCharges: chargesByComponent["UNLOADING"] || 0,
    dalaCharges: chargesByComponent["DALA"] || 0,
    kataiCharges: chargesByComponent["KATAI"] || 0,
    insuranceAmount: chargesByComponent["INSURANCE"] || 0,
    reloadCharges: chargesByComponent["RELOAD"] || 0,
    dumpCharges: chargesByComponent["DUMP"] || 0,
    otherCharges: chargesByComponent["OTHER"] || 0,
    taxableAmount: billAmounts.taxableAmount,
    cgstRate: billAmounts.cgstRate,
    cgstAmount: billAmounts.cgstAmount,
    sgstRate: billAmounts.sgstRate,
    sgstAmount: billAmounts.sgstAmount,
    igstRate: billAmounts.igstRate,
    igstAmount: billAmounts.igstAmount,
    discountAmount: formInput.discountAmount || 0,
    tdsRate: billAmounts.tdsRate,
    tdsAmount: billAmounts.tdsAmount,
    totalAmount: billAmounts.totalAmount,
    roundedAmount,
    roundOffAmount,
    amountInWords: convertAmountToWords(roundedAmount),
    status: "DRAFT",
    paidAmount: 0,
    balanceAmount: roundedAmount,
    dueDate: formInput.dueDate,
    notes: formInput.notes,
  });

  // Create line items
  for (const item of formInput.items) {
    await createRentBillItem({
      organizationId,
      rentBillId: header.id,
      amadId: item.amadId,
      amadNo: item.amadNo,
      amadDate: item.amadDate,
      commodityName: item.commodityName,
      pkt1: item.pkt1 || 0,
      pkt2: item.pkt2 || 0,
      pkt3: item.pkt3 || 0,
      bags: item.bags,
      weightQtl: item.weightQtl,
      arrivalDate: item.arrivalDate,
      dispatchDate: item.dispatchDate,
      storageDays: item.storageDays,
      graceDays: item.graceDays,
      billableDays: item.billableDays,
      ratePerQtl: item.ratePerQtl,
      ratePerBag: item.ratePerBag || 0,
      rentAmount: item.rentAmount,
    });
  }

  // Create price breakups
  for (const charge of formInput.charges) {
    await createPriceBreakup({
      organizationId,
      rentBillId: header.id,
      component: charge.component,
      description: charge.description,
      rate: charge.rate,
      quantity: charge.quantity,
      unit: charge.unit,
      amount: charge.amount,
      hsnCode: charge.hsnCode,
    });
  }

  return header;
}

export async function confirmRentBill(
  id: string,
  confirmedBy: string
): Promise<RentBillHeader> {
  const bill = await fetchRentBillById(id);

  if (bill.status !== "DRAFT") {
    throw new Error("Only draft bills can be confirmed");
  }

  return updateRentBillHeader({
    id,
    status: "CONFIRMED",
    confirmedAt: new Date().toISOString(),
    confirmedBy,
  });
}

export async function cancelRentBill(
  id: string,
  cancelledBy: string,
  cancelReason?: string
): Promise<RentBillHeader> {
  const bill = await fetchRentBillById(id);

  if (bill.status === "PAID") {
    throw new Error("Cannot cancel a paid bill");
  }

  if (bill.paidAmount > 0) {
    throw new Error("Cannot cancel a bill with partial payment");
  }

  return updateRentBillHeader({
    id,
    status: "CANCELLED",
    cancelledAt: new Date().toISOString(),
    cancelledBy,
    cancelReason,
  });
}

// ==================== Billable Amads ====================

export async function fetchBillableAmads(
  organizationId: string,
  partyId?: string
): Promise<BillableAmad[]> {
  // Fetch all Amads for the organization
  const { data: amads, errors } =
    await client.models.Amad.listAmadByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  // Filter to dispatched/partial dispatched Amads
  const dispatchedAmads = (amads || []).filter(
    (a) =>
      a.status &&
      ["DISPATCHED", "PARTIAL_DISPATCH"].includes(a.status) &&
      (!partyId || a.partyName === partyId) // Filter by party if provided
  );

  // Get all existing bill items to exclude already billed Amads
  const bills = await fetchRentBillList(organizationId);
  const billedAmadIds = new Set<string>();

  for (const bill of bills) {
    if (bill.status !== "CANCELLED") {
      const items = await fetchRentBillItems(bill.id);
      items.forEach((item) => billedAmadIds.add(item.amadId));
    }
  }

  // Map to BillableAmad format, excluding already billed
  const billableAmads: BillableAmad[] = dispatchedAmads
    .filter((a) => !billedAmadIds.has(a.id))
    .map((a) => {
      const storageDays = calculateStorageDays(a.date, new Date().toISOString());
      const graceDays = a.graceDays || 0;
      const billableDays = Math.max(0, storageDays - graceDays);
      const estimatedRent = ((a.totalWeight || 0) * (a.rentRate || 0) * billableDays) / 30;

      return {
        id: a.id,
        amadNo: a.amadNo,
        date: a.date,
        partyName: a.partyName,
        commodityName: a.commodityName || undefined,
        variety: a.variety || undefined,
        pkt1: a.pkt1 || 0,
        pkt2: a.pkt2 || 0,
        pkt3: a.pkt3 || 0,
        totalPackets: a.totalPackets || 0,
        totalWeight: a.totalWeight || 0,
        storageDays,
        graceDays,
        billableDays,
        estimatedRent: Math.round(estimatedRent * 100) / 100,
        status: a.status || "PENDING",
        dispatchDate: undefined, // Would need to fetch from Rent table
      };
    });

  return billableAmads;
}

// ==================== Statistics ====================

export async function fetchBillingStats(
  organizationId: string
): Promise<BillingStats> {
  const bills = await fetchRentBillList(organizationId);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfMonthStr = startOfMonth.toISOString().split("T")[0];

  // Filter bills this month
  const billsThisMonth = bills.filter(
    (b) => b.billDate >= startOfMonthStr && b.status !== "CANCELLED"
  );

  // Pending bills (confirmed but not paid)
  const pendingBills = bills.filter(
    (b) =>
      b.status &&
      ["CONFIRMED", "PARTIAL_PAID", "OVERDUE"].includes(b.status) &&
      b.balanceAmount > 0
  );

  // Calculate GST payable this month
  const gstPayable = billsThisMonth.reduce(
    (sum, b) => sum + b.cgstAmount + b.sgstAmount + b.igstAmount,
    0
  );

  return {
    billsThisMonth: billsThisMonth.length,
    billsThisMonthAmount: billsThisMonth.reduce(
      (sum, b) => sum + b.roundedAmount,
      0
    ),
    pendingBills: pendingBills.length,
    pendingAmount: pendingBills.reduce((sum, b) => sum + b.balanceAmount, 0),
    collectionsThisMonth: billsThisMonth.reduce(
      (sum, b) => sum + b.paidAmount,
      0
    ),
    gstPayable,
  };
}

export async function fetchBillingTrend(
  organizationId: string,
  months: number = 6
): Promise<BillingTrendData[]> {
  const bills = await fetchRentBillList(organizationId);

  const now = new Date();
  const trends: BillingTrendData[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const monthStartStr = monthStart.toISOString().split("T")[0];
    const monthEndStr = monthEnd.toISOString().split("T")[0];

    const monthBills = bills.filter(
      (b) =>
        b.billDate >= monthStartStr &&
        b.billDate <= monthEndStr &&
        b.status !== "CANCELLED"
    );

    const monthName = monthStart.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });

    trends.push({
      month: monthName,
      billed: monthBills.reduce((sum, b) => sum + b.roundedAmount, 0),
      collected: monthBills.reduce((sum, b) => sum + b.paidAmount, 0),
    });
  }

  return trends;
}
