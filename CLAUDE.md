# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # TypeScript compile + Vite production build (output: dist/)
npm run lint     # ESLint with strict mode (zero warnings allowed)
npm run preview  # Preview production build locally
```

**Amplify Backend (Gen 2):**
```bash
npx ampx sandbox     # Start local cloud sandbox for development
npx ampx generate    # Generate GraphQL client code after schema changes
```

**Requirements:** Node >= 20.20.0, npm >= 10.8.0

## Documentation

Design documentation in `docs/src/`. Key documents:
- `docs/src/entities.md` - Data model, relationships, CRUD operations
- `docs/src/multi-tenancy-user-org.md` - Multi-tenant architecture details
- `docs/src/glossary.md` - Hindi/industry terminology reference

## Architecture

**Stack:** React 18 + Vite + TanStack Router/Query, AWS Amplify Gen 2 (AppSync GraphQL, DynamoDB, Cognito)

**Backend (`amplify/`):**
- `backend.ts` - Main backend definition combining auth + data
- `auth/resource.ts` - Cognito authentication (email-based)
- `data/resource.ts` - GraphQL schema with 50+ models and enums

**Frontend (`src/`):**
```
src/
├── components/
│   ├── ui/           # shadcn/ui components (Button, Dialog, Table, etc.)
│   ├── layout/       # AppShell, Sidebar, Header
│   └── shared/       # Reusable domain components
├── features/         # Domain modules (feature-first organization)
│   ├── auth/         # Login, signup, confirmation
│   ├── organizations/# Multi-tenant org management
│   ├── inventory/    # Amad (arrival), Nikasi (dispatch)
│   ├── bardana/      # Packaging bag tracking
│   ├── accounts/     # Vouchers, ledgers, daybook
│   ├── billing/      # Rent bills, receipts
│   ├── trading/      # Sauda (deals), gate passes
│   ├── loans/        # Advances, loans against goods
│   └── payroll/      # Employee salary, attendance
├── config/           # Navigation config
├── lib/              # Utilities (react-query, utils)
├── stores/           # UI context (sidebar state)
└── routes/           # TanStack Router file-based routes
```

**Feature Module Pattern:** Each feature follows this structure:
```
feature/
├── index.ts          # Barrel exports (public API)
├── types/index.ts    # TypeScript interfaces & enums
├── api/              # GraphQL client functions
├── hooks/            # React Query hooks (useXList, useCreateX, etc.)
├── utils/            # Domain calculations, formatters
└── components/       # Feature-specific UI components
```

**Routing:** TanStack Router with file-based routing. `/_authenticated` layout guards all protected routes with `beforeLoad` hook. Route tree auto-generated in `routeTree.gen.ts`.

**State Management:**
- Server state: TanStack Query (60s stale time, 1 retry)
- Auth context: `src/features/auth/hooks/use-auth.tsx`
- Org context: `src/features/organizations/`
- UI state: `src/stores/ui-store.tsx`

**Multi-tenancy:** Pool model with shared database, tenant isolation via `organizationId` on all business entities. Global User identity across organizations with Membership junction table for role-based access (Admin, Supervisor, Operator).

**Path Alias:** `@` maps to `./src` (e.g., `@/components/ui/button`)

## Domain Context

Agricultural cold storage facility management system (India-focused). Core operations:

- **Parties:** Kissan (farmers), Vyapari (traders), Aarti (commission agents)
- **Stock:** Amad (incoming goods), Nikasi (outgoing goods), Lot tracking by room/chamber
- **Financial:** Vouchers, Bardana (packaging advances), rent/interest calculations
- **Trading:** Sauda (deals), Gate passes, Katai (grading)
- **Billing:** Rent bills with GST, receipts, price breakups

Hindi language support with `nameHindi` fields on entities. See `docs/src/glossary.md` for Hindi/industry terms.
