import os
import shutil
import sys
import tempfile
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

TEST_DB_DIR = Path(tempfile.mkdtemp(prefix="kia-backend-tests-"))
os.environ["DATABASE_URL"] = f"sqlite:///{(TEST_DB_DIR / 'test.db').as_posix()}"
os.environ["ADMIN_EMAIL"] = "admin@test.kia"
os.environ["ADMIN_PASSWORD"] = "test-admin-password-123"
os.environ["JWT_SECRET"] = "test-only-jwt-secret-with-more-than-thirty-two-characters"

from app.main import app
from app.models.database import Base, SessionLocal, engine


@pytest.fixture(scope="session", autouse=True)
def remove_test_database():
    yield
    engine.dispose()
    shutil.rmtree(TEST_DB_DIR, ignore_errors=True)


@pytest.fixture
def client():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def admin_headers(client):
    response = client.post(
        "/api/auth/login",
        json={"email": os.environ["ADMIN_EMAIL"], "password": os.environ["ADMIN_PASSWORD"]},
    )
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}
