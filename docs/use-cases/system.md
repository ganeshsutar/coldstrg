# System (Automated) Use Cases

This document covers use cases performed automatically by the system without direct user interaction.

**Primary Actor:** System

[Back to Use Cases Overview](../use-cases.md)

---

## Table of Contents

### Financial Transactions
1. [UC-14: Calculate Interest](#uc-14-calculate-interest)

---

## Financial Transactions

### UC-14: Calculate Interest

**Description:** System calculates interest on outstanding balances.

**Primary Actor:** System

**Trigger:** End of month, on-demand, or during settlement

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | System | Identifies parties with interest-bearing balances |
| 2 | System | For each party, calculates: |
| | | - Interest on opening balance |
| | | - Interest on rent outstanding |
| | | - Interest on bardana advances |
| | | - Interest on loans |
| 3 | System | Applies configured interest rate |
| 4 | System | Creates interest entries in ledger |
| 5 | System | Updates party balance |

**Business Rules:**
- Interest calculated based on party's interest_rate_pm
- Compound interest based on configuration
- Interest calculation starts from charge_interest_from date

**Postconditions:**
- Interest calculated and recorded
- Party balances updated

**Related Entities:** Party, Party Ledger

---

[Back to Use Cases Overview](../use-cases.md)
