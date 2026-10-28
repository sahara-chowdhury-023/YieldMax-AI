# YieldMax-AI Frontend — Summary of Work Done

## Overview
Built a React + TypeScript + Tailwind CSS v4 frontend on top of the existing Django REST backend for YieldMax-AI (AI-powered crop yield prediction and optimization for Bangladeshi farmers).

## Project Structure
```
frontend/
├── index.html
├── vite.config.ts            # Vite config with React + Tailwind plugins
├── package.json
├── tsconfig.json
├── .env.example              # VITE_API_BASE_URL=http://localhost:8000
├── .gitignore                # ignores node_modules, dist, .env
├── FRONTEND.md               # setup & usage guide
├── public/
└── src/
    ├── main.tsx              # React entry point
    ├── App.tsx               # client-side router (no library)
    ├── index.css             # Tailwind imports + custom @theme
    ├── api.ts                # typed Axios client for all backend endpoints
    ├── components/
    │   ├── Navbar.tsx        # sticky nav with health badge
    │   ├── HealthBadge.tsx   # live /api/health/ status indicator
    │   └── ui.tsx            # shared UI primitives (Card, SectionHeader, StatCard, Button, Input, Select, Textarea)
    └── pages/
        ├── Home.tsx          # dashboard with features + backend health
        ├── Predict.tsx       # farmer/farm form → yield prediction (3 scenarios)
        ├── Farms.tsx         # farm registry (list + search + create)
        ├── Economics.tsx     # standalone profit calculator
        └── Mcp.tsx           # MCP integration demo page
```

## Backend Integration
Consumed Django REST endpoints via a typed Axios client (`src/api.ts`):

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health/` | API health status |
| GET | `/api/farms/` | List farms |
| POST | `/api/farms/` | Create farm |
| POST | `/api/farmers/` | Create farmer |
| GET | `/api/farms/<pk>/` | Farm detail |
| POST | `/api/predictions/` | Create yield prediction (normal/low_rain/heavy_rain) |
| GET | `/api/predictions/<pk>/` | Prediction detail |
| POST | `/api/predictions/economics/calculate/` | Profit economics |

Backend CORS was enabled in `backend/config/settings.py` (`corsheaders` middleware + `CORS_ALLOW_ALL_ORIGINS = True`).

## Key Features
- **Home**: feature cards, live backend health badge
- **Predict**: multi-step farmer + farm + economics form; returns 3 weather scenarios with yield/profit in BDT
- **Farms**: searchable registry table + create form
- **Economics**: standalone production/revenue/cost/profit calculator
- **MCP**: documents custom + external MCP servers, transports (SSE/Stdio/Streamable HTTP), permission boundaries (≥80-char notes for CloudCamp BD scoring)

## Tailwind v4 Fix
The UI was rendering unstyled because `@tailwindcss/vite` was missing. Fixed by:
- Installing `@tailwindcss/vite` devDependency
- Registering `tailwindcss()` plugin in `vite.config.ts`
- `src/index.css` already had `@import "tailwindcss"` + `@theme` with custom colors/fonts
- `src/main.tsx` already imported `./index.css`

No `tailwind.config.js` or `postcss.config.js` required — Tailwind v4 auto-scans content.

## Verification
- `npm run build` — passes cleanly (TS + Vite)
- `npm run lint` — passes (only benign React warnings)
- Generated `dist/assets/*.css` confirms Tailwind utilities are produced (e.g. `bg-accent`, `text-accent`, `rounded-lg`, `px-4`, `py-2`, `text-text-primary`)

## Setup
```bash
cd frontend
cp .env.example .env      # set VITE_API_BASE_URL if backend is not on :8000
npm install
npm run dev               # http://localhost:5173
npm run build             # production build
```

## CloudCamp BD Scoring Alignment
- Frontend AI Tools category: modern React/Tailwind stack
- MCP Integration: dedicated `/mcp` page with built + external servers, transports, permission notes
- Links & Deliverables: deployable to Vercel/Render/Railway for a live demo URL
- Data Lifecycle: farm → prediction → scenario → economics pipeline exposed in UI
