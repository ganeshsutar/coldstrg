# Cold Storage Management System

A comprehensive cold storage management system designed to manage farmers (Kissan), traders (Vyapari), inventory, billing, accounting, and reporting for an agricultural cold storage facility.

## Documentation

This repository contains the design documentation for the Cold Storage Management System. The documentation is built using MkDocs with the Material theme.

### Serve Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Serve documentation locally
mkdocs serve
```

Then open [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.

### Build Static Site

```bash
mkdocs build
```

The static site will be generated in the `site/` directory.

## Documentation Structure

| Document | Description |
|----------|-------------|
| [Application Requirements](docs/app-requirements.md) | Detailed functional requirements |
| [Entities & Operations](docs/entities.md) | Data entities, relationships, and CRUD operations |
| [Use Cases](docs/use-cases.md) | Detailed use case specifications |
| [Dashboards & Reports](docs/dashboards.md) | KPIs, dashboards, and report catalog |
| [Glossary](docs/glossary.md) | Hindi/industry terminology reference |

## Key Features

- **Party Management** - Register and manage farmers, traders, and other stakeholders
- **Stock Management** - Track incoming (Amad) and outgoing (Nikasi) inventory
- **Financial Transactions** - Vouchers, payments, receipts, and advances
- **Deals & Trading** - Sauda (deals) between farmers and traders
- **Billing** - Chitti (delivery receipts), Nikasi bills, and cash memos
- **Reports** - Ledgers, balance sheets, and operational reports

---

**Developer:** Ganesh Sutar
