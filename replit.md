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
- **Type**: React + Vite web app (frontend SPA; calls API server via `/api` proxy)
- **Preview path**: `/`
- **Purpose**: Bilingual (EN/ES) guest-facing LiveOps Concierge hub for Rosalina Boutique Hotels (Ocean Park & Isla Verde), Puerto Rico
- **Brand palette (CURRENT)**:
  - Background: `hsl(38 22% 96%)` — warm champagne cream
  - Primary: `hsl(224 58% 24%)` — deep navy blue (matches logo)
  - Accent: `hsl(38 72% 52%)` — warm gold
  - Dark sections: `#0D1B40` — deep navy (PageHeader, hero, dark cards)
  - Mid-navy: `#162B5E`
- **Logo**: Navy blue floral R medallion (`attached_assets/image_1775935433037.png`)
- **Fonts**: Cormorant Garamond (headings) + DM Sans (body)
- **Pages** (route-based multi-page):
  - `/` — HubPage: 4-slide layout (Hero navy → PropertyShowcase swipe carousel → Action Hub grid → LocationSection distance map)
  - `/pre-arrival` — PreArrivalPage: 3-step form (Booking info → Arrival details → Requests), creates guest account on submit
  - `/guest` — GuestPortalPage: login with reservation number + password; view stay info + contact team
  - `/concierge` — ConciergePage: live concierge form → Google Meet
  - `/request` — RequestPage: service request form
  - `/feedback` — FeedbackPage: Google Review + feedback form
  - `/emergency` — EmergencyPage: tap-to-call emergency contacts
  - `/staff/login` → `/staff/report` — PIN-protected staff dashboard with 3 tabs (Today, Pre-Arrivals, Guest Accounts) + CSV downloads
- **Key features**:
  - Language toggle (EN/ES) via React context
  - Dual property selector on HubPage (Ocean Park / Isla Verde), saved to localStorage
  - Smart concierge status by time of day (AM/PM/late/closed)
  - After-hours detection: hides Meet form, shows emergency call (2–8 AM)
  - WhatsApp service requests: wa.me/17874389393
  - Google Meet live concierge: meet.google.com/rcs-ugkv-cyk
  - Google Review link: share.google/dMZZbAfY87Z3CDP7e
  - Emergency contacts (tap-to-call): 787-438-9393 (24/7), 787-304-3335 (8AM–2AM)
  - AI chat widget ("Rosa" / ROSALINA EXPERIENCE AI) — floating bottom-right button → streaming chat panel with concierge avatar; tracks all guest questions to localStorage for FAQ analytics
  - Property showcase carousel: swipeable photos for Ocean Park + Isla Verde with selection
  - Location distance map: visual PR map showing ~12km / 25 min between both properties
  - Guest account system: created on pre-arrival submit; localStorage key `rosalina_guests`
  - Guest portal at `/guest`: login with reservation number + password; WhatsApp/email/Meet contact
  - Footer: Google Review, Instagram (@rosalinaexperience), Guest Portal, Staff links
  - Pre-arrival password formula: first 4 chars of name + last 4 chars of reservation + `!`
  - Mobile-first: glass bottom tab bar on mobile, icon top nav on desktop
  - Framer Motion splash + page transitions
  - PageHeader component: `bg-[#0D1B40]` with radial accent glow per page
- **Staff portal**:
  - PIN: `Rosalina2025!` (override via `VITE_STAFF_PIN` env var)
  - Session: 8hr stored in localStorage (`rosalina_staff_session`)
  - Daily Report with KPI stats, CSV export, Email Report, Clear Today
  - **AI Insights tab**: FAQ tracking from chat widget — auto-categorized questions (WiFi, Check-in, Dining, Activities, etc.), frequency counts, category bar chart, CSV export
  - Logs stored in localStorage (`rosalina_report`); chat FAQ in `rosalina_chat_faq`
- **Vite proxy**: `/api` → `http://localhost:8080` (API server)

### API Server (`artifacts/api-server`)
- Express 5 API server, port 8080
- Routes mounted under `/api`
- Health endpoint: `GET /api/healthz`
- **AI Chat endpoint**: `POST /api/chat`
  - Accepts `{ messages: ChatMessage[], property?: string }`
  - Streams SSE responses from OpenAI gpt-4o-mini
  - "ROSALINA EXPERIENCE AI" persona: premium concierge with personalized recommendations, upselling, max 3 curated options per response, evocative tone
  - OpenAI via Replit AI Integrations (`@workspace/integrations-openai-ai-server`)
  - Env vars: `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY` (auto-provisioned)

### Canvas / Mockup Sandbox (`artifacts/mockup-sandbox`)
- Design sandbox for UI prototyping

## Contact & Hotel Info (Rosalina)
- Emergency 24/7: 787-438-9393
- Concierge (8AM–2AM): 787-304-3335
- Email: contact@rosalinapr.com
- WhatsApp: +1 787-438-9393
- Ocean Park: 2020 Av. McLeary, San Juan PR 00911
- Isla Verde: 84 Calle Júpiter, Carolina PR 00979
- WiFi: "Rosalina Guest" / RosalinaForever1!
- Check-in: 4PM | Check-out: 11AM
