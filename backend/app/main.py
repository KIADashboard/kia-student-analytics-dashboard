"""
main.py – FastAPI application entry point.
"""
# Load .env file automatically for local development.
# In Docker/production, environment variables come from docker-compose / the host.
from dotenv import load_dotenv
load_dotenv()

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from .models.database import SessionLocal, engine
from .api.routers import academic, auth, students, kpis, export, imports, users
from .services.auth_service import ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY


@asynccontextmanager
async def lifespan(_: FastAPI):
    if len(SECRET_KEY) < 32 or "replace" in SECRET_KEY.lower():
        raise RuntimeError("JWT_SECRET must contain at least 32 characters.")
    if ACCESS_TOKEN_EXPIRE_MINUTES <= 0:
        raise RuntimeError("JWT_EXPIRE_MINUTES must be greater than zero.")
    if engine.dialect.name == "postgresql":
        database_password = engine.url.password or ""
        if len(database_password) < 16 or "replace" in database_password.lower():
            raise RuntimeError("POSTGRES_PASSWORD must be a unique secret of at least 16 characters.")
    with SessionLocal() as db:
        auth.initialize_admin(db)
    yield


app = FastAPI(
    title="KIA Student Analytics API",
    description="Backend API for the KIA Student Analytics Dashboard",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS – allow the Vite dev server and the Docker nginx container
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   # Vite dev server (npm run dev --port=3000)
        "http://localhost:5173",   # Vite dev server (default port)
        "http://localhost",        # Nginx in Docker (port 80)
        "http://frontend",         # Internal Docker hostname
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router,     prefix="/api")
app.include_router(kpis.router,     prefix="/api")
app.include_router(students.router, prefix="/api")
app.include_router(export.router,   prefix="/api")
app.include_router(imports.router,   prefix="/api")
app.include_router(academic.router,  prefix="/api")
app.include_router(users.router,     prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/health/ready")
def readiness():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return {"status": "ready"}
