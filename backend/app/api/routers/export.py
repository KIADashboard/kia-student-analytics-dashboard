"""
export.py – /api/export endpoints (CSV download).
Replaces downloadCsv + studentCsvRow from adminData.ts.
"""
import csv
import io
from typing import Optional

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from ...models.database import get_db
from .auth import require_admin
from ...services.kpi_service import get_students, _income_category

router = APIRouter(prefix="/export", tags=["Export"], dependencies=[Depends(require_admin)])


@router.get("/students.csv")
def export_students_csv(
    batch: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    residence: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """
    CSV export of the filtered student list.
    Replaces adminData.ts → downloadCsv() + studentCsvRow().
    Column selection happens SERVER-SIDE, not in the browser.
    """
    # Pull all matching students (no page limit for export)
    result = get_students(
        db,
        batch_year=batch,
        gender=gender,
        residence=residence,
        district=district,
        search=q,
        page=1,
        page_size=10_000,
    )

    fieldnames = [
        "Name", "ID Number", "Reg No", "Batch Year",
        "Gender", "Community", "District", "State",
        "Residence", "Admission Quota", "First Graduate",
        "Cutoff Score", "Income Category",
    ]

    def generate():
        buf = io.StringIO()
        # UTF-8 BOM so Excel opens it correctly
        buf.write("\ufeff")
        writer = csv.DictWriter(buf, fieldnames=fieldnames)
        writer.writeheader()
        yield buf.getvalue()

        for s in result["students"]:
            buf = io.StringIO()
            writer = csv.DictWriter(buf, fieldnames=fieldnames)
            writer.writerow({
                "Name":            s["name"],
                "ID Number":       s["id_number"],
                "Reg No":          s.get("reg_no") or "",
                "Batch Year":      s["batch_year"],
                "Gender":          s.get("gender") or "",
                "Community":       s.get("community") or "",
                "District":        s.get("district") or "",
                "State":           s.get("state") or "",
                "Residence":       s.get("residence") or "",
                "Admission Quota": s.get("admission_quota") or "",
                "First Graduate":  "Yes" if s.get("first_graduate") else "No",
                "Cutoff Score":    f"{s['cutoff']:.2f}" if s.get("cutoff") else "",
                "Income Category": s.get("income_category") or "",
            })
            yield buf.getvalue()

    filename = f"kia-students-{batch or 'all'}.csv"
    return StreamingResponse(
        generate(),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
