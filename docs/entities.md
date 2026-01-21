# Cold Storage - Entities & Operations

This document describes all entities in the Cold Storage Management System, their operations, relationships, and the records created during interactions.

---

## Table of Contents

1. [Entity Overview](#entity-overview)
2. [Core Entities](#core-entities)
   - [Party (Account)](#1-party-account)
   - [Commodity (Item)](#2-commodity-item)
   - [Room](#3-room)
   - [Lot](#4-lot)
3. [Transaction Entities](#transaction-entities)
   - [Stock Transaction (Amad/Nikasi)](#5-stock-transaction-amadnikasi)
   - [Voucher](#6-voucher)
   - [Bardana (Packaging Advance)](#7-bardana-packaging-advance)
   - [Chitti (Receipt/Slip)](#8-chitti-receiptslip)
   - [Sauda (Deal)](#9-sauda-deal)
4. [Supporting Entities](#supporting-entities)
   - [Village/Location](#10-villagelocation)
   - [Meter Reading](#11-meter-reading)
   - [Temperature Record](#12-temperature-record)
5. [Ledger & Report Entities](#ledger--report-entities)
   - [Party Ledger](#13-party-ledger)
   - [Cash Book](#14-cash-book)
   - [Stock Register](#15-stock-register)
6. [Entity Relationship Diagram](#entity-relationship-diagram)
7. [Interaction Flows](#interaction-flows)

---

## Entity Overview

| # | Entity | Type | Description |
|---|--------|------|-------------|
| 1 | Party | Master | Farmers, traders, staff, and other stakeholders |
| 2 | Commodity | Master | Items stored (potato, walnut, etc.) |
| 3 | Room | Master | Physical storage rooms in cold storage |
| 4 | Lot | Master | A batch of commodity belonging to a party |
| 5 | Stock Transaction | Transaction | Incoming (Amad) and outgoing (Nikasi) movements |
| 6 | Voucher | Transaction | Financial entries (payment, receipt, journal) |
| 7 | Bardana | Transaction | Packaging material advances and returns |
| 8 | Chitti | Transaction | Delivery receipts/slips |
| 9 | Sauda | Transaction | Deals/agreements between parties |
| 10 | Village | Master | Location master for party addresses |
| 11 | Meter Reading | Record | Electricity meter photo documentation |
| 12 | Temperature Record | Record | Storage temperature logs |
| 13 | Party Ledger | Derived | Financial ledger per party (computed) |
| 14 | Cash Book | Derived | Daily cash transactions (computed) |
| 15 | Stock Register | Derived | Stock movement register (computed) |

---

## Core Entities

### 1. Party (Account)

**Description:** Represents all stakeholders - farmers who store produce, traders who buy/sell, staff, and other parties.

#### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| account_no | String | Yes | Unique identifier |
| account_name | String | Yes | Full name |
| account_type | Enum | Yes | KISSAN, VYAPARI, STAFF, SUNDRY_DEBTOR, AARTI |
| father_husband_name | String | No | Guardian name |
| relation_type | Enum | No | S/O, D/O, W/O |
| name_hindi | String | No | Name in Devanagari script |
| subgroup | Enum | Yes | Category (FARMER, SUNDRY DEBTORS, etc.) |
| village_id | FK | No | Reference to Village |
| address | String | No | Full address |
| guarantor_id | FK | No | Reference to another Party |
| phone | String | No | Contact number |
| email | String | No | Email address |
| aadhar_no | String | No | Aadhaar number |
| pan_no | String | No | PAN card number |
| gst_no | String | No | GST number |
| tin_no | String | No | TIN number |
| remark | Text | No | Additional notes |

**Financial Settings:**

| Field | Type | Description |
|-------|------|-------------|
| opening_balance | Decimal | Opening balance amount |
| opening_balance_type | Enum | DR (Debit) or CR (Credit) |
| charge_interest_from | Date | Interest calculation start date |
| rent_charges | Decimal | Default rent charges |
| bardana_charges | Decimal | Default packaging charges |
| other_charges | Decimal | Other default charges |
| loan_amount | Decimal | Outstanding loan |
| interest_amount | Decimal | Accrued interest |
| interest_rate_pm | Decimal | Interest rate per month (%) |
| depreciation_rate | Decimal | Depreciation percentage |
| dr_limit | Decimal | Maximum debit limit |
| sauda_limit | Decimal | Transaction limit |
| due_days | Integer | Payment due in days |
| calc_int_on_bardana | Enum | DEFAULT or CUSTOM |

**Bank Details:**

| Field | Type | Description |
|-------|------|-------------|
| bank_name | String | Bank name |
| branch | String | Branch name |
| bank_account_no | String | Bank account number |
| bank_account_name | String | Account holder name |
| ifsc_code | String | IFSC code |
| cheque_numbers | String | Available cheque numbers |

#### Operations

| Operation | Description | Records Created/Modified |
|-----------|-------------|--------------------------|
| **Create** | Register new party | Party record |
| **Read** | View party details, search, filter by type/village | - |
| **Update** | Modify party information, financial settings | Party record (audit trail) |
| **Delete** | Soft delete (if no transactions) | Party marked inactive |
| **List** | View all parties with filters | - |
| **Print** | Generate party list report | - |

#### Relationships

- **Has many:** Lots, Stock Transactions, Vouchers, Bardana Transactions, Sauda
- **Belongs to:** Village
- **References:** Guarantor (another Party)

---

### 2. Commodity (Item)

**Description:** Products stored in the cold storage facility (potatoes, walnuts, etc.).

#### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| commodity_id | String | Yes | Unique identifier |
| name | String | Yes | Commodity name (POTATO, AKHROT, S.S COLD) |
| item_group | String | No | Category grouping |
| unit | Enum | Yes | Unit of measurement (KG, QTL, BAGS) |
| charge_rent | Enum | Yes | MONTHLY or SEASONAL |
| rate_per_qtl_field | Decimal | No | Rate per quintal (field price) |
| rate_per_qtl_mandi | Decimal | No | Rate per quintal (market price) |
| rate_per_unit_field | Decimal | No | Rate per unit (field price) |
| rate_per_unit_mandi | Decimal | No | Rate per unit (market price) |

**Grace Period Settings:**

| Field | Type | Description |
|-------|------|-------------|
| zero_rent_days | Integer | Days with no rent |
| half_rent_days | Integer | Days with 50% rent |
| rent_on | Enum | QUANTITY or WEIGHT based |

#### Operations

| Operation | Description | Records Created/Modified |
|-----------|-------------|--------------------------|
| **Create** | Add new commodity with pricing | Commodity record |
| **Read** | View commodity details | - |
| **Update** | Modify pricing, grace periods | Commodity record |
| **Delete** | Remove commodity (if unused) | Commodity removed |
| **List** | View all commodities | - |

#### Relationships

- **Has many:** Lots, Stock Transactions

---

### 3. Room

**Description:** Physical storage rooms within the cold storage facility.

#### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| room_no | String | Yes | Room identifier |
| name | String | No | Room name/description |
| capacity | Integer | No | Maximum capacity (bags/packets) |
| temperature_setting | Decimal | No | Target temperature |
| status | Enum | Yes | ACTIVE, MAINTENANCE, INACTIVE |

#### Operations

| Operation | Description | Records Created/Modified |
|-----------|-------------|--------------------------|
| **Create** | Add new storage room | Room record |
| **Read** | View room details, occupancy | - |
| **Update** | Modify room settings | Room record |
| **Delete** | Deactivate room | Room marked inactive |
| **List** | View all rooms with stock summary | - |

#### Relationships

- **Has many:** Lots (allocated), Stock Transactions

---

### 4. Lot

**Description:** A batch/lot of commodity belonging to a specific party, stored in a room.

#### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| lot_no | String | Yes | Unique lot identifier |
| party_id | FK | Yes | Owner party reference |
| commodity_id | FK | Yes | Commodity type |
| room_id | FK | Yes | Storage room |
| marka | String | No | Brand/mark identification |
| arrival_date | Date | Yes | Date of arrival |
| initial_packets | Integer | Yes | Initial packet count |
| initial_weight | Decimal | Yes | Initial weight (in QTL) |
| current_packets | Integer | Yes | Current packet count |
| current_weight | Decimal | Yes | Current weight |
| category | Enum | Yes | SEEDHI (fresh), DUMP |
| status | Enum | Yes | ACTIVE, CLOSED |

#### Operations

| Operation | Description | Records Created/Modified |
|-----------|-------------|--------------------------|
| **Create** | Register new lot during Amad | Lot record, Stock Transaction |
| **Read** | View lot details, history | - |
| **Update** | Modify lot info (marka, room transfer) | Lot record |
| **Close** | Mark lot as fully dispatched | Lot status = CLOSED |
| **Search** | Find lot by number, party, room | - |
| **Map** | View lot position in storage | - |

#### Relationships

- **Belongs to:** Party, Commodity, Room
- **Has many:** Stock Transactions (Amad/Nikasi)

---

## Transaction Entities

### 5. Stock Transaction (Amad/Nikasi)

**Description:** Records all stock movements - incoming (Amad) and outgoing (Nikasi).

#### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| transaction_id | String | Yes | Unique identifier |
| transaction_type | Enum | Yes | AMAD (incoming) or NIKASI (outgoing) |
| date | Date | Yes | Transaction date |
| party_id | FK | Yes | Party reference |
| lot_id | FK | Yes | Lot reference |
| commodity_id | FK | Yes | Commodity reference |
| room_id | FK | Yes | Room reference |
| packets | Integer | Yes | Number of packets/bags |
| weight | Decimal | Yes | Weight in quintal |
| category | Enum | Yes | SEEDHI, DUMP, KATAI |
| rent_amount | Decimal | No | Calculated rent |
| reference_no | String | No | Reference document number |
| narration | Text | No | Additional notes |

**For Nikasi (Outgoing) Additional Fields:**

| Field | Type | Description |
|-------|------|-------------|
| chitti_id | FK | Reference to Chitti |
| nikasi_bill_id | FK | Reference to Nikasi Bill |
| vyapari_id | FK | Buyer (Vyapari) reference |

#### Operations

| Operation | Description | Records Created/Modified |
|-----------|-------------|--------------------------|
| **Create Amad** | Record incoming stock | Stock Transaction, Lot (create/update), Party balance |
| **Create Nikasi** | Record outgoing stock | Stock Transaction, Lot (update), Chitti, Nikasi Bill |
| **Read** | View transaction details | - |
| **Update** | Modify transaction (if allowed) | Stock Transaction, Lot |
| **Delete** | Reverse transaction | Stock Transaction deleted, Lot restored |
| **List** | View by date, party, lot, room | - |
| **Reloading** | Transfer between rooms | Two Stock Transactions (out + in) |

#### Relationships

- **Belongs to:** Party, Lot, Commodity, Room
- **Creates:** Chitti (for Nikasi), Nikasi Bill

---

### 6. Voucher

**Description:** Financial transactions - payments, receipts, journals, and contra entries.

#### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| voucher_no | String | Yes | Unique voucher number |
| voucher_type | Enum | Yes | CONTRA, PAYMENT, RECEIPT, JOURNAL, BHUGTAAN |
| date | Date | Yes | Transaction date |
| party_id | FK | Yes | Party reference |
| dr_amount | Decimal | No | Debit amount |
| cr_amount | Decimal | No | Credit amount |
| reference_no | String | No | Check/reference number |
| interest_rate_pm | Decimal | No | Interest rate applied |
| marfat | String | No | Through/via agent name |
| narration | Text | No | Transaction description |
| narration_line2 | Text | No | Additional description |

#### Voucher Types

| Type | Hotkey | Description | Effect |
|------|--------|-------------|--------|
| CONTRA | F4 | Cash to bank transfers | Both sides internal |
| PAYMENT | F5 | Cash/bank outgoing | Party balance decreases (Cr) |
| RECEIPT | F6 | Cash/bank incoming | Party balance decreases (Dr) |
| JOURNAL | F7 | Non-cash adjustments | Ledger adjustments |
| BHUGTAAN | F8 | Payment to party | Party balance decreases (Cr) |

#### Operations

| Operation | Description | Records Created/Modified |
|-----------|-------------|--------------------------|
| **Create** | Enter new voucher | Voucher record, Party balance, Cash Book |
| **Read** | View voucher details | - |
| **Update** | Modify voucher (same day only) | Voucher record, Party balance |
| **Delete** | Cancel voucher | Voucher marked cancelled, Party balance restored |
| **List** | View by date, type, party | - |
| **Print** | Generate voucher print | - |

#### Relationships

- **Belongs to:** Party
- **Affects:** Party Ledger, Cash Book

---

### 7. Bardana (Packaging Advance)

**Description:** Advance payments for jute bags/packaging materials given to farmers.

#### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| voucher_no | String | Yes | Unique identifier |
| date | Date | Yes | Transaction date |
| party_id | FK | Yes | Party reference |
| bardana_type | Enum | Yes | JUTE, PLASTIC, etc. |
| rate | Decimal | Yes | Rate per bag |

**Issued Section:**

| Field | Type | Description |
|-------|------|-------------|
| qty_issued | Integer | Number of bags issued |
| dr_amount | Decimal | Debit amount (advance) |
| interest_rate_pm | Decimal | Interest rate per month |
| expected_arrival | Date | Expected stock arrival date |
| expected_bags | Integer | Expected bags to receive |

**Received Section:**

| Field | Type | Description |
|-------|------|-------------|
| qty_received | Integer | Bags returned/adjusted |
| cr_amount | Decimal | Credit amount |
| ref_no | String | Reference number |
| narration | Text | Notes |

#### Operations

| Operation | Description | Records Created/Modified |
|-----------|-------------|--------------------------|
| **Create Issue** | Issue bardana advance | Bardana record, Party balance (Dr) |
| **Create Receipt** | Record bardana return | Bardana record, Party balance (Cr) |
| **Read** | View advance details | - |
| **Update** | Modify advance terms | Bardana record |
| **Adjust** | Adjust against stock arrival | Bardana record, linked to Amad |
| **List** | View outstanding advances | - |

#### Relationships

- **Belongs to:** Party
- **Links to:** Stock Transaction (Amad) when adjusted

---

### 8. Chitti (Receipt/Slip)

**Description:** Delivery receipt issued when stock leaves the cold storage.

#### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| chitti_no | String | Yes | Unique slip number |
| date | Date | Yes | Issue date |
| nikasi_bill_id | FK | No | Linked Nikasi bill |
| party_id | FK | Yes | Kissan (owner) reference |
| vyapari_id | FK | No | Buyer (trader) reference |
| transport | String | No | Transport company |
| vehicle_no | String | No | Vehicle number |
| bilti_no | String | No | Lorry receipt number |
| delivered_to | String | No | Delivery destination |
| amount_payable | Decimal | No | Amount to collect |

#### Operations

| Operation | Description | Records Created/Modified |
|-----------|-------------|--------------------------|
| **Create** | Generate chitti during Nikasi | Chitti record, linked Stock Transaction |
| **Read** | View chitti details | - |
| **Update** | Add transport/bilti info | Chitti record |
| **Search** | Find by number, party, vehicle | - |
| **Print** | Generate delivery slip print | - |

#### Relationships

- **Belongs to:** Party (Kissan), Party (Vyapari)
- **Links to:** Stock Transaction (Nikasi), Nikasi Bill

---

### 9. Sauda (Deal)

**Description:** Deals/agreements between parties for buying/selling stored goods.

#### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sauda_no | String | Yes | Unique deal number |
| date | Date | Yes | Deal date |
| kissan_id | FK | Yes | Seller (farmer) reference |
| vyapari_id | FK | Yes | Buyer (trader) reference |
| lot_id | FK | No | Specific lot reference |
| commodity_id | FK | Yes | Commodity |
| quantity | Integer | Yes | Agreed quantity (bags) |
| rate | Decimal | Yes | Agreed rate |
| total_amount | Decimal | Yes | Total deal value |
| status | Enum | Yes | PENDING, PARTIAL, COMPLETED, CANCELLED |
| due_date | Date | No | Settlement due date |
| narration | Text | No | Deal terms/notes |

#### Operations

| Operation | Description | Records Created/Modified |
|-----------|-------------|--------------------------|
| **Create** | Register new deal | Sauda record |
| **Read** | View deal details | - |
| **Update** | Modify terms (if pending) | Sauda record |
| **Execute** | Process against stock | Sauda updated, Nikasi created |
| **Cancel** | Cancel pending deal | Sauda status = CANCELLED |
| **List** | View pending/completed deals | - |

#### Relationships

- **Belongs to:** Party (Kissan), Party (Vyapari), Commodity, Lot
- **Creates:** Stock Transaction (Nikasi) when executed

---

## Supporting Entities

### 10. Village/Location

**Description:** Master list of villages and cities for party addresses.

#### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| village_id | String | Yes | Unique identifier |
| name | String | Yes | Village/city name |
| name_hindi | String | No | Name in Hindi |
| district | String | No | District name |
| state | String | No | State name |

#### Operations

| Operation | Description |
|-----------|-------------|
| **Create** | Add new village |
| **Read** | View village details |
| **Update** | Modify village info |
| **Delete** | Remove if unused |
| **List** | View all villages |

#### Relationships

- **Has many:** Parties

---

### 11. Meter Reading

**Description:** Electricity meter photo documentation.

#### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| reading_id | String | Yes | Unique identifier |
| date | Date | Yes | Reading date |
| photo_path | String | Yes | Image file path |
| reading_value | Decimal | No | Meter reading value |
| notes | Text | No | Additional notes |

#### Operations

| Operation | Description |
|-----------|-------------|
| **Create** | Upload meter photo with reading |
| **Read** | View reading and photo |
| **List** | Gallery view of all readings |
| **Delete** | Remove reading |

---

### 12. Temperature Record

**Description:** Storage temperature monitoring logs.

#### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| record_id | String | Yes | Unique identifier |
| room_id | FK | No | Room reference |
| timestamp | DateTime | Yes | Reading timestamp |
| temperature | Decimal | Yes | Temperature value |
| recorded_by | String | No | Person who recorded |

#### Operations

| Operation | Description |
|-----------|-------------|
| **Create** | Log temperature reading |
| **Read** | View reading |
| **List** | View history by room/date |
| **Alert** | Notify if out of range |

---

## Ledger & Report Entities

These are derived/computed entities based on transaction data.

### 13. Party Ledger

**Description:** Complete financial ledger for a party showing all transactions.

#### Components

| Component | Source | Description |
|-----------|--------|-------------|
| Opening Balance | Party | Starting balance |
| Rent | Stock Transactions | Accumulated rent charges |
| Bardana | Bardana Transactions | Packaging advances |
| Loan | Vouchers | Loan amounts |
| Interest | Calculated | Interest on outstanding |
| Payments | Vouchers | Payments received |
| Receipts | Vouchers | Receipts issued |
| **Closing Balance** | Calculated | Net balance |

#### Operations

| Operation | Description |
|-----------|-------------|
| **View** | Display party ledger with date range |
| **Print** | Generate ledger print |
| **Export** | Export to file |

---

### 14. Cash Book

**Description:** Daily record of all cash transactions.

#### Components

| Component | Source |
|-----------|--------|
| Opening Cash | Previous day closing |
| Receipts | Receipt vouchers |
| Payments | Payment vouchers |
| **Closing Cash** | Calculated |

#### Operations

| Operation | Description |
|-----------|-------------|
| **View** | Display cash book by date |
| **Print** | Generate cash book print |

---

### 15. Stock Register

**Description:** Complete stock movement register.

#### Components

| Component | Source |
|-----------|--------|
| Amad (Incoming) | Stock Transactions |
| Nikasi (Outgoing) | Stock Transactions |
| Reloading | Stock Transactions |
| **Current Stock** | Calculated |

#### Operations

| Operation | Description |
|-----------|-------------|
| **View** | Display by commodity/room/party |
| **Print** | Generate stock register |

---

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Village   │       │  Commodity  │       │    Room     │
└──────┬──────┘       └──────┬──────┘       └──────┬──────┘
       │                     │                     │
       │ 1:N                 │ 1:N                 │ 1:N
       ▼                     │                     │
┌─────────────┐              │                     │
│    Party    │◄─────────────┼─────────────────────┤
│  (Account)  │              │                     │
└──────┬──────┘              │                     │
       │                     │                     │
       ├─────────────────────┼─────────────────────┤
       │                     │                     │
       │ 1:N                 │ 1:N                 │ 1:N
       ▼                     ▼                     ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│     Lot     │◄──────│    Stock    │──────►│   Chitti    │
│             │       │ Transaction │       │             │
└──────┬──────┘       └──────┬──────┘       └─────────────┘
       │                     │
       │                     │
       │              ┌──────┴──────┐
       │              │             │
       │              ▼             ▼
       │       ┌───────────┐ ┌───────────┐
       │       │   Amad    │ │  Nikasi   │
       │       │ (Incoming)│ │(Outgoing) │
       │       └───────────┘ └─────┬─────┘
       │                           │
       │                           │
       │                           ▼
       │                    ┌─────────────┐
       └───────────────────►│   Sauda     │
                            │   (Deal)    │
                            └─────────────┘

┌─────────────┐       ┌─────────────┐
│   Voucher   │       │   Bardana   │
│             │       │  (Advance)  │
└──────┬──────┘       └──────┬──────┘
       │                     │
       └─────────┬───────────┘
                 │
                 ▼
          ┌─────────────┐
          │Party Ledger │
          │  (Derived)  │
          └─────────────┘
```

---

## Interaction Flows

### Flow 1: Farmer Stores Goods (Amad)

```
1. Farmer (Kissan) arrives with goods
   ↓
2. [Party] Check/Create party record
   ↓
3. [Bardana] Check if advance was taken (optional adjustment)
   ↓
4. [Lot] Create new lot OR add to existing lot
   ↓
5. [Stock Transaction] Create AMAD transaction
   ↓
6. [Room] Update room occupancy
   ↓
7. [Party Ledger] Update with rent liability

Records Created:
- Lot (new or updated)
- Stock Transaction (AMAD)
- Party balance updated
```

### Flow 2: Goods Dispatched (Nikasi)

```
1. Sauda executed OR direct dispatch request
   ↓
2. [Lot] Verify available stock
   ↓
3. [Stock Transaction] Create NIKASI transaction
   ↓
4. [Chitti] Generate delivery slip
   ↓
5. [Nikasi Bill] Generate bill (optional)
   ↓
6. [Lot] Update remaining quantity
   ↓
7. [Party Ledger] Update balances

Records Created:
- Stock Transaction (NIKASI)
- Chitti
- Nikasi Bill (optional)
- Lot updated (may close if empty)
```

### Flow 3: Payment Received

```
1. Party makes payment
   ↓
2. [Voucher] Create RECEIPT voucher
   ↓
3. [Party Ledger] Credit party account
   ↓
4. [Cash Book] Record cash receipt

Records Created:
- Voucher (RECEIPT)
- Party balance updated
- Cash Book entry
```

### Flow 4: Bardana Advance

```
1. Farmer requests advance for bags
   ↓
2. [Party] Verify credit limit
   ↓
3. [Bardana] Create advance record
   ↓
4. [Voucher] Create payment voucher
   ↓
5. [Party Ledger] Debit party account

Records Created:
- Bardana transaction
- Voucher (implicit)
- Party balance updated

Later when goods arrive:
- Bardana adjusted against Amad
```

### Flow 5: Trade Deal (Sauda)

```
1. Vyapari wants to buy from Kissan
   ↓
2. [Sauda] Create deal with terms
   ↓
3. [Status] PENDING until executed
   ↓
4. When executed:
   ├─► [Stock Transaction] Create NIKASI
   ├─► [Chitti] Generate delivery slip
   └─► [Sauda] Status = COMPLETED

Records Created:
- Sauda record
- Stock Transaction (when executed)
- Chitti (when executed)
```

### Flow 6: End of Season Settlement

```
1. Calculate final balances
   ↓
2. [Party Ledger] Generate for each party:
   ├─► Rent charges
   ├─► Bardana adjustments
   ├─► Interest calculations
   ├─► Payments/Receipts
   └─► Net balance
   ↓
3. [Voucher] Create settlement vouchers
   ↓
4. [Party] Update opening balance for next season

Records Created/Updated:
- Multiple vouchers
- Party opening balances
```

---

## Summary Table

| Entity | Create | Read | Update | Delete | Special Operations |
|--------|--------|------|--------|--------|-------------------|
| Party | ✓ | ✓ | ✓ | Soft | Print List |
| Commodity | ✓ | ✓ | ✓ | ✓ | - |
| Room | ✓ | ✓ | ✓ | Soft | Stock Summary |
| Lot | ✓ | ✓ | ✓ | - | Search, Map, Close |
| Stock Transaction | ✓ | ✓ | Limited | Reverse | Reloading |
| Voucher | ✓ | ✓ | Same Day | Cancel | Print |
| Bardana | ✓ | ✓ | ✓ | - | Adjust |
| Chitti | ✓ | ✓ | ✓ | - | Search, Print |
| Sauda | ✓ | ✓ | If Pending | Cancel | Execute |
| Village | ✓ | ✓ | ✓ | If Unused | - |
| Meter Reading | ✓ | ✓ | - | ✓ | Gallery View |
| Temperature | ✓ | ✓ | - | - | Alert |

---

## Notes

1. **Soft Delete:** Entity is marked inactive rather than physically deleted to maintain referential integrity and audit trail.

2. **Limited Update:** Stock transactions can only be modified under specific conditions to maintain data integrity.

3. **Same Day:** Vouchers can only be edited on the day they were created.

4. **Reverse:** Instead of deleting, a reversal transaction is created.

5. **Derived Entities:** Party Ledger, Cash Book, and Stock Register are computed from transaction data and not stored separately.
