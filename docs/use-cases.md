# Cold Storage - Use Cases

This document describes all use cases for the Cold Storage Management System, organized by module and actor.

---

## Table of Contents

1. [Actors](#actors)
2. [Use Case Overview](#use-case-overview)
3. [Party Management](#1-party-management)
4. [Stock Management](#2-stock-management)
5. [Financial Transactions](#3-financial-transactions)
6. [Deals & Trading](#4-deals--trading)
7. [Billing & Receipts](#5-billing--receipts)
8. [Reports & Ledgers](#6-reports--ledgers)
9. [Facility Management](#7-facility-management)
10. [System Administration](#8-system-administration)

---

## Actors

| Actor | Description | Primary Responsibilities |
|-------|-------------|-------------------------|
| **Operator** | Primary system user (staff) | Day-to-day data entry, transactions, reports |
| **Manager** | Cold storage manager | Approvals, reports, configuration |
| **Kissan (Farmer)** | Stores goods in cold storage | Deposits goods, pays rent, withdraws goods |
| **Vyapari (Trader)** | Buys goods from farmers | Purchases goods, makes payments |
| **Accountant** | Financial operations | Vouchers, ledgers, settlements |
| **System** | Automated processes | Calculations, alerts, scheduled tasks |

---

## Use Case Overview

| # | Use Case | Module | Primary Actor |
|---|----------|--------|---------------|
| UC-01 | Register New Party | Party Management | Operator |
| UC-02 | Update Party Information | Party Management | Operator |
| UC-03 | Search and View Party | Party Management | Operator |
| UC-04 | Set Party Financial Limits | Party Management | Manager |
| UC-05 | Record Stock Arrival (Amad) | Stock Management | Operator |
| UC-06 | Record Stock Dispatch (Nikasi) | Stock Management | Operator |
| UC-07 | Transfer Stock Between Rooms | Stock Management | Operator |
| UC-08 | View Stock Summary | Stock Management | Operator |
| UC-09 | Search Lot | Stock Management | Operator |
| UC-10 | Create Payment Voucher | Financial | Accountant |
| UC-11 | Create Receipt Voucher | Financial | Accountant |
| UC-12 | Issue Bardana Advance | Financial | Operator |
| UC-13 | Adjust Bardana Against Stock | Financial | Operator |
| UC-14 | Calculate Interest | Financial | System |
| UC-15 | Create Sauda (Deal) | Trading | Operator |
| UC-16 | Execute Sauda | Trading | Operator |
| UC-17 | Cancel Sauda | Trading | Manager |
| UC-18 | Generate Chitti | Billing | Operator |
| UC-19 | Generate Nikasi Bill | Billing | Operator |
| UC-20 | Generate Cash Memo | Billing | Operator |
| UC-21 | View Party Ledger | Reports | Operator |
| UC-22 | View Cash Book | Reports | Accountant |
| UC-23 | Generate Balance Sheet | Reports | Manager |
| UC-24 | View Party Balance Summary | Reports | Operator |
| UC-25 | Record Meter Reading | Facility | Operator |
| UC-26 | Record Temperature | Facility | Operator |
| UC-27 | Configure Commodity | Administration | Manager |
| UC-28 | Manage Storage Rooms | Administration | Manager |
| UC-29 | End of Season Settlement | Financial | Accountant |
| UC-30 | Generate Sample Slip | Stock Management | Operator |

---

## 1. Party Management

### UC-01: Register New Party

**Description:** Create a new party account for a farmer, trader, or other stakeholder.

**Primary Actor:** Operator

**Preconditions:**
- Operator is logged into the system
- Party does not already exist in the system

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Operator | Selects "New Party" from sidebar or Master menu |
| 2 | System | Displays Account Master form with auto-generated Account No |
| 3 | Operator | Selects Account Type (Kissan/Vyapari/Staff/etc.) |
| 4 | Operator | Enters party name and personal details |
| 5 | Operator | Enters name in Hindi using on-screen keyboard (optional) |
| 6 | Operator | Selects Subgroup category |
| 7 | Operator | Selects or enters Village |
| 8 | Operator | Enters contact information (phone, email, Aadhar, PAN) |
| 9 | Operator | Enters financial settings (opening balance, limits, rates) |
| 10 | Operator | Enters bank details (optional) |
| 11 | Operator | Clicks Save |
| 12 | System | Validates all required fields |
| 13 | System | Creates party record and displays confirmation |

**Alternate Flows:**

| Alt | Condition | Action |
|-----|-----------|--------|
| 4a | Party name already exists | System warns, allows continue with different account |
| 12a | Validation fails | System highlights errors, returns to form |
| 6a | New village needed | Operator enters new village name, system creates it |

**Postconditions:**
- New party record created in the system
- Party can now be used in transactions

**Related Entities:** Party, Village

---

### UC-02: Update Party Information

**Description:** Modify existing party details, financial settings, or bank information.

**Primary Actor:** Operator

**Preconditions:**
- Party exists in the system

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Operator | Searches for party using UC-03 |
| 2 | Operator | Clicks Edit or double-clicks party record |
| 3 | System | Displays Account Master form with existing data |
| 4 | Operator | Modifies required fields |
| 5 | Operator | Clicks Save |
| 6 | System | Validates changes |
| 7 | System | Updates party record with audit trail |

**Alternate Flows:**

| Alt | Condition | Action |
|-----|-----------|--------|
| 4a | Changing account type | System warns if transactions exist |
| 6a | Critical field changed | System logs change for audit |

**Postconditions:**
- Party record updated
- Audit trail maintained

**Related Entities:** Party

---

### UC-03: Search and View Party

**Description:** Find and view party details using various search criteria.

**Primary Actor:** Operator

**Preconditions:**
- At least one party exists in the system

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Operator | Opens Account List from menu or searches from any party field |
| 2 | System | Displays searchable list of all parties |
| 3 | Operator | Enters search criteria (name, village, account no, phone) |
| 4 | System | Filters list in real-time |
| 5 | Operator | Applies filters (Under category, Village, Type) |
| 6 | System | Refines results based on filters |
| 7 | Operator | Selects party from list |
| 8 | System | Displays party details or populates calling form |

**Alternate Flows:**

| Alt | Condition | Action |
|-----|-----------|--------|
| 4a | No results found | System displays "No parties found" message |
| 7a | Print List requested | System generates printable party list |

**Postconditions:**
- Party information displayed or selected for use

**Related Entities:** Party, Village

---

### UC-04: Set Party Financial Limits

**Description:** Configure credit limits, interest rates, and due days for a party.

**Primary Actor:** Manager

**Preconditions:**
- Party exists in the system
- Manager has appropriate permissions

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Manager | Opens party record (UC-02) |
| 2 | Manager | Navigates to Financial Settings section |
| 3 | Manager | Sets DR Limit (maximum debit allowed) |
| 4 | Manager | Sets Sauda Limit (transaction limit) |
| 5 | Manager | Sets Due Days (payment terms) |
| 6 | Manager | Sets Interest Rate per month |
| 7 | Manager | Configures interest calculation on Bardana |
| 8 | Manager | Clicks Save |
| 9 | System | Updates party financial settings |

**Business Rules:**
- DR Limit cannot be negative
- Interest rate typically ranges from 0-5% per month
- Due Days affects overdue calculations

**Postconditions:**
- Party financial limits configured
- Limits enforced in future transactions

**Related Entities:** Party

---

## 2. Stock Management

### UC-05: Record Stock Arrival (Amad)

**Description:** Record incoming goods from a farmer into cold storage.

**Primary Actor:** Operator

**Preconditions:**
- Party (Kissan) exists in the system
- Commodity is configured
- Storage room is available

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Operator | Selects "Inward" from sidebar or Transaction menu |
| 2 | System | Displays Amad entry form |
| 3 | Operator | Enters/selects date |
| 4 | Operator | Searches and selects Party (Kissan) |
| 5 | System | Displays party details and balance |
| 6 | Operator | Selects Commodity |
| 7 | Operator | Selects Room for storage |
| 8 | Operator | Enters Lot No (new or existing) |
| 9 | Operator | Enters Marka (brand/mark) if applicable |
| 10 | Operator | Enters number of Packets/Bags |
| 11 | Operator | Enters Weight (in quintals) |
| 12 | Operator | Selects Category (Seedhi/Dump) |
| 13 | Operator | Enters any reference number |
| 14 | Operator | Clicks Save |
| 15 | System | Creates/updates Lot record |
| 16 | System | Creates Stock Transaction (AMAD) |
| 17 | System | Updates party balance with rent liability |
| 18 | System | Generates Unloading Slip (optional) |

**Alternate Flows:**

| Alt | Condition | Action |
|-----|-----------|--------|
| 4a | New party needed | Operator uses UC-01 to create party |
| 8a | Adding to existing lot | System shows existing lot details |
| 14a | Bardana advance exists | System prompts to adjust (UC-13) |
| 15a | Room capacity exceeded | System warns but allows override |

**Business Rules:**
- Rent calculation starts from arrival date
- Grace period applies per commodity configuration
- Weight must be positive and reasonable for packet count

**Postconditions:**
- Lot created or updated
- Stock Transaction recorded
- Party balance updated
- Room occupancy updated

**Related Entities:** Party, Lot, Stock Transaction, Commodity, Room, Bardana

---

### UC-06: Record Stock Dispatch (Nikasi)

**Description:** Record outgoing goods from cold storage.

**Primary Actor:** Operator

**Preconditions:**
- Lot exists with available stock
- Party (Kissan - owner) exists

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Operator | Selects dispatch option or executes Sauda |
| 2 | System | Displays Nikasi entry form |
| 3 | Operator | Enters/selects date |
| 4 | Operator | Searches and selects Party (Kissan - owner) |
| 5 | System | Displays party's lots and available stock |
| 6 | Operator | Selects Lot to dispatch from |
| 7 | Operator | Enters number of Packets to dispatch |
| 8 | Operator | Enters Weight being dispatched |
| 9 | Operator | Selects Category (Seedhi/Katai) |
| 10 | Operator | Selects Vyapari (buyer) if applicable |
| 11 | Operator | Enters transport details |
| 12 | Operator | Clicks Save |
| 13 | System | Validates stock availability |
| 14 | System | Creates Stock Transaction (NIKASI) |
| 15 | System | Updates Lot (reduces quantity) |
| 16 | System | Calculates final rent |
| 17 | System | Generates Chitti (UC-18) |

**Alternate Flows:**

| Alt | Condition | Action |
|-----|-----------|--------|
| 7a | Requested > Available | System shows error, limits to available |
| 10a | Direct to Kissan | Vyapari field left empty |
| 15a | Lot fully dispatched | System marks Lot as CLOSED |

**Business Rules:**
- Cannot dispatch more than available stock
- Rent calculated up to dispatch date
- Partial dispatches allowed

**Postconditions:**
- Stock Transaction recorded
- Lot quantity reduced (may close lot)
- Rent finalized for dispatched quantity
- Chitti generated

**Related Entities:** Party (Kissan, Vyapari), Lot, Stock Transaction, Chitti

---

### UC-07: Transfer Stock Between Rooms (Reloading)

**Description:** Move stock from one storage room to another.

**Primary Actor:** Operator

**Preconditions:**
- Lot exists with stock in source room
- Target room is available

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Operator | Selects "Reloading" from Stock menu |
| 2 | System | Displays reloading form |
| 3 | Operator | Selects source Lot |
| 4 | System | Shows lot details and current room |
| 5 | Operator | Selects target Room |
| 6 | Operator | Enters quantity to transfer (Packets, Weight) |
| 7 | Operator | Enters reason/narration |
| 8 | Operator | Clicks Save |
| 9 | System | Creates Stock Transaction (NIKASI from source room) |
| 10 | System | Creates Stock Transaction (AMAD to target room) |
| 11 | System | Updates Lot room allocation |

**Business Rules:**
- No rent change during internal transfer
- Both transactions linked with same reference

**Postconditions:**
- Two stock transactions created (linked)
- Lot room allocation updated
- Room occupancies updated

**Related Entities:** Lot, Stock Transaction, Room

---

### UC-08: View Stock Summary

**Description:** View current stock position by commodity, room, or party.

**Primary Actor:** Operator

**Preconditions:**
- Stock transactions exist in the system

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Operator | Selects "Stock" from sidebar or menu |
| 2 | System | Displays Stock Summary screen |
| 3 | Operator | Selects filters (Commodity, Room, Lot No, Date) |
| 4 | System | Calculates and displays summary |
| 5 | System | Shows Amad totals (Seedhi, Dump) |
| 6 | System | Shows Nikasi totals (Seedhi, Katai) |
| 7 | System | Shows Balance (Packets, Weight, Pending Rent) |
| 8 | System | Shows room-wise breakdown |

**Alternate Flows:**

| Alt | Condition | Action |
|-----|-----------|--------|
| 3a | No filters | System shows total summary |
| 8a | Print requested | System generates printable report |

**Postconditions:**
- Stock summary displayed

**Related Entities:** Stock Transaction, Lot, Commodity, Room

---

### UC-09: Search Lot

**Description:** Find a specific lot by various criteria.

**Primary Actor:** Operator

**Preconditions:**
- Lots exist in the system

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Operator | Clicks "Lot Search" quick action |
| 2 | System | Displays lot search dialog |
| 3 | Operator | Enters search criteria (Lot No, Party, Marka, Room) |
| 4 | System | Searches and displays matching lots |
| 5 | Operator | Selects lot from results |
| 6 | System | Displays lot details and transaction history |

**Alternate Flows:**

| Alt | Condition | Action |
|-----|-----------|--------|
| 4a | No results | System displays "No lots found" |
| 6a | Map requested | System shows lot position in storage map |

**Postconditions:**
- Lot information displayed

**Related Entities:** Lot, Party, Room

---

### UC-30: Generate Sample Slip

**Description:** Generate a sample slip for quality inspection.

**Primary Actor:** Operator

**Preconditions:**
- Lot exists in the system

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Operator | Clicks "Sample Slip" quick action |
| 2 | System | Displays sample slip form |
| 3 | Operator | Selects or searches for Lot |
| 4 | Operator | Enters sample details |
| 5 | Operator | Clicks Print |
| 6 | System | Generates and prints sample slip |

**Postconditions:**
- Sample slip printed

**Related Entities:** Lot, Party

---

## 3. Financial Transactions

### UC-10: Create Payment Voucher

**Description:** Record a payment made to a party.

**Primary Actor:** Accountant

**Preconditions:**
- Party exists in the system
- Accountant has voucher entry permissions

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Accountant | Selects "Voucher" from sidebar or presses F5 (Payment) |
| 2 | System | Displays voucher entry form with type=PAYMENT |
| 3 | System | Auto-generates voucher number |
| 4 | Accountant | Enters/confirms date |
| 5 | Accountant | Searches and selects Party |
| 6 | System | Displays party balance summary |
| 7 | Accountant | Enters Credit amount (payment to party) |
| 8 | Accountant | Enters reference number (cheque no, etc.) |
| 9 | Accountant | Selects Marfat (through agent) if applicable |
| 10 | Accountant | Enters narration |
| 11 | Accountant | Clicks Save |
| 12 | System | Validates entry |
| 13 | System | Creates voucher record |
| 14 | System | Updates party balance (Credit) |
| 15 | System | Updates Cash Book |

**Alternate Flows:**

| Alt | Condition | Action |
|-----|-----------|--------|
| 7a | Amount exceeds limit | System warns but allows with override |
| 12a | Validation fails | System shows errors |

**Business Rules:**
- Voucher date cannot be future date
- Same-day vouchers can be edited
- All vouchers require narration

**Postconditions:**
- Payment voucher created
- Party balance credited
- Cash Book updated

**Related Entities:** Voucher, Party, Cash Book

---

### UC-11: Create Receipt Voucher

**Description:** Record a payment received from a party.

**Primary Actor:** Accountant

**Preconditions:**
- Party exists with outstanding balance

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Accountant | Selects "Voucher" from sidebar or presses F6 (Receipt) |
| 2 | System | Displays voucher entry form with type=RECEIPT |
| 3 | System | Auto-generates voucher number |
| 4 | Accountant | Enters/confirms date |
| 5 | Accountant | Searches and selects Party |
| 6 | System | Displays party balance (shows amount owed) |
| 7 | Accountant | Enters Debit amount (received from party) |
| 8 | Accountant | Enters reference number |
| 9 | Accountant | Enters narration |
| 10 | Accountant | Clicks Save |
| 11 | System | Creates voucher record |
| 12 | System | Updates party balance (Debit - reduces what party owes) |
| 13 | System | Updates Cash Book |

**Alternate Flows:**

| Alt | Condition | Action |
|-----|-----------|--------|
| 7a | Receipt > Balance | System warns (creating advance) |

**Postconditions:**
- Receipt voucher created
- Party balance reduced
- Cash Book updated

**Related Entities:** Voucher, Party, Cash Book

---

### UC-12: Issue Bardana Advance

**Description:** Issue advance payment for jute bags/packaging to a farmer.

**Primary Actor:** Operator

**Preconditions:**
- Party (Kissan) exists
- Party credit limit allows advance

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Operator | Selects "Bardana" from sidebar |
| 2 | System | Displays Advance for Bardana form |
| 3 | Operator | Enters date |
| 4 | Operator | Searches and selects Party |
| 5 | System | Shows party details and existing advances |
| 6 | Operator | Selects Bardana Type (JUTE, etc.) |
| 7 | Operator | Enters Rate per bag |
| 8 | Operator | Enters Quantity Issued |
| 9 | System | Calculates Debit Amount |
| 10 | Operator | Enters Interest rate per month |
| 11 | Operator | Enters Expected Arrival date |
| 12 | Operator | Enters Expected Bags to receive |
| 13 | Operator | Enters narration |
| 14 | Operator | Clicks Save |
| 15 | System | Creates Bardana advance record |
| 16 | System | Debits party account |

**Business Rules:**
- Interest starts accruing from issue date
- Expected bags used for tracking purposes
- Advance tracked until fully adjusted

**Postconditions:**
- Bardana advance record created
- Party balance debited
- Advance appears in pending list

**Related Entities:** Bardana, Party

---

### UC-13: Adjust Bardana Against Stock

**Description:** Adjust bardana advance when farmer brings goods to storage.

**Primary Actor:** Operator

**Preconditions:**
- Bardana advance exists for the party
- Stock arrival (Amad) is being recorded

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | System | During Amad (UC-05), detects pending bardana |
| 2 | System | Prompts operator to adjust bardana |
| 3 | Operator | Selects bardana advance(s) to adjust |
| 4 | Operator | Enters quantity received/adjusted |
| 5 | System | Calculates credit amount |
| 6 | System | Calculates interest till date |
| 7 | Operator | Confirms adjustment |
| 8 | System | Updates Bardana record (Qty Received) |
| 9 | System | Credits party account |
| 10 | System | Links adjustment to Amad transaction |

**Alternate Flows:**

| Alt | Condition | Action |
|-----|-----------|--------|
| 4a | Partial adjustment | Advance remains open for balance |
| 4b | Full adjustment | Advance marked as closed |

**Business Rules:**
- Interest calculated up to adjustment date
- Net (advance - interest) credited to party

**Postconditions:**
- Bardana record updated
- Party balance credited
- Adjustment linked to stock arrival

**Related Entities:** Bardana, Party, Stock Transaction

---

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

## 4. Deals & Trading

### UC-15: Create Sauda (Deal)

**Description:** Create a deal/agreement between a farmer and trader.

**Primary Actor:** Operator

**Preconditions:**
- Kissan (seller) exists with stock
- Vyapari (buyer) exists

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Operator | Selects "Sauda" from sidebar |
| 2 | System | Displays Sauda entry form |
| 3 | Operator | Enters date |
| 4 | Operator | Searches and selects Kissan (seller) |
| 5 | System | Shows Kissan's available lots and stock |
| 6 | Operator | Searches and selects Vyapari (buyer) |
| 7 | System | Shows Vyapari's credit limit and balance |
| 8 | Operator | Selects Commodity |
| 9 | Operator | Selects specific Lot (optional) |
| 10 | Operator | Enters Quantity (bags) |
| 11 | Operator | Enters Rate per unit |
| 12 | System | Calculates total amount |
| 13 | Operator | Enters due date (optional) |
| 14 | Operator | Enters deal terms/narration |
| 15 | Operator | Clicks Save |
| 16 | System | Validates against limits |
| 17 | System | Creates Sauda record with status=PENDING |

**Alternate Flows:**

| Alt | Condition | Action |
|-----|-----------|--------|
| 10a | Quantity > Available | System warns |
| 16a | Exceeds Vyapari's sauda limit | System requires manager approval |

**Business Rules:**
- Sauda creates obligation but not actual movement
- Quantity reserved but not locked
- Multiple saudas can exist for same lot

**Postconditions:**
- Sauda record created
- Appears in Pending Sauda dashboard
- Ready for execution

**Related Entities:** Sauda, Party (Kissan, Vyapari), Lot, Commodity

---

### UC-16: Execute Sauda

**Description:** Execute a pending deal by dispatching goods.

**Primary Actor:** Operator

**Preconditions:**
- Sauda exists with status=PENDING
- Stock available for dispatch

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Operator | Opens Pending Sauda from dashboard |
| 2 | Operator | Selects sauda to execute |
| 3 | System | Displays sauda details |
| 4 | Operator | Clicks Execute |
| 5 | System | Verifies stock availability |
| 6 | Operator | Confirms dispatch quantity |
| 7 | Operator | Enters transport details |
| 8 | System | Creates Nikasi transaction (UC-06) |
| 9 | System | Generates Chitti (UC-18) |
| 10 | System | Updates Sauda status (PARTIAL or COMPLETED) |
| 11 | System | Updates Vyapari balance (debit for purchase) |

**Alternate Flows:**

| Alt | Condition | Action |
|-----|-----------|--------|
| 5a | Stock insufficient | System allows partial execution |
| 6a | Partial quantity | Sauda status = PARTIAL |

**Postconditions:**
- Nikasi recorded
- Chitti generated
- Sauda status updated
- Vyapari account debited

**Related Entities:** Sauda, Stock Transaction, Chitti, Party

---

### UC-17: Cancel Sauda

**Description:** Cancel a pending deal.

**Primary Actor:** Manager

**Preconditions:**
- Sauda exists with status=PENDING
- No partial execution has occurred

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Manager | Opens Pending Sauda list |
| 2 | Manager | Selects sauda to cancel |
| 3 | Manager | Clicks Cancel |
| 4 | System | Prompts for cancellation reason |
| 5 | Manager | Enters reason |
| 6 | System | Updates Sauda status=CANCELLED |
| 7 | System | Logs cancellation with reason |

**Alternate Flows:**

| Alt | Condition | Action |
|-----|-----------|--------|
| 2a | Partial execution exists | System prevents cancellation |

**Postconditions:**
- Sauda marked as cancelled
- Removed from pending list
- Audit trail maintained

**Related Entities:** Sauda

---

## 5. Billing & Receipts

### UC-18: Generate Chitti (Delivery Receipt)

**Description:** Generate delivery slip when goods leave cold storage.

**Primary Actor:** Operator

**Trigger:** During Nikasi (UC-06) or Sauda execution (UC-16)

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | System | Initiates chitti generation during dispatch |
| 2 | System | Auto-populates from dispatch details |
| 3 | Operator | Verifies/enters Vyapari details |
| 4 | Operator | Enters Transport company |
| 5 | Operator | Enters Vehicle number |
| 6 | Operator | Enters delivery destination |
| 7 | Operator | Clicks Generate |
| 8 | System | Creates Chitti record |
| 9 | System | Assigns Chitti number |
| 10 | Operator | Prints Chitti |

**Postconditions:**
- Chitti record created
- Linked to Nikasi transaction
- Ready for printing

**Related Entities:** Chitti, Stock Transaction, Party

---

### UC-19: Generate Nikasi Bill

**Description:** Generate formal bill for dispatched goods.

**Primary Actor:** Operator

**Preconditions:**
- Nikasi transaction exists
- Billing details available

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Operator | Selects "Nikasi Bill" from sidebar |
| 2 | System | Displays bill generation form |
| 3 | Operator | Selects dispatch transactions to bill |
| 4 | System | Calculates rent, charges |
| 5 | Operator | Reviews line items |
| 6 | Operator | Adds any additional charges |
| 7 | Operator | Clicks Generate Bill |
| 8 | System | Creates Nikasi Bill |
| 9 | System | Links to Chitti and transactions |
| 10 | Operator | Prints bill |

**Postconditions:**
- Nikasi Bill created
- Linked to transactions
- Party ledger updated

**Related Entities:** Nikasi Bill, Chitti, Stock Transaction, Party

---

### UC-20: Generate Cash Memo

**Description:** Generate cash memo for immediate cash transactions.

**Primary Actor:** Operator

**Preconditions:**
- Transaction details available

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Operator | Selects "Cash Memo" from sidebar |
| 2 | System | Displays cash memo form |
| 3 | Operator | Enters party details |
| 4 | Operator | Enters items and amounts |
| 5 | Operator | Clicks Generate |
| 6 | System | Creates cash memo |
| 7 | System | Updates Cash Book |
| 8 | Operator | Prints cash memo |

**Postconditions:**
- Cash memo created
- Cash Book updated

**Related Entities:** Cash Memo, Cash Book

---

## 6. Reports & Ledgers

### UC-21: View Party Ledger

**Description:** View complete financial ledger for a specific party.

**Primary Actor:** Operator

**Preconditions:**
- Party exists with transactions

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Operator | Selects "Party Ledger" from sidebar |
| 2 | System | Displays party selection and date range |
| 3 | Operator | Searches and selects Party |
| 4 | Operator | Enters date range (From - To) |
| 5 | Operator | Clicks View |
| 6 | System | Computes ledger from all transactions |
| 7 | System | Displays ledger with: |
| | | - Opening Balance |
| | | - Rent entries |
| | | - Bardana entries |
| | | - Vouchers (payments/receipts) |
| | | - Interest entries |
| | | - Running balance |
| | | - Closing balance |
| 8 | Operator | Can print or export ledger |

**Alternate Flows:**

| Alt | Condition | Action |
|-----|-----------|--------|
| 7a | No transactions | System shows only opening/closing balance |

**Postconditions:**
- Party ledger displayed
- Available for print/export

**Related Entities:** Party Ledger, Party, Voucher, Stock Transaction, Bardana

---

### UC-22: View Cash Book

**Description:** View daily cash transactions.

**Primary Actor:** Accountant

**Preconditions:**
- Voucher entries exist

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Accountant | Selects "Cash Book" from sidebar |
| 2 | System | Displays date selection |
| 3 | Accountant | Selects date or date range |
| 4 | Operator | Clicks View |
| 5 | System | Computes cash book from vouchers |
| 6 | System | Displays: |
| | | - Opening cash balance |
| | | - All receipts (Dr side) |
| | | - All payments (Cr side) |
| | | - Closing cash balance |

**Postconditions:**
- Cash book displayed
- Balances reconciled

**Related Entities:** Cash Book, Voucher

---

### UC-23: Generate Balance Sheet

**Description:** Generate balance sheet report showing assets and liabilities.

**Primary Actor:** Manager

**Preconditions:**
- Financial year transactions exist

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Manager | Selects "Balance Sheet" from Account Books menu |
| 2 | System | Displays date selection |
| 3 | Manager | Selects As On date |
| 4 | Manager | Clicks Fresh List |
| 5 | System | Computes all account balances |
| 6 | System | Displays hierarchical tree view: |
| | | - Assets |
| | | - Liabilities |
| | | - Capital |
| 7 | Manager | Can expand/collapse categories |
| 8 | Manager | Can print or export |

**Postconditions:**
- Balance sheet generated
- Financial position displayed

**Related Entities:** All entities (computed)

---

### UC-24: View Party Balance Summary

**Description:** View summary of all party balances.

**Primary Actor:** Operator

**Preconditions:**
- Parties exist with balances

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Operator | Selects "Party Balance" from sidebar |
| 2 | System | Displays filter options |
| 3 | Operator | Selects filters (Type, Village, Group) |
| 4 | Operator | Clicks View |
| 5 | System | Calculates all party balances |
| 6 | System | Displays summary with: |
| | | - Party name |
| | | - Balance amount |
| | | - Dr/Cr indicator |
| | | - Stock value (if applicable) |
| 7 | System | Shows totals |

**Postconditions:**
- Party balance summary displayed

**Related Entities:** Party, Party Ledger

---

## 7. Facility Management

### UC-25: Record Meter Reading

**Description:** Capture and store electricity meter reading with photo.

**Primary Actor:** Operator

**Preconditions:**
- Camera/phone available for photo capture

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Operator | Selects "Meter Reading" from sidebar |
| 2 | System | Displays meter reading form and photo gallery |
| 3 | Operator | Captures or uploads meter photo |
| 4 | Operator | Enters reading value (optional) |
| 5 | Operator | Enters date/time |
| 6 | Operator | Adds notes (optional) |
| 7 | Operator | Clicks Save |
| 8 | System | Stores meter reading record |
| 9 | System | Adds photo to gallery |

**Postconditions:**
- Meter reading recorded
- Photo stored in gallery

**Related Entities:** Meter Reading

---

### UC-26: Record Temperature

**Description:** Log storage temperature readings.

**Primary Actor:** Operator

**Preconditions:**
- Temperature monitoring equipment available

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Operator | Selects "Temperature" from sidebar |
| 2 | System | Displays temperature entry form |
| 3 | Operator | Selects Room (optional, for room-specific) |
| 4 | Operator | Enters temperature value |
| 5 | Operator | Confirms timestamp |
| 6 | Operator | Clicks Save |
| 7 | System | Validates temperature range |
| 8 | System | Stores temperature record |

**Alternate Flows:**

| Alt | Condition | Action |
|-----|-----------|--------|
| 7a | Temperature out of range | System raises alert |

**Business Rules:**
- Normal range typically 2-4°C for potatoes
- Out of range triggers alert/notification

**Postconditions:**
- Temperature logged
- Alert raised if out of range

**Related Entities:** Temperature Record, Room

---

## 8. System Administration

### UC-27: Configure Commodity

**Description:** Set up or modify commodity with pricing and rent rules.

**Primary Actor:** Manager

**Preconditions:**
- Manager has configuration permissions

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Manager | Selects "Item Master" from Master menu |
| 2 | System | Displays commodity list and form |
| 3 | Manager | Clicks Add New or selects existing |
| 4 | Manager | Enters commodity name |
| 5 | Manager | Selects item group |
| 6 | Manager | Selects unit of measurement |
| 7 | Manager | Selects rent charge type (Monthly/Seasonal) |
| 8 | Manager | Enters rates (per QTL, per Unit) |
| 9 | Manager | Enters grace period settings: |
| | | - Zero rent days |
| | | - Half rent days |
| | | - Rent basis (Quantity/Weight) |
| 10 | Manager | Clicks Save |
| 11 | System | Saves commodity configuration |

**Postconditions:**
- Commodity configured
- Available for use in transactions

**Related Entities:** Commodity

---

### UC-28: Manage Storage Rooms

**Description:** Add or configure storage rooms.

**Primary Actor:** Manager

**Preconditions:**
- Manager has configuration permissions

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Manager | Selects "Room Master" from Master menu |
| 2 | System | Displays room list |
| 3 | Manager | Clicks Add New or selects existing |
| 4 | Manager | Enters room number/name |
| 5 | Manager | Enters capacity |
| 6 | Manager | Enters target temperature |
| 7 | Manager | Sets status (Active/Maintenance) |
| 8 | Manager | Clicks Save |
| 9 | System | Saves room configuration |

**Postconditions:**
- Room configured
- Available for stock allocation

**Related Entities:** Room

---

### UC-29: End of Season Settlement

**Description:** Perform end of season settlement for all parties.

**Primary Actor:** Accountant

**Preconditions:**
- Season ending
- All transactions entered

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Accountant | Initiates settlement process |
| 2 | System | Calculates for each party: |
| | | - Total rent due |
| | | - Bardana adjustments |
| | | - Interest calculations |
| | | - All voucher entries |
| 3 | System | Generates settlement preview |
| 4 | Accountant | Reviews each party's balance |
| 5 | Accountant | Creates settlement vouchers |
| 6 | System | Updates party balances |
| 7 | System | Transfers closing to opening balance |
| 8 | System | Prepares for new season |

**Business Rules:**
- All pending transactions must be completed
- Interest calculated up to settlement date
- Opening balance set for next season

**Postconditions:**
- All parties settled
- Balances finalized
- System ready for new season

**Related Entities:** All entities

---

## Summary

| Module | Use Cases | Key Entities |
|--------|-----------|--------------|
| Party Management | UC-01 to UC-04 | Party, Village |
| Stock Management | UC-05 to UC-09, UC-30 | Lot, Stock Transaction, Room |
| Financial | UC-10 to UC-14, UC-29 | Voucher, Bardana, Party Ledger |
| Trading | UC-15 to UC-17 | Sauda |
| Billing | UC-18 to UC-20 | Chitti, Nikasi Bill, Cash Memo |
| Reports | UC-21 to UC-24 | Party Ledger, Cash Book, Balance Sheet |
| Facility | UC-25 to UC-26 | Meter Reading, Temperature |
| Administration | UC-27 to UC-28 | Commodity, Room |

---

## Appendix: Quick Reference - Keyboard Shortcuts

| Key | Action | Related Use Case |
|-----|--------|------------------|
| F1 | List of Vouchers | UC-10, UC-11 |
| F2 | Change Date | All voucher UCs |
| F4 | Contra Voucher | Financial |
| F5 | Payment Voucher | UC-10 |
| F6 | Receipt Voucher | UC-11 |
| F7 | Journal Voucher | Financial |
| F8 | Bhugtaan (Payment) | UC-10 |
