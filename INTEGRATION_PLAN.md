# KIA Student Analytics Dashboard — Integration Plan

This document is the in-project companion to the full project analysis.  
See `PROJECT_ANALYSIS.md` (artifact) for the complete gap analysis.

---

## What was done in this session

### ✅ Critical fixes applied

1. **`backend/.env`** — Fixed two startup-crashing issues:
   - `JWT_SECRET` changed from placeholder (contained "replace") to a proper 48-char secret
   - `ADMIN_PASSWORD` changed from 9-char `Admin@123` (failed 12-char guard) to `KiaAdmin@2026Secure`
   - `DATABASE_URL` updated to SQLite for local dev (`sqlite:///./kia_test.db`)

2. **`backend/app/api/routers/users.py`** — **New file** implementing full user account management:
   - `GET /api/users` — list all user accounts
   - `POST /api/users` — create student/admin account
   - `PATCH /api/users/{id}/password` — reset password
   - `DELETE /api/users/{id}` — delete account

3. **`backend/app/main.py`** — Registered the new `users` router at `/api/users`

4. **`backend/app/api/routers/academic.py`** — Added `POST /api/academic/import/activities.csv` endpoint (the activities table had no import path before)

5. **`src/api.ts`** — Added 9 new KPI/analytics API functions:
   - `getOverviewKpis()`, `getEnrollmentByYear()`, `getCgpaDistribution()`
   - `getStudentsNeedingAttention()`, `getAcademicKpis()`, `getCutoffByBatch()`
   - `getAnalyticsDistributions()`, `getAnalyticsCompare()`, `getAnalyticsTrend()`, `getMetaBatches()`
   - Plus user management: `listUsers()`, `createUser()`, `deleteUser()`, `resetUserPassword()`

6. **`src/components/admin/BatchProfileReport.tsx`** — **Replaced 4-line stub** with a full component:
   - Calls `/api/analytics/distributions` on load
   - Renders all 18 batch profile distribution charts (bar + doughnut)
   - Has batch filter dropdown populated from already-loaded student list

---

## Remaining tasks (Priority 2 — optional, not blocking)

These backend endpoints are wired and tested. The frontend still computes them in-memory
from the already-loaded `students[]` prop, which works fine for the current data size.
Connect them when you want server-side performance for large datasets.

### OverviewPage.tsx
Import and call:
```ts
import { getOverviewKpis, getEnrollmentByYear, getCgpaDistribution, getStudentsNeedingAttention } from '../../api';
```
Replace inline `useMemo` computations for KPI cards, enrollment chart, CGPA chart, and attention list with `useEffect` + API calls.

### AcademicPerformancePage.tsx
Import and call `getAcademicKpis(batch)` on batch change. Replace `cards` array inline computation.

### AnalyticsPage.tsx (Compare and Trend tabs)
Import and call `getAnalyticsCompare(batch1, batch2)` and `getAnalyticsTrend(metric)`.

---

## How to run the backend locally

```bash
cd d:\KIA\kia-student-analytics-dashboard\backend

# Install dependencies
pip install -r requirements.txt

# Set environment variables from .env
# On Windows PowerShell:
Get-Content .env | ForEach-Object {
  if ($_ -match '^([^#=]+)=(.*)$') {
    [System.Environment]::SetEnvironmentVariable($Matches[1].Trim(), $Matches[2].Trim(), 'Process')
  }
}

# OR use python-dotenv by running via the CLI:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run migrations (first time):
alembic upgrade head
```

## How to run the frontend locally

```bash
cd d:\KIA\kia-student-analytics-dashboard
npm install
npm run dev
# Frontend served at http://localhost:5173
# API requests proxied to http://localhost:8000 via vite.config.ts
```

## Docker (full stack)

```bash
cd d:\KIA\kia-student-analytics-dashboard
docker-compose up --build
# Frontend at http://localhost (port 80, via nginx)
# Backend at http://localhost/api/
```

---

## API Reference Summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | JWT | Current user profile |
| GET | `/api/students` | admin | Paginated student list |
| POST | `/api/students` | admin | Create student |
| GET | `/api/students/{id}` | admin | Student detail |
| PATCH | `/api/students/{id}` | admin | Update student |
| DELETE | `/api/students/{id}` | admin | Delete student |
| POST | `/api/import/students.csv` | admin | Bulk import students |
| POST | `/api/academic/import/{kind}.csv` | admin | Import academic records |
| GET | `/api/academic/export/{kind}.csv` | admin | Export academic records |
| POST | `/api/academic/import/activities.csv` | admin | Import activities (**NEW**) |
| GET | `/api/export/students.csv` | admin | Export student CSV |
| GET | `/api/kpis/overview` | admin | Overview KPI cards |
| GET | `/api/kpis/academic` | admin | Academic KPI cards |
| GET | `/api/charts/enrollment-by-year` | admin | Enrollment chart data |
| GET | `/api/charts/cgpa-distribution` | admin | CGPA distribution |
| GET | `/api/charts/cutoff-by-batch` | admin | Cutoff trend data |
| GET | `/api/analytics/distributions` | admin | 18 batch profile charts |
| GET | `/api/analytics/compare` | admin | Batch comparison |
| GET | `/api/analytics/trend` | admin | Multi-year trend |
| GET | `/api/students/needs-attention` | admin | At-risk students |
| GET | `/api/meta/batches` | admin | Available batch years |
| GET | `/api/users` | admin | List user accounts (**NEW**) |
| POST | `/api/users` | admin | Create user account (**NEW**) |
| PATCH | `/api/users/{id}/password` | admin | Reset password (**NEW**) |
| DELETE | `/api/users/{id}` | admin | Delete user (**NEW**) |
| GET | `/api/health` | — | Health check |
| GET | `/api/health/ready` | — | DB readiness check |
