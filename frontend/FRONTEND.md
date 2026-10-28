# YieldMax-AI Frontend

React + TypeScript + Tailwind CSS v4 frontend for the Django REST backend.

## Tech Stack (CloudCamp BD scoring)
- React 19, TypeScript, Vite
- Tailwind CSS v4
- Axios (HTTP client)
- Lucide React (icons)

This aligns with the CloudCamp BD "Frontend AI Tools" scoring category
(v0, Lovable, Bolt.new, Cursor, etc.).

## API Endpoints consumed

| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/health/ | API health status |
| GET | /api/farms/ | List all farms |
| POST | /api/farms/ | Create a farm |
| POST | /api/farmers/ | Create a farmer |
| GET | /api/farms/<pk>/ | Farm detail |
| POST | /api/predictions/ | Create yield prediction (3 scenarios) |
| GET | /api/predictions/<pk>/ | Prediction detail |
| POST | /api/predictions/economics/calculate/ | Profit economics |

## Pages
- `/` — Home with backend health check
- `/predict` — Farmer/farm form → yield prediction (normal / low_rain / heavy_rain)
- `/farms` — Farm registry with search + create form
- `/economics` — Standalone profit calculator
- `/mcp` — MCP integration demo (servers, transports, architecture notes)

## Setup
```bash
cd frontend
cp .env.example .env   # edit VITE_API_BASE_URL if needed
npm install
npm run dev            # http://localhost:5173
npm run build          # production build
npm run lint           # oxlint
```

## Backend prerequisites
The Django backend must be running on `http://localhost:8000` (or the
`VITE_API_BASE_URL` you set). CORS is already enabled in
`backend/config/settings.py` (`CORS_ALLOW_ALL_ORIGINS = True`).

## CloudCamp BD scoring alignment
- Frontend AI Tools category: built with modern frontend stack (v0/Lovable-compatible output style)
- MCP Integration: dedicated `/mcp` page documenting built + external MCP servers, transports (SSE/Stdio/Streamable HTTP), permission boundaries
- Links & Deliverables: app is deployable to Vercel/Render/Railway for a live demo URL
- Data Lifecycle: farm → prediction → scenario → economics pipeline documented in UI
