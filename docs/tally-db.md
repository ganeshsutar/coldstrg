# Tally ERP Database Schema Reference

This document reconstructs the logical database schema for **Tally ERP 9** and **Tally Prime** from a developer's perspective. Rather than detailing Tally's proprietary OODBMS internals, this reference presents the relational schema (tables, columns, data types, and relationships) that developers encounter when integrating via **ODBC**, **TDL (Tally Definition Language)**, or **XML/API** interfaces.

> **Sources**: This schema is derived from [Tally Developer Reference](https://help.tallysolutions.com/article/DeveloperReference/tdlreference/objects_and_collections.htm), [Tally ODBC Documentation](https://help.tallysolutions.com/odbc-integrations/), and the open-source [tally-database-loader](https://github.com/dhananjay1405/tally-database-loader) project.

---

## Table of Contents

1. [Conceptual Overview](#1-conceptual-overview)
2. [Accounting Masters](#2-accounting-masters-chart-of-accounts)
3. [Inventory Masters](#3-inventory-masters)
4. [Transactions (Vouchers)](#4-transactions-vouchers)
5. [Statutory and Tax Details](#5-statutory-and-tax-details)
6. [Relationships & Joins](#6-relationships--joins)
7. [Quick Reference: Table Summary](#7-quick-reference-table-summary)

---

## 1. Conceptual Overview

### Tally's Data Model

Tally uses a **hierarchical object-oriented database** where:
- **Objects** = Rows in relational terms
- **Collections** = Tables containing multiple objects
- **Methods** = Columns/fields that retrieve data from objects

When exposed via ODBC or exported to SQL, Tally data maps to a relational structure with:
- **Master Tables** (prefixed `mst_`) — Reference/configuration data
- **Transaction Tables** (prefixed `trn_`) — Operational/transactional data

### Key Identifiers

| Identifier | Description |
|------------|-------------|
| `GUID` | Globally Unique Identifier (varchar 64) — Primary key for most entities |
| `NAME` | Human-readable identifier — Used for joins in many cases |
| `MasterID` | Numeric ID assigned by Tally internally |
| `AlterID` | Tracks modification sequence |

---

## 2. Accounting Masters (Chart of Accounts)

Tally's accounting structure follows a **hierarchical Group → Ledger** model where Groups classify Ledgers, and Ledgers record actual transactions.

### 2.1 Groups (`mst_group`)

Groups organize ledgers into a classification hierarchy. Tally provides **28 predefined groups** (e.g., *Sundry Debtors*, *Sundry Creditors*, *Bank Accounts*) that users can extend.

```sql
CREATE TABLE mst_group (
    guid                VARCHAR(64) NOT NULL PRIMARY KEY,
    name                NVARCHAR(1024) NOT NULL DEFAULT '',
    parent              NVARCHAR(1024) NOT NULL DEFAULT '',     -- Parent group name
    primary_group       NVARCHAR(1024) NOT NULL DEFAULT '',     -- Top-level ancestor
    is_revenue          TINYINT,                                -- 1 = Revenue, 0 = Capital
    is_deemedpositive   TINYINT,                                -- 1 = Debit nature, 0 = Credit
    is_reserved         TINYINT,                                -- 1 = System group
    affects_gross_profit TINYINT,                               -- 1 = Affects P&L
    sort_position       INT
);
```

**Key Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | nvarchar(1024) | Group name (unique within company) |
| `parent` | nvarchar(1024) | Immediate parent group name |
| `primary_group` | nvarchar(1024) | Root-level group in hierarchy |
| `is_revenue` | tinyint | Revenue (1) vs Capital (0) classification |
| `is_deemedpositive` | tinyint | Natural debit balance (1) vs credit (0) |

**Predefined Primary Groups:**

| Category | Groups |
|----------|--------|
| **Assets** | Bank Accounts, Cash-in-Hand, Deposits, Fixed Assets, Investments, Loans & Advances, Stock-in-Hand, Sundry Debtors |
| **Liabilities** | Bank OD, Current Liabilities, Loans (Liability), Provisions, Sundry Creditors, Suspense A/c |
| **Income** | Direct Income, Indirect Income, Sales Accounts |
| **Expenses** | Direct Expenses, Indirect Expenses, Purchase Accounts |
| **Capital** | Capital Account, Reserves & Surplus |

---

### 2.2 Ledgers (`mst_ledger`)

Ledgers are individual accounts where transactions are posted. Every debit/credit entry in a voucher references a ledger.

```sql
CREATE TABLE mst_ledger (
    guid                    VARCHAR(64) NOT NULL PRIMARY KEY,
    name                    NVARCHAR(1024) NOT NULL DEFAULT '',
    parent                  NVARCHAR(1024) NOT NULL DEFAULT '',  -- Group name
    alias                   NVARCHAR(256) NOT NULL DEFAULT '',
    description             NVARCHAR(64) NOT NULL DEFAULT '',
    notes                   NVARCHAR(64) NOT NULL DEFAULT '',

    -- Classification
    is_revenue              TINYINT,
    is_deemedpositive       TINYINT,

    -- Balances
    opening_balance         DECIMAL(17,2) DEFAULT 0,
    closing_balance         DECIMAL(17,2) DEFAULT 0,             -- Calculated field

    -- Contact/Mailing Details
    mailing_name            NVARCHAR(256) NOT NULL DEFAULT '',
    mailing_address         NVARCHAR(1024) NOT NULL DEFAULT '',
    mailing_state           NVARCHAR(256) NOT NULL DEFAULT '',
    mailing_country         NVARCHAR(256) NOT NULL DEFAULT '',
    mailing_pincode         NVARCHAR(64) NOT NULL DEFAULT '',
    email                   NVARCHAR(256) NOT NULL DEFAULT '',
    mobile                  NVARCHAR(32) NOT NULL DEFAULT '',

    -- Statutory Information
    it_pan                  NVARCHAR(64) NOT NULL DEFAULT '',    -- Income Tax PAN
    gstn                    NVARCHAR(64) NOT NULL DEFAULT '',    -- GST Number
    gst_registration_type   NVARCHAR(64) NOT NULL DEFAULT '',    -- Regular/Composition/etc.
    gst_supply_type         NVARCHAR(64) NOT NULL DEFAULT '',    -- Goods/Services
    gst_duty_head           NVARCHAR(16) NOT NULL DEFAULT '',    -- CGST/SGST/IGST
    tax_rate                DECIMAL(9,4) DEFAULT 0,

    -- Banking Details
    bank_account_holder     NVARCHAR(256) NOT NULL DEFAULT '',
    bank_account_number     NVARCHAR(64) NOT NULL DEFAULT '',
    bank_ifsc               NVARCHAR(64) NOT NULL DEFAULT '',
    bank_swift              NVARCHAR(64) NOT NULL DEFAULT '',
    bank_name               NVARCHAR(64) NOT NULL DEFAULT '',
    bank_branch             NVARCHAR(64) NOT NULL DEFAULT '',

    -- Credit Terms
    bill_credit_period      INT NOT NULL DEFAULT 0               -- Days
);
```

**Additional ODBC-Accessible Fields (via TDL Methods):**

| Method | Description |
|--------|-------------|
| `$_PrimaryGroup` | Returns root-level group (external method) |
| `$ClosingBalance` | Dynamic closing balance as of period end |
| `$_PrevYearBalance` | Previous financial year closing |
| `$PartyGSTIN` | GSTIN of the party |

**Parent-Child Relationship:**

```
Primary Group (e.g., "Sundry Debtors")
    └── User Group (e.g., "North Zone Debtors")
            └── Ledger (e.g., "ABC Corporation")
```

---

## 3. Inventory Masters

### 3.1 Stock Groups (`mst_stock_group`)

Hierarchical classification for stock items (similar to Groups for Ledgers).

```sql
CREATE TABLE mst_stock_group (
    guid        VARCHAR(64) NOT NULL PRIMARY KEY,
    name        NVARCHAR(1024) NOT NULL DEFAULT '',
    parent      NVARCHAR(1024) NOT NULL DEFAULT ''    -- Parent stock group
);
```

**Example Hierarchy:**

```
Primary (All Items)
    └── Electronics
            ├── Mobile Phones
            └── Laptops
    └── Furniture
            └── Office Furniture
```

---

### 3.2 Stock Items (`mst_stock_item`)

Individual inventory products or materials.

```sql
CREATE TABLE mst_stock_item (
    guid                VARCHAR(64) NOT NULL PRIMARY KEY,
    name                NVARCHAR(1024) NOT NULL DEFAULT '',
    parent              NVARCHAR(1024) NOT NULL DEFAULT '',  -- Stock Group
    category            NVARCHAR(1024) NOT NULL DEFAULT '',  -- Stock Category
    alias               NVARCHAR(256) NOT NULL DEFAULT '',
    description         NVARCHAR(64) NOT NULL DEFAULT '',
    notes               NVARCHAR(64) NOT NULL DEFAULT '',
    part_number         NVARCHAR(256) NOT NULL DEFAULT '',   -- Vendor catalog number

    -- Units of Measure
    uom                 NVARCHAR(32) NOT NULL DEFAULT '',    -- Base unit
    alternate_uom       NVARCHAR(32) NOT NULL DEFAULT '',    -- Alternate unit
    conversion          DECIMAL(15,4) NOT NULL DEFAULT 0,    -- Conversion factor

    -- Opening Stock
    opening_balance     DECIMAL(15,4) DEFAULT 0,             -- Quantity
    opening_rate        DECIMAL(15,4) DEFAULT 0,             -- Rate per unit
    opening_value       DECIMAL(17,2) DEFAULT 0,             -- Total value

    -- Closing Stock (Calculated)
    closing_balance     DECIMAL(15,4) DEFAULT 0,
    closing_rate        DECIMAL(15,4) DEFAULT 0,
    closing_value       DECIMAL(17,2) DEFAULT 0,

    -- Valuation
    costing_method      NVARCHAR(32) NOT NULL DEFAULT '',    -- FIFO/LIFO/Average/etc.

    -- GST Details
    gst_type_of_supply  NVARCHAR(32) DEFAULT '',             -- Goods/Services
    gst_hsn_code        NVARCHAR(64) DEFAULT '',             -- HSN/SAC Code
    gst_hsn_description NVARCHAR(256) DEFAULT '',
    gst_rate            DECIMAL(9,4) DEFAULT 0,              -- Tax rate %
    gst_taxability      NVARCHAR(32) DEFAULT ''              -- Taxable/Exempt/Nil
);
```

**Costing Methods:**
- `Avg Cost` — Weighted Average
- `FIFO` — First In First Out
- `LIFO` — Last In First Out
- `Std Cost` — Standard Cost
- `Last Purchase Cost`

---

### 3.3 Godowns/Locations (`mst_godown`)

Physical storage locations for inventory.

```sql
CREATE TABLE mst_godown (
    guid        VARCHAR(64) NOT NULL PRIMARY KEY,
    name        NVARCHAR(1024) NOT NULL DEFAULT '',
    parent      NVARCHAR(1024) NOT NULL DEFAULT '',  -- Parent godown (hierarchical)
    address     NVARCHAR(1024) NOT NULL DEFAULT ''
);
```

Tally creates a default godown named **"Main Location"** for every company.

---

### 3.4 Units of Measure (`mst_uom`)

```sql
CREATE TABLE mst_uom (
    guid            VARCHAR(64) NOT NULL PRIMARY KEY,
    name            NVARCHAR(1024) NOT NULL DEFAULT '',     -- Symbol (e.g., "nos", "kg")
    formalname      NVARCHAR(256) NOT NULL DEFAULT '',      -- Full name (e.g., "Numbers")
    is_simple_unit  TINYINT NOT NULL,                       -- 1 = Simple, 0 = Compound
    base_units      NVARCHAR(1024) NOT NULL,                -- For compound units
    additional_units NVARCHAR(1024) NOT NULL,               -- Secondary unit
    conversion      DECIMAL(15,4) NOT NULL                  -- Conversion factor
);
```

**Unit Types:**
- **Simple Units**: `nos`, `pcs`, `kg`, `ltr`, `mtr`
- **Compound Units**: `dozen = 12 nos`, `box = 24 pcs`

---

## 4. Transactions (Vouchers)

Tally uses a **Header → Line Items** (Master-Detail) architecture for all transactions.

### 4.1 Voucher Header (`trn_voucher`)

```sql
CREATE TABLE trn_voucher (
    guid                    VARCHAR(64) NOT NULL PRIMARY KEY,
    date                    DATE NOT NULL,
    voucher_type            NVARCHAR(1024) NOT NULL,        -- e.g., "Sales", "Purchase"
    voucher_number          NVARCHAR(64) NOT NULL DEFAULT '',
    reference_number        NVARCHAR(64) NOT NULL DEFAULT '',
    reference_date          DATE,
    narration               NVARCHAR(4000) NOT NULL DEFAULT '',
    party_name              NVARCHAR(256) NOT NULL,         -- Primary party
    place_of_supply         NVARCHAR(256) NOT NULL,         -- For GST

    -- Voucher Classification Flags
    is_invoice              TINYINT,                        -- 1 = Invoice voucher
    is_accounting_voucher   TINYINT,                        -- 1 = Affects accounts only
    is_inventory_voucher    TINYINT,                        -- 1 = Affects inventory
    is_order_voucher        TINYINT                         -- 1 = Order (not actual)
);
```

**Voucher Types (`mst_vouchertype`):**

```sql
CREATE TABLE mst_vouchertype (
    guid                VARCHAR(64) NOT NULL PRIMARY KEY,
    name                NVARCHAR(1024) NOT NULL DEFAULT '',
    parent              NVARCHAR(1024) NOT NULL DEFAULT '', -- Parent voucher type
    numbering_method    NVARCHAR(64) NOT NULL DEFAULT '',   -- Auto/Manual
    is_deemedpositive   TINYINT,
    affects_stock       TINYINT                             -- 1 = Updates inventory
);
```

**Standard Voucher Types:**

| Category | Voucher Types |
|----------|---------------|
| **Accounting** | Receipt, Payment, Contra, Journal, Credit Note, Debit Note |
| **Inventory** | Purchase, Sales, Stock Journal, Delivery Note, Receipt Note, Physical Stock |
| **Order** | Purchase Order, Sales Order |

---

### 4.2 Ledger Entries (`trn_accounting`)

Each row represents a debit or credit to a ledger account.

```sql
CREATE TABLE trn_accounting (
    guid            VARCHAR(64) NOT NULL DEFAULT '',    -- FK to trn_voucher.guid
    ledger          NVARCHAR(1024) NOT NULL DEFAULT '', -- Ledger name
    amount          DECIMAL(17,2) NOT NULL DEFAULT 0,   -- Negative = Debit, Positive = Credit
    amount_forex    DECIMAL(17,2) NOT NULL DEFAULT 0,   -- Foreign currency amount
    currency        NVARCHAR(16) NOT NULL DEFAULT ''    -- Currency code
);
```

**Amount Sign Convention:**
- **Negative (-)** = Debit
- **Positive (+)** = Credit

**Example: Sales Invoice**

| GUID | Ledger | Amount | Description |
|------|--------|--------|-------------|
| V001 | ABC Customer | -11,800 | Debit (Receivable) |
| V001 | Sales Account | 10,000 | Credit (Revenue) |
| V001 | CGST Output | 900 | Credit (Tax Liability) |
| V001 | SGST Output | 900 | Credit (Tax Liability) |

---

### 4.3 Inventory Allocations (`trn_inventory`)

Links stock items to vouchers with quantity and rate details.

```sql
CREATE TABLE trn_inventory (
    guid                VARCHAR(64) NOT NULL DEFAULT '',    -- FK to trn_voucher.guid
    item                NVARCHAR(1024) NOT NULL DEFAULT '', -- Stock item name
    quantity            DECIMAL(15,4) NOT NULL DEFAULT 0,   -- Negative = Outward
    rate                DECIMAL(15,4) NOT NULL DEFAULT 0,
    amount              DECIMAL(17,2) NOT NULL DEFAULT 0,
    additional_amount   DECIMAL(17,2) NOT NULL DEFAULT 0,   -- Freight, etc.
    discount_amount     DECIMAL(17,2) NOT NULL DEFAULT 0,
    godown              NVARCHAR(1024),                     -- Storage location
    tracking_number     NVARCHAR(256),                      -- For order tracking
    order_number        NVARCHAR(256),
    order_duedate       DATE
);
```

**Quantity Sign Convention:**
- **Negative (-)** = Stock Outward (Sales, Issue)
- **Positive (+)** = Stock Inward (Purchase, Receipt)

---

### 4.4 Bill Allocations (`trn_bill`)

Tracks invoice-wise payment allocations for party ledgers.

```sql
CREATE TABLE trn_bill (
    guid                VARCHAR(64) NOT NULL DEFAULT '',    -- FK to trn_voucher.guid
    ledger              NVARCHAR(1024) NOT NULL DEFAULT '', -- Party ledger name
    name                NVARCHAR(1024) NOT NULL DEFAULT '', -- Bill/Invoice reference
    amount              DECIMAL(17,2) NOT NULL DEFAULT 0,
    billtype            NVARCHAR(256) NOT NULL DEFAULT '',  -- New Ref/Against Ref/Advance
    bill_credit_period  INT NOT NULL DEFAULT 0              -- Credit days
);
```

**Bill Types:**
- `New Ref` — Creating a new bill/invoice
- `Against Ref` — Settling against existing bill
- `Advance` — Advance payment/receipt
- `On Account` — Unallocated payment

---

### 4.5 Batch Allocations (`trn_batch`)

Tracks batch-wise and godown-wise inventory details.

```sql
CREATE TABLE trn_batch (
    guid                VARCHAR(64) NOT NULL DEFAULT '',
    item                NVARCHAR(1024) NOT NULL DEFAULT '',
    name                NVARCHAR(1024) NOT NULL DEFAULT '', -- Batch name/number
    quantity            DECIMAL(15,4) NOT NULL DEFAULT 0,
    amount              DECIMAL(17,2) NOT NULL DEFAULT 0,
    godown              NVARCHAR(1024),                     -- Source godown
    destination_godown  NVARCHAR(1024),                     -- For transfers
    tracking_number     NVARCHAR(1024)
);
```

---

### 4.6 Voucher Structure Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      trn_voucher (Header)                       │
│  guid | date | voucher_type | voucher_number | narration | ...  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┬───────────────┐
          │               │               │               │
          ▼               ▼               ▼               ▼
┌─────────────────┐ ┌───────────────┐ ┌──────────┐ ┌────────────┐
│ trn_accounting  │ │ trn_inventory │ │ trn_bill │ │ trn_batch  │
│ (Ledger Lines)  │ │ (Stock Lines) │ │ (Bills)  │ │ (Batches)  │
│                 │ │               │ │          │ │            │
│ guid (FK)       │ │ guid (FK)     │ │ guid(FK) │ │ guid (FK)  │
│ ledger          │ │ item          │ │ ledger   │ │ item       │
│ amount          │ │ quantity      │ │ name     │ │ name       │
│ ...             │ │ rate          │ │ amount   │ │ quantity   │
│                 │ │ godown        │ │ billtype │ │ godown     │
└─────────────────┘ └───────────────┘ └──────────┘ └────────────┘
```

---

## 5. Statutory and Tax Details

### 5.1 GST Configuration

GST details are stored at **multiple levels** with inheritance:

```
Company Level (Default)
    └── Stock Group Level (Override)
            └── Stock Item Level (Override)
                    └── Ledger Level (Final Override)
```

**Stock Item GST Fields:**

| Field | Description |
|-------|-------------|
| `gst_type_of_supply` | "Goods" or "Services" |
| `gst_hsn_code` | HSN Code (Goods) or SAC Code (Services) |
| `gst_hsn_description` | Description of HSN/SAC |
| `gst_rate` | Tax rate percentage (0, 5, 12, 18, 28) |
| `gst_taxability` | "Taxable", "Exempt", "Nil Rated" |

**Ledger GST Fields:**

| Field | Description |
|-------|-------------|
| `gstn` | Party's GSTIN (15-character) |
| `gst_registration_type` | Regular, Composition, Unregistered, Consumer, etc. |
| `gst_supply_type` | Interstate/Intrastate indicator |
| `gst_duty_head` | CGST, SGST, IGST, CESS |

**Tax Ledger Types for GST:**

| Ledger | Group | Purpose |
|--------|-------|---------|
| CGST Input | Duties & Taxes | Input tax credit (Central) |
| SGST Input | Duties & Taxes | Input tax credit (State) |
| IGST Input | Duties & Taxes | Input tax credit (Interstate) |
| CGST Output | Duties & Taxes | Output tax liability |
| SGST Output | Duties & Taxes | Output tax liability |
| IGST Output | Duties & Taxes | Output tax liability |

---

### 5.2 TDS (Tax Deducted at Source)

**TDS Ledger Configuration:**

```sql
-- Conceptual structure (stored as ledger properties)
TDS_Ledger {
    group           = "Duties and Taxes"
    type            = "TDS"
    nature_of_payment = "194J - Professional Fees"  -- Section code
    rate_with_pan   = 10.00
    rate_without_pan = 20.00
    threshold_amount = 30000
}
```

**Deductee (Party) Ledger Fields:**

| Field | Description |
|-------|-------------|
| `is_tds_deductable` | Enable TDS for this party |
| `deductee_type` | "Company", "Individual", "Non-Resident", etc. |
| `it_pan` | PAN number (affects rate) |
| `tds_nature_of_payment` | Applicable section code |

**TDS Nature of Payment Sections:**

| Section | Description | Threshold |
|---------|-------------|-----------|
| 194A | Interest (other than securities) | ₹40,000 |
| 194C | Payment to Contractors | ₹30,000 (single), ₹1,00,000 (aggregate) |
| 194H | Commission/Brokerage | ₹15,000 |
| 194I | Rent | ₹2,40,000 |
| 194J | Professional/Technical Fees | ₹30,000 |

---

### 5.3 TCS (Tax Collected at Source)

**TCS Ledger Configuration:**

```sql
-- Conceptual structure
TCS_Ledger {
    group           = "Duties and Taxes"
    type            = "TCS"
    nature_of_goods = "Scrap"
    rate            = 1.00
    threshold_amount = 5000000  -- ₹50 Lakhs
}
```

**Collectee (Party) Ledger Fields:**

| Field | Description |
|-------|-------------|
| `is_tcs_applicable` | Enable TCS collection |
| `buyer_type` | "Company", "Individual", etc. |
| `it_pan` | PAN number |

---

## 6. Relationships & Joins

### 6.1 Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐
│  mst_group   │◄────────│ mst_ledger   │
│  (parent)    │  parent │              │
└──────────────┘         └──────┬───────┘
                                │ name
                                ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│mst_stock_grp │◄────────│mst_stock_item│────────►│   mst_uom    │
│  (parent)    │  parent │              │   uom   │              │
└──────────────┘         └──────┬───────┘         └──────────────┘
                                │ name
                                ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│ trn_voucher  │◄────────│trn_inventory │────────►│  mst_godown  │
│   (guid)     │   guid  │              │  godown │              │
└──────┬───────┘         └──────────────┘         └──────────────┘
       │ guid
       ▼
┌──────────────┐
│trn_accounting│──────────► mst_ledger (via ledger name)
│              │
└──────────────┘
```

### 6.2 Common Join Patterns

**1. Voucher with Ledger Entries:**

```sql
SELECT
    v.date,
    v.voucher_type,
    v.voucher_number,
    a.ledger,
    a.amount,
    l.parent AS ledger_group,
    l.gstn
FROM trn_voucher v
JOIN trn_accounting a ON v.guid = a.guid
LEFT JOIN mst_ledger l ON a.ledger = l.name
WHERE v.date BETWEEN '2024-04-01' AND '2025-03-31';
```

**2. Sales Voucher with Stock Items:**

```sql
SELECT
    v.date,
    v.voucher_number,
    v.party_name,
    i.item,
    i.quantity,
    i.rate,
    i.amount,
    s.gst_hsn_code,
    s.gst_rate
FROM trn_voucher v
JOIN trn_inventory i ON v.guid = i.guid
JOIN mst_stock_item s ON i.item = s.name
WHERE v.voucher_type = 'Sales';
```

**3. Ledger with Outstanding Bills:**

```sql
SELECT
    l.name AS party,
    b.name AS bill_number,
    b.amount,
    b.billtype,
    v.date AS voucher_date
FROM mst_ledger l
JOIN trn_bill b ON l.name = b.ledger
JOIN trn_voucher v ON b.guid = v.guid
WHERE l.parent = 'Sundry Debtors'
  AND b.billtype = 'New Ref';
```

**4. Stock Item Closing Balance Calculation:**

```sql
SELECT
    s.name,
    s.opening_balance,
    COALESCE(SUM(i.quantity), 0) AS net_movement,
    s.opening_balance + COALESCE(SUM(i.quantity), 0) AS closing_qty
FROM mst_stock_item s
LEFT JOIN trn_inventory i ON s.name = i.item
LEFT JOIN trn_voucher v ON i.guid = v.guid
    AND v.is_order_voucher = 0  -- Exclude orders
GROUP BY s.name, s.opening_balance;
```

**5. GST Summary by HSN Code:**

```sql
SELECT
    s.gst_hsn_code,
    s.gst_rate,
    SUM(ABS(i.amount)) AS taxable_value,
    SUM(ABS(i.amount)) * s.gst_rate / 100 AS tax_amount
FROM trn_inventory i
JOIN mst_stock_item s ON i.item = s.name
JOIN trn_voucher v ON i.guid = v.guid
WHERE v.voucher_type IN ('Sales', 'Purchase')
  AND v.date BETWEEN '2024-04-01' AND '2025-03-31'
GROUP BY s.gst_hsn_code, s.gst_rate;
```

---

## 7. Quick Reference: Table Summary

### Master Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| `mst_group` | Account groups hierarchy | guid, name, parent, primary_group |
| `mst_ledger` | GL accounts/parties | guid, name, parent, opening_balance, gstn |
| `mst_stock_group` | Stock classification | guid, name, parent |
| `mst_stock_item` | Inventory items | guid, name, parent, uom, gst_hsn_code |
| `mst_godown` | Storage locations | guid, name, parent, address |
| `mst_uom` | Units of measure | guid, name, is_simple_unit, conversion |
| `mst_vouchertype` | Transaction types | guid, name, affects_stock |
| `mst_cost_category` | Cost category masters | guid, name |
| `mst_cost_centre` | Cost centre masters | guid, name, parent, category |

### Transaction Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| `trn_voucher` | Transaction headers | guid, date, voucher_type, voucher_number |
| `trn_accounting` | Ledger entries | guid (FK), ledger, amount |
| `trn_inventory` | Stock entries | guid (FK), item, quantity, rate, godown |
| `trn_bill` | Bill allocations | guid (FK), ledger, name, amount, billtype |
| `trn_batch` | Batch allocations | guid (FK), item, name, quantity, godown |
| `trn_bank` | Bank transaction details | guid (FK), bank details |
| `trn_cost_centre` | Cost allocations | guid (FK), cost_centre, amount |

### Key Relationships

| From Table | To Table | Join Column | Type |
|------------|----------|-------------|------|
| mst_ledger | mst_group | parent = name | Name-based |
| mst_stock_item | mst_stock_group | parent = name | Name-based |
| mst_stock_item | mst_uom | uom = name | Name-based |
| trn_accounting | trn_voucher | guid | GUID-based |
| trn_inventory | trn_voucher | guid | GUID-based |
| trn_accounting | mst_ledger | ledger = name | Name-based |
| trn_inventory | mst_stock_item | item = name | Name-based |
| trn_inventory | mst_godown | godown = name | Name-based |

---

## References

- [Tally Developer Reference - Objects and Collections](https://help.tallysolutions.com/article/DeveloperReference/tdlreference/objects_and_collections.htm)
- [Tally ODBC Integration Guide](https://help.tallysolutions.com/odbc-integrations/)
- [Tally Sample XML Documentation](https://help.tallysolutions.com/sample-xml/)
- [Tally Database Loader (GitHub)](https://github.com/dhananjay1405/tally-database-loader)
- [Tally GST Configuration Guide](https://help.tallysolutions.com/tally-prime/gst-master-setup/india-gst-manage-hsn-code-sac-and-tax-rates-tally/)
- [TDS Setup in TallyPrime](https://help.tallysolutions.com/tally-prime/india-tds/tds-masters-tally/)
- [TCS Recording in TallyPrime](https://help.tallysolutions.com/tally-prime/india-tcs/tcs-tallyprime/)
