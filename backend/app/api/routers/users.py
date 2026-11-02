"""
users.py – /api/users endpoints for admin user account management.

Allows admins to create student login accounts, list users,
reset passwords, and delete user accounts.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ...models.database import get_db
from ...models.schema import Student, User
from ...services.auth_service import hash_password
from .auth import require_admin

router = APIRouter(prefix="/users", tags=["User Management"], dependencies=[Depends(require_admin)])


class UserCreateRequest(BaseModel):
    email: str = Field(min_length=3, max_length=120)
    password: str = Field(min_length=8, max_length=128)
    role: str = Field(default="student")
    student_id: int | None = None


class UserPasswordResetRequest(BaseModel):
    password: str = Field(min_length=8, max_length=128)


def _user_response(user: User) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "student_id": user.student_id,
    }


@router.get("")
def list_users(db: Session = Depends(get_db)):
    """List all user accounts. Admin only."""
    users = db.execute(select(User).order_by(User.id)).scalars().all()
    return {"users": [_user_response(u) for u in users]}


@router.post("", status_code=status.HTTP_201_CREATED)
def create_user(body: UserCreateRequest, db: Session = Depends(get_db)):
    """
    Create a new user account.
    - To create a student account, set role='student' and provide student_id.
    - To create an admin account, set role='admin' and leave student_id null.
    """
    if body.role not in ("admin", "student"):
        raise HTTPException(status_code=422, detail="Role must be 'admin' or 'student'.")

    if body.role == "student" and body.student_id is None:
        raise HTTPException(status_code=422, detail="student_id is required when creating a student account.")

    if body.student_id is not None:
        student = db.get(Student, body.student_id)
        if student is None:
            raise HTTPException(status_code=404, detail="Student not found.")
        # Check if student already has an account
        existing = db.execute(
            select(User).where(User.student_id == body.student_id)
        ).scalar_one_or_none()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This student already has a login account.",
            )

    user = User(
        email=body.email.strip().lower(),
        password_hash=hash_password(body.password),
        role=body.role,
        student_id=body.student_id,
    )
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with that email address already exists.",
        )
    return _user_response(user)


@router.patch("/{user_id}/password", status_code=status.HTTP_200_OK)
def reset_password(user_id: int, body: UserPasswordResetRequest, db: Session = Depends(get_db)):
    """Reset the password for a user account. Admin only."""
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    user.password_hash = hash_password(body.password)
    db.commit()
    return {"message": "Password updated successfully."}


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    Delete a user account. Admin only.
    Cannot delete your own account (handled by the admin guard).
    """
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    db.delete(user)
    db.commit()
