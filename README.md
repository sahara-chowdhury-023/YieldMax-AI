# YieldMax — Predictive Yield Optimization Across Seasons

**International AI Builders Congress 2026 | V1 Prototype**

YieldMax is a web-based agricultural decision-support prototype that helps farmers estimate crop production and financial outcomes under different rainfall scenarios.

The application allows users to enter farm information, generate scenario-based yield estimates, and compare expected revenue, costs, and net profit.

> **Note:** Current yield values are rule-based prototype estimates. They are not trained machine-learning forecasts or verified field productivity gains.

## Key Features

- **Farm Information:** Enter farmer name, location, land area, crop type, and planting date.
- **Yield Estimation:** Generate baseline crop-yield estimates.
- **Weather Scenarios:** Compare normal, low-rainfall, and heavy-rainfall conditions.
- **Economics Calculator:** Calculate production, revenue, cost, and net profit in Bangladeshi Taka (BDT).
- **Prediction History:** Retrieve saved predictions through the API.
- **Interactive Dashboard:** View scenario comparison cards and detailed results.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Python, Django, Django REST Framework |
| Database | PostgreSQL 16 |
| Containerization | Docker, Docker Compose |
| API Testing | Postman |
| Version Control | Git, GitHub |

## System Architecture

```text
User / Browser
      |
      v
React Frontend (Port 5173)
      |
      | HTTP / JSON API
      v
Django REST Backend (Port 8000)
      |
      v
PostgreSQL Database (Port 5432)
```

Django handles farm information, prediction requests, scenario calculations, and database operations.

## Project Structure

```text
YieldMax-AI/
|
|-- backend/
|   |-- apps/
|   |   |-- farms/
|   |   `-- predictions/
|   |-- config/
|   |-- services/
|   |-- tests/
|   |-- Dockerfile
|   |-- manage.py
|   `-- requirements.txt
|
|-- frontend/
|   |-- src/
|   |-- Dockerfile
|   |-- package.json
|   `-- vite.config.ts
|
|-- docs/
|   |-- QA_TEST_PLAN.md
|   `-- TEST_RESULTS.md
|
|-- docker-compose.yml
|-- .env.example
|-- .gitignore
`-- README.md
```

## Getting Started

### Prerequisites

Install:

- Git
- Docker Desktop (with Docker Compose)

### Step 1 — Clone the repository

```bash
git clone https://github.com/sahara-chowdhury-023/YieldMax-AI.git
cd YieldMax-AI
git switch development
```

The `development` branch is the team's integration branch. Use it to run the latest merged development code.

### Step 2 — Configure environment variables

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder database password with a strong local password. Generate a random value for `DJANGO_SECRET_KEY` if the backend is configured to use it.

Never commit `.env` to GitHub.

### Step 3 — Build and start Docker containers

Make sure Docker Desktop is running.

```bash
docker compose up --build -d
```

This starts three services:

- `db` — PostgreSQL
- `backend` — Django
- `frontend` — React/Vite

### Step 4 — Apply database migrations

```bash
docker compose exec backend python manage.py migrate
```

### Step 5 — Verify running services

```bash
docker compose ps
```

All three containers should be running, and PostgreSQL should report a healthy status.

### Step 6 — Open the application

| Service | Local URL |
|---|---|
| React application | http://localhost:5173 |
| Django health API | http://localhost:8000/api/health/ |
| Prediction API | http://localhost:8000/api/predictions/ |
| Economics API | http://localhost:8000/api/economics/calculate/ |

The prediction and economics endpoints accept POST requests.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health/` | Check backend availability |
| POST | `/api/predictions/` | Create prediction with rainfall scenarios |
| GET | `/api/predictions/{id}/` | Retrieve saved prediction |
| POST | `/api/economics/calculate/` | Calculate farm economics |
| POST | `/api/predictions/economics/calculate/` | Alternative economics endpoint |

### Example Prediction Request

**POST** `http://localhost:8000/api/predictions/`

```json
{
  "farmer_name": "Rahim",
  "area_ha": 2.0,
  "district": "Bogura",
  "upazila": "Shibganj",
  "land_type": "lowland",
  "crop_code": "boro_rice",
  "planting_date": "2026-12-15",
  "market_price_bdt_per_kg": 30,
  "total_cost_bdt": 150000
}
```

### Example Scenario Results

| Scenario | Yield (t/ha) | Production (kg) | Net Profit (BDT) |
|---|---:|---:|---:|
| Normal rainfall | 5.0 | 10,000 | 150,000 |
| Low rainfall | 4.0 | 8,000 | 90,000 |
| Heavy rainfall | 4.5 | 9,000 | 120,000 |

These values are illustrative prototype calculations based on the sample input.

## Testing and Quality Assurance

The local development environment was tested using Docker, Postman, and Chrome Developer Tools.

Verified checks include:

- Docker builds for backend and frontend
- PostgreSQL readiness
- Django system checks and migrations
- Health API returning HTTP 200
- Prediction creation returning HTTP 201
- Saved prediction retrieval returning HTTP 200
- Economics calculation
- Missing-field validation returning HTTP 400
- Negative land-area validation returning HTTP 400
- Invalid crop-code validation returning HTTP 400
- React-to-Django integration returning HTTP 201

Detailed documentation:

- [QA Test Plan](docs/QA_TEST_PLAN.md)
- [QA Test Results](docs/TEST_RESULTS.md)

## GitHub Branch Workflow

| Branch | Purpose |
|---|---|
| `main` | Stable project |
| `development` | Team integration |
| `feature/backend` | Backend development |
| `feature/frontend` | Frontend development |
| `feature/devops-testing` | Docker, QA and integration |

Team members should develop on their feature branches and submit Pull Requests to `development` for review.

## Useful Docker Commands

Check containers:

```bash
docker compose ps
```

View backend logs:

```bash
docker compose logs backend
```

View frontend logs:

```bash
docker compose logs frontend
```

Stop containers:

```bash
docker compose down
```

Rebuild after changing Docker configuration:

```bash
docker compose up --build -d
```

## Current Limitations

- Yield estimates use prototype calculation rules rather than trained predictive ML models.
- Weather scenarios are simplified and are not connected to live rainfall forecasts.
- Productivity improvements have not been independently verified.
- The Docker setup uses development servers and is not production-ready.
- Automated regression and performance testing remain future work.

## Future Improvements

Potential next steps include integrating historical rainfall and crop-yield datasets, evaluating predictive ML models, adding model validation, and testing irrigation or planting recommendations against real agricultural data.

## Team

**International AI Builders Congress 2026 — YieldMax**

Add the four team members' confirmed names and responsibilities here.

## Project Status

**V1 prototype — local development and integration tested.**

The project is under active development.