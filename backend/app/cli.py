import argparse
from getpass import getpass

from sqlalchemy import select

from .models.database import SessionLocal
from .models.schema import Student, User
from .services.auth_service import hash_password


def create_user(email: str, role: str, student_id: int | None) -> None:
    password = getpass("New account password: ")
    confirmation = getpass("Confirm password: ")
    if len(password) < 12:
        raise SystemExit("Password must contain at least 12 characters.")
    if password != confirmation:
        raise SystemExit("Passwords do not match.")

    normalized_email = email.strip().lower()
    with SessionLocal() as db:
        if db.execute(
            select(User).where(User.email == normalized_email)
        ).scalar_one_or_none():
            raise SystemExit("An account with that email already exists.")
        if role == "student":
            student = db.get(Student, student_id)
            if not student or not student.email:
                raise SystemExit("Student record does not exist or has no email.")
            if student.email.strip().lower() != normalized_email:
                raise SystemExit("Account email must match the student's email.")
            if db.execute(
                select(User).where(User.student_id == student_id)
            ).scalar_one_or_none():
                raise SystemExit("This student already has a login account.")
        db.add(User(
            email=normalized_email,
            password_hash=hash_password(password),
            role=role,
            student_id=student_id,
        ))
        db.commit()
    print(f"Created {role} account for {normalized_email}.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Manage dashboard login accounts.")
    subparsers = parser.add_subparsers(dest="command", required=True)
    user_parser = subparsers.add_parser("create-user")
    user_parser.add_argument("--email", required=True)
    user_parser.add_argument("--role", choices=("admin", "student"), required=True)
    user_parser.add_argument("--student-id", type=int)
    args = parser.parse_args()
    if args.role == "student" and args.student_id is None:
        parser.error("--student-id is required for student accounts.")
    if args.role == "admin" and args.student_id is not None:
        parser.error("--student-id is only valid for student accounts.")
    create_user(args.email, args.role, args.student_id)


if __name__ == "__main__":
    main()
