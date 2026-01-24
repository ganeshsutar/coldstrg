# Operator Use Cases

This document covers use cases performed by the Operator (primary system user/staff) for day-to-day operations.

**Primary Actor:** Operator

[Back to Use Cases Overview](../use-cases.md)

---

## Table of Contents

### Party Management
1. [UC-01: Register New Party](#uc-01-register-new-party)
2. [UC-02: Update Party Information](#uc-02-update-party-information)
3. [UC-03: Search and View Party](#uc-03-search-and-view-party)

### Stock Management
4. [UC-05: Record Stock Arrival (Amad)](#uc-05-record-stock-arrival-amad)
5. [UC-06: Record Stock Dispatch (Nikasi)](#uc-06-record-stock-dispatch-nikasi)
6. [UC-07: Transfer Stock Between Rooms](#uc-07-transfer-stock-between-rooms-reloading)
7. [UC-08: View Stock Summary](#uc-08-view-stock-summary)
8. [UC-09: Search Lot](#uc-09-search-lot)
9. [UC-30: Generate Sample Slip](#uc-30-generate-sample-slip)

### Financial Transactions
10. [UC-12: Issue Bardana Advance](#uc-12-issue-bardana-advance)
11. [UC-13: Adjust Bardana Against Stock](#uc-13-adjust-bardana-against-stock)

### Deals & Trading
12. [UC-15: Create Sauda (Deal)](#uc-15-create-sauda-deal)
13. [UC-16: Execute Sauda](#uc-16-execute-sauda)

### Billing & Receipts
14. [UC-18: Generate Chitti](#uc-18-generate-chitti-delivery-receipt)
15. [UC-19: Generate Nikasi Bill](#uc-19-generate-nikasi-bill)
16. [UC-20: Generate Cash Memo](#uc-20-generate-cash-memo)

### Reports & Ledgers
17. [UC-21: View Party Ledger](#uc-21-view-party-ledger)
18. [UC-24: View Party Balance Summary](#uc-24-view-party-balance-summary)

### Facility Management
19. [UC-25: Record Meter Reading](#uc-25-record-meter-reading)
20. [UC-26: Record Temperature](#uc-26-record-temperature)

---

## Party Management

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

## Stock Management

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

## Financial Transactions

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

## Deals & Trading

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

## Billing & Receipts

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

## Reports & Ledgers

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

## Facility Management

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

**Related Entities:** Party, Lot, Stock Transaction, Commodity, Room, Bardana, Sauda, Chitti, Voucher, Cash Book

[Back to Use Cases Overview](../use-cases.md)
