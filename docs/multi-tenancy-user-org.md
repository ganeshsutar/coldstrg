# Multi-Tenant Architecture - User & Organization Model

This document describes the multi-tenant architecture for the Cold Storage Management System, enabling users to access and manage multiple organizations (cold storage facilities) with a single identity.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architectural Strategy](#2-architectural-strategy)
3. [Core Entities](#3-core-entities)
4. [Entity Relationships](#4-entity-relationships)
5. [Security & Data Isolation](#5-security--data-isolation)
6. [Role-Based Access Control](#6-role-based-access-control)
7. [Functional Workflows](#7-functional-workflows)
8. [API Design](#8-api-design)
9. [Database Schema](#9-database-schema)
10. [Implementation Guidelines](#10-implementation-guidelines)
11. [Non-Functional Requirements](#11-non-functional-requirements)

---

## 1. Executive Summary

The Cold Storage Management System adopts a **multi-tenant architecture** to support scenarios where:

- A single user (e.g., owner, accountant) manages multiple cold storage facilities
- Multiple users collaborate within a single organization
- Users need to switch between organizations seamlessly

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Single Identity** | Users maintain one login across all organizations |
| **Cost Efficiency** | Shared infrastructure reduces operational costs |
| **Easy Collaboration** | Invite team members to specific organizations |
| **Data Isolation** | Strict boundaries prevent cross-organization data access |
| **Scalability** | Add new organizations without infrastructure changes |

---

## 2. Architectural Strategy

### 2.1 Tenancy Model: Pool Model (Shared Resources)

The system uses a **shared database with logical isolation** approach:

```
+-----------------------------------------------------------------------------+
|                           MULTI-TENANT ARCHITECTURE                          |
+-----------------------------------------------------------------------------+
|                                                                              |
|  +-----------+    +-----------+    +-----------+    +-----------+           |
|  |  User A   |    |  User B   |    |  User C   |    |  User D   |           |
|  +-----------+    +-----------+    +-----------+    +-----------+           |
|        |               |  \             |  \             |                   |
|        v               v   \            v   \            v                   |
|  +-----------+    +-----------+    +-----------+    +-----------+           |
|  |   Org 1   |    |   Org 2   |    |   Org 3   |    |   Org 4   |           |
|  |Cold Store |    |Cold Store |    |Cold Store |    |Cold Store |           |
|  |  Agra     |    |  Mathura  |    |  Delhi    |    |  Jaipur   |           |
|  +-----------+    +-----------+    +-----------+    +-----------+           |
|        |               |                 |                 |                 |
|        +-------+-------+-----------------+-----------------+                 |
|                |                                                             |
|                v                                                             |
|  +-----------------------------------------------------------------------+  |
|  |                     SHARED DATABASE                                    |  |
|  |  +----------------+  +----------------+  +----------------+           |  |
|  |  | Global Users   |  | Organizations  |  | Memberships    |           |  |
|  |  +----------------+  +----------------+  +----------------+           |  |
|  |                                                                        |  |
|  |  +----------------+  +----------------+  +----------------+           |  |
|  |  | Parties        |  | Stock Txns     |  | Vouchers       |           |  |
|  |  | (org_id FK)    |  | (org_id FK)    |  | (org_id FK)    |           |  |
|  |  +----------------+  +----------------+  +----------------+           |  |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
+-----------------------------------------------------------------------------+
```

### 2.2 Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Logical Isolation** | All business data filtered by `organization_id` |
| **Shared Infrastructure** | Single database, single API server instance |
| **Horizontal Scalability** | Add organizations without new infrastructure |
| **Identity Separation** | User identity exists independent of organizations |

### 2.3 Comparison with Alternatives

| Model | Description | Pros | Cons |
|-------|-------------|------|------|
| **Silo (Separate DB)** | Each org has own database | Maximum isolation | High cost, complex management |
| **Bridge (Separate Schema)** | Shared DB, separate schemas | Good isolation | Schema management overhead |
| **Pool (Shared)** | Shared DB with org_id filter | Cost-effective, simple | Requires careful filtering |

**Selected: Pool Model** - Best balance of cost, simplicity, and maintainability for this use case.

---

## 3. Core Entities

### 3.1 Global User

Represents an individual's identity, independent of any organization.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| email | String | Yes | Login email (unique) |
| password_hash | String | Yes | Hashed password |
| full_name | String | Yes | Display name |
| phone | String | No | Contact number |
| avatar_url | String | No | Profile picture URL |
| email_verified | Boolean | Yes | Email verification status |
| is_active | Boolean | Yes | Account active status |
| last_login_at | DateTime | No | Last successful login |
| created_at | DateTime | Yes | Account creation timestamp |
| updated_at | DateTime | Yes | Last update timestamp |

**Key Characteristics:**
- Exists independently of organizations
- Single email/password for all organizations
- Profile data shared across organizations

### 3.2 Organization (Tenant)

Represents a cold storage facility - the top-level data boundary.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| name | String | Yes | Organization name |
| name_hindi | String | No | Name in Hindi |
| slug | String | Yes | URL-friendly identifier (unique) |
| address | Text | No | Physical address |
| city | String | No | City name |
| state | String | No | State name |
| phone | String | No | Contact number |
| email | String | No | Organization email |
| gst_no | String | No | GST registration number |
| logo_url | String | No | Organization logo |
| timezone | String | Yes | Timezone (default: Asia/Kolkata) |
| financial_year_start | Integer | Yes | Financial year start month (1-12) |
| billing_status | Enum | Yes | TRIAL, ACTIVE, SUSPENDED, CANCELLED |
| subscription_plan | String | No | Current subscription tier |
| settings | JSONB | No | Organization-specific settings |
| is_active | Boolean | Yes | Organization active status |
| created_at | DateTime | Yes | Creation timestamp |
| updated_at | DateTime | Yes | Last update timestamp |

**Settings JSON Structure:**
```json
{
  "defaultCurrency": "INR",
  "rentCalculation": {
    "method": "monthly",
    "gracePeriodDays": 15
  },
  "interestCalculation": {
    "compoundingFrequency": "monthly"
  },
  "notifications": {
    "emailAlerts": true,
    "smsAlerts": false
  },
  "features": {
    "bardanaTracking": true,
    "temperatureLogging": true,
    "meterReadings": true
  }
}
```

### 3.3 Organization Membership (Junction)

Links Global Users to Organizations with their role.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| user_id | UUID (FK) | Yes | Reference to Global User |
| organization_id | UUID (FK) | Yes | Reference to Organization |
| role | Enum | Yes | User's role in this organization |
| is_default | Boolean | Yes | Default org for this user |
| invited_by | UUID (FK) | No | User who sent invitation |
| invited_at | DateTime | No | Invitation timestamp |
| joined_at | DateTime | No | When user accepted invitation |
| status | Enum | Yes | PENDING, ACTIVE, SUSPENDED |
| permissions | JSONB | No | Custom permission overrides |
| created_at | DateTime | Yes | Creation timestamp |
| updated_at | DateTime | Yes | Last update timestamp |

**Unique Constraint:** `(user_id, organization_id)` - User can only have one membership per organization.

---

## 4. Entity Relationships

### 4.1 Relationship Diagram

```
+----------------+                    +--------------------+
|  Global User   |                    |   Organization     |
+----------------+                    +--------------------+
| id (PK)        |                    | id (PK)            |
| email          |                    | name               |
| full_name      |                    | slug               |
| password_hash  |                    | billing_status     |
+-------+--------+                    | settings           |
        |                             +----------+---------+
        |                                        |
        |    +---------------------------+       |
        |    |  Organization Membership  |       |
        |    +---------------------------+       |
        +--->| id (PK)                   |<------+
             | user_id (FK)              |
             | organization_id (FK)      |
             | role                      |
             | status                    |
             +-------------+-------------+
                           |
                           | (Provides context for)
                           v
        +------------------+------------------+------------------+
        |                  |                  |                  |
+-------+-------+  +-------+-------+  +-------+-------+  +-------+-------+
|    Party      |  | Stock Txn     |  |   Voucher     |  |     Lot       |
+---------------+  +---------------+  +---------------+  +---------------+
| org_id (FK)   |  | org_id (FK)   |  | org_id (FK)   |  | org_id (FK)   |
| account_no    |  | lot_id        |  | voucher_no    |  | lot_no        |
| ...           |  | ...           |  | ...           |  | ...           |
+---------------+  +---------------+  +---------------+  +---------------+
```

### 4.2 Relationship Logic

```
One User ──< Many Memberships >── One Organization
                   │
                   │ (Provides access to)
                   v
           Organization Data
           ├── Parties
           ├── Lots
           ├── Stock Transactions
           ├── Vouchers
           ├── Bardana
           ├── Sauda
           ├── Chitti
           ├── Meter Readings
           └── Temperature Records
```

### 4.3 Organization-Scoped Entities

All business entities must include `organization_id`:

| Entity | organization_id Required | Notes |
|--------|--------------------------|-------|
| Party | Yes | Farmers/traders belong to specific org |
| Commodity | Yes | Each org defines own commodities |
| Room | Yes | Physical rooms in that facility |
| Lot | Yes | Stock lots in that facility |
| Stock Transaction | Yes | Amad/Nikasi for that org |
| Voucher | Yes | Financial entries for that org |
| Bardana | Yes | Packaging advances for that org |
| Sauda | Yes | Deals within that org |
| Chitti | Yes | Delivery receipts for that org |
| Nikasi Bill | Yes | Bills for that org |
| Meter Reading | Yes | Facility readings |
| Temperature Record | Yes | Temperature logs |
| Village | Shared | Common reference data |

---

## 5. Security & Data Isolation

### 5.1 The "Magic Filter" Pattern

Every database query MUST include organization context:

```
+-----------------------------------------------------------------------------+
|                          REQUEST FLOW WITH ORG FILTER                        |
+-----------------------------------------------------------------------------+
|                                                                              |
|  1. API Request                                                              |
|     +------------------+                                                     |
|     | GET /api/parties |                                                     |
|     | Headers:         |                                                     |
|     |   Authorization: Bearer {token}                                        |
|     |   X-Organization-ID: org_123                                           |
|     +--------+---------+                                                     |
|              |                                                               |
|  2. Authentication    |                                                      |
|              v                                                               |
|     +------------------+                                                     |
|     | Verify JWT Token |                                                     |
|     | Extract user_id  |                                                     |
|     +--------+---------+                                                     |
|              |                                                               |
|  3. Authorization     |                                                      |
|              v                                                               |
|     +------------------+                                                     |
|     | Check Membership |                                                     |
|     | user_id + org_id |                                                     |
|     | Verify ACTIVE    |                                                     |
|     +--------+---------+                                                     |
|              |                                                               |
|  4. Query Execution   | (The Magic Filter)                                   |
|              v                                                               |
|     +------------------------------------------+                             |
|     | SELECT * FROM parties                    |                             |
|     | WHERE organization_id = 'org_123'        | <-- AUTO-INJECTED           |
|     |   AND is_active = true                   |                             |
|     +------------------------------------------+                             |
|                                                                              |
+-----------------------------------------------------------------------------+
```

### 5.2 Authorization Mechanism

```typescript
// Middleware pseudocode for every API request
async function organizationMiddleware(request, context) {
  // 1. Extract organization ID from request
  const orgId = request.headers['x-organization-id'];

  if (!orgId) {
    throw new Error('Organization context required');
  }

  // 2. Get authenticated user
  const userId = context.user.id;

  // 3. Verify membership exists and is active
  const membership = await db.organizationMembership.findUnique({
    where: {
      user_id_organization_id: { user_id: userId, organization_id: orgId }
    }
  });

  if (!membership || membership.status !== 'ACTIVE') {
    throw new ForbiddenError('Access denied to this organization');
  }

  // 4. Attach context for downstream use
  context.organization = { id: orgId, role: membership.role };

  // 5. Set up query filter (the "magic filter")
  context.queryFilter = { organization_id: orgId };
}
```

### 5.3 Query Interception

All repository methods automatically apply organization filter:

```typescript
// Base repository with automatic org filtering
class OrganizationScopedRepository<T> {
  constructor(private context: RequestContext) {}

  async findMany(where: Partial<T>): Promise<T[]> {
    return db.query({
      ...where,
      organization_id: this.context.organization.id  // Auto-injected
    });
  }

  async create(data: Partial<T>): Promise<T> {
    return db.create({
      ...data,
      organization_id: this.context.organization.id  // Auto-injected
    });
  }
}
```

### 5.4 Security Constraints

| Constraint | Enforcement |
|------------|-------------|
| **Membership Required** | Every API request validated against membership table |
| **Active Status** | Only ACTIVE memberships grant access |
| **Organization Header** | Required on all business API endpoints |
| **Row-Level Security** | Database-level policies as additional safeguard |
| **Audit Logging** | All data access logged with org context |

---

## 6. Role-Based Access Control

### 6.1 Organization Roles

The system uses a simplified role-based access control model:

| Role | Description | Permissions |
|------|-------------|-------------|
| **Admin** | Organization administrator | Full control, user management, settings, all operations |
| **Operator** | Primary system user (staff) | All operations (for now); will be limited in future versions |

> **Note:** In the initial version, both Admin and Operator roles have full access. Future versions will introduce granular permissions to restrict Operator access to specific modules.
>
> **Actor Consolidation:** The original design had multiple roles (Owner, Admin, Manager, Accountant, Operator, Viewer). These have been consolidated into Admin and Operator for simplicity, with access control managed through the permission system rather than separate roles.

### 6.2 Permission Matrix (Current)

| Permission | Admin | Operator |
|------------|:-----:|:--------:|
| **Organization** |
| Update org settings | Yes | Yes |
| Manage billing | Yes | Yes |
| Delete organization | Yes | No |
| **User Management** |
| Invite users | Yes | Yes |
| Remove users | Yes | Yes |
| Change user roles | Yes | Yes |
| **All Business Operations** |
| Parties, Stock, Financial, Trading, Reports | Yes | Yes |

### 6.3 Future Permission Model

Future versions will introduce granular permissions:

```json
{
  "permissions": {
    "canManageUsers": false,
    "canCreateVouchers": true,
    "canViewFinancialReports": true,
    "canConfigureSystem": false,
    "maxVoucherAmount": 100000
  }
}
```

---

## 7. Functional Workflows

### 7.1 Organization Switching (Context)

```
+-----------------------------------------------------------------------------+
|                        ORGANIZATION SWITCHING FLOW                           |
+-----------------------------------------------------------------------------+
|                                                                              |
|  1. User Login                                                               |
|     +------------------+                                                     |
|     | POST /auth/login |                                                     |
|     | email, password  |                                                     |
|     +--------+---------+                                                     |
|              |                                                               |
|              v                                                               |
|  2. Fetch User's Organizations                                               |
|     +------------------------------------+                                   |
|     | SELECT o.*, m.role, m.is_default   |                                   |
|     | FROM organizations o               |                                   |
|     | JOIN memberships m ON o.id = m.org_id                                  |
|     | WHERE m.user_id = {user_id}        |                                   |
|     |   AND m.status = 'ACTIVE'          |                                   |
|     +------------------------------------+                                   |
|              |                                                               |
|              v                                                               |
|  3. Response to Client                                                       |
|     +------------------------------------+                                   |
|     | {                                  |                                   |
|     |   "user": {...},                   |                                   |
|     |   "organizations": [               |                                   |
|     |     { "id": "org_1", "name": "Agra Cold Store", "isDefault": true },   |
|     |     { "id": "org_2", "name": "Mathura Cold Store" }                    |
|     |   ],                               |                                   |
|     |   "currentOrganization": "org_1"   |                                   |
|     | }                                  |                                   |
|     +------------------------------------+                                   |
|              |                                                               |
|              v                                                               |
|  4. Client Stores Active Organization                                        |
|     +------------------------------------+                                   |
|     | localStorage.setItem(              |                                   |
|     |   'currentOrgId', 'org_1'          |                                   |
|     | );                                 |                                   |
|     +------------------------------------+                                   |
|              |                                                               |
|              v                                                               |
|  5. All Subsequent Requests Include Org Header                               |
|     +------------------------------------+                                   |
|     | GET /api/parties                   |                                   |
|     | Headers:                           |                                   |
|     |   X-Organization-ID: org_1         |                                   |
|     +------------------------------------+                                   |
|              |                                                               |
|              v                                                               |
|  6. User Switches Organization (UI Action)                                   |
|     +------------------------------------+                                   |
|     | POST /api/user/switch-org          |                                   |
|     | { "organizationId": "org_2" }      |                                   |
|     +------------------------------------+                                   |
|              |                                                               |
|              v                                                               |
|  7. Client Updates Active Organization                                       |
|     +------------------------------------+                                   |
|     | - Update localStorage              |                                   |
|     | - Refresh UI with new org data     |                                   |
|     | - Clear cached data                |                                   |
|     +------------------------------------+                                   |
|                                                                              |
+-----------------------------------------------------------------------------+
```

### 7.2 User Invitation Workflow

```
+-----------------------------------------------------------------------------+
|                           USER INVITATION FLOW                               |
+-----------------------------------------------------------------------------+
|                                                                              |
|  1. Admin Initiates Invitation                                               |
|     +------------------------------------------+                             |
|     | POST /api/organizations/{org_id}/invite  |                             |
|     | {                                        |                             |
|     |   "email": "newuser@example.com",        |                             |
|     |   "role": "OPERATOR",                    |                             |
|     |   "message": "Join our cold storage"     |                             |
|     | }                                        |                             |
|     +--------------------+---------------------+                             |
|                          |                                                   |
|                          v                                                   |
|  2. System Checks if User Exists                                             |
|     +------------------------------------------+                             |
|     | SELECT * FROM global_users               |                             |
|     | WHERE email = 'newuser@example.com'      |                             |
|     +--------------------+---------------------+                             |
|                          |                                                   |
|            +-------------+-------------+                                     |
|            |                           |                                     |
|            v                           v                                     |
|     [User Exists]              [User Does Not Exist]                         |
|            |                           |                                     |
|            v                           v                                     |
|  3A. Create Membership          3B. Send Invitation Email                    |
|     +--------------------+      +--------------------+                       |
|     | INSERT membership  |      | Create invitation  |                       |
|     | status = ACTIVE    |      | token, send email  |                       |
|     +--------------------+      | with signup link   |                       |
|            |                    +--------------------+                       |
|            |                           |                                     |
|            v                           v                                     |
|  4A. User Sees New Org          4B. New User Signs Up                        |
|     in their switcher           +--------------------+                       |
|                                 | POST /auth/signup  |                       |
|                                 | + invitation_token |                       |
|                                 +--------------------+                       |
|                                          |                                   |
|                                          v                                   |
|                                 5B. Create User + Membership                 |
|                                 +--------------------+                       |
|                                 | - Create user      |                       |
|                                 | - Create membership|                       |
|                                 | - Mark token used  |                       |
|                                 +--------------------+                       |
|                                                                              |
+-----------------------------------------------------------------------------+
```

### 7.3 New Organization Creation

```
+-----------------------------------------------------------------------------+
|                       NEW ORGANIZATION CREATION                              |
+-----------------------------------------------------------------------------+
|                                                                              |
|  1. Existing User Creates New Organization                                   |
|     +------------------------------------------+                             |
|     | POST /api/organizations                  |                             |
|     | {                                        |                             |
|     |   "name": "New Cold Store",              |                             |
|     |   "city": "Mathura",                     |                             |
|     |   "state": "Uttar Pradesh"               |                             |
|     | }                                        |                             |
|     +--------------------+---------------------+                             |
|                          |                                                   |
|                          v                                                   |
|  2. System Creates Organization                                              |
|     +------------------------------------------+                             |
|     | - Generate unique ID and slug            |                             |
|     | - Set billing_status = TRIAL             |                             |
|     | - Apply default settings                 |                             |
|     +--------------------+---------------------+                             |
|                          |                                                   |
|                          v                                                   |
|  3. Create Owner Membership                                                  |
|     +------------------------------------------+                             |
|     | INSERT INTO organization_memberships     |                             |
|     | (user_id, organization_id, role, status) |                             |
|     | VALUES (current_user, new_org, 'OWNER', 'ACTIVE')                      |
|     +--------------------+---------------------+                             |
|                          |                                                   |
|                          v                                                   |
|  4. Initialize Default Data                                                  |
|     +------------------------------------------+                             |
|     | - Create default commodities (POTATO)    |                             |
|     | - Create sample rooms (Room 1, 2, 3)     |                             |
|     | - Initialize system settings             |                             |
|     +------------------------------------------+                             |
|                                                                              |
+-----------------------------------------------------------------------------+
```

---

## 8. API Design

### 8.1 Authentication Endpoints (No Org Context)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| GET | `/api/auth/verify-email/:token` | Verify email address |

### 8.2 User Endpoints (Authenticated, No Org Context)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get current user profile |
| PUT | `/api/user/profile` | Update user profile |
| PUT | `/api/user/password` | Change password |
| GET | `/api/user/organizations` | List user's organizations |
| POST | `/api/user/switch-org` | Set current organization |

### 8.3 Organization Management Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| POST | `/api/organizations` | Create new organization | Authenticated |
| GET | `/api/organizations/:id` | Get organization details | Member |
| PUT | `/api/organizations/:id` | Update organization | Admin+ |
| DELETE | `/api/organizations/:id` | Delete organization | Owner |
| GET | `/api/organizations/:id/members` | List members | Admin+ |
| POST | `/api/organizations/:id/invite` | Invite user | Admin+ |
| DELETE | `/api/organizations/:id/members/:userId` | Remove member | Admin+ |
| PUT | `/api/organizations/:id/members/:userId` | Update member role | Admin+ |

### 8.4 Business Endpoints (Require Org Context)

All existing endpoints require `X-Organization-ID` header:

```
GET /api/parties                    # List parties (filtered by org)
POST /api/parties                   # Create party (in current org)
GET /api/stock/summary              # Stock summary (for current org)
POST /api/voucher                   # Create voucher (in current org)
...
```

### 8.5 Request/Response Examples

**Login Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "owner@coldstore.com",
    "fullName": "Ramesh Kumar"
  },
  "organizations": [
    {
      "id": "org_abc",
      "name": "Agra Cold Storage",
      "slug": "agra-cold-storage",
      "role": "OWNER",
      "isDefault": true
    },
    {
      "id": "org_xyz",
      "name": "Mathura Cold Storage",
      "slug": "mathura-cold-storage",
      "role": "ADMIN",
      "isDefault": false
    }
  ],
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Invite User Request:**
```json
POST /api/organizations/org_abc/invite
{
  "email": "accountant@example.com",
  "role": "ACCOUNTANT",
  "message": "Please join our cold storage management team."
}
```

---

## 9. Database Schema

### 9.1 Global User Table

```sql
CREATE TABLE global_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    password_changed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_global_users_email ON global_users(email);
CREATE INDEX idx_global_users_active ON global_users(is_active);
```

### 9.2 Organization Table

```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    name_hindi VARCHAR(200),
    slug VARCHAR(100) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    gst_no VARCHAR(15),
    logo_url TEXT,
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    financial_year_start INTEGER DEFAULT 4,  -- April
    billing_status VARCHAR(20) DEFAULT 'TRIAL'
        CHECK (billing_status IN ('TRIAL', 'ACTIVE', 'SUSPENDED', 'CANCELLED')),
    subscription_plan VARCHAR(50),
    trial_ends_at TIMESTAMP,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_billing ON organizations(billing_status);
CREATE INDEX idx_organizations_active ON organizations(is_active);
```

### 9.3 Organization Membership Table

```sql
CREATE TABLE organization_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES global_users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL
        CHECK (role IN ('ADMIN', 'OPERATOR')),
    is_default BOOLEAN DEFAULT FALSE,
    invited_by UUID REFERENCES global_users(id),
    invited_at TIMESTAMP,
    joined_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED')),
    permissions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, organization_id)
);

CREATE INDEX idx_memberships_user ON organization_memberships(user_id);
CREATE INDEX idx_memberships_org ON organization_memberships(organization_id);
CREATE INDEX idx_memberships_status ON organization_memberships(status);
```

### 9.4 Invitation Table

```sql
CREATE TABLE organization_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    invited_by UUID NOT NULL REFERENCES global_users(id),
    message TEXT,
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(organization_id, email)
);

CREATE INDEX idx_invitations_token ON organization_invitations(token);
CREATE INDEX idx_invitations_email ON organization_invitations(email);
```

### 9.5 Modified Party Table (with organization_id)

```sql
ALTER TABLE parties ADD COLUMN organization_id UUID NOT NULL
    REFERENCES organizations(id);

CREATE INDEX idx_parties_org ON parties(organization_id);

-- Example of modified query with org filter
-- Before: SELECT * FROM parties WHERE account_type = 'KISSAN'
-- After:  SELECT * FROM parties
--         WHERE organization_id = 'org_123' AND account_type = 'KISSAN'
```

### 9.6 Row-Level Security (Additional Protection)

```sql
-- Enable RLS on parties table
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;

-- Create policy for select
CREATE POLICY parties_org_isolation ON parties
    FOR ALL
    USING (organization_id = current_setting('app.current_org_id')::UUID);

-- Set context at connection level
SET app.current_org_id = 'org_123';
```

---

## 10. Implementation Guidelines

### 10.1 Adding organization_id to Existing Entities

All business tables need migration to add `organization_id`:

```sql
-- Migration script for adding multi-tenancy support
BEGIN;

-- 1. Add column (nullable first for existing data)
ALTER TABLE parties ADD COLUMN organization_id UUID;
ALTER TABLE lots ADD COLUMN organization_id UUID;
ALTER TABLE stock_transactions ADD COLUMN organization_id UUID;
ALTER TABLE vouchers ADD COLUMN organization_id UUID;
ALTER TABLE bardana ADD COLUMN organization_id UUID;
ALTER TABLE sauda ADD COLUMN organization_id UUID;
ALTER TABLE chitti ADD COLUMN organization_id UUID;
ALTER TABLE rooms ADD COLUMN organization_id UUID;
ALTER TABLE commodities ADD COLUMN organization_id UUID;
ALTER TABLE meter_readings ADD COLUMN organization_id UUID;
ALTER TABLE temperature_records ADD COLUMN organization_id UUID;

-- 2. Create default organization for existing data
INSERT INTO organizations (id, name, slug)
VALUES ('default-org-id', 'Default Organization', 'default');

-- 3. Update existing records
UPDATE parties SET organization_id = 'default-org-id';
UPDATE lots SET organization_id = 'default-org-id';
-- ... repeat for all tables

-- 4. Make column NOT NULL
ALTER TABLE parties ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE lots ALTER COLUMN organization_id SET NOT NULL;
-- ... repeat for all tables

-- 5. Add foreign key constraints
ALTER TABLE parties ADD CONSTRAINT fk_parties_org
    FOREIGN KEY (organization_id) REFERENCES organizations(id);
-- ... repeat for all tables

-- 6. Create indexes
CREATE INDEX idx_parties_org ON parties(organization_id);
CREATE INDEX idx_lots_org ON lots(organization_id);
-- ... repeat for all tables

COMMIT;
```

### 10.2 Service Layer Changes

```typescript
// Before: PartyService without org context
class PartyService {
  async findAll(): Promise<Party[]> {
    return this.db.parties.findMany();
  }
}

// After: PartyService with org context
class PartyService {
  constructor(private context: OrganizationContext) {}

  async findAll(): Promise<Party[]> {
    return this.db.parties.findMany({
      where: { organization_id: this.context.organizationId }
    });
  }

  async create(data: CreatePartyDTO): Promise<Party> {
    return this.db.parties.create({
      data: {
        ...data,
        organization_id: this.context.organizationId
      }
    });
  }
}
```

### 10.3 Frontend State Management

```typescript
// Organization context store
interface OrganizationState {
  currentOrganization: Organization | null;
  availableOrganizations: Organization[];
  isLoading: boolean;

  // Actions
  setCurrentOrganization: (org: Organization) => void;
  switchOrganization: (orgId: string) => Promise<void>;
  refreshOrganizations: () => Promise<void>;
}

// API client configuration
const apiClient = axios.create({
  baseURL: '/api'
});

apiClient.interceptors.request.use((config) => {
  const orgId = store.getState().organization.currentOrganization?.id;
  if (orgId) {
    config.headers['X-Organization-ID'] = orgId;
  }
  return config;
});
```

---

## 11. Non-Functional Requirements

### 11.1 Performance Requirements

| Metric | Requirement | Notes |
|--------|-------------|-------|
| Query Performance | < 200ms | For org-filtered queries |
| Organization Switch | < 500ms | Context switch time |
| Member List Load | < 1s | For orgs with 100+ members |
| Concurrent Orgs | 1000+ | Active organizations |
| Users per Org | 100+ | Members per organization |

### 11.2 Indexing Strategy

```sql
-- Composite indexes for common query patterns
CREATE INDEX idx_parties_org_type ON parties(organization_id, account_type);
CREATE INDEX idx_stock_txn_org_date ON stock_transactions(organization_id, date);
CREATE INDEX idx_vouchers_org_date ON vouchers(organization_id, date);
CREATE INDEX idx_lots_org_status ON lots(organization_id, status);
```

### 11.3 Audit Logging

All organization-level actions must be logged:

```json
{
  "timestamp": "2026-01-22T10:30:00Z",
  "user_id": "user_123",
  "organization_id": "org_abc",
  "action": "MEMBER_INVITED",
  "resource_type": "organization_membership",
  "resource_id": "membership_456",
  "details": {
    "invited_email": "new@example.com",
    "role": "OPERATOR"
  },
  "ip_address": "192.168.1.1"
}
```

### 11.4 Extensibility: Personal Workspaces

The schema supports future "personal workspace" feature:

```sql
-- Personal workspace = Organization with 1 member
INSERT INTO organizations (name, slug, settings)
VALUES ('Personal Workspace', 'user-123-personal', '{"isPersonal": true}');

INSERT INTO organization_memberships (user_id, organization_id, role)
VALUES ('user_123', 'org_personal', 'OWNER');
```

---

## Summary

| Component | Status |
|-----------|--------|
| Pool Model Architecture | Defined |
| Global User Entity | Defined |
| Organization Entity | Defined |
| Membership Junction | Defined |
| Magic Filter Pattern | Specified |
| RBAC Roles | 6 roles defined |
| Org Switching Flow | Documented |
| Invitation Flow | Documented |
| API Endpoints | Specified |
| Database Schema | Provided |
| Migration Strategy | Outlined |

---

## Related Documents

- [Application Requirements](app-requirements.md) - Functional requirements
- [High-Level Architecture](high-arch.md) - System architecture
- [Entities & Operations](entities.md) - Data entities
- [Use Cases](use-cases.md) - User workflows

---

*Document Version: 1.0*
*Last Updated: January 2026*
