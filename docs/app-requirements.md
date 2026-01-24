# Cold Storage - Application Requirements

## 1. Overview

**Application Name:** Cold Storage Management System
**Developer:** Ganesh Sutar
**Platform:** Desktop Application (Windows)

This is a comprehensive cold storage management system designed to manage farmers (Kissan), traders (Vyapari), inventory, billing, accounting, and reporting for an agricultural cold storage facility primarily dealing with potatoes and other commodities.

---

## 2. User Interface Structure

### 2.1 Main Menu Bar
- **Master** - Master data management
- **Transaction** - Day-to-day transactions
- **Cold Storage Reports** - Storage-specific reports
- **Stock Registers** - Inventory registers
- **Account Books** - Accounting modules
- **Machine Room** - Equipment/facility management
- **PayRoll** - Employee payroll
- **Verify** - Verification utilities
- **Utilities** - System utilities
- **Quit** - Exit application

### 2.2 Left Navigation Sidebar
- New Party
- Inward
- Voucher
- Bardana
- Nikasi Bill
- Cash Memo
- Sauda
- Chitti Bilti
- Stock
- Map
- Party Ledger
- Group Ledger
- Party Parcha
- Cash Book
- Sauda Register
- Chitti Ageing
- Party Balance
- Party Summary
- Meter Reading
- Temperature

### 2.3 Dashboard Tabs
- **Pending Sauda** - Pending deals/transactions
- **Kissan** - Farmer accounts and balances
- **Vyapari** - Trader accounts and stock
- **Over Due (C)** - Overdue accounts
- **Meter Reading** - Electricity meter photos
- **Temperature** - Temperature monitoring

### 2.4 Dashboard Widgets
- Calendar (Month view)
- Reminders/Events panel
- Quick action buttons (Sample Slip, Lot Search, Unloading Slip, Party Ledger, Party Parcha)

---

## 3. Core Modules

### 3.1 Party Management

#### 3.1.1 Account Master
**Purpose:** Create and manage party accounts (farmers, traders, and other stakeholders)

**Fields:**

| Field | Description |
|-------|-------------|
| Type of Account | Kissan (Farmer), Vyapari (Trader), etc. |
| Account No | Unique account identifier |
| Account Name | Full name of the party |
| Father/Husband | Relation (S/O, D/O, W/O) with name |
| Name in Hindi | Hindi transliteration |
| Subgroup of | Category (FARMER, SUNDRY DEBTORS, STAFF, etc.) |
| Village/City | Location with Hindi name |
| Address | Full address |
| Gurranter | Guarantor name |
| Phone | Contact number |
| E Mail | Email address |
| Aadhar No | Aadhaar identification |
| PAN | PAN card number |
| GST | GST number |
| TIN | TIN number |
| Remark | Additional notes |

**Financial Settings:**

| Field | Description |
|-------|-------------|
| Opening Bal | Opening balance (Dr/Cr) |
| Charge Int. From | Interest charging start date |
| Rent | Rent charges |
| Bardana | Jute bag/packaging charges |
| Other | Other charges |
| Loan | Loan amount |
| Interest | Interest amount |
| Interest pm | Interest per month (%) |
| Depreciation | Depreciation rate |
| DR Limit | Debit limit |
| Sauda Limit | Transaction limit |
| Due Days | Payment due days |
| Calculate Int. on Bardana | Interest calculation method (Default/Custom) |

**Bank Details:**
- Bank Name (dropdown with major Indian banks)
- Branch
- Account Number
- Account Name
- IFSC Code
- Cheque Numbers

#### 3.1.2 Account List View
**Features:**
- Searchable list of all accounts
- Filter by: Under (category), Village, Type
- Columns: Account Name, Village, Opening Balance, Phone, Nature, Account No, Sub Group
- Actions: Fresh List, Print List, Hide List

### 3.2 Stock Management

#### 3.2.1 Stock Summary
**Purpose:** View current stock position by commodity and room

**Filters:**
- Commodity (dropdown)
- Room (storage room number)
- Lot No
- Till Date

**Display Sections:**

**Amad (Incoming):**

| Category | Pkts | Wt | Rent |
|----------|------|----|----|
| Seedhi (Straight/Fresh) | Count | Weight | Amount |
| Dump | Count | Weight | Amount |

**Nikasi (Outgoing):**

| Category | Pkts | Wt | Rent |
|----------|------|----|----|
| Seedhi | Count | Weight | Amount |
| Katai (Cut/Sorted) | Count | Weight | Amount |

**Balance:**
- Current packets count
- Current weight
- Pending rent

**Room-wise Breakdown:**
- Room number
- Amad: Pkts, Wt, Rent
- Nikasi: Pkts, Wt, Rent
- Balance: Pkts, Wt, Rent

**Actions:**
- Amad (View incoming)
- Reloading
- Amad + Reloading + All Commodity
- Print Summary
- Print Detailed

#### 3.2.2 Item Master (Commodity Configuration)
**Purpose:** Configure commodities and their pricing

**Fields:**

| Field | Description |
|-------|-------------|
| Commodity | Name (AKHROT, POTATO, S.S COLD, etc.) |
| Item Group | Category grouping |
| Unit | Unit of measurement |
| Charge Rent | Monthly/Seasonaly |
| Rate/QTL | Rate per quintal (Field/Mandi) |
| Rate/Unit | Rate per unit (Field/Mandi) |

**Grace Period Settings:**

| Field | Description |
|-------|-------------|
| Zero Rent | Days of zero rent |
| Half Rent | Days of half rent |
| Rent On | Quantity or Weight based |

### 3.3 Transaction Management

#### 3.3.1 Advance for Bardana
**Purpose:** Manage advance payments for jute bags/packaging materials

**Header Fields:**
- Date
- Voucher No
- Party Name
- Village
- Bardana Type (JUTE, etc.)
- Rate

**Qty Issued Section:**
- Quantity Issued
- Dr Amount
- Int @ pm (Interest per month)
- Expected Arrival
- Expected Bags

**Qty Received Section:**
- Quantity Received
- Cr Amount
- Ref. No
- Narrations

**Party Selection:**
- Search by Name, Village, Party Code
- Filter by category
- Shows: Description, Village, AccNo, Group, Garanter

#### 3.3.2 Chitti (Receipt/Slip) Management
**Purpose:** Generate and search delivery receipts

**Search Fields:**
- Chitti No
- Date
- Nikasi Bill
- Vyapari
- Transport
- Vehicle
- Bilti No
- Delivered To
- Dr Limit
- Acc Balance
- Amount Payable

**Party Search:**
- Name
- Village
- Party Code
- Category filter (Aarti, etc.)

#### 3.3.3 Voucher System
**Purpose:** Financial voucher entry for all transactions

**Voucher Types (Hotkeys):**

| Key | Type |
|-----|------|
| F1 | List of Vouchers |
| F2 | Change Date |
| F4 | Contra |
| F5 | Payment |
| F6 | Receipt |
| F7 | Journal |
| F8 | Bhugtaan (Payment) |

**Voucher Entry Fields:**
- Voucher Type
- Voucher No
- Date
- Dr/Cr indicator
- Particulars
- Dr Amount
- Cr Amount
- Ref. No
- Int @ pm
- Marfat (Through/Agent)
- Narration lines

**Party Balance Display:**

| Item | Dr Amount | Cr Amount | Balance |
|------|-----------|-----------|---------|
| Party Amad Bal | - | - | - |
| Opening | - | - | - |
| Rent | - | - | - |
| Bardana | - | - | - |
| Others | - | - | - |
| Loan | - | - | - |
| Interest | - | - | - |
| Total | - | - | - |

**Additional Info:**
- Un.Rent (Unpaid Rent)
- Loan/Bag
- Avg/Bag
- Stock quantity
- Contact numbers

### 3.4 Dashboard Views

#### 3.4.1 Kissan (Farmer) Tab
**Display Columns:**
- Name (with Father's name in S/O format)
- Village
- Phone
- Balance Amount
- Temperature status

**Bottom Section:**
- Lot No
- Name
- Marka (Mark/Brand)
- Pkts (Packets)
- Map

**Quick Actions:**
- Account Balance (icon)
- Total Amad count
- Sample Slip
- Lot Search
- Unloading Slip
- Party Ledger
- Cancel
- Party Parcha

#### 3.4.2 Vyapari (Trader) Tab
**Display Columns:**
- Trader Name
- Phone Number
- Stock Amad (Incoming quantity)
- Stock Nikasi (Outgoing quantity)
- Temperature

**Features:**
- Top 20 traders summary
- Total calculation row

#### 3.4.3 Meter Reading Tab
**Purpose:** Photo gallery of electricity meter readings

**Features:**
- Grid layout of meter/storage photos
- Visual documentation of stored goods
- Date-stamped images

#### 3.4.4 Temperature Tab
**Purpose:** Monitor storage temperature

### 3.5 Reports

#### 3.5.1 Balance Sheet
**Features:**
- Date range selection
- Hierarchical tree view
- Fresh List button
- Print functionality
- Export option

---

## 4. Key Terminology (Hindi/Industry)

| Hindi Term | English Meaning |
|------------|-----------------|
| Kissan | Farmer |
| Vyapari | Trader/Merchant |
| Sauda | Deal/Transaction |
| Bardana | Jute bags/Packaging material |
| Chitti | Receipt/Slip |
| Bilti | Lorry receipt/Transport document |
| Nikasi | Outgoing/Dispatch |
| Amad | Incoming/Receipt |
| Marka | Mark/Brand |
| Pkts | Packets/Bags |
| Parcha | Document/Slip |
| Bhugtaan | Payment |
| Aarti | Commission agent |
| Gurranter | Guarantor |
| Marfat | Through/Via (agent) |
| Seedhi | Straight/Fresh (unprocessed) |
| Katai | Cut/Sorted/Processed |
| QTL | Quintal (100 kg) |

---

## 5. Data Entities

### 5.1 Party/Account
- Account Number (unique)
- Type (Kissan/Vyapari/Staff/Sundry Debtors)
- Personal details
- Financial limits and settings
- Bank information

### 5.2 Lot
- Lot Number
- Party reference
- Marka (brand/mark)
- Commodity
- Room allocation
- Packet count
- Weight

### 5.3 Stock Transaction
- Transaction type (Amad/Nikasi)
- Date
- Party
- Lot reference
- Quantity (Pkts, Weight)
- Category (Seedhi/Dump/Katai)
- Rent calculation

### 5.4 Voucher
- Voucher Number
- Voucher Type
- Date
- Party
- Debit/Credit entries
- Interest calculations
- Reference numbers

### 5.5 Commodity/Item
- Name
- Group
- Unit
- Rent type (Monthly/Seasonal)
- Rate structure
- Grace period settings

---

## 6. Business Rules

### 6.1 Rent Calculation
- Grace period with zero rent
- Half rent period
- Full rent after grace period
- Can be based on Quantity or Weight
- Supports Monthly or Seasonal charging

### 6.2 Interest Calculation
- Configurable interest rate per month
- Can be applied on Bardana advances
- Linked to due days setting

### 6.3 Credit Limits
- DR Limit per party
- Sauda Limit for transactions
- Due Days for payment terms

### 6.4 Stock Tracking
- Room-wise allocation
- Lot-based tracking
- Separate tracking for incoming (Amad) and outgoing (Nikasi)
- Category tracking (Seedhi, Dump, Katai)

---

## 7. User Interface Requirements

### 7.1 Visual Design
- Pink/Magenta color theme
- Classic Windows form-based interface
- Hindi language support (Devanagari script)
- On-screen Hindi keyboard for text input

### 7.2 Navigation
- Menu bar for module access
- Left sidebar for quick actions
- Tab-based dashboard
- Modal dialogs for data entry forms

### 7.3 Data Entry
- Search/filter functionality in list views
- Dropdown selections for predefined values
- Keyboard shortcuts for voucher types
- Auto-calculation for totals and balances

### 7.4 Printing
- Print List functionality
- Print Summary
- Print Detailed reports
- Balance Sheet printing

---

## 8. Integration Points

### 8.1 External Systems (Potential)
- Bank integration for cheque management
- SMS notifications (phone numbers stored)
- Temperature monitoring sensors
- Meter reading capture

### 8.2 Hardware
- Barcode/label printing for lot identification
- Photo capture for meter readings
- Temperature sensors for monitoring

---

## 9. Security Requirements

### 9.1 Authentication
- User authentication with email/password
- Session management with secure tokens

### 9.2 Role-Based Access Control

The system uses a simplified permission-based access control model:

| Role | Permissions | Description |
|------|-------------|-------------|
| **Admin** | All permissions | Full access to all system features, settings, and user management |
| **Operator** | All permissions (for now) | Currently has full access; will be limited to specific operational permissions in future versions |

> **Note:** In the initial version, both Admin and Operator roles have full access. Future versions will introduce granular permissions to restrict Operator access to specific modules (e.g., Administration, Financial approvals).

### 9.3 System Actors

| Actor | Description |
|-------|-------------|
| **System** | Automated processes for calculations, alerts, and scheduled tasks |
| **Operator** | Human users performing all operations (data entry, transactions, reports, configuration) |

### 9.4 Audit & Backup
- Audit trail for financial transactions
- Data backup utilities

---

## 10. Screenshots Reference

| # | Screenshot | Description |
|---|------------|-------------|
| 01 | initial-view-no-sidebar | Main dashboard without sidebar expanded |
| 02 | kissan-tab-with-sidebar | Farmer list with navigation sidebar |
| 03 | vyapari-tab-traders | Trader list with stock summary |
| 04 | meter-reading-photo-gallery | Photo gallery of meter/storage images |
| 05 | pending-sauda-tab | Pending deals list |
| 06 | account-master-form-empty | Empty account creation form |
| 07 | account-list-filter-view | Searchable account list |
| 08 | account-master-form-filled | Filled account form with bank dropdown |
| 09 | advance-bardana-party-list | Party selection for bardana advance |
| 10 | advance-bardana-entry-form | Bardana advance entry form |
| 11 | chitti-search-dialog | Receipt search with party lookup |
| 12 | stock-summary | Stock summary by room and commodity |
| 13 | dashboard-payment-dropdown | Payment menu expanded |
| 14 | voucher-form-bhugtaan | Payment voucher entry |
| 15 | vyapari-tab-loading | Trader tab with loading indicator |
| 16 | balance-sheet-report | Balance sheet report view |
| 17 | item-master-form | Commodity configuration form |
| 18 | commodity-search-list | Commodity list view |
| 19 | commodity-search-selected | Commodity selection highlighted |
| 20 | screen-recording-controls | Screen recording utility |
