"""
schema.py – SQLAlchemy ORM models for the KIA Student Analytics Dashboard.

Tables
------
students        – core student record (one row per student)
activities      – extracurricular activities (many-per-student)
"""
from __future__ import annotations

from sqlalchemy import (
    BigInteger, Boolean, Column, Date, Float, ForeignKey, Integer,
    Numeric, String, Text, UniqueConstraint,
)
from .database import Base


# ---------------------------------------------------------------------------
# Main student table
# ---------------------------------------------------------------------------
class Student(Base):
    __tablename__ = "students"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)

    # Batch / admission year
    batch_year = Column(Integer, nullable=False, index=True)

    # Identity
    student_name     = Column(String(200), nullable=False)
    id_number        = Column(String(50), unique=True, nullable=False, index=True)
    reg_no           = Column(String(50), unique=True, nullable=True)
    dob              = Column(Date, nullable=True)
    gender           = Column(String(20), nullable=True)
    blood_group      = Column(String(30), nullable=True)

    # Socio-cultural
    nationality      = Column(String(60), nullable=True)
    religion         = Column(String(60), nullable=True)
    community        = Column(String(60), nullable=True)
    caste            = Column(String(60), nullable=True)
    mother_tongue    = Column(String(60), nullable=True)

    # Residence
    hosteller_dayscholar = Column(String(30), nullable=True)   # normalised → 'Hosteller'/'Dayscholar'

    # Admission
    admission_type   = Column(String(60), nullable=True)
    first_graduate   = Column(Boolean, nullable=True)
    admission_quota  = Column(String(80), nullable=True)

    # Address
    address_comm     = Column(Text, nullable=True)
    permanent_address= Column(Text, nullable=True)
    district         = Column(String(80), nullable=True)
    state            = Column(String(80), nullable=True)
    pin_code         = Column(String(10), nullable=True)

    # Contact
    mobile_number    = Column(String(20), nullable=True)
    whatsapp_number  = Column(String(20), nullable=True)
    email            = Column(String(120), nullable=True)

    # Bank (stored but not exposed publicly)
    bank_name        = Column(String(80), nullable=True)
    bank_account_no  = Column(String(40), nullable=True)
    branch_name      = Column(String(80), nullable=True)
    ifsc_code        = Column(String(20), nullable=True)
    aadhar_no        = Column(String(20), nullable=True)

    # X Standard
    x_board              = Column(String(80), nullable=True)
    x_school_name        = Column(String(200), nullable=True)
    x_month_year_passing = Column(String(20), nullable=True)
    x_medium             = Column(String(40), nullable=True)
    x_mark_scored        = Column(Float, nullable=True)

    # XII Standard
    xii_board              = Column(String(80), nullable=True)
    xii_school_name        = Column(String(200), nullable=True)
    xii_month_year_passing = Column(String(20), nullable=True)
    xii_medium             = Column(String(40), nullable=True)
    xii_mark_scored        = Column(Float, nullable=True)

    # Cutoff / marks
    cutoff_xii_percentage = Column(Float, nullable=True)
    marks_language        = Column(Float, nullable=True)
    marks_english         = Column(Float, nullable=True)
    marks_maths           = Column(Float, nullable=True)
    marks_physics         = Column(Float, nullable=True)
    marks_chemistry       = Column(Float, nullable=True)
    marks_biology         = Column(Float, nullable=True)
    marks_botany          = Column(Float, nullable=True)
    marks_zoology         = Column(Float, nullable=True)
    marks_computer_science= Column(Float, nullable=True)
    marks_total           = Column(Float, nullable=True)

    # Family / socio-economic
    father_guardian_name  = Column(String(200), nullable=True)
    father_qualification  = Column(String(80), nullable=True)
    father_occupation     = Column(String(80), nullable=True)
    father_mobile         = Column(String(20), nullable=True)
    mother_name           = Column(String(200), nullable=True)
    mother_qualification  = Column(String(80), nullable=True)
    mother_occupation     = Column(String(80), nullable=True)
    mother_mobile         = Column(String(20), nullable=True)
    annual_income         = Column(BigInteger, nullable=True)   # stored in rupees
    parents_occupation    = Column(String(100), nullable=True)

    # School / study background
    emis_no               = Column(String(40), nullable=True)
    languages_known       = Column(String(200), nullable=True)
    board_of_study        = Column(String(80), nullable=True)
    medium_of_study       = Column(String(60), nullable=True)
    school_type           = Column(String(60), nullable=True)   # normalised
    family_background     = Column(String(80), nullable=True)
    agri_land_availability= Column(Float, nullable=True)        # in acres; -1 = not collected
    crops_planted         = Column(String(200), nullable=True)
    agri_land_locality    = Column(String(200), nullable=True)
    area_type             = Column(String(20), nullable=True)    # Rural / Urban
    studied_tamil_in_xii  = Column(Boolean, nullable=True)

    # Derived / computed fields (can be updated later)
    income_category       = Column(String(30), nullable=True)   # e.g. '< ₹1 Lakh'
    agri_background       = Column(String(10), nullable=True)   # Yes / No / Unknown


# ---------------------------------------------------------------------------
# Activities table (one-to-many with students)
# ---------------------------------------------------------------------------
class Activity(Base):
    __tablename__ = "activities"

    id                   = Column(Integer, primary_key=True, index=True)
    student_id           = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    activity_category    = Column(String(100), nullable=True)
    activity_name        = Column(String(200), nullable=True)
    achievement_level    = Column(String(80), nullable=True)
    achievement_type     = Column(String(80), nullable=True)
    achievement_description = Column(Text, nullable=True)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), unique=True, nullable=True)


class SemesterRecord(Base):
    __tablename__ = "semester_records"
    __table_args__ = (UniqueConstraint("student_id", "semester", name="uq_semester_student_term"),)

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    semester = Column(Integer, nullable=False)
    academic_year = Column(String(20), nullable=True)
    gpa = Column(Numeric(4, 2), nullable=True)
    credits_earned = Column(Numeric(6, 2), nullable=True)
    total_credits = Column(Numeric(6, 2), nullable=True)


class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    __table_args__ = (UniqueConstraint("student_id", "semester", name="uq_attendance_student_term"),)

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    semester = Column(Integer, nullable=False)
    attendance_percentage = Column(Numeric(5, 2), nullable=False)


class ArrearRecord(Base):
    __tablename__ = "arrear_records"
    __table_args__ = (
        UniqueConstraint("student_id", "semester", "course_code", name="uq_arrear_student_course_term"),
    )

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    semester = Column(Integer, nullable=False)
    course_code = Column(String(50), nullable=False)
    course_name = Column(String(200), nullable=True)
    cleared = Column(Boolean, nullable=False, default=False)


class PlacementRecord(Base):
    __tablename__ = "placement_records"
    __table_args__ = (
        UniqueConstraint("student_id", "company", "job_title", name="uq_placement_student_offer"),
    )

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    company = Column(String(200), nullable=False)
    job_title = Column(String(200), nullable=False)
    status = Column(String(40), nullable=False)
    package_lpa = Column(Numeric(10, 2), nullable=True)
    placement_date = Column(Date, nullable=True)
