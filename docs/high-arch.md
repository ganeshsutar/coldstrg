# Cold Storage Management System - High-Level Architecture

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Architecture Diagram](#3-architecture-diagram)
4. [Multi-Tenant Architecture](#4-multi-tenant-architecture)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Services Architecture](#6-backend-services-architecture)
7. [Database Architecture](#7-database-architecture)
8. [File Storage](#8-file-storage)
9. [Scheduled Jobs & Background Processing](#9-scheduled-jobs--background-processing)
10. [Integration Points](#10-integration-points)
11. [Security Architecture](#11-security-architecture)
12. [Technology Stack Recommendations](#12-technology-stack-recommendations)
13. [Implementation Phases](#13-implementation-phases)
14. [Non-Functional Requirements](#14-non-functional-requirements)

---

## 1. Executive Summary

The Cold Storage Management System is a comprehensive desktop application for managing agricultural cold storage facilities, primarily dealing with potatoes and other commodities. The system handles:

- **Party Management**: Farmers (Kissan), Traders (Vyapari), and other stakeholders
- **Stock Operations**: Incoming (Amad) and outgoing (Nikasi) inventory tracking
- **Financial Transactions**: Vouchers, payments, receipts, advances (Bardana)
- **Trading Deals**: Sauda (deals) between farmers and traders
- **Billing**: Chitti (delivery receipts), Nikasi Bills, Cash Memos
- **Reporting**: Ledgers, balance sheets, stock registers
- **Facility Monitoring**: Temperature logs, meter readings

### Key Requirements
- Windows desktop application
- Hindi language support with on-screen keyboard
- Offline-first capability (single facility)
- Print support for all documents
- Photo capture for meter readings
- Multi-user access within the facility

---

## 2. System Overview

### 2.1 Domain Model

```
+-----------------------------------------------------------------------------+
|                        COLD STORAGE DOMAIN                                   |
+-----------------------------------------------------------------------------+
|                                                                              |
|  +-------------+    +-------------+    +-------------+    +-------------+   |
|  |   PARTIES   |    |   STORAGE   |    |  FINANCIAL  |    |   TRADING   |   |
|  +-------------+    +-------------+    +-------------+    +-------------+   |
|  | - Kissan    |    | - Rooms     |    | - Vouchers  |    | - Sauda     |   |
|  | - Vyapari   |    | - Lots      |    | - Bardana   |    | - Chitti    |   |
|  | - Staff     |    | - Commodity |    | - Interest  |    | - Nikasi    |   |
|  | - Aarti     |    | - Amad      |    | - Ledger    |    |   Bill      |   |
|  | - Village   |    | - Nikasi    |    | - Cash Book |    | - Cash Memo |   |
|  +-------------+    +-------------+    +-------------+    +-------------+   |
|                                                                              |
|  +-------------+    +-------------+                                          |
|  |  FACILITY   |    |  REPORTING  |                                          |
|  +-------------+    +-------------+                                          |
|  | - Meter     |    | - Balance   |                                          |
|  |   Reading   |    |   Sheet     |                                          |
|  | - Temp      |    | - Stock     |                                          |
|  |   Logs      |    |   Register  |                                          |
|  +-------------+    +-------------+                                          |
|                                                                              |
+-----------------------------------------------------------------------------+
```

### 2.2 User Roles

The system uses a simplified role-based access control model:

| Role | Description | Primary Functions |
|------|-------------|-------------------|
| **Admin** | Organization administrator | Full control, user management, settings, all operations |
| **Operator** | Primary system user (staff) | All operations (for now); will be limited in future versions |

> **Note:** In the initial version, both Admin and Operator roles have full access. Future versions will introduce granular permissions to restrict Operator access to specific modules.

---

## 3. Architecture Diagram

```
+-----------------------------------------------------------------------------+
|                              PRESENTATION LAYER                              |
+-----------------------------------------------------------------------------+
|                                                                              |
|  +-----------------------------------------------------------------------+  |
|  |                     DESKTOP APPLICATION (Electron/Tauri)               |  |
|  |  +-----------+ +-----------+ +-----------+ +-----------+              |  |
|  |  | Dashboard | |   Party   | |   Stock   | |  Finance  |              |  |
|  |  |   Module  | |  Module   | |  Module   | |  Module   |              |  |
|  |  +-----------+ +-----------+ +-----------+ +-----------+              |  |
|  |  +-----------+ +-----------+ +-----------+ +-----------+              |  |
|  |  |  Trading  | |  Billing  | |  Reports  | |  Facility |              |  |
|  |  |  Module   | |  Module   | |  Module   | |  Module   |              |  |
|  |  +-----------+ +-----------+ +-----------+ +-----------+              |  |
|  |                                                                        |  |
|  |  +------------------------------------------------------------------+ |  |
|  |  |  SHARED COMPONENTS                                                | |  |
|  |  |  - Hindi Keyboard  - Print Service  - Photo Capture              | |  |
|  |  |  - Search/Filter   - Data Grid      - Form Components            | |  |
|  |  +------------------------------------------------------------------+ |  |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
+-----------------------------------------------------------------------------+
                                      |
                                      v
+-----------------------------------------------------------------------------+
|                              APPLICATION LAYER                               |
+-----------------------------------------------------------------------------+
|                                                                              |
|  +-----------------------------------------------------------------------+  |
|  |                        BACKEND API (Node.js/Fastify)                   |  |
|  |                                                                        |  |
|  |  +--------------+  +--------------+  +--------------+                 |  |
|  |  |Party Service |  |Stock Service |  |Finance Svc   |                 |  |
|  |  |              |  |              |  |              |                 |  |
|  |  | - CRUD       |  | - Amad       |  | - Vouchers   |                 |  |
|  |  | - Search     |  | - Nikasi     |  | - Bardana    |                 |  |
|  |  | - Limits     |  | - Reloading  |  | - Interest   |                 |  |
|  |  +--------------+  +--------------+  +--------------+                 |  |
|  |                                                                        |  |
|  |  +--------------+  +--------------+  +--------------+                 |  |
|  |  |Trading Svc   |  |Billing Svc   |  |Report Service|                 |  |
|  |  |              |  |              |  |              |                 |  |
|  |  | - Sauda      |  | - Chitti     |  | - Ledger     |                 |  |
|  |  | - Execute    |  | - Nikasi Bill|  | - Cash Book  |                 |  |
|  |  | - Cancel     |  | - Cash Memo  |  | - Balance    |                 |  |
|  |  +--------------+  +--------------+  +--------------+                 |  |
|  |                                                                        |  |
|  |  +--------------+  +--------------+  +--------------+                 |  |
|  |  |Facility Svc  |  |Master Data   |  |Auth Service  |                 |  |
|  |  |              |  |Service       |  |              |                 |  |
|  |  | - Meter      |  | - Commodity  |  | - Login      |                 |  |
|  |  | - Temp       |  | - Room       |  | - Roles      |                 |  |
|  |  | - Alerts     |  | - Village    |  | - Audit      |                 |  |
|  |  +--------------+  +--------------+  +--------------+                 |  |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
|  +-----------------------------------------------------------------------+  |
|  |                     BACKGROUND JOB PROCESSOR                           |  |
|  |  - Interest Calculator  - Rent Calculator  - Alert Generator          |  |
|  |  - Temperature Monitor  - Database Backup  - Report Pre-generator     |  |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
+-----------------------------------------------------------------------------+
                                      |
                                      v
+-----------------------------------------------------------------------------+
|                                DATA LAYER                                    |
+-----------------------------------------------------------------------------+
|                                                                              |
|  +-----------------------------+    +-----------------------------+         |
|  |        PostgreSQL           |    |       File Storage          |         |
|  |  +-----------------------+  |    |  +-----------------------+  |         |
|  |  |    Master Tables      |  |    |  |   Meter Photos        |  |         |
|  |  |  - Party              |  |    |  |   /uploads/meter/     |  |         |
|  |  |  - Commodity          |  |    |  +-----------------------+  |         |
|  |  |  - Room               |  |    |  +-----------------------+  |         |
|  |  |  - Village            |  |    |  |   Generated Reports   |  |         |
|  |  +-----------------------+  |    |  |   /reports/           |  |         |
|  |  +-----------------------+  |    |  +-----------------------+  |         |
|  |  |  Transaction Tables   |  |    |  +-----------------------+  |         |
|  |  |  - Stock Transaction  |  |    |  |   Database Backups    |  |         |
|  |  |  - Voucher            |  |    |  |   /backups/           |  |         |
|  |  |  - Bardana            |  |    |  +-----------------------+  |         |
|  |  |  - Sauda              |  |    |                             |         |
|  |  |  - Chitti             |  |    +-----------------------------+         |
|  |  |  - Lot                |  |                                            |
|  |  +-----------------------+  |                                            |
|  |  +-----------------------+  |                                            |
|  |  |    Record Tables      |  |                                            |
|  |  |  - Meter Reading      |  |                                            |
|  |  |  - Temperature        |  |                                            |
|  |  |  - Audit Log          |  |                                            |
|  |  +-----------------------+  |                                            |
|  +-----------------------------+                                            |
|                                                                              |
+-----------------------------------------------------------------------------+
```

---

## 4. Multi-Tenant Architecture

The system adopts a **Pool Model (Shared Resources)** multi-tenant architecture, enabling users to access multiple organizations (cold storage facilities) with a single identity.

### 4.1 Tenancy Overview

```
+-----------------------------------------------------------------------------+
|                           MULTI-TENANT LAYER                                 |
+-----------------------------------------------------------------------------+
|                                                                              |
|  +---------------------------+          +-------------------------------+   |
|  |      IDENTITY LAYER       |          |      ORGANIZATION LAYER       |   |
|  +---------------------------+          +-------------------------------+   |
|  |                           |          |                               |   |
|  |  +-------------------+    |          |  +-------------------------+  |   |
|  |  |   Global Users    |    |   N:M    |  |    Organizations        |  |   |
|  |  |                   |<------------>|  |    (Tenants)            |  |   |
|  |  | - email/password  |    |          |  | - Cold Store Agra      |  |   |
|  |  | - profile         |    |          |  | - Cold Store Mathura   |  |   |
|  |  +-------------------+    |          |  | - Cold Store Delhi     |  |   |
|  |                           |          |  +-------------------------+  |   |
|  +---------------------------+          +-------------------------------+   |
|                                                    |                         |
|                    +-------------------------------+                         |
|                    |   Organization Membership                               |
|                    |   (Junction Table)                                      |
|                    |   - user_id                                             |
|                    |   - organization_id                                     |
|                    |   - role (OWNER/ADMIN/MANAGER/etc.)                     |
|                    +-------------------------------+                         |
|                                    |                                         |
|                                    v                                         |
|  +-----------------------------------------------------------------------+  |
|  |                    ORGANIZATION-SCOPED DATA                            |  |
|  |  +----------+  +----------+  +----------+  +----------+  +----------+ |  |
|  |  | Parties  |  |   Lots   |  | Vouchers |  |  Sauda   |  |  Rooms   | |  |
|  |  | org_id   |  | org_id   |  | org_id   |  | org_id   |  | org_id   | |  |
|  |  +----------+  +----------+  +----------+  +----------+  +----------+ |  |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
+-----------------------------------------------------------------------------+
```

### 4.2 Key Components

| Component | Description |
|-----------|-------------|
| **Global User** | Individual identity independent of organizations |
| **Organization** | Tenant boundary (cold storage facility) |
| **Membership** | Links users to organizations with roles |
| **Org Context** | Active organization for API requests |

### 4.3 Data Isolation Strategy

All business data is isolated by `organization_id`:

```
API Request                 Middleware                    Database Query
+-----------+              +-------------+               +------------------+
| GET /api/ |    +----->   | Verify      |    +----->   | SELECT * FROM    |
| parties   |    |         | membership  |    |         | parties          |
| Header:   |    |         | for org_id  |    |         | WHERE org_id =   |
| X-Org-ID  |----+         +-------------+----+         | 'org_123'        |
+-----------+                                            +------------------+
```

### 4.4 Organization Roles

The system uses a simplified role-based access control model:

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Admin** | Organization administrator | Full control, user management, settings, all operations |
| **Operator** | Primary system user (staff) | All operations (for now); will be limited in future versions |

> **Actor Consolidation:** The original design had multiple roles (Owner, Admin, Manager, Accountant, Operator, Viewer). These have been consolidated into Admin and Operator for simplicity, with access control managed through the permission system rather than separate roles.

> **Note:** For detailed multi-tenancy specifications, see [Multi-Tenancy Architecture](multi-tenancy-user-org.md).

---

## 5. Frontend Architecture

### 5.1 Technology Choice

**Recommended: Electron + React + TypeScript**

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Shell | Electron | Windows desktop, native integration, offline support |
| UI Framework | React 18+ | Component-based, rich ecosystem, TypeScript support |
| State Management | Zustand/Redux Toolkit | Complex state across modules |
| UI Components | Ant Design / MUI | Enterprise-ready, form controls, Hindi support |
| Data Grid | AG Grid / TanStack Table | Large datasets, sorting, filtering |
| Forms | React Hook Form + Zod | Validation, performance |
| Styling | Tailwind CSS | Rapid UI development |
| Print | Electron IPC + Native Print | Receipt/report printing |

### 5.2 Module Structure

```
src/
├── main/                          # Electron main process
│   ├── index.ts                   # Main entry
│   ├── ipc/                       # IPC handlers
│   │   ├── print.ipc.ts          # Print functionality
│   │   ├── file.ipc.ts           # File operations
│   │   └── camera.ipc.ts         # Photo capture
│   └── services/
│       └── backup.service.ts     # Local backup
│
├── renderer/                      # React application
│   ├── App.tsx
│   ├── modules/
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── KissanTab.tsx
│   │   │   │   ├── VyapariTab.tsx
│   │   │   │   ├── PendingSaudaTab.tsx
│   │   │   │   └── OverdueTab.tsx
│   │   │   └── Dashboard.tsx
│   │   │
│   │   ├── party/
│   │   │   ├── components/
│   │   │   │   ├── PartyForm.tsx
│   │   │   │   ├── PartyList.tsx
│   │   │   │   └── PartySearch.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useParty.ts
│   │   │   └── Party.module.tsx
│   │   │
│   │   ├── stock/
│   │   │   ├── components/
│   │   │   │   ├── AmadForm.tsx
│   │   │   │   ├── NikasiForm.tsx
│   │   │   │   ├── StockSummary.tsx
│   │   │   │   ├── LotSearch.tsx
│   │   │   │   └── ReloadingForm.tsx
│   │   │   └── Stock.module.tsx
│   │   │
│   │   ├── finance/
│   │   │   ├── components/
│   │   │   │   ├── VoucherForm.tsx
│   │   │   │   ├── BardanaForm.tsx
│   │   │   │   └── VoucherList.tsx
│   │   │   └── Finance.module.tsx
│   │   │
│   │   ├── trading/
│   │   │   ├── components/
│   │   │   │   ├── SaudaForm.tsx
│   │   │   │   ├── SaudaList.tsx
│   │   │   │   └── SaudaExecute.tsx
│   │   │   └── Trading.module.tsx
│   │   │
│   │   ├── billing/
│   │   │   ├── components/
│   │   │   │   ├── ChittiForm.tsx
│   │   │   │   ├── NikasiBill.tsx
│   │   │   │   └── CashMemo.tsx
│   │   │   └── Billing.module.tsx
│   │   │
│   │   ├── reports/
│   │   │   ├── components/
│   │   │   │   ├── PartyLedger.tsx
│   │   │   │   ├── CashBook.tsx
│   │   │   │   ├── BalanceSheet.tsx
│   │   │   │   ├── StockRegister.tsx
│   │   │   │   └── PartyBalance.tsx
│   │   │   └── Reports.module.tsx
│   │   │
│   │   ├── facility/
│   │   │   ├── components/
│   │   │   │   ├── MeterReading.tsx
│   │   │   │   ├── TemperatureLog.tsx
│   │   │   │   └── PhotoGallery.tsx
│   │   │   └── Facility.module.tsx
│   │   │
│   │   └── master/
│   │       ├── components/
│   │       │   ├── CommodityMaster.tsx
│   │       │   ├── RoomMaster.tsx
│   │       │   └── VillageMaster.tsx
│   │       └── Master.module.tsx
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── HindiKeyboard.tsx     # On-screen Hindi keyboard
│   │   │   ├── PartySearchModal.tsx  # Reusable party search
│   │   │   ├── DataGrid.tsx          # Configurable data grid
│   │   │   ├── PrintPreview.tsx      # Print preview component
│   │   │   ├── DatePicker.tsx        # Date picker with Hindi
│   │   │   └── AmountInput.tsx       # Currency input
│   │   ├── hooks/
│   │   │   ├── useApi.ts             # API call wrapper
│   │   │   ├── usePrint.ts           # Print functionality
│   │   │   └── useKeyboard.ts        # Keyboard shortcuts
│   │   └── utils/
│   │       ├── formatters.ts         # Number/date formatting
│   │       ├── validators.ts         # Validation rules
│   │       └── calculations.ts       # Rent/interest calc
│   │
│   ├── store/                        # State management
│   │   ├── auth.store.ts
│   │   ├── party.store.ts
│   │   ├── stock.store.ts
│   │   └── ui.store.ts
│   │
│   └── api/                          # API client
│       ├── client.ts                 # Axios/fetch config
│       ├── party.api.ts
│       ├── stock.api.ts
│       └── finance.api.ts
│
└── shared/                           # Shared between main/renderer
    ├── types/
    │   ├── party.types.ts
    │   ├── stock.types.ts
    │   └── finance.types.ts
    └── constants/
        ├── voucher-types.ts
        └── party-types.ts
```

### 5.3 Key UI Components

#### 5.3.1 Hindi Keyboard Component

```typescript
// Conceptual structure for Hindi keyboard
interface HindiKeyboardProps {
  onInput: (text: string) => void;
  visible: boolean;
  onClose: () => void;
}

// Features:
// - Full Devanagari character set
// - Common conjuncts (matras)
// - Transliteration support (optional)
// - Floating/docked modes
```

#### 5.3.2 Party Search Modal

```typescript
// Reusable party search component
interface PartySearchProps {
  filter?: {
    type?: PartyType[];
    village?: string;
    subgroup?: string;
  };
  onSelect: (party: Party) => void;
  showBalance?: boolean;
}

// Features:
// - Real-time search
// - Multiple filter criteria
// - Shows key party info
// - Balance display option
```

### 5.4 Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| F1 | List vouchers | Voucher module |
| F2 | Change date | Voucher entry |
| F4 | Contra voucher | Voucher module |
| F5 | Payment voucher | Voucher module |
| F6 | Receipt voucher | Voucher module |
| F7 | Journal voucher | Voucher module |
| F8 | Bhugtaan | Voucher module |
| Ctrl+P | Print | Global |
| Ctrl+S | Save | Forms |
| Ctrl+N | New | List views |
| Esc | Cancel/Close | Global |

---

## 5. Backend Services Architecture

### 5.1 Service Overview

```
+-----------------------------------------------------------------------------+
|                            BACKEND SERVICES                                  |
+-----------------------------------------------------------------------------+
|                                                                              |
|  +-----------------------------------------------------------------------+  |
|  |                         API GATEWAY LAYER                              |  |
|  |  - Request validation    - Rate limiting    - Error handling          |  |
|  |  - Authentication        - Logging          - Response formatting     |  |
|  +-----------------------------------------------------------------------+  |
|                                      |                                       |
|  +-----------------------------------+-----------------------------------+   |
|  |                                   v                                   |   |
|  |  +--------------+  +--------------+  +--------------+                |   |
|  |  |Party Service |  |Stock Service |  |Finance Svc   |                |   |
|  |  |              |  |              |  |              |                |   |
|  |  | POST /party  |  | POST /amad   |  | POST /voucher|                |   |
|  |  | GET /party   |  | POST /nikasi |  | POST /bardana|                |   |
|  |  | PUT /party   |  | GET /stock   |  | GET /ledger  |                |   |
|  |  | GET /search  |  | GET /lot     |  | POST /interest|               |   |
|  |  +--------------+  +--------------+  +--------------+                |   |
|  |                                                                       |   |
|  |  +--------------+  +--------------+  +--------------+                |   |
|  |  |Trading Svc   |  |Billing Svc   |  |Report Svc    |                |   |
|  |  |              |  |              |  |              |                |   |
|  |  | POST /sauda  |  | POST /chitti |  | GET /ledger  |                |   |
|  |  | PUT /execute |  | POST /bill   |  | GET /cashbook|                |   |
|  |  | PUT /cancel  |  | POST /memo   |  | GET /balance |                |   |
|  |  +--------------+  +--------------+  +--------------+                |   |
|  |                                                                       |   |
|  |  +--------------+  +--------------+  +--------------+                |   |
|  |  |Facility Svc  |  |Master Svc    |  |Auth Service  |                |   |
|  |  |              |  |              |  |              |                |   |
|  |  | POST /meter  |  | CRUD /commodity| POST /login  |                |   |
|  |  | POST /temp   |  | CRUD /room   |  | GET /session |                |   |
|  |  | GET /alerts  |  | CRUD /village|  | POST /logout |                |   |
|  |  +--------------+  +--------------+  +--------------+                |   |
|  |                                                                       |   |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
+-----------------------------------------------------------------------------+
```

### 5.2 Service Definitions

#### 5.2.1 Party Service

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/party` | POST | Create new party |
| `/api/party/:id` | GET | Get party by ID |
| `/api/party/:id` | PUT | Update party |
| `/api/party/:id` | DELETE | Soft delete party |
| `/api/party/search` | GET | Search parties with filters |
| `/api/party/:id/balance` | GET | Get party balance summary |
| `/api/party/:id/limits` | PUT | Update financial limits |

#### 5.2.2 Stock Service

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stock/amad` | POST | Record incoming stock |
| `/api/stock/nikasi` | POST | Record outgoing stock |
| `/api/stock/reload` | POST | Transfer between rooms |
| `/api/stock/summary` | GET | Get stock summary |
| `/api/lot` | GET | List lots with filters |
| `/api/lot/:id` | GET | Get lot details |
| `/api/lot/:id/history` | GET | Get lot transaction history |

#### 5.2.3 Finance Service

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/voucher` | POST | Create voucher |
| `/api/voucher/:id` | GET | Get voucher |
| `/api/voucher/:id` | PUT | Update voucher (same day) |
| `/api/voucher/:id/cancel` | POST | Cancel voucher |
| `/api/bardana` | POST | Create bardana advance |
| `/api/bardana/:id/adjust` | POST | Adjust bardana |
| `/api/interest/calculate` | POST | Calculate interest |

#### 5.2.4 Trading Service

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sauda` | POST | Create sauda |
| `/api/sauda` | GET | List saudas |
| `/api/sauda/:id` | GET | Get sauda details |
| `/api/sauda/:id/execute` | POST | Execute sauda |
| `/api/sauda/:id/cancel` | POST | Cancel sauda |

#### 5.2.5 Billing Service

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chitti` | POST | Generate chitti |
| `/api/chitti/:id` | GET | Get chitti |
| `/api/chitti/search` | GET | Search chitti |
| `/api/nikasi-bill` | POST | Generate nikasi bill |
| `/api/cash-memo` | POST | Generate cash memo |

#### 5.2.6 Report Service

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/report/party-ledger/:id` | GET | Party ledger report |
| `/api/report/cash-book` | GET | Cash book report |
| `/api/report/balance-sheet` | GET | Balance sheet |
| `/api/report/stock-register` | GET | Stock register |
| `/api/report/party-balance` | GET | Party balance summary |
| `/api/report/sauda-register` | GET | Sauda register |

#### 5.2.7 Facility Service

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/meter-reading` | POST | Record meter reading |
| `/api/meter-reading` | GET | List meter readings |
| `/api/temperature` | POST | Record temperature |
| `/api/temperature` | GET | Get temperature history |
| `/api/facility/alerts` | GET | Get active alerts |

#### 5.2.8 Master Data Service

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/commodity` | CRUD | Commodity master |
| `/api/room` | CRUD | Room master |
| `/api/village` | CRUD | Village master |
| `/api/config` | GET/PUT | System configuration |

### 5.3 Service Implementation Pattern

```typescript
// Example service structure
// src/services/party/party.service.ts

interface PartyService {
  // Commands (write operations)
  create(data: CreatePartyDTO): Promise<Party>;
  update(id: string, data: UpdatePartyDTO): Promise<Party>;
  delete(id: string): Promise<void>;
  updateLimits(id: string, limits: FinancialLimits): Promise<Party>;

  // Queries (read operations)
  findById(id: string): Promise<Party | null>;
  search(criteria: PartySearchCriteria): Promise<PaginatedResult<Party>>;
  getBalance(id: string): Promise<PartyBalance>;
  getBalanceSummary(id: string): Promise<PartyBalanceSummary>;
}

// Business logic encapsulated in service layer
// Repository pattern for data access
// DTOs for input validation
// Domain events for cross-service communication
```

---

## 6. Database Architecture

### 6.1 Entity Relationship Overview

```
+-----------------------------------------------------------------------------+
|                           DATABASE SCHEMA                                    |
+-----------------------------------------------------------------------------+
|                                                                              |
|  MASTER TABLES                                                               |
|  +--------------+    +--------------+    +--------------+                   |
|  |   village    |    |  commodity   |    |     room     |                   |
|  +--------------+    +--------------+    +--------------+                   |
|  | id           |    | id           |    | id           |                   |
|  | name         |    | name         |    | room_no      |                   |
|  | name_hindi   |    | unit         |    | capacity     |                   |
|  | district     |    | charge_rent  |    | target_temp  |                   |
|  | state        |    | rates...     |    | status       |                   |
|  +--------------+    | grace_period |    +--------------+                   |
|         |            +--------------+           |                            |
|         |                   |                   |                            |
|         v                   |                   |                            |
|  +----------------------+   |                   |                            |
|  |                      |   |                   |                            |
|  |  +------------------------------------------------------+               |
|  |  |                      party                            |               |
|  |  +------------------------------------------------------+               |
|  |  | id                    | interest_rate_pm              |               |
|  |  | account_no            | dr_limit                      |               |
|  |  | account_name          | sauda_limit                   |               |
|  |  | account_type          | due_days                      |               |
|  |  | name_hindi            | bank_details (JSON)           |               |
|  |  | village_id (FK)       | guarantor_id (FK)             |               |
|  |  | opening_balance       | created_at                    |               |
|  |  | opening_balance_type  | updated_at                    |               |
|  |  +------------------------------------------------------+               |
|  |                          |                                                |
|  |                          |                                                |
|  |  TRANSACTION TABLES      |                                                |
|  |                          v                                                |
|  |  +------------------------------------------------------+               |
|  |  |                       lot                             |               |
|  |  +------------------------------------------------------+               |
|  |  | id              | current_packets                     |               |
|  |  | lot_no          | current_weight                      |               |
|  |  | party_id (FK)   | category                            |               |
|  |  | commodity_id(FK)| status                              |               |
|  |  | room_id (FK)    | arrival_date                        |               |
|  |  | marka           | created_at                          |               |
|  |  | initial_packets | updated_at                          |               |
|  |  | initial_weight  |                                     |               |
|  |  +------------------------------------------------------+               |
|  |                          |                                                |
|  |                          v                                                |
|  |  +------------------------------------------------------+               |
|  |  |               stock_transaction                       |               |
|  |  +------------------------------------------------------+               |
|  |  | id              | category (SEEDHI/DUMP/KATAI)        |               |
|  |  | transaction_type| rent_amount                         |               |
|  |  | date            | reference_no                        |               |
|  |  | party_id (FK)   | chitti_id (FK)                      |               |
|  |  | lot_id (FK)     | vyapari_id (FK)                     |               |
|  |  | commodity_id(FK)| narration                           |               |
|  |  | room_id (FK)    | created_at                          |               |
|  |  | packets         |                                     |               |
|  |  | weight          |                                     |               |
|  |  +------------------------------------------------------+               |
|  |                                                                          |
|  |  +------------------+  +------------------+  +------------------+        |
|  |  |     voucher      |  |     bardana      |  |      sauda       |        |
|  |  +------------------+  +------------------+  +------------------+        |
|  |  | id               |  | id               |  | id               |        |
|  |  | voucher_no       |  | voucher_no       |  | sauda_no         |        |
|  |  | voucher_type     |  | party_id (FK)    |  | kissan_id (FK)   |        |
|  |  | date             |  | bardana_type     |  | vyapari_id (FK)  |        |
|  |  | party_id (FK)    |  | rate             |  | lot_id (FK)      |        |
|  |  | dr_amount        |  | qty_issued       |  | commodity_id(FK) |        |
|  |  | cr_amount        |  | dr_amount        |  | quantity         |        |
|  |  | reference_no     |  | qty_received     |  | rate             |        |
|  |  | interest_rate_pm |  | cr_amount        |  | total_amount     |        |
|  |  | marfat           |  | interest_rate_pm |  | status           |        |
|  |  | narration        |  | expected_arrival |  | due_date         |        |
|  |  | status           |  | linked_amad_id   |  | narration        |        |
|  |  +------------------+  +------------------+  +------------------+        |
|  |                                                                          |
|  |  +------------------+  +------------------+                              |
|  |  |      chitti      |  |   nikasi_bill    |                              |
|  |  +------------------+  +------------------+                              |
|  |  | id               |  | id               |                              |
|  |  | chitti_no        |  | bill_no          |                              |
|  |  | date             |  | date             |                              |
|  |  | party_id (FK)    |  | party_id (FK)    |                              |
|  |  | vyapari_id (FK)  |  | chitti_id (FK)   |                              |
|  |  | transport        |  | total_amount     |                              |
|  |  | vehicle_no       |  | rent_amount      |                              |
|  |  | bilti_no         |  | other_charges    |                              |
|  |  | delivered_to     |  |                  |                              |
|  |  | amount_payable   |  |                  |                              |
|  |  +------------------+  +------------------+                              |
|  |                                                                          |
|  |  FACILITY TABLES                                                         |
|  |  +------------------+  +------------------+                              |
|  |  |  meter_reading   |  | temperature_log  |                              |
|  |  +------------------+  +------------------+                              |
|  |  | id               |  | id               |                              |
|  |  | date             |  | room_id (FK)     |                              |
|  |  | photo_path       |  | timestamp        |                              |
|  |  | reading_value    |  | temperature      |                              |
|  |  | notes            |  | recorded_by      |                              |
|  |  +------------------+  +------------------+                              |
|  |                                                                          |
|  |  SYSTEM TABLES                                                           |
|  |  +------------------+  +------------------+  +------------------+        |
|  |  |      user        |  |    audit_log     |  |  system_config   |        |
|  |  +------------------+  +------------------+  +------------------+        |
|  |  | id               |  | id               |  | key              |        |
|  |  | username         |  | user_id          |  | value            |        |
|  |  | password_hash    |  | action           |  | description      |        |
|  |  | role             |  | entity_type      |  | updated_at       |        |
|  |  | is_active        |  | entity_id        |  |                  |        |
|  |  | last_login       |  | old_value        |  |                  |        |
|  |  |                  |  | new_value        |  |                  |        |
|  |  |                  |  | timestamp        |  |                  |        |
|  |  +------------------+  +------------------+  +------------------+        |
|                                                                              |
+-----------------------------------------------------------------------------+
```

### 6.2 Key Tables Schema

#### 6.2.1 Party Table

```sql
CREATE TABLE party (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_no VARCHAR(20) UNIQUE NOT NULL,
    account_name VARCHAR(200) NOT NULL,
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('KISSAN', 'VYAPARI', 'STAFF', 'SUNDRY_DEBTOR', 'AARTI')),
    father_husband_name VARCHAR(200),
    relation_type VARCHAR(10) CHECK (relation_type IN ('S/O', 'D/O', 'W/O')),
    name_hindi VARCHAR(200),
    subgroup VARCHAR(50) NOT NULL,
    village_id UUID REFERENCES village(id),
    address TEXT,
    guarantor_id UUID REFERENCES party(id),
    phone VARCHAR(20),
    email VARCHAR(100),
    aadhar_no VARCHAR(12),
    pan_no VARCHAR(10),
    gst_no VARCHAR(15),
    tin_no VARCHAR(20),
    remark TEXT,

    -- Financial settings
    opening_balance DECIMAL(15,2) DEFAULT 0,
    opening_balance_type VARCHAR(2) CHECK (opening_balance_type IN ('DR', 'CR')),
    charge_interest_from DATE,
    rent_charges DECIMAL(15,2) DEFAULT 0,
    bardana_charges DECIMAL(15,2) DEFAULT 0,
    other_charges DECIMAL(15,2) DEFAULT 0,
    loan_amount DECIMAL(15,2) DEFAULT 0,
    interest_amount DECIMAL(15,2) DEFAULT 0,
    interest_rate_pm DECIMAL(5,2) DEFAULT 0,
    depreciation_rate DECIMAL(5,2) DEFAULT 0,
    dr_limit DECIMAL(15,2) DEFAULT 0,
    sauda_limit DECIMAL(15,2) DEFAULT 0,
    due_days INTEGER DEFAULT 30,
    calc_int_on_bardana VARCHAR(10) DEFAULT 'DEFAULT',

    -- Bank details (JSON for flexibility)
    bank_details JSONB,

    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_party_account_no ON party(account_no);
CREATE INDEX idx_party_account_name ON party(account_name);
CREATE INDEX idx_party_account_type ON party(account_type);
CREATE INDEX idx_party_village ON party(village_id);
CREATE INDEX idx_party_phone ON party(phone);
```

#### 6.2.2 Stock Transaction Table

```sql
CREATE TABLE stock_transaction (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('AMAD', 'NIKASI')),
    date DATE NOT NULL,
    party_id UUID NOT NULL REFERENCES party(id),
    lot_id UUID NOT NULL REFERENCES lot(id),
    commodity_id UUID NOT NULL REFERENCES commodity(id),
    room_id UUID NOT NULL REFERENCES room(id),
    packets INTEGER NOT NULL CHECK (packets > 0),
    weight DECIMAL(10,2) NOT NULL CHECK (weight > 0),
    category VARCHAR(10) NOT NULL CHECK (category IN ('SEEDHI', 'DUMP', 'KATAI')),
    rent_amount DECIMAL(15,2) DEFAULT 0,
    reference_no VARCHAR(50),
    narration TEXT,

    -- For NIKASI transactions
    chitti_id UUID REFERENCES chitti(id),
    nikasi_bill_id UUID REFERENCES nikasi_bill(id),
    vyapari_id UUID REFERENCES party(id),
    sauda_id UUID REFERENCES sauda(id),

    -- For reloading (room transfer)
    linked_transaction_id UUID REFERENCES stock_transaction(id),

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_stock_txn_date ON stock_transaction(date);
CREATE INDEX idx_stock_txn_party ON stock_transaction(party_id);
CREATE INDEX idx_stock_txn_lot ON stock_transaction(lot_id);
CREATE INDEX idx_stock_txn_type ON stock_transaction(transaction_type);
CREATE INDEX idx_stock_txn_room ON stock_transaction(room_id);
```

#### 6.2.3 Voucher Table

```sql
CREATE TABLE voucher (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_no VARCHAR(20) UNIQUE NOT NULL,
    voucher_type VARCHAR(10) NOT NULL CHECK (voucher_type IN ('CONTRA', 'PAYMENT', 'RECEIPT', 'JOURNAL', 'BHUGTAAN')),
    date DATE NOT NULL,
    party_id UUID NOT NULL REFERENCES party(id),
    dr_amount DECIMAL(15,2) DEFAULT 0,
    cr_amount DECIMAL(15,2) DEFAULT 0,
    reference_no VARCHAR(50),
    interest_rate_pm DECIMAL(5,2),
    marfat VARCHAR(200),
    narration TEXT,
    narration_line2 TEXT,
    status VARCHAR(10) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CANCELLED')),
    cancelled_at TIMESTAMP,
    cancelled_by UUID REFERENCES users(id),
    cancellation_reason TEXT,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_voucher_no ON voucher(voucher_no);
CREATE INDEX idx_voucher_date ON voucher(date);
CREATE INDEX idx_voucher_party ON voucher(party_id);
CREATE INDEX idx_voucher_type ON voucher(voucher_type);
```

### 6.3 Views for Computed Data

```sql
-- Party Balance View
CREATE VIEW v_party_balance AS
SELECT
    p.id AS party_id,
    p.account_no,
    p.account_name,
    p.opening_balance,
    p.opening_balance_type,
    COALESCE(SUM(CASE WHEN v.voucher_type IN ('RECEIPT') THEN v.dr_amount ELSE 0 END), 0) AS total_receipts,
    COALESCE(SUM(CASE WHEN v.voucher_type IN ('PAYMENT', 'BHUGTAAN') THEN v.cr_amount ELSE 0 END), 0) AS total_payments,
    COALESCE(SUM(st.rent_amount), 0) AS total_rent,
    COALESCE(SUM(CASE WHEN b.qty_issued > 0 THEN b.dr_amount ELSE 0 END), 0) AS total_bardana_issued,
    COALESCE(SUM(CASE WHEN b.qty_received > 0 THEN b.cr_amount ELSE 0 END), 0) AS total_bardana_received
FROM party p
LEFT JOIN voucher v ON p.id = v.party_id AND v.status = 'ACTIVE'
LEFT JOIN stock_transaction st ON p.id = st.party_id
LEFT JOIN bardana b ON p.id = b.party_id
WHERE p.is_active = TRUE
GROUP BY p.id, p.account_no, p.account_name, p.opening_balance, p.opening_balance_type;

-- Stock Summary View
CREATE VIEW v_stock_summary AS
SELECT
    l.id AS lot_id,
    l.lot_no,
    p.account_name AS party_name,
    c.name AS commodity_name,
    r.room_no,
    l.marka,
    l.initial_packets,
    l.initial_weight,
    l.current_packets,
    l.current_weight,
    l.arrival_date,
    l.status,
    COALESCE(SUM(CASE WHEN st.transaction_type = 'AMAD' THEN st.packets ELSE 0 END), 0) AS total_amad_packets,
    COALESCE(SUM(CASE WHEN st.transaction_type = 'NIKASI' THEN st.packets ELSE 0 END), 0) AS total_nikasi_packets
FROM lot l
JOIN party p ON l.party_id = p.id
JOIN commodity c ON l.commodity_id = c.id
JOIN room r ON l.room_id = r.id
LEFT JOIN stock_transaction st ON l.id = st.lot_id
GROUP BY l.id, l.lot_no, p.account_name, c.name, r.room_no, l.marka,
         l.initial_packets, l.initial_weight, l.current_packets, l.current_weight,
         l.arrival_date, l.status;
```

---

## 7. File Storage

### 7.1 Storage Structure

```
/app-data/
├── uploads/
│   ├── meter-readings/
│   │   ├── 2024/
│   │   │   ├── 01/
│   │   │   │   ├── meter_2024-01-15_001.jpg
│   │   │   │   └── meter_2024-01-15_002.jpg
│   │   │   └── 02/
│   │   └── 2025/
│   └── temp/                    # Temporary uploads
│
├── reports/
│   ├── generated/
│   │   ├── party-ledger/
│   │   ├── balance-sheet/
│   │   └── stock-register/
│   └── templates/
│       ├── chitti-template.html
│       ├── nikasi-bill-template.html
│       └── voucher-template.html
│
├── backups/
│   ├── daily/
│   │   ├── backup_2024-01-15.sql.gz
│   │   └── backup_2024-01-14.sql.gz
│   ├── weekly/
│   └── monthly/
│
└── exports/
    ├── excel/
    └── pdf/
```

### 7.2 File Management Strategy

| File Type | Storage Location | Retention | Naming Convention |
|-----------|------------------|-----------|-------------------|
| Meter Photos | `/uploads/meter-readings/YYYY/MM/` | Permanent | `meter_YYYY-MM-DD_NNN.jpg` |
| Generated Reports | `/reports/generated/{type}/` | 30 days | `{type}_{date}_{id}.pdf` |
| Daily Backups | `/backups/daily/` | 7 days | `backup_YYYY-MM-DD.sql.gz` |
| Weekly Backups | `/backups/weekly/` | 4 weeks | `backup_YYYY-WNN.sql.gz` |
| Monthly Backups | `/backups/monthly/` | 12 months | `backup_YYYY-MM.sql.gz` |
| Excel Exports | `/exports/excel/` | 7 days | `{report}_{date}.xlsx` |

---

## 8. Scheduled Jobs & Background Processing

### 8.1 Job Definitions

| Job Name | Schedule | Description | Priority |
|----------|----------|-------------|----------|
| **Daily Interest Calculator** | 00:00 (midnight) | Calculate interest on outstanding balances for all parties | High |
| **Daily Rent Calculator** | 00:05 | Calculate storage rent based on grace periods and rates | High |
| **Overdue Alert Generator** | 06:00 | Identify parties exceeding due days, generate alerts | Medium |
| **Temperature Monitor** | Every 15 min | Check temperature readings, alert if out of range | High |
| **Database Backup (Daily)** | 02:00 | Full database backup | Critical |
| **Database Backup (Weekly)** | Sunday 03:00 | Full backup with extended retention | Critical |
| **Report Pre-generation** | 05:00 | Pre-compute common reports for faster access | Low |
| **Cleanup Old Files** | 03:00 | Remove expired temporary files and old exports | Low |
| **Season-End Preparation** | Weekly (configurable) | Prepare settlement calculations during season end | Medium |

### 8.2 Job Implementation

```typescript
// Job processor configuration (conceptual)
interface ScheduledJob {
  name: string;
  schedule: string;           // Cron expression
  handler: () => Promise<void>;
  retryPolicy: {
    maxRetries: number;
    backoffMs: number;
  };
  timeout: number;            // Max execution time in ms
  enabled: boolean;
}

const jobs: ScheduledJob[] = [
  {
    name: 'daily-interest-calculator',
    schedule: '0 0 * * *',    // Midnight daily
    handler: calculateDailyInterest,
    retryPolicy: { maxRetries: 3, backoffMs: 5000 },
    timeout: 300000,          // 5 minutes
    enabled: true
  },
  {
    name: 'daily-rent-calculator',
    schedule: '5 0 * * *',    // 00:05 daily
    handler: calculateDailyRent,
    retryPolicy: { maxRetries: 3, backoffMs: 5000 },
    timeout: 300000,
    enabled: true
  },
  {
    name: 'temperature-monitor',
    schedule: '*/15 * * * *', // Every 15 minutes
    handler: checkTemperatureAlerts,
    retryPolicy: { maxRetries: 1, backoffMs: 1000 },
    timeout: 60000,
    enabled: true
  },
  {
    name: 'database-backup-daily',
    schedule: '0 2 * * *',    // 02:00 daily
    handler: performDailyBackup,
    retryPolicy: { maxRetries: 2, backoffMs: 60000 },
    timeout: 1800000,         // 30 minutes
    enabled: true
  }
];
```

### 8.3 Interest Calculation Logic

```typescript
// Interest calculation algorithm
async function calculateDailyInterest(): Promise<void> {
  const parties = await getPartiesWithInterest();

  for (const party of parties) {
    const balance = await getOutstandingBalance(party.id);

    if (balance > 0 && party.interestRatePm > 0) {
      const dailyRate = party.interestRatePm / 30;
      const interestAmount = balance * (dailyRate / 100);

      await createInterestEntry({
        partyId: party.id,
        date: new Date(),
        principal: balance,
        rate: party.interestRatePm,
        amount: interestAmount,
        type: 'DAILY_ACCRUAL'
      });
    }
  }
}
```

### 8.4 Rent Calculation Logic

```typescript
// Rent calculation considering grace periods
async function calculateRentForLot(lotId: string, asOfDate: Date): Promise<number> {
  const lot = await getLot(lotId);
  const commodity = await getCommodity(lot.commodityId);

  const daysStored = differenceInDays(asOfDate, lot.arrivalDate);

  let rentableDays = 0;
  let rentAmount = 0;

  // Zero rent period
  if (daysStored <= commodity.zeroRentDays) {
    rentableDays = 0;
  }
  // Half rent period
  else if (daysStored <= commodity.zeroRentDays + commodity.halfRentDays) {
    rentableDays = daysStored - commodity.zeroRentDays;
    const rate = commodity.rentOn === 'QUANTITY'
      ? commodity.ratePerUnit
      : commodity.ratePerQtl;
    rentAmount = rentableDays * (rate / 2) * getQuantity(lot, commodity.rentOn);
  }
  // Full rent period
  else {
    const halfRentDays = commodity.halfRentDays;
    const fullRentDays = daysStored - commodity.zeroRentDays - halfRentDays;
    const rate = commodity.rentOn === 'QUANTITY'
      ? commodity.ratePerUnit
      : commodity.ratePerQtl;
    const quantity = getQuantity(lot, commodity.rentOn);

    rentAmount = (halfRentDays * (rate / 2) * quantity) +
                 (fullRentDays * rate * quantity);
  }

  return rentAmount;
}
```

---

## 9. Integration Points

### 9.1 External System Integrations

| Integration | Type | Purpose | Priority |
|-------------|------|---------|----------|
| **Print Service** | Native (Electron) | Document printing | Essential |
| **Camera/Scanner** | Native (Electron) | Meter photo capture | Essential |
| **SMS Gateway** | REST API | Notifications (optional) | Future |
| **Bank Integration** | File-based | Cheque reconciliation (optional) | Future |
| **Temperature Sensors** | Serial/USB | Automated temp logging (optional) | Future |

### 9.2 Print Integration

```typescript
// Print service configuration
interface PrintConfig {
  printerName?: string;       // Default printer if not specified
  copies: number;
  paperSize: 'A4' | 'A5' | 'LETTER' | 'THERMAL';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// Document types and their print configs
const printConfigs: Record<string, PrintConfig> = {
  'chitti': {
    copies: 2,
    paperSize: 'A5',
    orientation: 'portrait',
    margins: { top: 10, bottom: 10, left: 10, right: 10 }
  },
  'nikasi-bill': {
    copies: 2,
    paperSize: 'A4',
    orientation: 'portrait',
    margins: { top: 15, bottom: 15, left: 15, right: 15 }
  },
  'voucher': {
    copies: 1,
    paperSize: 'A5',
    orientation: 'landscape',
    margins: { top: 10, bottom: 10, left: 10, right: 10 }
  },
  'party-ledger': {
    copies: 1,
    paperSize: 'A4',
    orientation: 'portrait',
    margins: { top: 20, bottom: 20, left: 20, right: 20 }
  }
};
```

---

## 10. Security Architecture

### 10.1 Authentication & Authorization

```
+-----------------------------------------------------------------------------+
|                           SECURITY ARCHITECTURE                              |
+-----------------------------------------------------------------------------+
|                                                                              |
|  +-----------------------------------------------------------------------+  |
|  |                        AUTHENTICATION                                  |  |
|  |  - Local username/password authentication                             |  |
|  |  - Password hashing with bcrypt (cost factor 12)                      |  |
|  |  - Session-based authentication                                        |  |
|  |  - Auto-logout after inactivity                                        |  |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
|  +-----------------------------------------------------------------------+  |
|  |                        AUTHORIZATION (RBAC)                            |  |
|  |                                                                        |  |
|  |  ADMIN       --> Full system access, user management, all operations  |  |
|  |  OPERATOR    --> All operations (for now; will be limited in future)  |  |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
|  +-----------------------------------------------------------------------+  |
|  |                        DATA PROTECTION                                 |  |
|  |  - Sensitive data encryption at rest (AES-256)                        |  |
|  |  - Database connection encryption                                      |  |
|  |  - Audit logging for all financial transactions                       |  |
|  |  - Soft delete for maintaining data integrity                         |  |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
+-----------------------------------------------------------------------------+
```

### 10.2 Role Permissions Matrix (Current)

| Permission | Admin | Operator |
|------------|:-----:|:--------:|
| User Management | Yes | Yes |
| System Config | Yes | Yes |
| Party Create/Edit | Yes | Yes |
| Party Delete | Yes | Yes |
| Financial Limits | Yes | Yes |
| Stock Amad/Nikasi | Yes | Yes |
| Voucher Create | Yes | Yes |
| Voucher Cancel | Yes | Yes |
| Sauda Create | Yes | Yes |
| Sauda Cancel | Yes | Yes |
| Reports View | Yes | Yes |
| Reports Print | Yes | Yes |
| Backup/Restore | Yes | Yes |

> **Note:** In the initial version, both Admin and Operator roles have full access. Future versions will introduce granular permissions to restrict Operator access to specific modules.

### 10.3 Audit Logging

```typescript
// Audit log entry structure
interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'CANCEL' | 'VIEW' | 'PRINT' | 'LOGIN' | 'LOGOUT';
  entityType: string;        // e.g., 'PARTY', 'VOUCHER', 'STOCK_TRANSACTION'
  entityId: string;
  oldValue?: object;         // Previous state (for UPDATE/DELETE)
  newValue?: object;         // New state (for CREATE/UPDATE)
  ipAddress?: string;
  userAgent?: string;
  metadata?: object;         // Additional context
}

// Audited operations
const auditedOperations = [
  'party.create', 'party.update', 'party.delete',
  'voucher.create', 'voucher.update', 'voucher.cancel',
  'stock.amad', 'stock.nikasi',
  'sauda.create', 'sauda.execute', 'sauda.cancel',
  'bardana.issue', 'bardana.adjust',
  'user.login', 'user.logout', 'user.password_change',
  'config.update', 'backup.create', 'backup.restore'
];
```

---

## 11. Technology Stack Recommendations

### 11.1 Option A: Electron + Node.js Stack (Recommended)

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Desktop Shell** | Electron | Cross-platform, native features, web tech |
| **Frontend** | React 18 + TypeScript | Modern, performant, type-safe |
| **UI Components** | Ant Design | Enterprise-ready, Hindi support, forms |
| **State Management** | Zustand | Simple, performant, TypeScript-first |
| **Backend** | Node.js + Fastify | Fast, TypeScript support |
| **ORM** | Prisma | Type-safe, migrations, good DX |
| **Database** | PostgreSQL | Reliable, ACID, complex queries |
| **Job Scheduler** | node-cron / Agenda | Reliable scheduling |
| **Print Engine** | Puppeteer / electron-print | PDF generation, native print |
| **Build Tool** | Vite + electron-builder | Fast builds, easy packaging |

### 11.2 Option B: .NET Stack (Alternative)

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Desktop Shell** | .NET MAUI / WPF | Native Windows, enterprise support |
| **Frontend** | Blazor | C# full-stack, component model |
| **Backend** | ASP.NET Core | High performance, mature |
| **ORM** | Entity Framework Core | Mature, migrations |
| **Database** | PostgreSQL / SQL Server | Enterprise features |
| **Job Scheduler** | Hangfire / Quartz.NET | Reliable, dashboard |
| **Print Engine** | QuestPDF / iTextSharp | PDF generation |

### 11.3 Recommended Stack Decision

**Recommendation: Option A (Electron + Node.js)**

Reasons:
1. **Faster development**: JavaScript/TypeScript ecosystem has more UI components ready for use
2. **Hindi support**: Better Unicode and font rendering in web technologies
3. **Developer familiarity**: Easier to find developers with React experience
4. **Offline capability**: Electron handles offline scenarios well
5. **Update mechanism**: Electron auto-updater for easy deployments

---

## 12. Implementation Phases

### Phase 1: Foundation (Weeks 1-4)

| Component | Tasks | Dependencies |
|-----------|-------|--------------|
| **Project Setup** | Initialize Electron + React project, configure TypeScript, setup build pipeline | None |
| **Database** | Design and implement core schema, setup migrations, seed data | Project Setup |
| **Auth Module** | User management, login/logout, session handling | Database |
| **Master Data** | Village, Commodity, Room CRUD operations | Database |
| **Party Module** | Party CRUD, search, basic financial settings | Master Data |

### Phase 2: Stock Operations (Weeks 5-8)

| Component | Tasks | Dependencies |
|-----------|-------|--------------|
| **Lot Management** | Create/update lots, lot search, history | Party Module |
| **Amad (Incoming)** | Record stock arrival, room allocation | Lot Management |
| **Nikasi (Outgoing)** | Record stock dispatch, balance updates | Lot Management |
| **Reloading** | Room transfer functionality | Amad, Nikasi |
| **Stock Summary** | Stock reports by room/commodity/party | All Stock ops |

### Phase 3: Financial Operations (Weeks 9-12)

| Component | Tasks | Dependencies |
|-----------|-------|--------------|
| **Voucher System** | All voucher types, entry, cancellation | Party Module |
| **Bardana Module** | Advance issuance, adjustment against stock | Voucher, Amad |
| **Interest Calculation** | Background job, interest entries | Voucher |
| **Rent Calculation** | Grace period logic, rent computation | Stock Module |
| **Party Ledger** | Comprehensive ledger generation | All Financial |

### Phase 4: Trading & Billing (Weeks 13-16)

| Component | Tasks | Dependencies |
|-----------|-------|--------------|
| **Sauda Module** | Deal creation, listing, execution | Party, Stock |
| **Chitti Generation** | Delivery receipt creation and print | Nikasi, Sauda |
| **Nikasi Bill** | Bill generation with all charges | Chitti |
| **Cash Memo** | Quick cash transactions | Voucher |
| **Print Integration** | All document printing | All Billing |

### Phase 5: Reports & Automation (Weeks 17-20)

| Component | Tasks | Dependencies |
|-----------|-------|--------------|
| **Cash Book** | Daily cash transactions report | Voucher |
| **Balance Sheet** | Financial position report | All Financial |
| **Stock Register** | Comprehensive stock report | Stock Module |
| **Dashboard** | KPIs, alerts, quick actions | All Modules |
| **Background Jobs** | All scheduled jobs implementation | All Modules |

### Phase 6: Enhancements (Weeks 21-24)

| Component | Tasks | Dependencies |
|-----------|-------|--------------|
| **Facility Module** | Meter reading, temperature logging | Core System |
| **Hindi Keyboard** | On-screen keyboard component | UI Framework |
| **Backup/Restore** | Database backup and restoration | Database |
| **Performance Tuning** | Query optimization, caching | All Modules |
| **User Training** | Documentation, training materials | Complete System |

### Implementation Timeline Visualization

```
Week:  1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24
       |---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
Phase 1: Foundation
       [===============]
Phase 2: Stock Operations
                       [===============]
Phase 3: Financial Operations
                                       [===============]
Phase 4: Trading & Billing
                                                       [===============]
Phase 5: Reports & Automation
                                                                       [===============]
Phase 6: Enhancements
                                                                                       [===============]
```

---

## 13. Non-Functional Requirements

### 13.1 Performance Requirements

| Metric | Requirement | Measurement |
|--------|-------------|-------------|
| Page Load | < 2 seconds | Time to interactive |
| Search Response | < 500ms | API response time |
| Report Generation | < 10 seconds | Complex reports (1 year data) |
| Print Preview | < 3 seconds | Document rendering |
| Database Query | < 100ms | 95th percentile |
| Concurrent Users | 10 | Same facility |
| Data Volume | 100,000 transactions/season | Storage capacity |

### 13.2 Reliability Requirements

| Requirement | Target | Notes |
|-------------|--------|-------|
| Availability | 99.5% uptime | During business hours |
| Data Durability | No data loss | Automated backups |
| Recovery Time | < 1 hour | From backup |
| Backup Frequency | Daily + On-demand | Automated + Manual |

### 13.3 Usability Requirements

| Requirement | Description |
|-------------|-------------|
| Hindi Support | Full Devanagari script support for input and display |
| Keyboard Navigation | All forms navigable without mouse |
| Shortcut Keys | Standard shortcuts for common operations |
| Error Messages | Clear, actionable error messages in Hindi/English |
| Form Validation | Real-time validation with helpful hints |
| Print Preview | WYSIWYG print preview for all documents |

### 13.4 Scalability Considerations

| Aspect | Current | Future |
|--------|---------|--------|
| Users | Single facility, 10 users | Multi-facility support |
| Data | 100K transactions/season | 1M+ transactions |
| Storage | Local file system | Cloud storage option |
| Deployment | On-premise | Cloud-hosted option |

---

## Appendix A: Glossary

| Term | Hindi | Description |
|------|-------|-------------|
| Kissan | किसान | Farmer who stores goods |
| Vyapari | व्यापारी | Trader who buys goods |
| Amad | आमद | Incoming stock/arrival |
| Nikasi | निकासी | Outgoing stock/dispatch |
| Sauda | सौदा | Trade deal/agreement |
| Bardana | बरदाना | Jute bags/packaging |
| Chitti | चिट्ठी | Delivery receipt/slip |
| Bilti | बिल्टी | Lorry receipt |
| Marka | मारका | Brand/mark on bags |
| Parcha | पर्चा | Document/slip |
| Bhugtaan | भुगतान | Payment |
| Aarti | आढ़ती | Commission agent |
| Marfat | मारफ़त | Through/via agent |
| Seedhi | सीधी | Fresh/unprocessed |
| Katai | कटाई | Sorted/processed |
| QTL | क्विंटल | Quintal (100 kg) |

---

## Appendix B: References

- `docs/app-requirements.md` - Detailed application requirements
- `docs/entities.md` - Entity definitions and relationships
- `docs/use-cases.md` - Complete use case specifications
- `docs/multi-tenancy-user-org.md` - Multi-tenant architecture and user/organization model

---

*Document Version: 1.0*
*Last Updated: January 2026*
