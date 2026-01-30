// ==================== Deal/Sauda Calculations ====================

/**
 * Calculate deal amount based on quantity and rate
 * @param quantity - Number of bags
 * @param rate - Rate per quintal (Rs)
 * @param weightPerBag - Weight per bag in kg (default 50kg)
 * @returns Total amount in Rs
 */
export function calculateDealAmount(
  quantity: number,
  rate: number,
  weightPerBag: number = 50
): number {
  // Convert bags to quintals (1 quintal = 100 kg)
  const quintals = (quantity * weightPerBag) / 100;
  return quintals * rate;
}

/**
 * Calculate progress percentage for a deal
 */
export function calculateDealProgress(
  dispatchedQty: number,
  totalQty: number
): number {
  if (totalQty <= 0) return 0;
  return Math.min(100, Math.round((dispatchedQty / totalQty) * 100));
}

/**
 * Calculate balance quantity for a deal
 */
export function calculateBalanceQty(
  totalQty: number,
  dispatchedQty: number
): number {
  return Math.max(0, totalQty - dispatchedQty);
}

// ==================== Weight Calculations ====================

/**
 * Calculate total weight from packet counts
 * @param pkt1 - Count of PKT1 packets
 * @param pkt2 - Count of PKT2 packets
 * @param pkt3 - Count of PKT3 packets
 * @param wt1 - Weight per PKT1 in kg (default 50)
 * @param wt2 - Weight per PKT2 in kg (default 60)
 * @param wt3 - Weight per PKT3 in kg (default 100)
 * @returns Total weight in kg
 */
export function calculateTotalWeight(
  pkt1: number,
  pkt2: number,
  pkt3: number,
  wt1: number = 50,
  wt2: number = 60,
  wt3: number = 100
): number {
  return pkt1 * wt1 + pkt2 * wt2 + pkt3 * wt3;
}

/**
 * Calculate total packets
 */
export function calculateTotalPackets(
  pkt1: number,
  pkt2: number,
  pkt3: number
): number {
  return (pkt1 || 0) + (pkt2 || 0) + (pkt3 || 0);
}

/**
 * Convert weight to quintals
 */
export function toQuintals(weightKg: number): number {
  return weightKg / 100;
}

// ==================== Grading Calculations ====================

/**
 * Calculate grading output totals and percentages
 */
export function calculateGradingTotals(grades: {
  motaBags: number;
  chattaBags: number;
  beejBags: number;
  mixBags: number;
  gullaBags: number;
}) {
  const total =
    (grades.motaBags || 0) +
    (grades.chattaBags || 0) +
    (grades.beejBags || 0) +
    (grades.mixBags || 0) +
    (grades.gullaBags || 0);

  const percentages = {
    mota: total > 0 ? ((grades.motaBags || 0) / total) * 100 : 0,
    chatta: total > 0 ? ((grades.chattaBags || 0) / total) * 100 : 0,
    beej: total > 0 ? ((grades.beejBags || 0) / total) * 100 : 0,
    mix: total > 0 ? ((grades.mixBags || 0) / total) * 100 : 0,
    gulla: total > 0 ? ((grades.gullaBags || 0) / total) * 100 : 0,
  };

  return { total, percentages };
}

/**
 * Calculate grading charges
 */
export function calculateGradingCharges(
  bagsGraded: number,
  ratePerBag: number
): number {
  return bagsGraded * ratePerBag;
}

/**
 * Check if grading is balanced (input = output)
 */
export function isGradingBalanced(
  bagsGraded: number,
  grades: {
    motaBags: number;
    chattaBags: number;
    beejBags: number;
    mixBags: number;
    gullaBags: number;
  }
): boolean {
  const { total } = calculateGradingTotals(grades);
  return total === bagsGraded;
}

// ==================== Gate Pass Calculations ====================

/**
 * Calculate gate pass totals from details
 */
export function calculateGatePassTotals(
  details: Array<{
    pkt1: number;
    pkt2: number;
    pkt3: number;
    weight?: number;
    rate?: number;
  }>
) {
  let totalPkt1 = 0;
  let totalPkt2 = 0;
  let totalPkt3 = 0;
  let totalWeight = 0;
  let totalAmount = 0;

  for (const detail of details) {
    totalPkt1 += detail.pkt1 || 0;
    totalPkt2 += detail.pkt2 || 0;
    totalPkt3 += detail.pkt3 || 0;
    totalWeight += detail.weight || 0;

    if (detail.rate) {
      const detailTotal = (detail.pkt1 || 0) + (detail.pkt2 || 0) + (detail.pkt3 || 0);
      totalAmount += detailTotal * detail.rate;
    }
  }

  const totalPackets = totalPkt1 + totalPkt2 + totalPkt3;

  return {
    totalPkt1,
    totalPkt2,
    totalPkt3,
    totalPackets,
    totalWeight,
    totalAmount,
  };
}

// ==================== Due Date Calculations ====================

/**
 * Calculate due date from sauda date and due days
 */
export function calculateDueDate(saudaDate: string, dueDays: number): string {
  const date = new Date(saudaDate);
  date.setDate(date.getDate() + dueDays);
  return date.toISOString().split("T")[0];
}

/**
 * Check if a deal is overdue
 */
export function isDealOverdue(dueDate: string | null | undefined): boolean {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

/**
 * Calculate days until due
 */
export function daysUntilDue(dueDate: string | null | undefined): number | null {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diff = due.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
