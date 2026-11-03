# Running KIA Student Analytics Dashboard locally

Stack: **React/Vite frontend** + **FastAPI backend** + **PostgreSQL database**.

There are two ways to run it. **Option A (Docker) is the easiest** and is what you should use if you just want the site working.

---

## Prerequisites

| Tool | Needed for | Notes |
|---|---|---|
| Git | cloning | |
| Docker Desktop (Compose v2) | Option A, and the DB in Option B | Must be *running* before any `docker` command |
| Node.js 20+ and npm | Option B (frontend) | |
| Python **3.11** | Option B (backend) | Pinned deps (pandas 2.2.1 etc.) do not install on 3.13/3.14 |

---

## Step 0 - Clone and create the `.env` file (both options)

```powershell
git clone <repo-url>
cd kia-student-analytics-dashboard
git checkout feature-backend      # only if the work is not yet merged into main
Copy-Item .env.example .env       # macOS/Linux: cp .env.example .env
```

`.env` is git-ignored, so **it does not come with the clone - you must create it**.

> **IMPORTANT:** the placeholder values in `.env.example` (`password`, `your_password`) are rejected by the backend on startup, and it will crash. Open `.env` and set:
>
> | Variable | Rule |
> |---|---|
> | `POSTGRES_PASSWORD` | at least **16** characters, URL-safe (letters/digits only is safest) |
> | `ADMIN_PASSWORD` | at least **12** characters |
> | `JWT_SECRET` | at least **32** characters |
> | `ADMIN_EMAIL` | the login email for the admin, e.g. `admin@kia.edu` |
>
> None of the values may contain the word `replace`. `GEMINI_API_KEY` and `APP_URL` are not used by the backend and can be left alone.

Quick way to generate good secrets (PowerShell):

```powershell
-join ((48..57)+(97..102) | Get-Random -Count 32 | ForEach-Object {[char]$_})   # run once per secret
```

Example `.env`:

```env
POSTGRES_USER=kia_user
POSTGRES_PASSWORD=a1b2c3d4e5f6a7b8c9d0e1f2
POSTGRES_DB=kia_dashboard
ADMIN_EMAIL=admin@kia.edu
ADMIN_PASSWORD=MyAdminPass#2026
JWT_SECRET=0f3a9c1d7e5b42a68c0d9e1f3a5b7c9d2e4f6a8b
JWT_EXPIRE_MINUTES=480
```

---

## Option A - Everything in Docker (recommended)

Starts the database, backend and frontend with a few commands. No Node or Python install required.

```powershell
# 1. Build and start db + backend + frontend
docker compose up --build -d

# 2. Check all three are "healthy"/running (backend takes ~15s)
docker compose ps

# 3. ONE TIME ONLY: load the student data from src/assets/master_students.xlsx into the DB
docker compose run --rm seed
```

Open **http://localhost** and log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env`.

| What | URL |
|---|---|
| Website | http://localhost |
| API docs (Swagger) | http://localhost:8000/docs |
| Health check | http://localhost:8000/api/health/ready |
| Postgres (host access) | `localhost:5433` |

Day-to-day commands:

```powershell
docker compose logs -f backend frontend db     # view logs
docker compose down                            # stop (data is kept in the db_data volume)
docker compose up -d                           # start again (no rebuild needed)
docker compose up --build -d                   # rebuild after code changes
docker compose down -v                         # stop AND wipe the database (then re-run the seed)
```

Seeding is safe to re-run (it upserts by `id_number`).

---

## Option B - Run frontend and backend directly (for development)

You still need PostgreSQL. The simplest way is to run **only the DB container** and run the other two servers on your machine, so you need **three terminals**.

### Terminal 1 - Database (Docker, DB service only)

```powershell
docker compose up -d db
docker compose ps          # wait until db is "healthy"
```

The DB is now at `localhost:5433` (host port 5433 -> container 5432).

### Terminal 2 - Backend (FastAPI on http://localhost:8000)

```powershell
cd backend
py -3.11 -m venv .venv                   # use a fresh venv; do not reuse a committed/other-machine one
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Environment (must match the values in your .env; note the host is localhost and port is 5433)
$env:DATABASE_URL = "postgresql://kia_user:<POSTGRES_PASSWORD>@localhost:5433/kia_dashboard"
$env:ADMIN_EMAIL = "admin@kia.edu"
$env:ADMIN_PASSWORD = "<ADMIN_PASSWORD>"
$env:JWT_SECRET = "<JWT_SECRET>"

alembic upgrade head                     # create the tables
python seed/seed_students.py             # ONE TIME: load master_students.xlsx
uvicorn app.main:app --reload --port 8000
```

The backend creates the admin account automatically on startup from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
(The root `.env` is also auto-loaded by the backend, so the three `ADMIN_*`/`JWT_SECRET` lines are optional if `.env` is filled in, but `DATABASE_URL` is not in `.env` and must always be set.)

macOS/Linux equivalents: `python3.11 -m venv .venv && source .venv/bin/activate`, and `export VAR=value` instead of `$env:VAR = "value"`.

### Terminal 3 - Frontend (Vite on http://localhost:3000)

From the repository root:

```powershell
npm ci
npm run dev
```

Open **http://localhost:3000**. Vite automatically proxies `/api/*` to `http://localhost:8000`, so the backend must be running.

---

## Creating student logins (optional)

The Excel import creates student *profiles*, not logins. The admin account works out of the box; for a student login use the profile's database id and the email stored on that profile:

```powershell
# Docker
docker compose run --rm backend python -m app.cli create-user --email student@example.edu --role student --student-id 1

# Option B (inside backend/ with venv active and DATABASE_URL set)
python -m app.cli create-user --email student@example.edu --role student --student-id 1
```

You are prompted for a password (minimum 12 characters).

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `error during connect` / `docker daemon not running` | Start Docker Desktop and wait for it to finish starting. |
| `Set POSTGRES_PASSWORD in .env` | `.env` is missing or a variable is empty. Redo Step 0. |
| Backend container keeps restarting; logs say `must contain at least 32 characters` / `unique secret of at least 16` / `at least 12 characters` | Secrets in `.env` are too short or contain `replace`. Fix them, then `docker compose up -d --force-recreate backend`. |
| Changed `POSTGRES_PASSWORD` but DB still rejects the new one | The old password is stored in the `db_data` volume. Run `docker compose down -v` and start again (this wipes the DB). |
| Port 80 / 8000 / 3000 already in use | Stop the program using it, or change the left-hand port in `docker-compose.yml`. |
| Login works but dashboards are empty | The seed was not run. Run `docker compose run --rm seed` (Option B: `python seed/seed_students.py`). |
| Option B: `pip install` fails building pandas / psycopg2 | You are on Python 3.13/3.14. Use Python 3.11. |
| Option B: `DATABASE_URL must be configured` | Set `$env:DATABASE_URL` in the same terminal before running `alembic`, `seed`, or `uvicorn`. |
| Option B: frontend shows network / 502 errors | Backend (Terminal 2) is not running on port 8000. |
| `Cannot be loaded because running scripts is disabled` when activating the venv | Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once. |

For API details, CSV import/export and academic-record endpoints, see [README.md](README.md).
