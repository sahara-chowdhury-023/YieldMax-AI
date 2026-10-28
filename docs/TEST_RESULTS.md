# YieldMax V1 — QA Test Results

**Test date:** 28 October 2026  
**Branch:** `feature/devops-testing`  
**Tester:** Sahara Chowdhury  
**Environment:** Local Docker Compose

## Results

| Test ID | Actual Result | Status |
|---|---|---|
| TC-01 | All three containers running | PASS |
| TC-02 | PostgreSQL healthy and accepting connections | PASS |
| TC-03 | Django reported no system check issues | PASS |
| TC-04 | All migrations applied successfully | PASS |
| TC-05 | HTTP 200; status ok | PASS |
| TC-06 | Prediction created; three scenarios returned | PASS |
| TC-07 | Saved prediction ID 1 retrieved successfully | PASS |
| TC-08 | Revenue ৳300,000; profit ৳150,000 | PASS |
| TC-09 | Missing required fields reported | PASS |
| TC-10 | HTTP 400 for negative land area | PASS |
| TC-11 | HTTP 400 for invalid crop code | PASS |
| TC-12 | Browser Network confirmed POST /api/predictions/ returned HTTP 201 | PASS |

## Scenario Calculation Verification

Input: 2 hectares, 30 BDT/kg market price, 150,000 BDT total cost.

| Scenario | Production (kg) | Revenue (BDT) | Net Profit (BDT) |
|---|---:|---:|---:|
| Normal | 10,000 | 300,000 | 150,000 |
| Low rain | 8,000 | 240,000 | 90,000 |
| Heavy rain | 9,000 | 270,000 | 120,000 |

All returned calculations matched the expected prototype formulas.

## Integration Verification

Chrome Developer Tools confirmed:

- Frontend origin: `http://localhost:5173`
- Backend URL: `http://localhost:8000/api/predictions/`
- Request method: POST
- Response status: 201 Created
- CORS allowed the local frontend origin.

## Limitations and Follow-up

- The yield values are prototype estimates, not field-verified agricultural forecasts.
- Production security hardening remains necessary: environment-based Django secret, restricted CORS, and production-safe debug settings.
- Automated regression tests, performance tests, and production deployment were not verified.

## Conclusion

All 12 recorded local infrastructure, API, and integration test cases passed. The V1 development environment is ready for team review and further development.