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

Extensive design documentation exists in `docs/src/`. Serve locally:
```bash
cd docs && pip install -r requirements.txt && mkdocs serve
```

Key documents:
- `docs/src/entities.md` - Data model, relationships, CRUD operations
- `docs/src/high-arch.md` - System architecture and technology stack
- `docs/src/multi-tenancy-user-org.md` - Multi-tenant architecture details
- `docs/src/glossary.md` - Hindi/industry terminology reference

## Architecture

**Stack:** React 18 + Vite frontend, AWS Amplify Gen 2 backend (AppSync GraphQL, DynamoDB, Cognito)

**Structure:**
- `src/` - React frontend application
- `amplify/` - AWS Amplify Gen 2 backend (TypeScript-first)
  - `backend.ts` - Main backend definition combining auth + data
  - `auth/resource.ts` - Cognito authentication (email-based)
  - `data/resource.ts` - GraphQL schema definition (uses `@aws-amplify/backend`)
- `docs/src/` - MkDocs design documentation

**Multi-tenancy:** Pool model with shared database, tenant isolation via `organization_id` on all business entities. Global User identity across organizations with Membership junction table for role-based access (Admin, Operator roles).

**Current State:** Early development - frontend is Amplify template, data schema is placeholder (Todo model). Production schema design covering 18+ entities is documented in `docs/src/entities.md`.

## Domain Context

Agricultural cold storage facility management system (India-focused). Core operations:

- **Parties:** Kissan (farmers), Vyapari (traders), Aarti (commission agents)
- **Stock:** Amad (incoming goods), Nikasi (outgoing goods), Lot tracking by room
- **Financial:** Vouchers, Bardana (packaging advances), rent/interest calculations
- **Trading:** Sauda (deals), Chitti (delivery receipts), Nikasi Bills

Hindi language support with on-screen keyboard is a requirement. See `docs/src/glossary.md` for Hindi/industry terms.
