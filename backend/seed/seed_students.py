"""
seed_students.py – One-time script to import master_students.xlsx into PostgreSQL.

Usage (from project root):
  docker compose run --rm backend python -m seed.seed_students

Or locally (set DATABASE_URL env var first):
  python backend/seed/seed_students.py
"""
from __future__ import annotations

import os
import sys
import re
import datetime
from pathlib import Path

import pandas as pd
from sqlalchemy import create_engine, delete, select
from sqlalchemy.orm import sessionmaker

# ── Path setup ───────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from app.models.schema import Student, Activity

# ── Database connection ───────────────────────────────────────────────────────
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://kia_user:kia_pass@localhost:5432/kia_dashboard",
)
if not os.environ.get("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL must be configured before importing student data.")
DATABASE_URL = os.environ["DATABASE_URL"]
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
Session = sessionmaker(bind=engine)

# ── Sentinel value used in the Excel for "not collected" ─────────────────────
NULL_VALS = {"-1", "not_collected", "na", "nan", "none", "", "not collected"}


def is_null(val) -> bool:
    if val is None:
        return True
    try:
        if pd.isna(val):
            return True
    except (TypeError, ValueError):
        pass
    s = str(val).strip().lower()
    return s in NULL_VALS or s == "n/a"


def clean_str(val) -> str | None:
    if is_null(val):
        return None
    return str(val).strip() or None


def clean_float(val) -> float | None:
    if is_null(val):
        return None
    try:
        f = float(val)
        return None if f == -1 else f
    except (ValueError, TypeError):
        return None


def clean_int(val) -> int | None:
    if is_null(val):
        return None
    try:
        i = int(float(val))
        return None if i == -1 else i
    except (ValueError, TypeError):
        return None


def parse_bool(val) -> bool | None:
    if is_null(val):
        return None
    return str(val).strip().upper() in {"YES", "TRUE", "1", "Y"}


def parse_date(val) -> datetime.date | None:
    if is_null(val):
        return None
    if isinstance(val, datetime.datetime):
        return val.date()
    if isinstance(val, datetime.date):
        return val
    try:
        return pd.to_datetime(str(val)).date()
    except Exception:
        return None


def parse_year_str(val) -> str | None:
    """Converts datetime/date/string to 'YYYY-MM' string."""
    if is_null(val):
        return None
    if isinstance(val, (datetime.datetime, datetime.date)):
        return val.strftime("%Y-%m")
    try:
        dt = pd.to_datetime(str(val))
        return dt.strftime("%Y-%m")
    except Exception:
        return clean_str(val)


def normalize_residence(val) -> str | None:
    if is_null(val):
        return None
    v = str(val).strip().lower()
    if "host" in v:
        return "Hosteller"
    if "day" in v or "scholar" in v:
        return "Dayscholar"
    return clean_str(val)


def normalize_school_type(val) -> str | None:
    if is_null(val):
        return None
    v = str(val).strip().lower()
    if "govt" in v and "aid" in v:
        return "Govt-Aided"
    if "govt" in v or "government" in v:
        return "Government"
    if "private" in v or "matric" in v:
        return "Private"
    if "cbse" in v or "icse" in v:
        return "CBSE/ICSE"
    return clean_str(val)


def income_category(income: int | None) -> str:
    if income is None or income <= 0:
        return "Unknown"
    if income < 100_000:
        return "< ₹1 Lakh"
    if income < 300_000:
        return "₹1L – ₹3L"
    if income < 600_000:
        return "₹3L – ₹6L"
    if income < 1_000_000:
        return "₹6L – ₹10L"
    return "> ₹10 Lakh"


def agri_background(acres) -> str:
    if acres is None or (isinstance(acres, float) and acres <= 0):
        return "Unknown"
    return "Yes"


# ── Main import logic ─────────────────────────────────────────────────────────

EXCEL_PATH = ROOT / "src" / "assets" / "master_students.xlsx"


def seed(excel_path: Path = EXCEL_PATH):
    print(f"📂  Reading: {excel_path}")
    df = pd.read_excel(excel_path)
    print(f"✅  Loaded {len(df)} rows, {len(df.columns)} columns")

    with Session() as session:
        students_inserted = 0
        students_updated = 0
        activities_inserted = 0
        students_processed = 0

        for idx, row in df.iterrows():
            income = clean_int(row.get("annual_income"))
            agri_acres = clean_float(row.get("agri_land_availability_acres"))

            student = Student(
                batch_year             = int(row["batch_year"]),
                student_name           = clean_str(row["student_name"]) or "Unknown",
                id_number              = clean_str(row["id_number"]) or f"UNKNOWN_{idx}",
                reg_no                 = clean_str(row.get("reg_no")),
                dob                    = parse_date(row.get("dob")),
                gender                 = clean_str(row.get("gender")),
                blood_group            = clean_str(row.get("blood_group")),
                nationality            = clean_str(row.get("nationality")),
                religion               = clean_str(row.get("religion")),
                community              = clean_str(row.get("community")),
                caste                  = clean_str(row.get("caste")),
                mother_tongue          = clean_str(row.get("mother_tongue")),
                hosteller_dayscholar   = normalize_residence(row.get("hosteller_dayscholar")),
                admission_type         = clean_str(row.get("admission_type")),
                first_graduate         = parse_bool(row.get("first_graduate")),
                address_comm           = clean_str(row.get("address_for_communication")),
                permanent_address      = clean_str(row.get("permanent_address")),
                district               = clean_str(row.get("district")),
                state                  = clean_str(row.get("state")),
                pin_code               = clean_str(row.get("pin_code")),
                mobile_number          = clean_str(row.get("mobile_number")),
                whatsapp_number        = clean_str(row.get("whatsapp_number")),
                email                  = clean_str(row.get("email")),
                bank_name              = clean_str(row.get("bank_name")),
                bank_account_no        = clean_str(row.get("bank_account_no")),
                branch_name            = clean_str(row.get("branch_name")),
                ifsc_code              = clean_str(row.get("ifsc_code")),
                aadhar_no              = clean_str(row.get("aadhar_no")),
                x_board                = clean_str(row.get("x_board")),
                x_school_name          = clean_str(row.get("x_school_name")),
                x_month_year_passing   = parse_year_str(row.get("x_month_year_passing")),
                x_medium               = clean_str(row.get("x_medium")),
                x_mark_scored          = clean_float(row.get("x_mark_scored")),
                xii_board              = clean_str(row.get("xii_board")),
                xii_school_name        = clean_str(row.get("xii_school_name")),
                xii_month_year_passing = parse_year_str(row.get("xii_month_year_passing")),
                xii_medium             = clean_str(row.get("xii_medium")),
                xii_mark_scored        = clean_float(row.get("xii_mark_scored")),
                father_guardian_name   = clean_str(row.get("father_guardian_name")),
                father_qualification   = clean_str(row.get("father_qualification")),
                father_occupation      = clean_str(row.get("father_occupation")),
                father_mobile          = clean_str(row.get("father_mobile")),
                mother_name            = clean_str(row.get("mother_name")),
                mother_qualification   = clean_str(row.get("mother_qualification")),
                mother_occupation      = clean_str(row.get("mother_occupation")),
                mother_mobile          = clean_str(row.get("mother_mobile")),
                annual_income          = income,
                parents_occupation     = clean_str(row.get("parents_occupation")),
                admission_quota        = clean_str(row.get("admission_quota")),
                cutoff_xii_percentage  = clean_float(row.get("cutoff_xii_percentage")),
                marks_language         = clean_float(row.get("marks_language")),
                marks_english          = clean_float(row.get("marks_english")),
                marks_maths            = clean_float(row.get("marks_maths")),
                marks_physics          = clean_float(row.get("marks_physics")),
                marks_chemistry        = clean_float(row.get("marks_chemistry")),
                marks_biology          = clean_float(row.get("marks_biology")),
                marks_botany           = clean_float(row.get("marks_botany")),
                marks_zoology          = clean_float(row.get("marks_zoology")),
                marks_computer_science = clean_float(row.get("marks_computer_science")),
                marks_total            = clean_float(row.get("marks_total")),
                emis_no                = clean_str(row.get("emis_no")),
                languages_known        = clean_str(row.get("languages_known")),
                board_of_study         = clean_str(row.get("board_of_study")),
                medium_of_study        = clean_str(row.get("medium_of_study")),
                school_type            = normalize_school_type(row.get("school_type_govt_private_aided")),
                family_background      = clean_str(row.get("family_background")),
                agri_land_availability = agri_acres,
                crops_planted          = clean_str(row.get("crops_planted")),
                agri_land_locality     = clean_str(row.get("agri_land_locality")),
                area_type              = clean_str(row.get("area_type_rural_urban")),
                studied_tamil_in_xii   = parse_bool(row.get("studied_tamil_in_xii")),
                income_category        = income_category(income),
                agri_background        = agri_background(agri_acres),
            )
            existing = session.execute(
                select(Student).where(Student.id_number == student.id_number)
            ).scalar_one_or_none()
            if existing:
                for column in Student.__table__.columns:
                    if column.name != "id":
                        setattr(existing, column.name, getattr(student, column.name))
                student = existing
                students_updated += 1
                session.execute(delete(Activity).where(Activity.student_id == student.id))
            else:
                session.add(student)
                students_inserted += 1
            session.flush()   # get student.id before inserting activities

            # Activity (if present)
            act_cat  = clean_str(row.get("activity_category"))
            act_name = clean_str(row.get("activity_name"))
            if act_cat or act_name:
                activity = Activity(
                    student_id              = student.id,
                    activity_category       = act_cat,
                    activity_name           = act_name,
                    achievement_level       = clean_str(row.get("achievement_level")),
                    achievement_type        = clean_str(row.get("achievement_type")),
                    achievement_description = clean_str(row.get("achievement_description")),
                )
                session.add(activity)
                activities_inserted += 1

            students_processed += 1

            if students_processed % 100 == 0:
                session.commit()
                print(f"   ↳ {students_processed} rows committed…")

        session.commit()

    print(f"\nSeed complete: {students_inserted} inserted, {students_updated} updated.")
    print(f"Activities inserted: {activities_inserted}")


if __name__ == "__main__":
    excel = Path(sys.argv[1]) if len(sys.argv) > 1 else EXCEL_PATH
    seed(excel)
