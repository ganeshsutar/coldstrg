# Cold Storage - Use Cases

This document provides an overview of all use cases for the Cold Storage Management System. Detailed use cases are organized by primary actor in separate documents.

---

## Table of Contents

1. [Actors](#actors)
2. [Use Cases by Actor](#use-cases-by-actor)
3. [Use Case Overview](#use-case-overview)
4. [Summary by Module](#summary-by-module)
5. [Appendix: Keyboard Shortcuts](#appendix-quick-reference---keyboard-shortcuts)

---

## Actors

| Actor | Description | Primary Responsibilities |
|-------|-------------|-------------------------|
| **System** | Automated processes | Calculations, alerts, scheduled tasks |
| **Operator** | Primary system user (staff) | All operations: data entry, transactions, vouchers, reports, configuration, approvals |

### External Entities (Non-System Actors)

| Entity | Description |
|--------|-------------|
| **Kissan (Farmer)** | Stores goods in cold storage, deposits goods, pays rent, withdraws goods |
| **Vyapari (Trader)** | Buys goods from farmers, makes payments |

### Role-Based Permissions

The system uses a permission-based access control model with the following roles:

| Role | Permissions | Description |
|------|-------------|-------------|
| **Admin** | All permissions | Full access to all system features and settings |
| **Operator** | All permissions (for now) | Currently has full access; will be limited to specific operational permissions in future versions |

> **Note:** In the initial version, both Admin and Operator roles have full access. Future versions will introduce granular permissions to restrict Operator access to specific modules.

### Actor Consolidation Note

> **Design Decision:** The original design had multiple actors (Manager, Accountant, Operator, Viewer) for different responsibilities. These have been consolidated into a single **Operator** actor for simplicity. The distinction between different user capabilities is now handled through the **role-based permission system** rather than separate actors. This allows for:
> - Simpler use case definitions
> - Flexible permission assignment without changing use cases
> - Easier onboarding (single actor to understand)
> - Future extensibility through permissions rather than new actors

---

## Use Cases by Actor

Detailed use cases are organized by primary actor:

| Actor | Document | Use Cases |
|-------|----------|-----------|
| **Operator** | [Operator Use Cases](use-cases/operator.md) | UC-01 to UC-13, UC-15 to UC-30 (28 use cases) |
| **System** | [System Use Cases](use-cases/system.md) | UC-14 (1 use case) |

> **Note:** User and Organization management use cases (UC-00a to UC-00h) are handled separately as part of the multi-tenancy infrastructure and are documented in [User & Organization](use-cases/user-org.md).

---

## Use Case Overview

> **Actor Mapping:** All use cases previously assigned to Manager, Accountant, or Viewer are now assigned to **Operator**. Access control is managed through the role-based permission system (Admin/Operator roles).

| # | Use Case | Module | Primary Actor | Details |
|---|----------|--------|---------------|---------|
| UC-01 | Register New Party | Party Management | Operator | [View](use-cases/operator.md#uc-01-register-new-party) |
| UC-02 | Update Party Information | Party Management | Operator | [View](use-cases/operator.md#uc-02-update-party-information) |
| UC-03 | Search and View Party | Party Management | Operator | [View](use-cases/operator.md#uc-03-search-and-view-party) |
| UC-04 | Set Party Financial Limits | Party Management | Operator | [View](use-cases/operator.md#uc-04-set-party-financial-limits) |
| UC-05 | Record Stock Arrival (Amad) | Stock Management | Operator | [View](use-cases/operator.md#uc-05-record-stock-arrival-amad) |
| UC-06 | Record Stock Dispatch (Nikasi) | Stock Management | Operator | [View](use-cases/operator.md#uc-06-record-stock-dispatch-nikasi) |
| UC-07 | Transfer Stock Between Rooms | Stock Management | Operator | [View](use-cases/operator.md#uc-07-transfer-stock-between-rooms-reloading) |
| UC-08 | View Stock Summary | Stock Management | Operator | [View](use-cases/operator.md#uc-08-view-stock-summary) |
| UC-09 | Search Lot | Stock Management | Operator | [View](use-cases/operator.md#uc-09-search-lot) |
| UC-10 | Create Payment Voucher | Financial | Operator | [View](use-cases/operator.md#uc-10-create-payment-voucher) |
| UC-11 | Create Receipt Voucher | Financial | Operator | [View](use-cases/operator.md#uc-11-create-receipt-voucher) |
| UC-12 | Issue Bardana Advance | Financial | Operator | [View](use-cases/operator.md#uc-12-issue-bardana-advance) |
| UC-13 | Adjust Bardana Against Stock | Financial | Operator | [View](use-cases/operator.md#uc-13-adjust-bardana-against-stock) |
| UC-14 | Calculate Interest | Financial | System | [View](use-cases/system.md#uc-14-calculate-interest) |
| UC-15 | Create Sauda (Deal) | Trading | Operator | [View](use-cases/operator.md#uc-15-create-sauda-deal) |
| UC-16 | Execute Sauda | Trading | Operator | [View](use-cases/operator.md#uc-16-execute-sauda) |
| UC-17 | Cancel Sauda | Trading | Operator | [View](use-cases/operator.md#uc-17-cancel-sauda) |
| UC-18 | Generate Chitti | Billing | Operator | [View](use-cases/operator.md#uc-18-generate-chitti-delivery-receipt) |
| UC-19 | Generate Nikasi Bill | Billing | Operator | [View](use-cases/operator.md#uc-19-generate-nikasi-bill) |
| UC-20 | Generate Cash Memo | Billing | Operator | [View](use-cases/operator.md#uc-20-generate-cash-memo) |
| UC-21 | View Party Ledger | Reports | Operator | [View](use-cases/operator.md#uc-21-view-party-ledger) |
| UC-22 | View Cash Book | Reports | Operator | [View](use-cases/operator.md#uc-22-view-cash-book) |
| UC-23 | Generate Balance Sheet | Reports | Operator | [View](use-cases/operator.md#uc-23-generate-balance-sheet) |
| UC-24 | View Party Balance Summary | Reports | Operator | [View](use-cases/operator.md#uc-24-view-party-balance-summary) |
| UC-25 | Record Meter Reading | Facility | Operator | [View](use-cases/operator.md#uc-25-record-meter-reading) |
| UC-26 | Record Temperature | Facility | Operator | [View](use-cases/operator.md#uc-26-record-temperature) |
| UC-27 | Configure Commodity | Administration | Operator | [View](use-cases/operator.md#uc-27-configure-commodity) |
| UC-28 | Manage Storage Rooms | Administration | Operator | [View](use-cases/operator.md#uc-28-manage-storage-rooms) |
| UC-29 | End of Season Settlement | Financial | Operator | [View](use-cases/operator.md#uc-29-end-of-season-settlement) |
| UC-30 | Generate Sample Slip | Stock Management | Operator | [View](use-cases/operator.md#uc-30-generate-sample-slip) |

---

## Summary by Module

| Module | Use Cases | Primary Actor | Key Entities |
|--------|-----------|---------------|--------------|
| Party Management | UC-01 to UC-04 | Operator | Party, Village |
| Stock Management | UC-05 to UC-09, UC-30 | Operator | Lot, Stock Transaction, Room |
| Financial | UC-10 to UC-14, UC-29 | Operator / System | Voucher, Bardana, Party Ledger |
| Trading | UC-15 to UC-17 | Operator | Sauda |
| Billing | UC-18 to UC-20 | Operator | Chitti, Nikasi Bill, Cash Memo |
| Reports | UC-21 to UC-24 | Operator | Party Ledger, Cash Book, Balance Sheet |
| Facility | UC-25 to UC-26 | Operator | Meter Reading, Temperature |
| Administration | UC-27 to UC-28 | Operator | Commodity, Room |

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
