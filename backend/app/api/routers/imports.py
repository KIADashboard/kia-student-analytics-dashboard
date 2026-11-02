import csv
import io
import math
from datetime import date

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import String, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ...models.database import get_db
from ...models.schema import Student
from .auth import require_admin

router = APIRouter(
    prefix="/import",
    tags=["Import"],
    dependencies=[Depends(require_admin)],
)

ALIASES = {
    "address_for_communication": "address_comm",
    "agri_land_availability_acres": "agri_land_availability",
    "school_type_govt_private_aided": "school_type",
    "area_type_rural_urban": "area_type",
}
BOOLEAN_FIELDS = {"first_graduate", "studied_tamil_in_xii"}
INTEGER_FIELDS = {"batch_year", "annual_income"}
FLOAT_FIELDS = {
    "x_mark_scored", "xii_mark_scored", "cutoff_xii_percentage",
    "marks_language", "marks_english", "marks_maths", "marks_physics",
    "marks_chemistry", "marks_biology", "marks_botany", "marks_zoology",
    "marks_computer_science", "marks_total", "agri_land_availability",
}
DATE_FIELDS = {"dob"}
REQUIRED_FIELDS = {"batch_year", "student_name", "id_number"}
NULL_VALUES = {"", "-1", "not collected", "not_collected", "na", "nan", "none"}
ALLOWED_FIELDS = {
    column.name for column in Student.__table__.columns
} - {"id"}


def _parse_value(field: str, value: str | None):
    if value is None or value.strip().lower() in NULL_VALUES:
        return None
    value = value.strip()
    if field in BOOLEAN_FIELDS:
        normalized = value.lower()
        if normalized in {"yes", "true", "1", "y"}:
            return True
        if normalized in {"no", "false", "0", "n"}:
            return False
        raise ValueError("expected yes/no")
    if field in INTEGER_FIELDS:
        number = float(value)
        if not number.is_integer():
            raise ValueError("expected a whole number")
        return int(number)
    if field in FLOAT_FIELDS:
        number = float(value)
        if not math.isfinite(number):
            raise ValueError("expected a finite number")
        return number
    if field in DATE_FIELDS:
        return date.fromisoformat(value)
    return value


@router.post("/students.csv")
async def import_students_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    content = await file.read(10 * 1024 * 1024 + 1)
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="CSV file exceeds the 10 MB limit.")
    try:
        text = content.decode("utf-8-sig")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="CSV file must use UTF-8 encoding.") from None

    reader = csv.DictReader(io.StringIO(text))
    if not reader.fieldnames:
        raise HTTPException(status_code=400, detail="CSV file must include a header row.")
    headers = {
        header.strip().lower(): ALIASES.get(header.strip().lower(), header.strip().lower())
        for header in reader.fieldnames if header
    }
    missing = sorted(REQUIRED_FIELDS - set(headers.values()))
    if missing:
        raise HTTPException(
            status_code=422,
            detail={"message": "CSV is missing required columns.", "columns": missing},
        )

    parsed_rows = []
    errors = []
    seen_ids = set()
    for line_number, row in enumerate(reader, start=2):
        if line_number > 10_001:
            raise HTTPException(status_code=413, detail="CSV is limited to 10,000 data rows.")
        values = {}
        try:
            for header, value in row.items():
                if not header:
                    continue
                field = headers.get(header.strip().lower())
                if field in ALLOWED_FIELDS:
                    parsed = _parse_value(field, value)
                    column = Student.__table__.columns[field]
                    if (
                        parsed is not None
                        and isinstance(column.type, String)
                        and column.type.length
                        and len(str(parsed)) > column.type.length
                    ):
                        raise ValueError(
                            f"{field} exceeds the {column.type.length}-character limit"
                        )
                    values[field] = parsed
            missing_values = sorted(
                field for field in REQUIRED_FIELDS
                if values.get(field) is None or values.get(field) == ""
            )
            if missing_values:
                raise ValueError(f"missing required values: {', '.join(missing_values)}")
            id_number = values["id_number"]
            if id_number in seen_ids:
                raise ValueError(f"duplicate id_number in CSV: {id_number}")
            seen_ids.add(id_number)
            parsed_rows.append(values)
        except (TypeError, ValueError, OverflowError) as error:
            errors.append({"row": line_number, "error": str(error)})
            if len(errors) >= 100:
                errors.append({"row": line_number, "error": "Further errors omitted."})
                break

    if errors:
        raise HTTPException(
            status_code=422,
            detail={"message": "No records were imported; fix the listed CSV errors.", "errors": errors},
        )
    if not parsed_rows:
        raise HTTPException(status_code=422, detail="CSV contains no student records.")

    inserted = 0
    updated = 0
    try:
        for values in parsed_rows:
            existing = db.execute(
                select(Student).where(Student.id_number == values["id_number"])
            ).scalar_one_or_none()
            if existing:
                for field, value in values.items():
                    setattr(existing, field, value)
                updated += 1
            else:
                db.add(Student(**values))
                inserted += 1
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Import conflicts with an existing student registration number or record.",
        ) from error
    except Exception:
        db.rollback()
        raise

    return {"inserted": inserted, "updated": updated, "total": len(parsed_rows)}
