# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # TypeScript compile + Vite production build (output: dist/)
npm run lint     # ESLint with strict mode (zero warnings allowed)
npm run preview  # Preview production build locally
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
- `docs/src/app-requirements.md` - Functional requirements
- `docs/src/glossary.md` - Hindi/industry terminology reference

## Architecture

**Stack:** React 18 + Vite frontend, AWS Amplify backend (AppSync GraphQL, DynamoDB, Cognito)

**Structure:**
- `src/` - React frontend application
- `amplify/` - AWS Amplify backend configuration
  - `auth/resource.ts` - Cognito authentication (email-based)
  - `data/resource.ts` - GraphQL schema definition
- `docs/src/` - MkDocs documentation

**Multi-tenancy:** Pool model with shared database, tenant isolation via Organization entity. Global User identity across organizations with Membership for role-based access.

**Current State:** Early development - frontend is Amplify template, data schema is placeholder (Todo). Production schema design is in `docs/src/entities.md`.

## Domain Context

Agricultural cold storage facility management system (India-focused). Core operations:

- **Parties:** Kissan (farmers), Vyapari (traders), Aarti (commission agents)
- **Stock:** Amad (incoming goods), Nikasi (outgoing goods), Lot tracking by room
- **Financial:** Vouchers, Bardana (packaging advances), rent/interest calculations
- **Trading:** Sauda (deals), Chitti (delivery receipts), Nikasi Bills

Hindi language support with on-screen keyboard is a requirement.
