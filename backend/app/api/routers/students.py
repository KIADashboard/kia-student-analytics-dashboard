"""
students.py – /api/students endpoints.
"""
from typing import Optional
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from pydantic import BaseModel, ConfigDict, Field, field_validator
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ...models.database import get_db
from ...models.schema import (
    Activity,
    ArrearRecord,
    AttendanceRecord,
    PlacementRecord,
    SemesterRecord,
    Student,
    User,
)
from .auth import require_admin
from ...services import kpi_service

router = APIRouter(prefix="/students", tags=["Students"], dependencies=[Depends(require_admin)])


class StudentUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    batch_year: int | None = Field(default=None, gt=0)
    student_name: str | None = Field(default=None, max_length=200)
    id_number: str | None = Field(default=None, max_length=50)
    reg_no: str | None = Field(default=None, max_length=50)
    dob: date | None = None
    gender: str | None = Field(default=None, max_length=20)
    blood_group: str | None = Field(default=None, max_length=30)
    nationality: str | None = Field(default=None, max_length=60)
    religion: str | None = Field(default=None, max_length=60)
    community: str | None = Field(default=None, max_length=60)
    caste: str | None = Field(default=None, max_length=60)
    mother_tongue: str | None = Field(default=None, max_length=60)
    hosteller_dayscholar: str | None = Field(default=None, max_length=30)
    admission_type: str | None = Field(default=None, max_length=60)
    first_graduate: bool | None = None
    admission_quota: str | None = Field(default=None, max_length=80)
    address_comm: str | None = None
    permanent_address: str | None = None
    pin_code: str | None = Field(default=None, max_length=10)
    email: str | None = Field(default=None, max_length=120)
    mobile_number: str | None = Field(default=None, max_length=20)
    whatsapp_number: str | None = Field(default=None, max_length=20)
    bank_name: str | None = Field(default=None, max_length=80)
    bank_account_no: str | None = Field(default=None, max_length=40)
    branch_name: str | None = Field(default=None, max_length=80)
    ifsc_code: str | None = Field(default=None, max_length=20)
    aadhar_no: str | None = Field(default=None, max_length=20)
    x_board: str | None = Field(default=None, max_length=80)
    x_school_name: str | None = Field(default=None, max_length=200)
    x_month_year_passing: str | None = Field(default=None, max_length=20)
    x_medium: str | None = Field(default=None, max_length=40)
    x_mark_scored: float | None = None
    xii_board: str | None = Field(default=None, max_length=80)
    xii_school_name: str | None = Field(default=None, max_length=200)
    xii_month_year_passing: str | None = Field(default=None, max_length=20)
    xii_medium: str | None = Field(default=None, max_length=40)
    xii_mark_scored: float | None = None
    cutoff_xii_percentage: float | None = Field(default=None, ge=0, le=200)
    marks_language: float | None = None
    marks_english: float | None = None
    marks_maths: float | None = None
    marks_physics: float | None = None
    marks_chemistry: float | None = None
    marks_biology: float | None = None
    marks_botany: float | None = None
    marks_zoology: float | None = None
    marks_computer_science: float | None = None
    marks_total: float | None = None
    father_guardian_name: str | None = Field(default=None, max_length=200)
    father_qualification: str | None = Field(default=None, max_length=80)
    father_occupation: str | None = Field(default=None, max_length=80)
    father_mobile: str | None = Field(default=None, max_length=20)
    mother_name: str | None = Field(default=None, max_length=200)
    mother_qualification: str | None = Field(default=None, max_length=80)
    mother_occupation: str | None = Field(default=None, max_length=80)
    mother_mobile: str | None = Field(default=None, max_length=20)
    annual_income: int | None = None
    parents_occupation: str | None = Field(default=None, max_length=100)
    emis_no: str | None = Field(default=None, max_length=40)
    languages_known: str | None = Field(default=None, max_length=200)
    board_of_study: str | None = Field(default=None, max_length=80)
    medium_of_study: str | None = Field(default=None, max_length=60)
    school_type: str | None = Field(default=None, max_length=60)
    family_background: str | None = Field(default=None, max_length=80)
    agri_land_availability: float | None = None
    crops_planted: str | None = Field(default=None, max_length=200)
    agri_land_locality: str | None = Field(default=None, max_length=200)
    area_type: str | None = Field(default=None, max_length=20)
    studied_tamil_in_xii: bool | None = None
    income_category: str | None = Field(default=None, max_length=30)
    agri_background: str | None = Field(default=None, max_length=10)
    district: str | None = Field(default=None, max_length=80)
    state: str | None = Field(default=None, max_length=80)

    @field_validator("student_name", "id_number", mode="before")
    @classmethod
    def trim_required_text(cls, value):
        if value is None:
            return value
        normalized = value.strip() if isinstance(value, str) else value
        if normalized == "":
            raise ValueError("must not be empty")
        return normalized


class StudentCreate(StudentUpdate):
    batch_year: int = Field(gt=0)
    student_name: str = Field(min_length=1, max_length=200)
    id_number: str = Field(min_length=1, max_length=50)


def _commit_student(db: Session, student: Student) -> None:
    try:
        db.commit()
        db.refresh(student)
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A student with that ID or registration number already exists.",
        ) from error


@router.get("")
def list_students(
    batch: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    residence: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    sort_by: str = Query("name"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """
    Filtered & paginated student list.
    Replaces StudentProfilesPage.tsx client-side filter + sort logic.
    """
    return kpi_service.get_students(
        db,
        batch_year=batch,
        gender=gender,
        residence=residence,
        district=district,
        search=q,
        sort_by=sort_by,
        page=page,
        page_size=page_size,
    )


@router.post("", status_code=status.HTTP_201_CREATED)
def create_student(body: StudentCreate, db: Session = Depends(get_db)):
    student = Student(**body.model_dump())
    db.add(student)
    _commit_student(db, student)
    return kpi_service.get_student_detail(db, student.id)


@router.get("/{student_id}")
def get_student(student_id: int, db: Session = Depends(get_db)):
    """
    Full student detail (used by profile modal in StudentProfilesPage).
    Replaces getStudentProfile() shim in studentData.ts.
    """
    detail = kpi_service.get_student_detail(db, student_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Student not found.")
    return detail


@router.patch("/{student_id}")
def update_student(
    student_id: int,
    body: StudentUpdate,
    db: Session = Depends(get_db),
):
    student = db.get(Student, student_id)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found.")
    values = body.model_dump(exclude_unset=True)
    if not values:
        raise HTTPException(status_code=422, detail="At least one student field is required.")
    if any(
        field in values and (values[field] is None or not str(values[field]).strip())
        for field in ("student_name", "id_number")
    ):
        raise HTTPException(status_code=422, detail="Student name and ID number cannot be empty.")
    for field, value in values.items():
        setattr(student, field, value)
    _commit_student(db, student)
    return kpi_service.get_student_detail(db, student.id)


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.get(Student, student_id)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found.")
    account = db.execute(
        select(User.id).where(User.student_id == student_id)
    ).scalar_one_or_none()
    if account is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Student has a login account. Remove the account before deleting the student.",
        )
    for model in (
        Activity,
        SemesterRecord,
        AttendanceRecord,
        ArrearRecord,
        PlacementRecord,
    ):
        db.query(model).filter(model.student_id == student_id).delete(synchronize_session=False)
    db.delete(student)
    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Student cannot be deleted while dependent records exist.",
        ) from error
    return Response(status_code=status.HTTP_204_NO_CONTENT)
