# Cold Storage - Dashboards & Reports

This document defines the Key Performance Indicators (KPIs), dashboard views, and reports for each user role in the Cold Storage Management System.

---

## Table of Contents

1. [Overview](#overview)
2. [KPIs by Role](#kpis-by-role)
   - [Manager KPIs](#manager-kpis)
   - [Operator KPIs](#operator-kpis)
   - [Accountant KPIs](#accountant-kpis)
3. [Dashboard Views](#dashboard-views)
   - [Main Dashboard](#1-main-dashboard)
   - [Kissan Dashboard](#2-kissan-dashboard)
   - [Vyapari Dashboard](#3-vyapari-dashboard)
   - [Stock Dashboard](#4-stock-dashboard)
   - [Financial Dashboard](#5-financial-dashboard)
   - [Facility Dashboard](#6-facility-dashboard)
4. [Reports Catalog](#reports-catalog)
   - [Stock Reports](#1-stock-reports)
   - [Party Reports](#2-party-reports)
   - [Financial Reports](#3-financial-reports)
   - [Transaction Reports](#4-transaction-reports)
   - [Facility Reports](#5-facility-reports)
   - [Audit Reports](#6-audit-reports)
5. [Report Matrix by Role](#report-matrix-by-role)
6. [Dashboard Widgets](#dashboard-widgets)

---

## Overview

The dashboard and reporting system is designed to provide actionable insights at every level of the organization:

| Level | Focus | Primary Users |
|-------|-------|---------------|
| **Executive** | Business health, profitability, growth | Owner, Manager |
| **Operational** | Daily activities, pending tasks, alerts | Operator, Manager |
| **Financial** | Cash flow, receivables, collections | Accountant, Manager |
| **Transactional** | Individual transactions, party details | Operator, Accountant |

---

## KPIs by Role

### Manager KPIs

The Manager needs visibility into overall business performance and operational health.

#### Storage & Capacity KPIs

| KPI | Description | Formula | Target/Threshold |
|-----|-------------|---------|------------------|
| **Storage Utilization %** | Percentage of total capacity in use | (Current Stock Bags / Total Capacity) × 100 | 70-90% optimal |
| **Room-wise Occupancy** | Utilization per storage room | (Room Stock / Room Capacity) × 100 | Monitor rooms < 50% or > 95% |
| **Stock Turnover Rate** | How quickly stock moves through | Total Nikasi / Average Stock | Higher is better |
| **Average Storage Duration** | Mean days goods stay in storage | Sum(Dispatch Date - Arrival Date) / Count | Industry benchmark |
| **Lot Aging Distribution** | Breakdown of lots by age | Count of lots in age buckets | Alert if > 180 days |

#### Financial KPIs

| KPI | Description | Formula | Target/Threshold |
|-----|-------------|---------|------------------|
| **Total Receivables** | Outstanding amount from all parties | Sum of all DR balances | Monitor trend |
| **Receivables Aging** | Breakdown by overdue period | Balances in 30/60/90/180+ day buckets | Minimize 90+ days |
| **Rent Collection Rate** | Percentage of rent collected | (Rent Received / Rent Due) × 100 | > 85% |
| **Bardana Recovery Rate** | Advances recovered vs issued | (Adjusted Amount / Issued Amount) × 100 | > 95% |
| **Daily Cash Position** | Net cash at end of day | Opening + Receipts - Payments | Positive always |

#### Business KPIs

| KPI | Description | Formula | Target/Threshold |
|-----|-------------|---------|------------------|
| **Active Parties** | Parties with current stock or balance | Count of active Kissan + Vyapari | Growth indicator |
| **New Registrations** | New parties this period | Count of new accounts | Track seasonally |
| **Sauda Conversion Rate** | Deals completed vs created | (Completed Sauda / Total Sauda) × 100 | > 80% |
| **Pending Sauda Value** | Value of unexecuted deals | Sum of pending sauda amounts | Monitor aging |
| **Revenue per QTL** | Average revenue per quintal stored | Total Revenue / Total Stock (QTL) | Benchmark |

---

### Operator KPIs

The Operator needs real-time visibility into daily operations and pending tasks.

#### Daily Operations KPIs

| KPI | Description | Formula | Target/Threshold |
|-----|-------------|---------|------------------|
| **Today's Amad** | Incoming stock today | Sum of today's Amad transactions | Compare to average |
| **Today's Nikasi** | Outgoing stock today | Sum of today's Nikasi transactions | Compare to average |
| **Today's Vouchers** | Financial entries today | Count of vouchers entered | Workload indicator |
| **Pending Chitti** | Chitti without transport details | Count of incomplete chitti | Should be 0 by EOD |
| **Pending Bardana** | Outstanding advances to follow up | Count of unadjusted advances | Track aging |

#### Task KPIs

| KPI | Description | Formula | Target/Threshold |
|-----|-------------|---------|------------------|
| **Pending Sauda Count** | Deals awaiting execution | Count of PENDING sauda | Follow up required |
| **Overdue Sauda** | Sauda past due date | Count where due_date < today | Urgent attention |
| **Temperature Alerts** | Out-of-range readings today | Count of alerts | Should be 0 |
| **Meter Readings Due** | Days since last reading | Days since last record | < 7 days |

---

### Accountant KPIs

The Accountant focuses on financial health and cash management.

#### Cash Management KPIs

| KPI | Description | Formula | Target/Threshold |
|-----|-------------|---------|------------------|
| **Cash in Hand** | Current cash balance | Cash Book closing balance | Reconciled daily |
| **Bank Balance** | Balance in bank accounts | Sum of bank account balances | Reconciled weekly |
| **Today's Collections** | Receipts received today | Sum of receipt vouchers | Track against target |
| **Today's Payments** | Payments made today | Sum of payment vouchers | Within budget |
| **Net Cash Flow** | Daily cash movement | Receipts - Payments | Monitor trend |

#### Receivables KPIs

| KPI | Description | Formula | Target/Threshold |
|-----|-------------|---------|------------------|
| **Total Outstanding** | All party balances (DR) | Sum of DR balances | Monitor weekly |
| **Kissan Outstanding** | Farmer balances | Sum of Kissan DR balances | Segment analysis |
| **Vyapari Outstanding** | Trader balances | Sum of Vyapari DR balances | Segment analysis |
| **Overdue Amount** | Balance past due days | Sum where age > due_days | Minimize |
| **Interest Accrued** | Unpaid interest | Sum of calculated interest | Track monthly |

#### Collection Efficiency KPIs

| KPI | Description | Formula | Target/Threshold |
|-----|-------------|---------|------------------|
| **Collection Efficiency** | Actual vs target collection | (Collected / Target) × 100 | > 90% |
| **DSO (Days Sales Outstanding)** | Average collection period | (Receivables / Daily Revenue) | Lower is better |
| **Bad Debt Ratio** | Potentially uncollectable | (Accounts > 365 days / Total) × 100 | < 5% |

---

## Dashboard Views

### 1. Main Dashboard

**Purpose:** Provide at-a-glance view of overall business status
**Primary Users:** Manager, Owner
**Refresh:** Real-time

#### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                        MAIN DASHBOARD                           │
├──────────────────┬──────────────────┬──────────────────────────┤
│   TODAY'S        │   STOCK          │   FINANCIAL              │
│   ACTIVITY       │   SUMMARY        │   SUMMARY                │
│ ┌──────────────┐ │ ┌──────────────┐ │ ┌──────────────────────┐ │
│ │ Amad: 150    │ │ │ Total: 45000 │ │ │ Cash: ₹2,50,000      │ │
│ │ Nikasi: 80   │ │ │ Bags         │ │ │ Receivables: ₹45L    │ │
│ │ Vouchers: 25 │ │ │ Utilization: │ │ │ Today Collected:     │ │
│ │ Sauda: 5     │ │ │ 78%          │ │ │ ₹1,25,000            │ │
│ └──────────────┘ │ └──────────────┘ │ └──────────────────────┘ │
├──────────────────┴──────────────────┴──────────────────────────┤
│                     PENDING ITEMS                               │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Pending Sauda: 12  │  Overdue Accounts: 8  │  Alerts: 2    │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ TABS: [Pending Sauda] [Kissan] [Vyapari] [Overdue] [Temp]      │
├─────────────────────────────────────────────────────────────────┤
│                    [Tab Content Area]                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Widgets

| Widget | Content | Drill-down |
|--------|---------|------------|
| Today's Activity | Amad/Nikasi/Voucher counts | Transaction list |
| Stock Summary | Total bags, weight, utilization | Stock Summary screen |
| Financial Summary | Cash, receivables, collections | Cash Book, Party Balance |
| Pending Items | Counts of items needing attention | Respective lists |
| Calendar | Month view with events/reminders | Day detail |
| Quick Actions | Sample Slip, Lot Search, etc. | Respective screens |

---

### 2. Kissan Dashboard

**Purpose:** View all farmer accounts and their status
**Primary Users:** Operator, Manager
**Tab:** Kissan tab on main dashboard

#### Display Columns

| Column | Description | Sort | Filter |
|--------|-------------|------|--------|
| Name | Party name with S/O | Yes | Search |
| Village | Location | Yes | Dropdown |
| Phone | Contact number | No | Search |
| Balance | Outstanding amount (Dr/Cr) | Yes | Range |
| Stock (Bags) | Current stock quantity | Yes | Range |
| Last Activity | Date of last transaction | Yes | Date range |

#### Summary Metrics

| Metric | Description |
|--------|-------------|
| Total Kissan | Count of active farmers |
| Total Stock | Sum of all farmer stock |
| Total Balance | Sum of all farmer balances |
| Avg Balance | Average balance per farmer |

#### Actions per Row

| Action | Description |
|--------|-------------|
| View Ledger | Open party ledger |
| View Stock | Show party's lots |
| View Parcha | Generate party statement |
| Add Voucher | Quick voucher entry |

---

### 3. Vyapari Dashboard

**Purpose:** View all trader accounts and their trading status
**Primary Users:** Operator, Manager
**Tab:** Vyapari tab on main dashboard

#### Display Columns

| Column | Description | Sort | Filter |
|--------|-------------|------|--------|
| Name | Trader name | Yes | Search |
| Phone | Contact number | No | Search |
| Balance | Outstanding amount | Yes | Range |
| Pending Sauda | Count of pending deals | Yes | Yes/No |
| Stock Purchased | Total quantity bought | Yes | Range |
| Credit Limit | Available credit | Yes | Range |

#### Summary Metrics

| Metric | Description |
|--------|-------------|
| Total Vyapari | Count of active traders |
| Total Outstanding | Sum of trader balances |
| Pending Sauda Value | Total value of pending deals |
| Over Limit Count | Traders exceeding credit limit |

#### Actions per Row

| Action | Description |
|--------|-------------|
| View Ledger | Open party ledger |
| View Sauda | Show party's deals |
| Create Sauda | New deal for this trader |
| Collect Payment | Quick receipt entry |

---

### 4. Stock Dashboard

**Purpose:** Real-time stock position and movement analysis
**Primary Users:** Operator, Manager

#### Stock Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      STOCK DASHBOARD                            │
├─────────────────────────────────────────────────────────────────┤
│ Filters: [Commodity ▼] [Room ▼] [Date Range] [Apply]           │
├────────────────┬────────────────┬───────────────────────────────┤
│    AMAD        │    NIKASI      │    BALANCE                    │
│  (Incoming)    │  (Outgoing)    │                               │
│ ┌────────────┐ │ ┌────────────┐ │ ┌───────────────────────────┐ │
│ │Seedhi:25000│ │ │Seedhi:15000│ │ │ Packets: 32,500           │ │
│ │Dump:  8000 │ │ │Katai: 5500 │ │ │ Weight: 16,250 QTL        │ │
│ │Total:33000 │ │ │Total:20500 │ │ │ Pending Rent: ₹8,45,000   │ │
│ └────────────┘ │ └────────────┘ │ └───────────────────────────┘ │
├────────────────┴────────────────┴───────────────────────────────┤
│                    ROOM-WISE BREAKDOWN                          │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Room │ Capacity │ Amad  │ Nikasi │ Balance │ Utilization   │ │
│ │  1   │  5000    │ 4500  │  2000  │  2500   │    50%  ████  │ │
│ │  2   │  5000    │ 5200  │  1800  │  3400   │    68%  █████ │ │
│ │  3   │  5000    │ 4800  │  2500  │  2300   │    46%  ████  │ │
│ │ ...  │   ...    │  ...  │   ...  │   ...   │    ...        │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                    LOT AGING ANALYSIS                           │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 0-30 days: 45 lots  ████████████████████                   │ │
│ │ 31-60 days: 28 lots ████████████                           │ │
│ │ 61-90 days: 15 lots ██████                                 │ │
│ │ 91-180 days: 8 lots ███                                    │ │
│ │ 180+ days: 3 lots   █ ⚠️                                   │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### Key Metrics

| Metric | Description |
|--------|-------------|
| Total Stock | Current bags and weight |
| Today's Movement | Amad and Nikasi for today |
| Pending Rent | Uncollected rent amount |
| Avg Storage Days | Mean duration across all lots |
| Aging Alerts | Lots exceeding threshold |

---

### 5. Financial Dashboard

**Purpose:** Financial health overview and cash management
**Primary Users:** Accountant, Manager

#### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    FINANCIAL DASHBOARD                          │
├──────────────────────────────┬──────────────────────────────────┤
│      CASH POSITION           │      RECEIVABLES SUMMARY         │
│ ┌──────────────────────────┐ │ ┌──────────────────────────────┐ │
│ │ Opening:    ₹1,50,000    │ │ │ Total Outstanding: ₹45,00,000│ │
│ │ + Receipts: ₹2,75,000    │ │ │ ├─ Kissan:        ₹32,00,000│ │
│ │ - Payments: ₹1,75,000    │ │ │ ├─ Vyapari:       ₹10,00,000│ │
│ │ ─────────────────────    │ │ │ └─ Others:        ₹3,00,000 │ │
│ │ Closing:    ₹2,50,000    │ │ │                              │ │
│ └──────────────────────────┘ │ └──────────────────────────────┘ │
├──────────────────────────────┴──────────────────────────────────┤
│                    RECEIVABLES AGING                            │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Current (0-30):   ₹15,00,000  ██████████████████████████   │ │
│ │ 31-60 days:       ₹12,00,000  ████████████████████         │ │
│ │ 61-90 days:       ₹8,00,000   █████████████                │ │
│ │ 91-180 days:      ₹6,00,000   ██████████ ⚠️                │ │
│ │ 180+ days:        ₹4,00,000   ███████ 🔴                   │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                    COLLECTION TREND (Last 30 Days)              │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │     ₹3L │         *                                        │ │
│ │         │    *         *    *                              │ │
│ │     ₹2L │  *    *   *    *    *   *                       │ │
│ │         │*                          *  *   *              │ │
│ │     ₹1L │                                    *  *         │ │
│ │         └─────────────────────────────────────────────    │ │
│ │           1    5    10   15   20   25   30                │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### Key Metrics

| Metric | Description |
|--------|-------------|
| Cash Balance | Current cash in hand |
| Bank Balance | Total across all accounts |
| Today's Collection | Receipts received today |
| Collection Target | Daily/weekly target |
| Overdue Amount | Balance past due date |
| Interest Receivable | Accrued interest pending |

---

### 6. Facility Dashboard

**Purpose:** Monitor storage facility health
**Primary Users:** Operator, Manager

#### Temperature Monitoring

| Display | Description |
|---------|-------------|
| Current Temp | Latest reading for each room |
| Trend Chart | Temperature over last 24 hours |
| Alert Status | Rooms outside acceptable range |
| Last Reading | Time since last recording |

#### Meter Reading

| Display | Description |
|---------|-------------|
| Photo Gallery | Recent meter photos |
| Reading Trend | Consumption trend |
| Last Reading | Most recent values |

---

## Reports Catalog

### 1. Stock Reports

#### SR-01: Stock Summary Report

**Purpose:** Overall stock position at a point in time
**Audience:** Manager, Operator
**Frequency:** Daily, On-demand

| Field | Description |
|-------|-------------|
| Commodity | Filtered or all |
| Amad (Seedhi/Dump) | Incoming totals |
| Nikasi (Seedhi/Katai) | Outgoing totals |
| Balance | Current position |
| Pending Rent | Rent not yet collected |

**Filters:** Commodity, Room, Date, Party
**Output:** Screen, Print, Export

---

#### SR-02: Room-wise Stock Report

**Purpose:** Stock position by storage room
**Audience:** Manager, Operator
**Frequency:** Daily

| Field | Description |
|-------|-------------|
| Room No | Storage room |
| Capacity | Maximum capacity |
| Current Stock | Bags/Weight |
| Utilization % | Percentage filled |
| Party Count | Number of parties with stock |

**Filters:** Date, Commodity
**Output:** Screen, Print

---

#### SR-03: Lot Register

**Purpose:** List of all lots with details
**Audience:** Operator
**Frequency:** On-demand

| Field | Description |
|-------|-------------|
| Lot No | Unique identifier |
| Party | Owner name |
| Marka | Brand/mark |
| Commodity | Item type |
| Room | Storage location |
| Arrival Date | When received |
| Initial Qty | Starting bags/weight |
| Current Qty | Remaining bags/weight |
| Status | Active/Closed |

**Filters:** Party, Room, Commodity, Date Range, Status
**Output:** Screen, Print, Export

---

#### SR-04: Lot Aging Report

**Purpose:** Identify old stock requiring attention
**Audience:** Manager
**Frequency:** Weekly

| Field | Description |
|-------|-------------|
| Lot No | Identifier |
| Party | Owner |
| Days in Storage | Age calculation |
| Age Bucket | 0-30, 31-60, 61-90, 91-180, 180+ |
| Pending Rent | Rent due |
| Last Activity | Last transaction date |

**Filters:** Age threshold, Commodity, Room
**Output:** Screen, Print

---

#### SR-05: Stock Movement Report

**Purpose:** All stock transactions in a period
**Audience:** Operator, Accountant
**Frequency:** Daily

| Field | Description |
|-------|-------------|
| Date | Transaction date |
| Type | Amad/Nikasi |
| Party | Related party |
| Lot No | Lot reference |
| Commodity | Item |
| Room | Location |
| Packets | Quantity |
| Weight | In quintals |
| Category | Seedhi/Dump/Katai |

**Filters:** Date Range, Party, Lot, Transaction Type
**Output:** Screen, Print, Export

---

### 2. Party Reports

#### PR-01: Party List Report

**Purpose:** Master list of all registered parties
**Audience:** Operator, Manager
**Frequency:** On-demand

| Field | Description |
|-------|-------------|
| Account No | Unique ID |
| Name | Party name |
| Type | Kissan/Vyapari/etc. |
| Village | Location |
| Phone | Contact |
| Balance | Current balance |
| Status | Active/Inactive |

**Filters:** Type, Village, Subgroup, Balance Range
**Output:** Screen, Print, Export

---

#### PR-02: Party Ledger Report

**Purpose:** Complete transaction history for a party
**Audience:** All
**Frequency:** On-demand

| Field | Description |
|-------|-------------|
| Date | Transaction date |
| Particulars | Description |
| Voucher No | Reference |
| Debit | DR amount |
| Credit | CR amount |
| Balance | Running balance |

**Sections:**
- Opening Balance
- Rent Entries
- Bardana Entries
- Voucher Entries
- Interest Entries
- Closing Balance

**Filters:** Party (required), Date Range
**Output:** Screen, Print, Export

---

#### PR-03: Party Balance Summary

**Purpose:** All party balances at a glance
**Audience:** Manager, Accountant
**Frequency:** Daily, Weekly

| Field | Description |
|-------|-------------|
| Party Name | Account name |
| Type | Kissan/Vyapari |
| Village | Location |
| DR Balance | Debit balance |
| CR Balance | Credit balance |
| Net Balance | DR - CR |

**Summary:**
- Total DR Balances
- Total CR Balances
- Net Position

**Filters:** Type, Village, Balance Type (DR/CR/All)
**Output:** Screen, Print, Export

---

#### PR-04: Party Parcha (Statement)

**Purpose:** Printable statement for party
**Audience:** Party (Kissan/Vyapari)
**Frequency:** On-demand

| Content | Description |
|---------|-------------|
| Party Details | Name, address, contact |
| Stock Summary | Current lots and quantities |
| Financial Summary | Balance breakdown |
| Transaction List | Recent transactions |

**Output:** Print (formatted for customer)

---

#### PR-05: Overdue Accounts Report

**Purpose:** Parties with payments past due
**Audience:** Manager, Accountant
**Frequency:** Weekly

| Field | Description |
|-------|-------------|
| Party Name | Account name |
| Balance | Outstanding amount |
| Due Days | Configured due days |
| Overdue Days | Days past due |
| Last Payment | Date of last receipt |
| Contact | Phone number |

**Filters:** Days Overdue threshold, Party Type
**Output:** Screen, Print

---

#### PR-06: Party Guarantor Report

**Purpose:** List parties with their guarantors
**Audience:** Manager
**Frequency:** On-demand

| Field | Description |
|-------|-------------|
| Party Name | Account name |
| Guarantor | Guarantor name |
| Guarantor Contact | Phone |
| Party Balance | Outstanding |
| Guarantor's Balance | Guarantor's own balance |

**Filters:** Party Type
**Output:** Screen, Print

---

### 3. Financial Reports

#### FR-01: Cash Book

**Purpose:** Daily cash transaction register
**Audience:** Accountant, Manager
**Frequency:** Daily

| Receipt Side | Payment Side |
|--------------|--------------|
| Date | Date |
| Party | Party |
| Voucher No | Voucher No |
| Amount (Dr) | Amount (Cr) |

**Summary:**
- Opening Balance
- Total Receipts
- Total Payments
- Closing Balance

**Filters:** Date/Date Range
**Output:** Screen, Print

---

#### FR-02: Bank Book

**Purpose:** Bank transaction register
**Audience:** Accountant
**Frequency:** Weekly

| Field | Description |
|-------|-------------|
| Date | Transaction date |
| Particulars | Description |
| Cheque No | Reference |
| Deposits | CR |
| Withdrawals | DR |
| Balance | Running |

**Filters:** Bank Account, Date Range
**Output:** Screen, Print

---

#### FR-03: Voucher Register

**Purpose:** List of all vouchers
**Audience:** Accountant
**Frequency:** Daily

| Field | Description |
|-------|-------------|
| Voucher No | Unique ID |
| Date | Entry date |
| Type | Payment/Receipt/Journal/etc. |
| Party | Related party |
| DR Amount | Debit |
| CR Amount | Credit |
| Narration | Description |

**Filters:** Date Range, Voucher Type, Party
**Output:** Screen, Print, Export

---

#### FR-04: Balance Sheet

**Purpose:** Financial position statement
**Audience:** Manager, Owner
**Frequency:** Monthly, Yearly

| Assets | Liabilities |
|--------|-------------|
| Cash in Hand | Capital |
| Bank Balances | Sundry Creditors |
| Sundry Debtors | Advances Received |
| Stock Value | |
| Fixed Assets | |

**Filters:** As On Date
**Output:** Screen, Print

---

#### FR-05: Trial Balance

**Purpose:** All account balances
**Audience:** Accountant
**Frequency:** Monthly

| Field | Description |
|-------|-------------|
| Account | Account name |
| Group | Category |
| Opening DR | Opening debit |
| Opening CR | Opening credit |
| Transactions DR | Period debit |
| Transactions CR | Period credit |
| Closing DR | Closing debit |
| Closing CR | Closing credit |

**Filters:** Date Range, Account Group
**Output:** Screen, Print

---

#### FR-06: Interest Calculation Report

**Purpose:** Interest charged to parties
**Audience:** Accountant
**Frequency:** Monthly

| Field | Description |
|-------|-------------|
| Party | Account name |
| Principal | Base amount |
| Rate | Interest rate % |
| Period | Days/Months |
| Interest | Calculated interest |
| Total Due | Principal + Interest |

**Filters:** Date Range, Party Type
**Output:** Screen, Print

---

### 4. Transaction Reports

#### TR-01: Sauda Register

**Purpose:** All deals/saudas with status
**Audience:** Operator, Manager
**Frequency:** Daily

| Field | Description |
|-------|-------------|
| Sauda No | Unique ID |
| Date | Deal date |
| Kissan | Seller |
| Vyapari | Buyer |
| Commodity | Item |
| Quantity | Bags agreed |
| Rate | Per unit |
| Amount | Total value |
| Status | Pending/Partial/Completed/Cancelled |
| Executed Qty | Amount fulfilled |

**Filters:** Date Range, Status, Kissan, Vyapari
**Output:** Screen, Print, Export

---

#### TR-02: Pending Sauda Report

**Purpose:** Deals awaiting execution
**Audience:** Operator, Manager
**Frequency:** Daily

| Field | Description |
|-------|-------------|
| Sauda No | ID |
| Age (Days) | Days since creation |
| Kissan | Seller |
| Vyapari | Buyer |
| Quantity Pending | Remaining to fulfill |
| Due Date | If specified |
| Status | Pending/Partial |

**Filters:** Age threshold, Kissan, Vyapari
**Output:** Screen, Print

---

#### TR-03: Chitti Register

**Purpose:** All delivery receipts
**Audience:** Operator
**Frequency:** Daily

| Field | Description |
|-------|-------------|
| Chitti No | Slip number |
| Date | Issue date |
| Kissan | Stock owner |
| Vyapari | Buyer |
| Lot No | Lot reference |
| Quantity | Bags dispatched |
| Transport | Transporter |
| Vehicle | Vehicle number |
| Bilti No | Lorry receipt |

**Filters:** Date Range, Kissan, Vyapari, Vehicle
**Output:** Screen, Print

---

#### TR-04: Bardana Register

**Purpose:** Packaging advances issued and adjusted
**Audience:** Operator, Accountant
**Frequency:** Weekly

| Field | Description |
|-------|-------------|
| Voucher No | ID |
| Date | Issue date |
| Party | Farmer |
| Type | Jute/Plastic |
| Qty Issued | Bags given |
| Amount | Advance amount |
| Qty Received | Adjusted |
| Balance | Outstanding |
| Interest | Accrued interest |
| Status | Open/Closed |

**Filters:** Date Range, Party, Status
**Output:** Screen, Print

---

#### TR-05: Chitti Aging Report

**Purpose:** Old chittis for follow-up
**Audience:** Manager
**Frequency:** Weekly

| Field | Description |
|-------|-------------|
| Chitti No | ID |
| Date | Issue date |
| Age (Days) | Days old |
| Party | Kissan |
| Amount Pending | Uncollected |
| Transport Status | Delivered/In-transit |

**Filters:** Age threshold
**Output:** Screen, Print

---

### 5. Facility Reports

#### FL-01: Temperature Log

**Purpose:** Temperature readings over time
**Audience:** Manager, Operator
**Frequency:** Daily

| Field | Description |
|-------|-------------|
| Date/Time | Reading timestamp |
| Room | Storage room |
| Temperature | Reading value |
| Status | Normal/Alert |
| Recorded By | Person |

**Filters:** Date Range, Room
**Output:** Screen, Print, Chart

---

#### FL-02: Meter Reading Log

**Purpose:** Electricity consumption tracking
**Audience:** Manager
**Frequency:** Monthly

| Field | Description |
|-------|-------------|
| Date | Reading date |
| Reading | Meter value |
| Consumption | Units since last |
| Photo | Reference image |

**Filters:** Date Range
**Output:** Screen, Print

---

### 6. Audit Reports

#### AR-01: User Activity Log

**Purpose:** Track user actions for audit
**Audience:** Manager
**Frequency:** On-demand

| Field | Description |
|-------|-------------|
| Timestamp | Action time |
| User | Who performed |
| Action | What was done |
| Entity | Affected record |
| Old Value | Before change |
| New Value | After change |

**Filters:** Date Range, User, Action Type
**Output:** Screen, Export

---

#### AR-02: Voucher Cancellation Report

**Purpose:** Track cancelled vouchers
**Audience:** Manager, Accountant
**Frequency:** Monthly

| Field | Description |
|-------|-------------|
| Voucher No | ID |
| Original Date | When created |
| Cancel Date | When cancelled |
| Amount | Voucher value |
| Reason | Cancellation reason |
| Cancelled By | User |

**Filters:** Date Range
**Output:** Screen, Print

---

## Report Matrix by Role

| Report | Operator | Accountant | Manager | Owner |
|--------|----------|------------|---------|-------|
| **Stock Reports** |
| SR-01 Stock Summary | View, Print | View | View, Print, Export | View |
| SR-02 Room-wise Stock | View, Print | View | View, Print | View |
| SR-03 Lot Register | View, Print, Export | View | View, Print, Export | - |
| SR-04 Lot Aging | View | View | View, Print | View |
| SR-05 Stock Movement | View, Print | View, Print | View, Print, Export | - |
| **Party Reports** |
| PR-01 Party List | View, Print | View | View, Print, Export | - |
| PR-02 Party Ledger | View, Print | View, Print, Export | View, Print, Export | - |
| PR-03 Party Balance | View | View, Print | View, Print, Export | View |
| PR-04 Party Parcha | Print | Print | Print | - |
| PR-05 Overdue Accounts | View | View, Print | View, Print | View |
| PR-06 Guarantor Report | - | View | View, Print | - |
| **Financial Reports** |
| FR-01 Cash Book | - | View, Print | View, Print | View |
| FR-02 Bank Book | - | View, Print | View, Print | View |
| FR-03 Voucher Register | View | View, Print, Export | View, Print | - |
| FR-04 Balance Sheet | - | View | View, Print, Export | View, Print |
| FR-05 Trial Balance | - | View, Print | View, Print | - |
| FR-06 Interest Report | - | View, Print | View, Print | - |
| **Transaction Reports** |
| TR-01 Sauda Register | View, Print | View | View, Print, Export | - |
| TR-02 Pending Sauda | View, Print | View | View, Print | View |
| TR-03 Chitti Register | View, Print | View | View, Print | - |
| TR-04 Bardana Register | View, Print | View, Print | View, Print | - |
| TR-05 Chitti Aging | View | View | View, Print | - |
| **Facility Reports** |
| FL-01 Temperature Log | View, Print | - | View, Print | - |
| FL-02 Meter Reading | View | - | View, Print | View |
| **Audit Reports** |
| AR-01 User Activity | - | - | View, Export | View |
| AR-02 Cancellation | - | View | View, Print | - |

---

## Dashboard Widgets

### Widget Catalog

| Widget ID | Name | Type | Refresh | Drill-down |
|-----------|------|------|---------|------------|
| W-01 | Today's Activity | Counter Cards | Real-time | Transaction List |
| W-02 | Stock Summary | Gauge + Numbers | 5 min | Stock Dashboard |
| W-03 | Cash Position | Number Card | Real-time | Cash Book |
| W-04 | Receivables Summary | Breakdown | 15 min | Party Balance |
| W-05 | Pending Items | Alert List | Real-time | Respective Lists |
| W-06 | Storage Utilization | Progress Bars | 5 min | Room Report |
| W-07 | Collection Trend | Line Chart | Daily | Collection Report |
| W-08 | Aging Analysis | Bar Chart | Daily | Aging Report |
| W-09 | Temperature Status | Status Indicators | Real-time | Temperature Log |
| W-10 | Calendar | Month View | Daily | Day Events |
| W-11 | Quick Actions | Button Group | - | Respective Screens |
| W-12 | Alerts | Notification List | Real-time | Alert Details |

### Widget Configuration

Each dashboard can be customized with widgets based on role:

| Dashboard | Manager Widgets | Operator Widgets | Accountant Widgets |
|-----------|-----------------|------------------|-------------------|
| Main | W-01,02,03,04,05,07,08 | W-01,02,05,09,10,11 | W-01,03,04,05,07 |
| Stock | W-02,06,08 | W-02,06,09 | W-02 |
| Financial | W-03,04,07,08 | - | W-03,04,07,08 |

---

## Notes

1. **Real-time vs Cached:** Dashboard KPIs should refresh in real-time or at short intervals (5-15 min). Reports can use cached data.

2. **Drill-down:** All summary widgets and reports should allow drill-down to underlying transaction details.

3. **Export Formats:** Reports should support PDF for printing and Excel/CSV for data analysis.

4. **Date Defaults:**
   - Daily reports default to today
   - Weekly reports default to current week
   - Monthly reports default to current month
   - On-demand reports require explicit date selection

5. **Alerts:** Critical KPIs (temperature, overdue accounts, aging stock) should trigger notifications when thresholds are breached.

6. **Mobile Considerations:** Key dashboards (Main, Stock Summary, Cash Position) should be accessible on mobile devices for managers.
