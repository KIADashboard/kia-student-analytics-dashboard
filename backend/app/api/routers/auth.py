"""
auth.py – /api/auth endpoints.
"""
import os
from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ...models.database import get_db
from ...models.schema import User
from ...services.auth_service import create_access_token, decode_token, hash_password, verify_password
from ...services.kpi_service import get_student_detail

router = APIRouter(prefix="/auth", tags=["Auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Authentication required.")
    payload = decode_token(authorization[7:].strip())
    if not payload or not payload.get("sub"):
        raise HTTPException(status_code=401, detail="Invalid or expired token.")
    try:
        user_id = int(payload["sub"])
    except (TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid authentication token.") from None
    user = db.get(User, user_id)
    if not user or user.role != payload.get("role"):
        raise HTTPException(status_code=401, detail="Invalid authentication token.")
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Administrator access required.")
    return user


def initialize_admin(db: Session) -> None:
    email = os.getenv("ADMIN_EMAIL", "").strip().lower()
    password = os.getenv("ADMIN_PASSWORD", "")
    if not email or not password:
        raise RuntimeError("ADMIN_EMAIL and ADMIN_PASSWORD must be configured.")
    if len(password) < 12 or "replace" in password.lower():
        raise RuntimeError("ADMIN_PASSWORD must be unique and contain at least 12 characters.")
    admin = db.execute(
        select(User).where(func.lower(User.email) == email)
    ).scalar_one_or_none()
    if admin is None:
        db.add(User(email=email, password_hash=hash_password(password), role="admin"))
        db.commit()
    elif admin.role != "admin":
        raise RuntimeError("ADMIN_EMAIL is already assigned to a non-administrator account.")


@router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.execute(
        select(User).where(func.lower(User.email) == body.email.strip().lower())
    ).scalar_one_or_none()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    token = create_access_token(user.id, user.role)
    return LoginResponse(access_token=token, role=user.role, user_id=user.id)


@router.get("/me")
def current_user(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = get_student_detail(db, user.student_id) if user.student_id else None
    if user.role == "student" and profile is None:
        raise HTTPException(status_code=409, detail="Student account is not linked to a profile.")
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "profile": profile,
    }
