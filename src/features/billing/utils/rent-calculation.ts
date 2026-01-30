/**
 * Calculate billable days after subtracting grace period
 */
export function calculateBillableDays(
  arrivalDate: Date | string,
  dispatchDate: Date | string | null | undefined,
  graceDays: number = 0
): number {
  const arrival =
    typeof arrivalDate === "string" ? new Date(arrivalDate) : arrivalDate;
  const dispatch = dispatchDate
    ? typeof dispatchDate === "string"
      ? new Date(dispatchDate)
      : dispatchDate
    : new Date(); // Use today if not dispatched

  const diffTime = dispatch.getTime() - arrival.getTime();
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Billable days = Total days - Grace days (minimum 0)
  return Math.max(0, totalDays - graceDays);
}

/**
 * Calculate storage days (total days without grace deduction)
 */
export function calculateStorageDays(
  arrivalDate: Date | string,
  dispatchDate: Date | string | null | undefined
): number {
  const arrival =
    typeof arrivalDate === "string" ? new Date(arrivalDate) : arrivalDate;
  const dispatch = dispatchDate
    ? typeof dispatchDate === "string"
      ? new Date(dispatchDate)
      : dispatchDate
    : new Date();

  const diffTime = dispatch.getTime() - arrival.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate rent based on weight (per quintal)
 */
export function calculateRentByWeight(
  weightQtl: number,
  days: number,
  ratePerQtl: number,
  rentPeriod: "MONTHLY" | "DAILY" | "SEASONALLY" = "MONTHLY"
): number {
  switch (rentPeriod) {
    case "DAILY":
      return weightQtl * ratePerQtl * days;
    case "SEASONALLY":
      return weightQtl * ratePerQtl; // Full season rate
    case "MONTHLY":
    default:
      // Monthly rate: (weight × rate × days) / 30
      return (weightQtl * ratePerQtl * days) / 30;
  }
}

/**
 * Calculate rent based on bags/packets
 */
export function calculateRentByBags(
  bags: number,
  days: number,
  ratePerBag: number,
  rentPeriod: "MONTHLY" | "DAILY" | "SEASONALLY" = "MONTHLY"
): number {
  switch (rentPeriod) {
    case "DAILY":
      return bags * ratePerBag * days;
    case "SEASONALLY":
      return bags * ratePerBag;
    case "MONTHLY":
    default:
      return (bags * ratePerBag * days) / 30;
  }
}

/**
 * Calculate rent for a single Amad/lot
 */
export function calculateAmadRent(params: {
  weightQtl: number;
  bags: number;
  storageDays: number;
  graceDays: number;
  ratePerQtl: number;
  ratePerBag?: number;
  rentBasis: "QUINTAL" | "PACKET" | "WEIGHT";
  rentPeriod?: "MONTHLY" | "DAILY" | "SEASONALLY";
}): { billableDays: number; rentAmount: number } {
  const {
    weightQtl,
    bags,
    storageDays,
    graceDays,
    ratePerQtl,
    ratePerBag = 0,
    rentBasis,
    rentPeriod = "MONTHLY",
  } = params;

  const billableDays = Math.max(0, storageDays - graceDays);

  let rentAmount = 0;

  switch (rentBasis) {
    case "QUINTAL":
    case "WEIGHT":
      rentAmount = calculateRentByWeight(
        weightQtl,
        billableDays,
        ratePerQtl,
        rentPeriod
      );
      break;
    case "PACKET":
      rentAmount = calculateRentByBags(
        bags,
        billableDays,
        ratePerBag || ratePerQtl,
        rentPeriod
      );
      break;
    default:
      rentAmount = calculateRentByWeight(
        weightQtl,
        billableDays,
        ratePerQtl,
        rentPeriod
      );
  }

  return {
    billableDays,
    rentAmount: Math.round(rentAmount * 100) / 100, // Round to 2 decimals
  };
}

/**
 * Calculate total rent for multiple Amads
 */
export function calculateTotalRent(
  items: {
    weightQtl: number;
    bags: number;
    storageDays: number;
    graceDays: number;
    ratePerQtl: number;
    ratePerBag?: number;
    rentBasis?: "QUINTAL" | "PACKET" | "WEIGHT";
  }[],
  rentPeriod: "MONTHLY" | "DAILY" | "SEASONALLY" = "MONTHLY"
): number {
  return items.reduce((total, item) => {
    const { rentAmount } = calculateAmadRent({
      ...item,
      rentBasis: item.rentBasis || "QUINTAL",
      rentPeriod,
    });
    return total + rentAmount;
  }, 0);
}

/**
 * Calculate monthly rent summary
 */
export function calculateMonthlyRentSummary(
  weightQtl: number,
  ratePerQtl: number,
  months: number
): number {
  return weightQtl * ratePerQtl * months;
}

/**
 * Round amount for billing (Indian rounding rules)
 */
export function roundBillAmount(amount: number): {
  roundedAmount: number;
  roundOffAmount: number;
} {
  const roundedAmount = Math.round(amount);
  const roundOffAmount = roundedAmount - amount;

  return {
    roundedAmount,
    roundOffAmount: Math.round(roundOffAmount * 100) / 100,
  };
}
