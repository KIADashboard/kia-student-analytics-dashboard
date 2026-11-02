# KIA Student Analytics Dashboard

React/Vite frontend served by Nginx, a FastAPI backend, and PostgreSQL. Nginx serves the frontend and proxies `/api/*` requests to FastAPI. The backend owns authentication, student records, analytics, CSV import/export, and PostgreSQL access.

## Run the complete system with Docker

Requirements: Docker Desktop with Docker Compose v2, and the repository's `src/assets/master_students.xlsx` file if you want to seed the included student dataset.

From the repository root, create the local Compose environment file and replace the example credentials and signing key:

```powershell
Copy-Item .env.example .env
notepad .env
```

Replace the placeholder values for `POSTGRES_PASSWORD`, `ADMIN_PASSWORD`, and `JWT_SECRET` with unique secrets. The admin password must be at least 12 characters, and the JWT secret must be at least 32 characters. Use URL-safe characters in `POSTGRES_PASSWORD` because Compose uses it in `DATABASE_URL`. Never commit `.env` or deploy with the example placeholders.

Build and start PostgreSQL, the API, and the frontend:

```powershell
docker compose up --build -d
docker compose ps
```

On first run, import the included Excel dataset into PostgreSQL:

```powershell
docker compose run --rm seed
```

The seed command is safe to rerun: it inserts new records and updates matching `id_number` records without truncating the database. Student data persists in the `db_data` Docker volume.

The backend applies Alembic migrations before starting. Migrations are stored in `backend/migrations`; run `docker compose run --rm backend alembic upgrade head` to apply them explicitly. Existing tables are preserved when the initial migration is adopted; take a database backup before upgrading any production database.

Open <http://localhost>. The initial admin account is the `ADMIN_EMAIL` and `ADMIN_PASSWORD` configured in `.env`. To follow container logs:

```powershell
docker compose logs -f backend frontend db
```

Stop the application while keeping database data:

```powershell
docker compose down
```

## Student accounts

The Excel import creates student profiles, not login passwords. Provision a student login after the profile is loaded, using its database `students.id` and the email already recorded on that profile:

```powershell
docker compose run --rm backend python -m app.cli create-user --email student@example.edu --role student --student-id 1
```

The command securely prompts twice for a password (minimum 12 characters). Student accounts are linked to one profile and can only access that account's own profile. Admin accounts are initialized from the configured `ADMIN_EMAIL` and `ADMIN_PASSWORD` on backend startup.

## CSV import and export

An authenticated administrator can import CSV data from **Admin → Student Profiles → Import CSV**. Required headers are `batch_year`, `student_name`, and `id_number`; other headers may use the database's snake_case field names. The import also accepts the Excel-seed aliases `address_for_communication`, `agri_land_availability_acres`, `school_type_govt_private_aided`, and `area_type_rural_urban`.

The import validates the whole file before writing, reports row errors, and applies valid rows in one transaction. Existing students are updated by `id_number`. The endpoint is limited to 10 MB and 10,000 data rows. Student export is generated from the backend and accepts the active batch, gender, residence, and search filters.

## Academic records

The admission spreadsheet does not include college semester outcomes, attendance, arrears, or placement records. Those values remain unavailable until real records are provided; the dashboard does not fabricate them. Administrators can import each record type from CSV (UTF-8):

- `POST /api/academic/import/semester.csv`: `id_number,semester,academic_year,gpa,credits_earned,total_credits`
- `POST /api/academic/import/attendance.csv`: `id_number,semester,attendance_percentage`
- `POST /api/academic/import/arrears.csv`: `id_number,semester,course_code,course_name,cleared`
- `POST /api/academic/import/placements.csv`: `id_number,company,job_title,status,package_lpa,placement_date` (date format `YYYY-MM-DD`)

GPA values use a 0–10 scale, attendance is 0–100, and semester numbers range from 1 to 20. All imports validate the entire file before committing and update matching student/term/course or student/company/role records. Matching CSV exports are available at `/api/academic/export/{semester,attendance,arrears,placements}.csv`. Academic records are available to administrators and to the student account linked to that profile. Existing analytics based on admission cut-off are explicitly proxies, not college CGPA.

## API and health checks

- API docs: <http://localhost:8000/docs>
- Liveness: <http://localhost:8000/api/health>
- Database readiness: <http://localhost:8000/api/health/ready>
- Login: `POST /api/auth/login`
- Current account/profile: `GET /api/auth/me`

Admin student, analytics, import, and export endpoints require a bearer token. The frontend obtains and sends this token after backend login.

Administrators can create student profiles with `POST /api/students`, update them with `PATCH /api/students/{id}`, and delete them with `DELETE /api/students/{id}`. CSV import/export remains available for bulk profile management. A student profile with a linked login cannot be deleted until that login is removed.

## Development without Docker

Docker Compose is the supported end-to-end setup. For frontend-only development, run `npm ci` and `npm run dev`; Vite proxies `/api` to `http://localhost:8000`. For backend development, configure the environment variables described in `.env.example`, install `backend/requirements.txt`, then run `alembic upgrade head` and `uvicorn app.main:app --reload` from the `backend` directory. To create admin/student accounts, use `python -m app.cli create-user ...` after migrations have been applied.

## Backend tests

Install `backend/requirements-dev.txt` and run `pytest backend/tests` from the repository root. Tests use an isolated SQLite database; production and end-to-end deployments use PostgreSQL.

## Data scope

The supplied spreadsheet contains student admission/profile information. It does not contain semester grades, attendance, arrears, or placement records. The application must not treat those fields as real student data; CGPA shown from admission cut-off is only a proxy until actual academic records are imported.
