# Cold Storage Management System - Overview

## 1. Introduction

The Cold Storage Management System is a comprehensive application designed to manage agricultural cold storage facility operations in India. It handles the complete lifecycle of storing perishable goods (primarily potatoes and other commodities) for farmers (Kissan) and traders (Vyapari).

The system digitizes and automates key operations including:
- **Multi-Tenant Architecture** - Users can manage multiple cold storage facilities with a single login
- **Organization Management** - Create organizations, invite team members, assign roles (Owner, Admin, Operator, etc.)
- **Inventory Management** - Tracking lots of commodities stored in various rooms
- **Financial Accounting** - Managing payments, receipts, rent calculations, and interest
- **Trading Operations** - Facilitating deals between farmers and traders
- **Facility Monitoring** - Recording temperature and electricity meter readings

The application supports Hindi/bilingual terminology to serve the Indian agricultural market effectively.

### Multi-Tenancy Model

The system uses a **Pool Model** (shared database) for multi-tenancy:
- **Global User**: Individual identity independent of organizations
- **Organization**: Cold storage facility (data boundary/tenant)
- **Membership**: Links users to organizations with role-based permissions

Users can belong to multiple organizations and switch between them seamlessly.

---

## 2. Entities

### Multi-Tenancy Entities

| Entity | Description |
|--------|-------------|
| **Global User** | Individual user identity across all organizations (email, password, profile) |
| **Organization** | Cold storage facility - the tenant boundary for data isolation |
| **Membership** | Links users to organizations with roles (Owner, Admin, Manager, Accountant, Operator, Viewer) |

### Master Data

| Entity | Description |
|--------|-------------|
| **Party** | Farmers, traders, staff, and other stakeholders who interact with the cold storage |
| **Commodity** | Products stored in the facility (potatoes, walnuts, etc.) with associated pricing and rent rules |
| **Room** | Physical storage rooms with defined capacity and temperature settings |
| **Village** | Location master used for party addresses |

### Transaction Entities

| Entity | Description |
|--------|-------------|
| **Lot** | A batch of commodity belonging to a party, stored in a specific room |
| **Stock Transaction** | Records of incoming (Amad) and outgoing (Nikasi) stock movements |
| **Voucher** | Financial transactions including payments, receipts, and journal entries |
| **Bardana** | Packaging material (jute bags) advances given to parties with interest tracking |
| **Chitti** | Delivery receipts generated when goods leave the storage |
| **Sauda** | Trade deals between farmers and traders |

### Operational Records

| Entity | Description |
|--------|-------------|
| **Meter Reading** | Electricity meter readings with photo evidence |
| **Temperature Record** | Storage temperature logs for quality monitoring |

### Derived/Report Entities

| Entity | Description |
|--------|-------------|
| **Party Ledger** | Financial ledger showing all transactions for a party |
| **Cash Book** | Daily record of cash transactions |
| **Stock Register** | Register of all stock movements |

---

## 3. Key Use Cases

### Stock Arrival (Amad)
When a farmer or trader brings goods to store, the system records the arrival by capturing party details, commodity type, quantity (number of bags and weight), and assigns the lot to a specific room. A receipt is generated for the party.

### Stock Dispatch (Nikasi)
When goods are taken out of storage, the system records the dispatch against an existing lot. It calculates applicable rent based on storage duration and generates a delivery receipt (Chitti).

### Payment Receipt
When a party makes a payment towards their outstanding balance, the system records it as a receipt voucher, updates the party's ledger, and reflects the change in their balance.

### Party Registration
New farmers or traders are registered with their personal details (name, village, contact), identification documents, and initial financial terms (credit limit, interest rates).

### View Party Ledger
Users can view a comprehensive ledger for any party showing all transactions (stock in/out, payments, receipts, rent charges, interest) with running balance.

### Stock Room Transfer (Reloading)
Lots can be transferred from one room to another for operational reasons. The system updates the room assignment while maintaining the lot's identity and history.

### Generate Balance Summary
At any point, users can generate a summary report showing outstanding balances for all parties, categorized by party type (farmer, trader) with aging analysis.
