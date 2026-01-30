import type { InterestChartEntry } from "../types";
import {
  calculatePeriodInterest,
  sumInterestDetails,
} from "../utils/calculations";
import { fetchLoanLedger, recordInterestLedger, getPartyLoanBalance } from "./loan-ledger";
import { fetchLoanList } from "./loan-amounts";
import { fetchAdvanceList } from "./advances";

// ==================== Interest Calculation ====================

/**
 * Calculate interest for a single party over a date range
 */
export async function calculateInterestForParty(
  organizationId: string,
  partyId: string,
  partyName: string,
  fromDate: string,
  toDate: string,
  ratePerMonth: number
): Promise<InterestChartEntry> {
  const ledger = await fetchLoanLedger(organizationId, partyId);

  // Filter transactions before or within the period
  const relevantTransactions = ledger.filter((l) => l.date <= toDate);

  // Calculate opening balance (balance at start of period)
  const openingTransactions = relevantTransactions.filter((l) => l.date < fromDate);
  const openingBalance =
    openingTransactions.length > 0
      ? openingTransactions[openingTransactions.length - 1].balance
      : 0;

  // Calculate disbursements and recoveries in the period
  const periodTransactions = relevantTransactions.filter(
    (l) => l.date >= fromDate && l.date <= toDate
  );

  const disbursements = periodTransactions
    .filter((l) => l.transactionType === "DISBURSEMENT")
    .reduce((sum, l) => sum + l.debitAmount, 0);

  const recoveries = periodTransactions
    .filter((l) => l.transactionType === "REPAYMENT")
    .reduce((sum, l) => sum + l.creditAmount, 0);

  // Calculate closing balance
  const closingBalance =
    relevantTransactions.length > 0
      ? relevantTransactions[relevantTransactions.length - 1].balance
      : 0;

  // Calculate period-wise interest details
  const details = calculatePeriodInterest(
    relevantTransactions,
    new Date(fromDate),
    new Date(toDate),
    ratePerMonth
  );

  const interest = sumInterestDetails(details);

  return {
    partyId,
    partyName,
    openingBalance,
    disbursements,
    recoveries,
    closingBalance,
    interest,
    details,
  };
}

/**
 * Generate interest chart for all parties with loan balances
 */
export async function generateInterestChart(
  organizationId: string,
  fromDate: string,
  toDate: string,
  ratePerMonth: number
): Promise<InterestChartEntry[]> {
  // Get all loans and advances to find parties with balances
  const [loans, advances] = await Promise.all([
    fetchLoanList(organizationId),
    fetchAdvanceList(organizationId),
  ]);

  // Get unique party IDs with names
  const partyMap = new Map<string, string>();

  for (const loan of loans) {
    if (loan.outstandingBalance > 0 && loan.partyName) {
      partyMap.set(loan.partyId, loan.partyName);
    }
  }

  for (const advance of advances) {
    if (advance.status === "PENDING" && advance.partyName) {
      partyMap.set(advance.partyId, advance.partyName);
    }
  }

  // Calculate interest for each party
  const results: InterestChartEntry[] = [];

  for (const [partyId, partyName] of partyMap) {
    const entry = await calculateInterestForParty(
      organizationId,
      partyId,
      partyName,
      fromDate,
      toDate,
      ratePerMonth
    );

    // Only include parties with non-zero balances or interest
    if (entry.closingBalance > 0 || entry.interest > 0) {
      results.push(entry);
    }
  }

  // Sort by party name
  return results.sort((a, b) => a.partyName.localeCompare(b.partyName));
}

/**
 * Post calculated interest to ledgers
 */
export async function postInterest(
  organizationId: string,
  entries: InterestChartEntry[],
  postDate: string
): Promise<void> {
  for (const entry of entries) {
    if (entry.interest > 0) {
      const currentBalance = await getPartyLoanBalance(organizationId, entry.partyId);

      await recordInterestLedger(
        organizationId,
        entry.partyId,
        postDate,
        entry.interest,
        currentBalance,
        entry.details[0]?.rate ?? 0,
        {
          narration: `Interest for period ${entry.details[0]?.fromDate} to ${entry.details[entry.details.length - 1]?.toDate}`,
        }
      );
    }
  }
}

/**
 * Calculate interest summary for organization
 */
export async function getInterestSummary(
  organizationId: string,
  fromDate: string,
  toDate: string,
  ratePerMonth: number
): Promise<{
  totalOutstanding: number;
  totalInterest: number;
  partyCount: number;
}> {
  const chart = await generateInterestChart(
    organizationId,
    fromDate,
    toDate,
    ratePerMonth
  );

  return {
    totalOutstanding: chart.reduce((sum, e) => sum + e.closingBalance, 0),
    totalInterest: chart.reduce((sum, e) => sum + e.interest, 0),
    partyCount: chart.length,
  };
}

/**
 * Get accumulated interest for a party (not yet posted)
 */
export async function getAccumulatedInterest(
  organizationId: string,
  partyId: string,
  partyName: string,
  ratePerMonth: number
): Promise<number> {
  const ledger = await fetchLoanLedger(organizationId, partyId);
  if (ledger.length === 0) return 0;

  // Find last interest posting
  const lastInterestEntry = [...ledger]
    .reverse()
    .find((l) => l.transactionType === "INTEREST");

  const fromDate = lastInterestEntry
    ? new Date(lastInterestEntry.date)
    : new Date(ledger[0].date);

  const toDate = new Date();

  const entry = await calculateInterestForParty(
    organizationId,
    partyId,
    partyName,
    fromDate.toISOString().split("T")[0],
    toDate.toISOString().split("T")[0],
    ratePerMonth
  );

  return entry.interest;
}
