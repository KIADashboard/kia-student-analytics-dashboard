# Running KIA Student Analytics Dashboard locally

Stack: **React/Vite frontend** (served by Nginx) + **FastAPI backend** + **PostgreSQL database**.

There are two ways to run it:

- **Option A - Docker (recommended).** Runs all three servers in containers. Use this if you just want the website working.
- **Option B - Local dev servers.** Runs the DB in Docker and runs the backend and frontend directly on your machine, with hot reload.

---

## Prerequisites

| Tool | Needed for | Notes |
|---|---|---|
| Git | cloning | |
| Docker Desktop (Compose v2) | Option A, and the DB in Option B | Must be **running** (whale icon steady) before any `docker` command |
| Node.js 20+ and npm | Option B only | |
| Python **3.11** | Option B only | The pinned packages (pandas 2.2.1, psycopg2 2.9.9) do not install on Python 3.13/3.14 |

---

## Step 1 - Clone

```powershell
git clone <repo-url>
cd kia-student-analytics-dashboard
git checkout feature-backend      # only if this work is not merged into main yet
```

## Step 2 - Create and fill in `.env`

`.env` is git-ignored, so **it does not come with the clone - you must create it**:

```powershell
Copy-Item .env.example .env       # macOS/Linux: cp .env.example .env
notepad .env
```

**The placeholder values in `.env.example` will crash the backend.** Replace them so that:

| Variable | Rule |
|---|---|
| `POSTGRES_PASSWORD` | at least **16** characters; letters and digits only (it goes inside a URL) |
| `ADMIN_PASSWORD` | at least **12** characters (this is your website login password) |
| `JWT_SECRET` | at least **32** characters |
| `ADMIN_EMAIL` | the website login email, e.g. `admin@kia.edu` |

Rules for the file:

- **One `KEY=value` per line.** If a variable ends up on the same line as a `# comment`, it is silently ignored. Compose then fails with `Set POSTGRES_USER in .env`.
- No value may contain the word `replace`.
- `GEMINI_API_KEY` and `APP_URL` are not used and can be left as they are.

Generate random secrets (PowerShell, run once per secret):

```powershell
-join ((48..57)+(65..90)+(97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

The Docker section of `.env` should look like this (use your own values):

```env
POSTGRES_USER=kia_user
POSTGRES_PASSWORD=Xq7Lm2Rt9Vb4Nc8Kd3Fg
POSTGRES_DB=kia_dashboard
ADMIN_EMAIL=admin@kia.edu
ADMIN_PASSWORD=KiaAdmin#2026
JWT_SECRET=8fK2mQ9xLw4Rt7Vb3Nc6Hd1Js5Pg0Ya2Ze
JWT_EXPIRE_MINUTES=480
```

> **Set `POSTGRES_PASSWORD` correctly before the first `docker compose up`.** Postgres stores the password the first time it creates its data volume. If you change it in `.env` later, the backend fails with `password authentication failed`. See [Troubleshooting](#troubleshooting) for the fix.

---

## Option A - Run everything in Docker (recommended)

Run all commands from the repository root (the folder containing `docker-compose.yml`).

### First time

```powershell
# 1. Check the .env is valid (prints nothing if OK)
docker compose config -q

# 2. Build the images and start db + backend + frontend in the background
docker compose up --build -d

# 3. Check status: db and backend must show "(healthy)", frontend "Up"
docker compose ps

# 4. Load the 826 students from src/assets/master_students.xlsx into the database
docker compose run --rm seed
```

A successful seed ends with `Seed complete: 826 inserted, 0 updated.`

### Open the website

| What | URL |
|---|---|
| **Website** | **http://localhost** |
| API docs (Swagger) | http://localhost:8000/docs |
| Health check | http://localhost:8000/api/health/ready (should return `{"status":"ready"}`) |
| Postgres (for DB tools like pgAdmin/DBeaver) | host `localhost`, port `5433`, values from `.env` |

Log in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env`.

### Server commands (everyday use)

```powershell
docker compose up -d                 # START all servers (db, backend, frontend)
docker compose ps                    # STATUS
docker compose down                  # STOP all servers (database data is kept)
docker compose restart backend       # RESTART one server (db | backend | frontend)
docker compose up --build -d         # REBUILD + START after pulling or changing code
docker compose logs -f backend       # LOGS for one server (Ctrl+C to exit)
docker compose logs -f               # LOGS for all servers
```

You do **not** need to re-run the seed each time; the data persists in the `db_data` Docker volume. Run `docker compose run --rm seed` again only when `master_students.xlsx` changes. It updates existing students by `id_number`, so it overwrites edits made in the website for those students.

To wipe the database completely and start fresh: `docker compose down -v`, then repeat **First time** steps 2-4.

---

## Option B - Run frontend and backend locally (development)

You need **three terminals**, all starting from the repository root. Complete Step 2 (`.env`) first.

### Terminal 1 - Database (PostgreSQL in Docker)

```powershell
docker compose up -d db
docker compose ps db                 # wait for "(healthy)"
```

PostgreSQL is now on `localhost:5433`.

If the Docker backend/frontend containers from Option A are running, stop them first so ports 8000/80 are free: `docker compose stop backend frontend`.

### Terminal 2 - Backend (FastAPI, http://localhost:8000)

One-time setup:

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Each time you open a new terminal for the backend:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
# Same user/password/db as .env, but host is localhost and port is 5433
$env:DATABASE_URL = "postgresql://kia_user:<POSTGRES_PASSWORD>@localhost:5433/kia_dashboard"
```

One time only (creates tables and loads the students; skip if you already did this in Option A, since it is the same database):

```powershell
alembic upgrade head
python seed/seed_students.py
```

**Start the backend server:**

```powershell
uvicorn app.main:app --reload --port 8000
```

The backend reads `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `JWT_SECRET` from the root `.env` automatically. `DATABASE_URL` is not in `.env`, so it must be set as shown above.

macOS/Linux: use `python3.11 -m venv .venv`, `source .venv/bin/activate`, and `export DATABASE_URL=...`.

### Terminal 3 - Frontend (Vite, http://localhost:3000)

One-time setup (from the repository root):

```powershell
npm ci
```

**Start the frontend server:**

```powershell
npm run dev
```

Open **http://localhost:3000**. Vite forwards `/api/*` to the backend on port 8000, so Terminal 2 must be running.

Stop any server with **Ctrl+C**. Stop the DB with `docker compose stop db`.

---

## Creating student logins (optional)

The seed creates student *profiles*, not logins. To give a student a login, use the profile's database id and the email stored on that profile:

```powershell
# Docker
docker compose run --rm backend python -m app.cli create-user --email student@example.edu --role student --student-id 1

# Option B (in backend/, venv active, DATABASE_URL set)
python -m app.cli create-user --email student@example.edu --role student --student-id 1
```

You'll be prompted for a password (minimum 12 characters).

---

## Troubleshooting

First look at the logs: `docker compose logs backend --tail 40`.

| Symptom | Cause and fix |
|---|---|
| `error during connect` / `cannot find the file specified ... docker_engine` | Docker Desktop is not running. Start it and wait. |
| `Set POSTGRES_USER in .env` (or any `Set ... in .env`) | `.env` is missing, a value is empty, or a `KEY=value` line has been merged into a comment line. Put every variable on its own line. |
| `dependency failed to start: container kia_backend is unhealthy` | The backend crashed. The real error is in `docker compose logs backend`; see the rows below. |
| Backend log: `JWT_SECRET must contain at least 32 characters` | Lengthen `JWT_SECRET` in `.env`, then `docker compose up -d`. |
| Backend log: `ADMIN_PASSWORD must be unique and contain at least 12 characters` | Lengthen `ADMIN_PASSWORD`, then `docker compose up -d`. |
| Backend log: `POSTGRES_PASSWORD must be a unique secret of at least 16 characters` | Lengthen `POSTGRES_PASSWORD`, then apply the next row's fix (the DB still has the old password). |
| Backend log: `password authentication failed for user "kia_user"` | The DB volume was created with a different password. **Keep the data:** run the command below. **Or wipe everything:** `docker compose down -v`, `docker compose up -d`, `docker compose run --rm seed`. |
| `Conflict. The container name "/..._kia_postgres" is already in use` | A previous run was interrupted. Run `docker compose down` (keeps data), then `docker compose up -d`. |
| Website loads but login fails | Use exactly the `ADMIN_EMAIL`/`ADMIN_PASSWORD` from `.env`. The admin account is created when the backend first starts. If you change `ADMIN_PASSWORD` afterwards, the old password still applies. |
| Login works but the dashboard is empty | The seed has not run yet: `docker compose run --rm seed`. |
| `Bind for 0.0.0.0:80 failed: port is already allocated` | Another program (IIS, Skype, another web server) is using port 80. Stop it, or change `"80:80"` to `"8080:80"` in `docker-compose.yml` and use http://localhost:8080. |
| Option B: `pip install` fails building pandas or psycopg2 | Wrong Python version. Use Python 3.11. |
| Option B: `DATABASE_URL must be configured` | Set `$env:DATABASE_URL` in the same terminal before `alembic`, `seed` or `uvicorn`. |
| Option B: `running scripts is disabled on this system` | Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once. |
| Option B: frontend shows network / 502 errors | The backend (Terminal 2) is not running on port 8000. |

Fix for the database password mismatch while keeping your data. This updates the DB to the password in `.env` (PowerShell, run from the repo root):

```powershell
$pw = ((Get-Content .env | Select-String '^POSTGRES_PASSWORD=') -replace '^POSTGRES_PASSWORD=','').Trim('"')
docker compose up -d db
docker compose exec db psql -U kia_user -d kia_dashboard -c "ALTER USER kia_user WITH PASSWORD '$pw';"
docker compose up -d
```

For API details, CSV import/export and academic-record endpoints, see [README.md](README.md).
