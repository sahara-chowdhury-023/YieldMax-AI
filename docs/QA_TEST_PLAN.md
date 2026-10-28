# YieldMax V1 — QA Test Plan

## Objective
Verify that the Docker-based YieldMax application works correctly across the React frontend, Django REST backend, and PostgreSQL database.

## Test Environment
- Operating system: Windows 11
- Containerization: Docker Compose
- Backend: Django REST Framework
- Frontend: React, TypeScript, Vite
- Database: PostgreSQL 16
- API testing: Postman
- Browser testing: Google Chrome

## Test Cases

| ID | Test Case | Expected Result |
|---|---|---|
| TC-01 | Start Docker services | All three containers running |
| TC-02 | Check PostgreSQL | Database healthy |
| TC-03 | Run Django system check | No issues |
| TC-04 | Apply migrations | Migrations successful |
| TC-05 | GET /api/health/ | HTTP 200 |
| TC-06 | POST /api/predictions/ | HTTP 201 and three scenarios |
| TC-07 | GET /api/predictions/1/ | HTTP 200 and saved data |
| TC-08 | POST /api/economics/calculate/ | HTTP 200 and correct profit |
| TC-09 | Submit missing fields | HTTP 400 |
| TC-10 | Submit negative land area | HTTP 400 |
| TC-11 | Submit invalid crop code | HTTP 400 |
| TC-12 | Submit prediction from React | HTTP 201 in browser Network tab |

## Acceptance Criteria
All listed tests must pass before the Day 1 development environment and integration setup are considered verified.

## Scope
Local V1 prototype testing only. No production deployment, model accuracy validation, or performance/load testing is included.