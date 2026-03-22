# The Club — Replit Project

## Overview
"The Club" is a members-only luxury dating/social app (Turkish market) built with React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and Capacitor for iOS/Android.

## Architecture
- **Frontend** — React SPA with screen-based routing via `AppContext`
- **Backend** — Express API on port 3001 (`server/index.ts`) with WebSocket support
- **Database** — PostgreSQL (Replit built-in) via `pg` package
- **State** — React Context (`AppContext`) + TanStack React Query
- **Mobile** — Capacitor 6 for iOS/Android native builds

## Key Files & Directories
- `src/App.tsx` — root component, screen router, provider tree
- `src/context/AppContext.tsx` — global state (screen, user, phone, userId)
- `src/lib/purchases.ts` — RevenueCat SubscriptionProvider & useSubscription hook
- `src/screens/` — LoginScreen, OnboardingScreen, WaitingApprovalScreen, DiscoveryScreen, MatchesScreen, ProfileScreen, EditProfileScreen, PremiumScreen
- `src/pages/admin/` — AdminLogin, AdminDashboard, PendingApprovals, AdminStats, ProtectedRoute
- `src/types/app.ts` — AppScreen union type, UserProfile, etc.
- `server/index.ts` — Express + HTTP server + WebSocket setup
- `server/db.ts` — pg Pool connection
- `server/routes/admin.ts` — admin auth (login/verify)
- `server/routes/adminUsers.ts` — user management (list, approve, reject, stats)
- `server/routes/users.ts` — user registration, status check
- `server/websocket.ts` — WebSocket server, notifyUser()
- `scripts/seedRevenueCat.ts` — seed RevenueCat project (run after integration connected)
- `vite.config.ts` — host: 0.0.0.0, port: 5000, proxies: /api → 3001, /ws → ws://3001

## Running the App

Two workflows run in parallel:
- **Start application** — Vite dev server on port 5000 (frontend + proxy)
- **Admin API** — Express + WebSocket backend on port 3001 (`npx tsx server/index.ts`)

## Database Schema
Table: `club_users`
- id (serial PK), phone (text UNIQUE), name (text), status ('pending'|'approved'|'rejected'), subscription_status ('none'|'active'|'expired'), profile_data (jsonb), created_at, updated_at
- Indexes: phone, status, created_at DESC

## User Flow
1. LoginScreen → enter phone → OTP (mocked) → POST /api/users/register
2. If status = 'approved' → onboarding flow
3. If status = 'pending' → WaitingApprovalScreen (WebSocket listener at /ws?phone=...)
4. Admin approves via panel → WebSocket notifies client → navigate to PremiumScreen
5. PremiumScreen → RevenueCat purchase → DiscoveryScreen

## Admin Panel
- URL: `/admin` (login) → `/admin/dashboard` (dashboard)
- Auth: JWT tokens, 8h expiry, stored in `localStorage`
- Backend routes: `/api/admin/login`, `/api/admin/verify`, `/api/admin/users`, `/api/admin/stats`, `/api/admin/users/:id/approve|reject`
- Env vars: `ADMIN_EMAIL`, `ADMIN_PASSWORD` (secret), `JWT_SECRET` (secret)
- Production domain: `www.theclubapp.com.tr/admin`

## RevenueCat Setup
- Entitlement: `premium`
- Product: `the_club_premium_monthly` (P1M, Turkish pricing ₺199)
- Client SDK: `@revenuecat/purchases-capacitor` (Capacitor native)
- Server SDK: `@replit/revenuecat-sdk` (seed script only)
- Seed script: `npx tsx scripts/seedRevenueCat.ts` (requires RevenueCat integration connected)
- After seed: set `VITE_REVENUECAT_TEST_API_KEY`, `VITE_REVENUECAT_IOS_API_KEY`, `VITE_REVENUECAT_ANDROID_API_KEY`

## App Details
- Bundle ID: `com.tugce.theclub`
- Gold color: `#C9A84C`, Background: `#0D0D0D`
- Target market: Turkey (Turkish UI language throughout)

## Replit Migration Notes
- Removed `lovable-tagger` from `vite.config.ts`
- Set Vite server host to `0.0.0.0` and port to `5000` for Replit preview
- `allowedHosts: true` for Replit's proxied preview iframe
