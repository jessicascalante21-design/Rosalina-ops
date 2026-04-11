# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Rosalina LiveOps Concierge™ Hub (`artifacts/rosalina-concierge`)
- **Type**: React + Vite web app (fully static, no backend)
- **Preview path**: `/`
- **Purpose**: Bilingual (EN/ES) guest-facing LiveOps Concierge hub for Rosalina Boutique Hotels (Ocean Park & Isla Verde), Puerto Rico
- **Brand**: Tropical Minimal Boutique — cream (#F8F5F0), sand (#EDE4D6), olive (#5C6E5E), terracotta (#C8785A)
- **Logo**: Navy blue floral R medallion (`attached_assets/image_1775935433037.png`) used in Splash, Navigation, LiveConcierge, DailyReport
- **Fonts**: Cormorant Garamond (headings) + DM Sans (body)
- **Sections**: Splash, Hero, Live Concierge, Property Info, Service Request, FAQ, Feedback/Reviews, Emergency Contacts, Footer
- **Key features**:
  - Language toggle (EN/ES) via React context
  - Smart status ribbon by time of day (8AM–5PM AM shift, 5PM–10PM PM shift, 10PM–2AM late night, 2AM–8AM closed)
  - After-hours detection: hides Meet form and shows emergency call (2–8 AM)
  - WhatsApp service requests: wa.me/17874389393
  - Google Meet live concierge: meet.google.com/rcs-ugkv-cyk
  - Feedback form → mailto:contact@rosalinapr.com + Google Review link
  - Emergency contacts (tap-to-call): 787-438-9393 (24/7), 787-304-3335 (8AM–2AM)
  - Mobile-first: sticky bottom tab bar (7 tabs) on mobile, icon top nav on desktop
  - Framer Motion splash + page transitions
- **Staff portal** (`/staff/login` → `/staff/report`):
  - PIN-protected login (default PIN: `Rosalina2025!`, override via `VITE_STAFF_PIN` env var)
  - 8-hour session stored in localStorage (`rosalina_staff_session`)
  - Protected route: unauthenticated access redirects to login
  - Daily Report: KPI stats, full log, Copy CSV, Download CSV, Email Report, Clear Today
  - All guest service requests and feedback logged to localStorage (`rosalina_report`)

### API Server (`artifacts/api-server`)
- Express 5 API server
- Health endpoint at `/api/healthz`

### Canvas / Mockup Sandbox (`artifacts/mockup-sandbox`)
- Design sandbox for UI prototyping
