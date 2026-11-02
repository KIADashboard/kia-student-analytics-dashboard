import csv
import io
from datetime import date
from decimal import Decimal
from typing import Any

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, ConfigDict, Field, ValidationError, field_validator
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
)
from .auth import get_current_user, require_admin

router = APIRouter(prefix="/academic", tags=["Academic records"])
MAX_CSV_BYTES = 10 * 1024 * 1024
MAX_CSV_ROWS = 10_000


class AcademicCsvRow(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id_number: str = Field(min_length=1, max_length=50)
    semester: int = Field(ge=1, le=20)


class SemesterCsvRow(AcademicCsvRow):
    academic_year: str | None = Field(default=None, max_length=20)
    gpa: Decimal | None = Field(default=None, ge=0, le=10)
    credits_earned: Decimal | None = Field(default=None, ge=0)
    total_credits: Decimal | None = Field(default=None, gt=0)


class AttendanceCsvRow(AcademicCsvRow):
    attendance_percentage: Decimal = Field(ge=0, le=100)


class ArrearCsvRow(AcademicCsvRow):
    course_code: str = Field(min_length=1, max_length=50)
    course_name: str | None = Field(default=None, max_length=200)
    cleared: bool = False

    @field_validator("cleared", mode="before")
    @classmethod
    def parse_cleared(cls, value: Any) -> Any:
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"yes", "true", "1", "y"}:
                return True
            if normalized in {"no", "false", "0", "n", ""}:
                return False
        return value


class PlacementCsvRow(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id_number: str = Field(min_length=1, max_length=50)
    company: str = Field(min_length=1, max_length=200)
    job_title: str = Field(min_length=1, max_length=200)
    status: str = Field(min_length=1, max_length=40)
    package_lpa: Decimal | None = Field(default=None, ge=0)
    placement_date: date | None = None


CSV_CONFIG = {
    "semester": (
        SemesterCsvRow,
        SemesterRecord,
        ("student_id", "semester"),
        ("id_number", "semester", "academic_year", "gpa", "credits_earned", "total_credits"),
    ),
    "attendance": (
        AttendanceCsvRow,
        AttendanceRecord,
        ("student_id", "semester"),
        ("id_number", "semester", "attendance_percentage"),
    ),
    "arrears": (
        ArrearCsvRow,
        ArrearRecord,
        ("student_id", "semester", "course_code"),
        ("id_number", "semester", "course_code", "course_name", "cleared"),
    ),
    "placements": (
        PlacementCsvRow,
        PlacementRecord,
        ("student_id", "company", "job_title"),
        ("id_number", "company", "job_title", "status", "package_lpa", "placement_date"),
    ),
}
CSV_REQUIRED_FIELDS = {
    "semester": {"id_number", "semester"},
    "attendance": {"id_number", "semester", "attendance_percentage"},
    "arrears": {"id_number", "semester", "course_code"},
    "placements": {"id_number", "company", "job_title", "status"},
}


def _record_dict(record: Any, fields: tuple[str, ...]) -> dict[str, Any]:
    result = {}
    for field in fields:
        value = getattr(record, field)
        if isinstance(value, Decimal):
            value = float(value)
        elif isinstance(value, date):
            value = value.isoformat()
        result[field] = value
    return result


def _student_academic_records(db: Session, student_id: int) -> dict[str, list[dict]]:
    return {
        "semesters": [
            _record_dict(row, ("id", "semester", "academic_year", "gpa", "credits_earned", "total_credits"))
            for row in db.execute(
                select(SemesterRecord).where(SemesterRecord.student_id == student_id)
                .order_by(SemesterRecord.semester)
            ).scalars()
        ],
        "attendance": [
            _record_dict(row, ("id", "semester", "attendance_percentage"))
            for row in db.execute(
                select(AttendanceRecord).where(AttendanceRecord.student_id == student_id)
                .order_by(AttendanceRecord.semester)
            ).scalars()
        ],
        "arrears": [
            _record_dict(row, ("id", "semester", "course_code", "course_name", "cleared"))
            for row in db.execute(
                select(ArrearRecord).where(ArrearRecord.student_id == student_id)
                .order_by(ArrearRecord.semester, ArrearRecord.course_code)
            ).scalars()
        ],
        "placements": [
            _record_dict(row, ("id", "company", "job_title", "status", "package_lpa", "placement_date"))
            for row in db.execute(
                select(PlacementRecord).where(PlacementRecord.student_id == student_id)
                .order_by(PlacementRecord.placement_date, PlacementRecord.company)
            ).scalars()
        ],
    }


@router.get("/students/{student_id}")
def get_student_academic_records(
    student_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if user.role != "admin" and user.student_id != student_id:
        raise HTTPException(status_code=403, detail="You may only view your own academic records.")
    if db.get(Student, student_id) is None:
        raise HTTPException(status_code=404, detail="Student not found.")
    return _student_academic_records(db, student_id)


async def _import_csv(
    kind: str,
    file: UploadFile,
    db: Session,
) -> dict[str, int]:
    schema, model, key_fields, _ = CSV_CONFIG[kind]
    content = await file.read(MAX_CSV_BYTES + 1)
    if len(content) > MAX_CSV_BYTES:
        raise HTTPException(status_code=413, detail="CSV file exceeds the 10 MB limit.")
    try:
        text = content.decode("utf-8-sig")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="CSV file must use UTF-8 encoding.") from None

    reader = csv.DictReader(io.StringIO(text))
    if not reader.fieldnames:
        raise HTTPException(status_code=400, detail="CSV file must include a header row.")
    headers = {header.strip().lower(): header for header in reader.fieldnames if header}
    for alias in ("student_id", "student_id_number"):
        if alias in headers:
            headers["id_number"] = headers[alias]
    missing = sorted(CSV_REQUIRED_FIELDS[kind] - set(headers))
    if missing:
        raise HTTPException(
            status_code=422,
            detail={"message": "CSV is missing required columns.", "columns": missing},
        )
    unknown = sorted(
        set(headers) - set(schema.model_fields) - {"student_id", "student_id_number"}
    )
    if unknown:
        raise HTTPException(
            status_code=422,
            detail={"message": "CSV contains unsupported columns.", "columns": unknown},
        )

    parsed: list[dict[str, Any]] = []
    errors = []
    seen_keys = set()
    for line, raw in enumerate(reader, start=2):
        if line > MAX_CSV_ROWS + 1:
            raise HTTPException(status_code=413, detail="CSV is limited to 10,000 data rows.")
        values = {}
        for key, source_header in headers.items():
            if key in schema.model_fields:
                value = raw.get(source_header)
                if isinstance(value, str):
                    value = value.strip()
                    if not value and key == "cleared":
                        continue
                    value = value or None
                values[key] = value
        try:
            row = schema.model_validate(values)
            data = row.model_dump()
            key = tuple(data[field] for field in key_fields if field != "student_id")
            id_number = data.pop("id_number").strip()
            student = db.execute(
                select(Student).where(Student.id_number == id_number)
            ).scalar_one_or_none()
            if student is None:
                raise ValueError(f"student ID not found: {id_number}")
            data["student_id"] = student.id
            unique_key = (student.id, *key)
            if unique_key in seen_keys:
                raise ValueError("duplicate record in CSV")
            seen_keys.add(unique_key)
            parsed.append(data)
        except (ValidationError, ValueError) as error:
            message = str(error)
            if isinstance(error, ValidationError):
                message = "; ".join(item["msg"] for item in error.errors())
            errors.append({"row": line, "error": message})
            if len(errors) >= 100:
                errors.append({"row": line, "error": "Further errors omitted."})
                break
    if errors:
        raise HTTPException(
            status_code=422,
            detail={"message": "No records were imported; fix the listed CSV errors.", "errors": errors},
        )
    if not parsed:
        raise HTTPException(status_code=422, detail="CSV contains no records.")

    inserted = updated = 0
    try:
        for values in parsed:
            conditions = [getattr(model, field) == values[field] for field in key_fields]
            existing = db.execute(select(model).where(*conditions)).scalar_one_or_none()
            if existing:
                for field, value in values.items():
                    if field not in key_fields:
                        setattr(existing, field, value)
                updated += 1
            else:
                db.add(model(**values))
                inserted += 1
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(status_code=409, detail="Academic record conflicts with an existing record.") from error
    return {"inserted": inserted, "updated": updated, "total": len(parsed)}


@router.post("/import/{kind}.csv", dependencies=[Depends(require_admin)])
async def import_academic_csv(
    kind: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if kind not in CSV_CONFIG:
        raise HTTPException(status_code=404, detail="Unknown academic record type.")
    return await _import_csv(kind, file, db)


@router.get("/export/{kind}.csv", dependencies=[Depends(require_admin)])
def export_academic_csv(kind: str, db: Session = Depends(get_db)):
    if kind not in CSV_CONFIG:
        raise HTTPException(status_code=404, detail="Unknown academic record type.")
    _, model, _, columns = CSV_CONFIG[kind]
    records = db.execute(select(model).order_by(model.id)).scalars().all()
    students = {
        student.id: student.id_number
        for student in db.execute(select(Student)).scalars()
    }

    def generate():
        output = io.StringIO()
        output.write("\ufeff")
        writer = csv.DictWriter(output, fieldnames=columns)
        writer.writeheader()
        yield output.getvalue()
        for record in records:
            output = io.StringIO()
            writer = csv.DictWriter(output, fieldnames=columns)
            row = {
                field: getattr(record, field)
                for field in columns
                if field != "id_number"
            }
            row["id_number"] = students[record.student_id]
            writer.writerow(row)
            yield output.getvalue()

    return StreamingResponse(
        generate(),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="kia-{kind}.csv"'},
    )


@router.post("/import/activities.csv", dependencies=[Depends(require_admin)])
async def import_activities_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Bulk import extracurricular activities from CSV.
    Required columns: id_number, activity_name
    Optional columns: activity_category, achievement_level, achievement_type, achievement_description
    """
    content = await file.read(MAX_CSV_BYTES + 1)
    if len(content) > MAX_CSV_BYTES:
        raise HTTPException(status_code=413, detail="CSV file exceeds the 10 MB limit.")
    try:
        text = content.decode("utf-8-sig")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="CSV file must use UTF-8 encoding.") from None

    reader = csv.DictReader(io.StringIO(text))
    if not reader.fieldnames:
        raise HTTPException(status_code=400, detail="CSV file must include a header row.")

    headers = {h.strip().lower() for h in reader.fieldnames if h}
    required = {"id_number", "activity_name"}
    missing = sorted(required - headers)
    if missing:
        raise HTTPException(
            status_code=422,
            detail={"message": "CSV is missing required columns.", "columns": missing},
        )

    allowed_fields = {
        "activity_category", "activity_name", "achievement_level",
        "achievement_type", "achievement_description",
    }
    inserted = 0
    errors = []
    for line, raw in enumerate(reader, start=2):
        if line > MAX_CSV_ROWS + 1:
            raise HTTPException(status_code=413, detail="CSV is limited to 10,000 data rows.")
        id_number = (raw.get("id_number") or "").strip()
        if not id_number:
            errors.append({"row": line, "error": "id_number is empty"})
            continue
        student = db.execute(
            select(Student).where(Student.id_number == id_number)
        ).scalar_one_or_none()
        if student is None:
            errors.append({"row": line, "error": f"student ID not found: {id_number}"})
            continue
        values: dict[str, Any] = {"student_id": student.id}
        for field in allowed_fields:
            raw_val = raw.get(field, "")
            values[field] = raw_val.strip() if isinstance(raw_val, str) else raw_val or None
        db.add(Activity(**values))
        inserted += 1
        if len(errors) >= 100:
            errors.append({"row": line, "error": "Further errors omitted."})
            break

    if errors:
        db.rollback()
        raise HTTPException(
            status_code=422,
            detail={"message": "Some rows could not be imported.", "errors": errors},
        )
    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(status_code=409, detail="Activity record conflicts with existing data.") from error

    return {"inserted": inserted, "updated": 0, "total": inserted}
