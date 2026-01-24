# Cold Storage Management System

A comprehensive cold storage management system designed to manage farmers (Kissan), traders (Vyapari), inventory, billing, accounting, and reporting for an agricultural cold storage facility.

## Overview

This system handles the complete lifecycle of agricultural cold storage operations:

- **Party Management** - Register and manage farmers, traders, and other stakeholders
- **Stock Management** - Track incoming (Amad) and outgoing (Nikasi) inventory
- **Financial Transactions** - Vouchers, payments, receipts, and advances
- **Deals & Trading** - Sauda (deals) between farmers and traders
- **Billing** - Chitti (delivery receipts), Nikasi bills, and cash memos
- **Reports** - Ledgers, balance sheets, and operational reports

## Key Features

| Feature | Description |
|---------|-------------|
| **Multi-Tenant Architecture** | Manage multiple cold storage facilities with single login |
| **Organization Management** | Create organizations, invite users, assign roles |
| Multi-party Accounting | Separate ledgers for Kissan, Vyapari, and other parties |
| Lot-based Tracking | Track goods by lot with room allocation |
| Rent Management | Automatic rent calculation with grace periods |
| Bardana Advances | Track packaging material advances to farmers |
| Sauda Management | Create and execute deals between parties |
| Comprehensive Reports | Financial and operational reporting |

## Documentation

| Document | Description |
|----------|-------------|
| [User Guide](user-guide.md) | Visual walkthrough with screenshots |
| [Application Requirements](app-requirements.md) | Detailed functional requirements |
| [High-Level Architecture](high-arch.md) | System architecture and technology stack |
| [Multi-Tenancy Architecture](multi-tenancy-user-org.md) | User & organization model, data isolation |
| [Entities & Operations](entities.md) | Data entities, relationships, and CRUD operations |
| [Use Cases](use-cases.md) | Detailed use case specifications |
| [Dashboards & Reports](dashboards.md) | KPIs, dashboards, and report catalog |
| [Glossary](glossary.md) | Hindi/industry terminology reference |

### Screen Guides

| Screen Guide | Description |
|--------------|-------------|
| [Dashboard & Navigation](screens/dashboard.md) | Main dashboard, tabs, sidebar |
| [Account Master](screens/account-master.md) | Party registration and management |
| [Stock Management](screens/stock-management.md) | Stock summary, Chitti, lot search |
| [Financial Transactions](screens/financial.md) | Vouchers, Bardana, Balance Sheet |
| [Masters Configuration](screens/masters.md) | Item Master, commodities setup |

## Technology

- **Platform:** Desktop Application (Windows)
- **Language Support:** English and Hindi (Devanagari)

## Quick Links

- [User Guide with Screenshots](user-guide.md)
- [Getting Started](app-requirements.md#1-overview)
- [Entity Relationships](entities.md#entity-relationship-diagram)
- [Use Case Overview](use-cases.md#use-case-overview)
- [KPIs by Role](dashboards.md#kpis-by-role)

---

**Developer:** Ganesh Sutar
