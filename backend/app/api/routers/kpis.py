"""
kpis.py – /api/kpis and /api/analytics endpoints.
All chart data + KPI cards served from PostgreSQL.
"""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ...models.database import get_db
from ...services import kpi_service
from .auth import require_admin

router = APIRouter(tags=["KPIs & Analytics"], dependencies=[Depends(require_admin)])


# ── Meta ────────────────────────────────────────────────────────────────────

@router.get("/meta/batches")
def batches(db: Session = Depends(get_db)):
    """All distinct batch years. Replaces hard-coded batchOptions array."""
    return {"batches": kpi_service.get_batch_years(db)}


@router.get("/meta/current-year")
def current_year(db: Session = Depends(get_db)):
    """Latest academic year. Replaces reduce(max) in OverviewPage."""
    return {"current_year": kpi_service.get_current_year(db)}


# ── Overview Page ────────────────────────────────────────────────────────────

@router.get("/kpis/overview")
def overview_kpis(db: Session = Depends(get_db)):
    """
    All four KPI cards on the Overview page:
    Total Students, Male, Female, Seven-Year Strength.
    """
    return kpi_service.get_overview_kpis(db)


@router.get("/charts/enrollment-by-year")
def enrollment_by_year(db: Session = Depends(get_db)):
    """Enrollment bar chart – students per academic year."""
    return {"data": kpi_service.get_enrollment_by_year(db)}


@router.get("/charts/cgpa-distribution")
def cgpa_dist(
    batch: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Unified CGPA distribution bands (fixes the 3-file inconsistency).
    Used by OverviewPage, AcademicPerformancePage, and AnalyticsPage.
    """
    return {
        "data": kpi_service.get_cgpa_distribution(db, batch),
        "data_basis": kpi_service.get_gpa_data_basis(db, batch),
    }


@router.get("/students/needs-attention")
def needs_attention(
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db),
):
    """Top-N students needing attention. Replaces in-memory sort/slice."""
    return {"data": kpi_service.get_students_needing_attention(db, limit)}


# ── Academic Performance Page ─────────────────────────────────────────────

@router.get("/kpis/academic")
def academic_kpis(
    batch: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """Four KPI cards on the Academic Performance page."""
    return kpi_service.get_academic_kpis(db, batch)


@router.get("/charts/cutoff-by-batch")
def cutoff_by_batch(db: Session = Depends(get_db)):
    """
    Avg / Max / Min cutoff per batch year.
    Replaces semester-wise GPA line chart until exam data is available.
    """
    return {"data": kpi_service.get_cutoff_distribution_by_batch(db)}


# ── Analytics Page ────────────────────────────────────────────────────────

@router.get("/analytics/distributions")
def distributions(
    batch: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """
    All 18 distribution charts for the Analytics > Batch Profile tab.
    Returns a single JSON object keyed by dimension name.
    """
    return kpi_service.get_distributions(db, batch)


@router.get("/analytics/compare")
def compare(
    batch1: int = Query(...),
    batch2: int = Query(...),
    db: Session = Depends(get_db),
):
    """
    Batch comparison summary. Replaces Analytics > Compare tab logic.
    """
    return kpi_service.get_batch_compare(db, batch1, batch2)


@router.get("/analytics/trend")
def trend(
    metric: str = Query("strength"),
    db: Session = Depends(get_db),
):
    """
    Multi-year trend for a single metric.
    Replaces Analytics > Trend tab trendMetric computation.
    metric options: strength | avg_cutoff | hostel_pct | first_gen_pct
    """
    return kpi_service.get_trend(db, metric)
