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

### Rosalina Digital Concierge Hub (`artifacts/rosalina-concierge`)
- **Type**: React + Vite web app
- **Preview path**: `/`
- **Purpose**: Bilingual (EN/ES) guest-facing concierge hub for Rosalina Boutique Hotels in Puerto Rico
- **Brand**: Tropical Minimal Boutique — cream (#F8F5F0), sand (#EDE4D6), olive (#5C6E5E), terracotta (#C8785A)
- **Fonts**: Cormorant Garamond (headings) + DM Sans (body)
- **No backend** — fully static, no database
- **Sections**: Splash, Hero (status ribbon), Live Concierge (Google Meet), Property Info (WiFi, check-in, pools, etc.), Service Request (WhatsApp integration), FAQ, Emergency Contacts, Footer
- **Key features**:
  - Language toggle (EN/ES) via React context
  - Smart status ribbon auto-updating by time of day (8AM–5PM, 5PM–10PM, 10PM–2AM, 2AM–8AM)
  - After-hours detection for Live Concierge (shows emergency call instead of form when 2–8 AM)
  - WhatsApp integration for service requests: wa.me/17874389393
  - Google Meet link for live concierge: meet.google.com/lookup/rosalina
  - Copy to clipboard for WiFi password and addresses
  - Mobile-first, sticky bottom tab bar on mobile / top nav on desktop
  - Framer Motion animations

### API Server (`artifacts/api-server`)
- Express 5 API server
- Health endpoint at `/api/healthz`

### Canvas / Mockup Sandbox (`artifacts/mockup-sandbox`)
- Design sandbox for UI prototyping
