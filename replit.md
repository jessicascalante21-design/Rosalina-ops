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

### Rosalina LiveOps Concierge / PR Property Hub (`artifacts/rosalina-concierge`)
- **Type**: React + Vite web app (frontend SPA; calls API server via `/api` proxy)
- **Preview path**: `/`
- **Purpose**: Bilingual (EN/ES) guest-facing LiveOps Concierge hub + staff property management system for Rosalina Boutique Hotels (Ocean Park & Isla Verde), Puerto Rico
- **Optimizations**:
  - Route-level code splitting via React.lazy() (each page loads on-demand)
  - Global ErrorBoundary wrapping entire app (catches render crashes gracefully)
  - Memoized LanguageContext with useMemo/useCallback (prevents unnecessary re-renders)
  - PageHead component for dynamic page titles (SEO)
  - DailyReport split into sub-components: PropertyTab, GuestsTab, GlassUI
  - Vite config gracefully defaults PORT/BASE_PATH for production builds
  - Derived data (todayEntries, serviceEntries, etc.) wrapped in useMemo
  - localStorage reads wrapped in try-catch for resilience
- **Brand palette (CURRENT)**:
  - Background: `hsl(40 20% 97%)` — warm champagne cream
  - Primary: `hsl(224 58% 24%)` — deep navy blue (matches logo)
  - Accent/Gold: `#B89B5E` — warm gold
  - Dark sections: `#0B1730` — deep navy (PageHeader, hero, dark cards)
  - Mid-navy: `#132350`
- **Logo**: Navy blue floral R medallion (`attached_assets/image_1775935433037.png`), displayed with `mixBlendMode: screen` on dark backgrounds
- **Concierge avatar**: `attached_assets/4536937_1775962091124.png` (used in AI chat widget and daily report)
- **Fonts**: Playfair Display (headings, editorial serif) + DM Sans (body, UI text) — LHW-inspired editorial luxury typography
- **Pages** (route-based multi-page):
  - `/` — HubPage: 4-slide layout (Hero navy → PropertyShowcase swipe carousel → Action Hub grid → LocationSection distance map + Google Maps)
  - `/pre-arrival` — PreArrivalPage: 4-step form (Guest info with phone/email/additional guests → Arrival details → Services/packages/decorations → Beach extras/notes), creates guest account on submit
  - `/guest` — GuestPortalPage: login with reservation number + password; view stay info, add-ons, additional guests, contact team, quick actions
  - `/concierge` — ConciergePage: live concierge form → Google Meet
  - `/request` — RequestPage: service request form
  - `/feedback` — FeedbackPage: Google Review + feedback form
  - `/emergency` — EmergencyPage: tap-to-call emergency contacts
  - `/guide` — WelcomeGuidePage: luxury editorial property guide
  - `/staff/login` → `/staff/report` — PIN-protected staff dashboard (PR Property Hub)
- **Shared types**: `src/lib/guest-types.ts` — GuestRecord interface, PACKAGE_OPTIONS, BEACH_EXTRAS, helper functions (getGuests, saveGuests, updateGuest, generatePassword)
- **GuestRecord fields**: name, reservationNumber, property, arrivalDate, arrivalTime, departureDate, numGuests, earlyCheckin, luggageStorage, carStatus, preferredContact, specialRequests, phone, email, additionalGuests, roomNumber, lockboxCode, staffNotes, status (pre-arrival/checked-in/checked-out/no-show), packages[], beachExtras[]
- **Key features**:
  - Language toggle (EN/ES) via React context
  - Dual property selector on HubPage (Ocean Park / Isla Verde), saved to localStorage
  - Smart concierge status by time of day (AM/PM/late/closed)
  - After-hours detection: hides Meet form, shows emergency call (2-8 AM)
  - WhatsApp service requests: wa.me/17874389393
  - Google Meet live concierge: meet.google.com/rcs-ugkv-cyk
  - Google Review link: share.google/dMZZbAfY87Z3CDP7e
  - Emergency contacts (tap-to-call): 787-438-9393 (24/7), 787-304-3335 (8AM-2AM)
  - AI chat widget ("Rosa" / ROSALINA EXPERIENCE AI) — floating bottom-right button → streaming chat panel with concierge avatar
  - Property showcase carousel: swipeable photos for Ocean Park + Isla Verde with selection
  - Location distance map: visual PR map showing ~12km / 25 min between both properties + interactive Google Maps embeds
  - Guest account system with extended fields (phone, email, additional guests, packages, beach extras)
  - Guest portal at `/guest`: login with reservation number + password; view stay, add-ons, quick actions, contact
  - Pre-arrival password formula: first 4 chars of name + last 4 chars of reservation + `!`
  - Special packages: Romantic Decoration, Birthday, Anniversary, Welcome Basket, Champagne & Flowers
  - Beach extras: 2/4 Beach Chairs, Umbrella, Combo, Cooler (daily rentals)
  - Mobile-first: glass bottom tab bar on mobile, icon top nav on desktop
  - Framer Motion splash + page transitions
- **Staff portal (PR Property Hub)**:
  - PIN: `Rosalina2025!` (override via `VITE_STAFF_PIN` env var)
  - Session: 8hr stored in localStorage (`rosalina_staff_session`)
  - Luxury glassmorphism dashboard with cinematic property photo background slider
  - Rosa AI avatar in sidebar with online status
  - 5 tabs: Today, Property, Guests, Arrivals, AI Insights
  - **Property Hub tab**: Room status board for Ocean Park (19 units) and Isla Verde (6 units) with color-coded status cards (Vacant/Occupied/Cleaning/Maintenance/Check-out), property summary
  - **Guests tab**: Expandable guest cards with full details, inline editing (room number, lockbox code, status, staff notes), guest deletion
  - **Today tab**: Daily report with KPI stats, CSV export, Email Report
  - **Arrivals tab**: Pre-arrival submissions list
  - **AI Insights tab**: FAQ tracking from chat widget, auto-categorized questions, frequency bar chart, CSV export
  - Room statuses stored in localStorage (`rosalina_room_status`)
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
- Concierge (8AM-2AM): 787-304-3335
- Email: contact@rosalinapr.com
- WhatsApp: +1 787-438-9393
- Ocean Park: 2020 Av. McLeary, San Juan PR 00911 (19 units)
- Isla Verde: 84 Calle Jupiter, Carolina PR 00979 (6 units)
- WiFi: "Rosalina Guest" / RosalinaForever1!
- Check-in: 4PM | Check-out: 11AM
