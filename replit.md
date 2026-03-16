# The Club — Replit Project

## Overview
"The Club" is a members-only dating/social app built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui components. It was originally built on Lovable and migrated to Replit.

## Architecture
- **Frontend only** — pure client-side React SPA (no backend server)
- **Routing** — screen-based routing managed by `AppContext` (not react-router)
- **UI** — shadcn/ui components + Tailwind CSS + Radix UI primitives
- **State** — React Context (`AppContext`) + TanStack React Query

## Key Files & Directories
- `src/App.tsx` — root component, screen router
- `src/context/AppContext.tsx` — global state and screen navigation
- `src/screens/` — all app screens (Login, Onboarding, Discovery, Matches, Profile, Premium, Admin, etc.)
- `src/components/` — reusable UI components (shadcn/ui in `ui/` subdirectory)
- `src/data/mockData.ts` — mock data used throughout the app
- `src/hooks/` — custom React hooks
- `src/types/` — TypeScript type definitions
- `vite.config.ts` — Vite config (host: 0.0.0.0, port: 5000)

## Running the App
```bash
npm run dev
```
Starts on port 5000. The Replit workflow "Start application" handles this automatically.

## Replit Migration Notes
- Removed `lovable-tagger` from `vite.config.ts` (Lovable-specific dev tool)
- Set Vite server host to `0.0.0.0` and port to `5000` for Replit preview compatibility
- `allowedHosts: true` set to support Replit's proxied preview iframe

## Dependencies
See `package.json` for full list. Notable:
- React 18, React Router DOM v6, TanStack React Query v5
- Radix UI primitives (full suite), shadcn/ui, Tailwind CSS v3
- Capacitor (Android/iOS shell — not active in web mode)
- Recharts, react-hook-form, zod, date-fns, lucide-react
