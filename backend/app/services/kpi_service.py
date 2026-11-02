"""
kpi_service.py – All business-logic / KPI computations.

Each function receives a SQLAlchemy Session and optional filters,
runs SQL queries, and returns plain Python dicts ready to be serialised
as JSON by FastAPI.

This replaces ALL the inline calculations that were hard-coded in the
React frontend files (OverviewPage, AcademicPerformancePage, AnalyticsPage).
"""
from __future__ import annotations

from typing import Any
from sqlalchemy import func, case, select, text
from sqlalchemy.orm import Session

from ..models.schema import (
    Activity,
    ArrearRecord,
    AttendanceRecord,
    PlacementRecord,
    SemesterRecord,
    Student,
)

# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

NULL_VALS = {"-1", "not_collected", "na", "nan", "none", ""}


def _is_null(val: Any) -> bool:
    return val is None or str(val).strip().lower() in NULL_VALS


def _safe_float(val: Any) -> float | None:
    """Return None for sentinel -1 values and non-numeric strings."""
    try:
        f = float(val)
        return None if f == -1 else f
    except (TypeError, ValueError):
        return None


def _income_category(income: int | None) -> str:
    """Map annual income (rupees) to a bracket label."""
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


def _filter_query(query, batch_year: str | None, gender: str | None = None):
    """Apply common batch / gender filters to any Student query."""
    if batch_year and batch_year != "all":
        try:
            query = query.filter(Student.batch_year == int(batch_year))
        except ValueError:
            pass
    if gender and gender != "all":
        query = query.filter(func.lower(Student.gender) == gender.lower())
    return query


# ---------------------------------------------------------------------------
# 1. META
# ---------------------------------------------------------------------------

def get_batch_years(db: Session) -> list[int]:
    """All distinct batch years present in the DB, ascending."""
    rows = db.execute(
        select(Student.batch_year)
        .distinct()
        .order_by(Student.batch_year)
    ).scalars().all()
    return [r for r in rows if r]


def get_current_year(db: Session) -> int | None:
    """The latest (highest) academic batch year."""
    return db.execute(select(func.max(Student.batch_year))).scalar()


# ---------------------------------------------------------------------------
# 2. OVERVIEW PAGE KPIs
# ---------------------------------------------------------------------------

def get_overview_kpis(db: Session) -> dict:
    """
    Replaces OverviewPage.tsx KPI card computations:
      - Total students (current year)
      - Male count (current year)
      - Female count (current year)
      - Seven-year student strength
    """
    current_year = get_current_year(db)
    if not current_year:
        return {
            "total_students": 0,
            "male_count": 0,
            "female_count": 0,
            "seven_year_strength": 0,
            "current_year": None,
        }

    total = db.execute(
        select(func.count()).where(Student.batch_year == current_year)
    ).scalar() or 0

    male = db.execute(
        select(func.count()).where(
            Student.batch_year == current_year,
            func.lower(Student.gender) == "male",
        )
    ).scalar() or 0

    female = db.execute(
        select(func.count()).where(
            Student.batch_year == current_year,
            func.lower(Student.gender) == "female",
        )
    ).scalar() or 0

    seven_yr = db.execute(
        select(func.count()).where(
            Student.batch_year >= current_year - 6,
            Student.batch_year <= current_year,
        )
    ).scalar() or 0

    return {
        "total_students": total,
        "male_count": male,
        "female_count": female,
        "seven_year_strength": seven_yr,
        "current_year": current_year,
    }


def get_enrollment_by_year(db: Session) -> list[dict]:
    """
    Replaces OverviewPage.tsx enrollmentByYear chart:
      SELECT academic_year, COUNT(*) … GROUP BY academic_year ORDER BY academic_year
    """
    rows = db.execute(
        select(Student.batch_year, func.count().label("count"))
        .group_by(Student.batch_year)
        .order_by(Student.batch_year)
    ).all()
    return [{"year": str(r.batch_year), "count": r.count} for r in rows]


def get_cgpa_distribution(db: Session, batch_year: str | None = None) -> list[dict]:
    """
    Unified CGPA bands – replaces the three different versions in
    OverviewPage, AcademicPerformancePage, and AnalyticsPage.
    Uses imported semester GPAs when available; otherwise it converts
    admission cutoffs to a clearly marked proxy.
    """
    bands = [
        ("Below 6", 0, 6),
        ("6 – 6.9", 6, 7),
        ("7 – 7.9", 7, 8),
        ("8 – 8.9", 8, 9),
        ("9 and above", 9, 11),
    ]
    data_basis = get_gpa_data_basis(db, batch_year)
    if data_basis == "semester_gpa":
        q = (
            select(func.avg(SemesterRecord.gpa))
            .join(Student, Student.id == SemesterRecord.student_id)
            .where(SemesterRecord.gpa.isnot(None))
            .group_by(SemesterRecord.student_id)
        )
    else:
        q = select(Student.cutoff_xii_percentage).where(
            Student.cutoff_xii_percentage.isnot(None),
            Student.cutoff_xii_percentage > 0,
        )
    if batch_year and batch_year != "all":
        try:
            q = q.where(Student.batch_year == int(batch_year))
        except ValueError:
            pass

    values = db.execute(q).scalars().all()
    if data_basis == "semester_gpa":
        cgpas = [float(value) for value in values]
    else:
        cgpas = [(value / 200) * 10 for value in values]

    result = []
    for label, lo, hi in bands:
        cnt = sum(1 for g in cgpas if lo <= g < hi)
        result.append({"label": label, "count": cnt})
    return result


def get_gpa_data_basis(db: Session, batch_year: str | None = None) -> str:
    query = (
        select(func.count())
        .select_from(SemesterRecord)
        .join(Student, Student.id == SemesterRecord.student_id)
        .where(SemesterRecord.gpa.isnot(None))
    )
    if batch_year and batch_year != "all":
        try:
            query = query.where(Student.batch_year == int(batch_year))
        except ValueError:
            pass
    return "semester_gpa" if (db.execute(query).scalar() or 0) else "admission_cutoff_proxy"


def get_students_needing_attention(db: Session, limit: int = 5) -> list[dict]:
    """
    Replaces OverviewPage.tsx attention list:
      ORDER BY backlogs DESC, cgpa ASC LIMIT 5
    Uses only imported, outstanding arrear records. Admission cut-off is not
    treated as a proxy for current academic difficulty.
    """
    current_year = get_current_year(db)
    if not current_year:
        return []

    rows = db.execute(
        select(Student, func.count(ArrearRecord.id).label("active_arrears"))
        .join(ArrearRecord, ArrearRecord.student_id == Student.id)
        .where(Student.batch_year == current_year, ArrearRecord.cleared.is_(False))
        .group_by(Student.id)
        .order_by(func.count(ArrearRecord.id).desc(), Student.student_name)
        .limit(limit)
    ).all()

    return [
        {
            "id": row.id,
            "name": row.student_name,
            "roll_no": row.reg_no or row.id_number,
            "active_arrears": active_arrears,
            "batch_year": row.batch_year,
        }
        for row, active_arrears in rows
    ]


# ---------------------------------------------------------------------------
# 3. ACADEMIC PERFORMANCE PAGE KPIs
# ---------------------------------------------------------------------------

def get_academic_kpis(db: Session, batch_year: str | None = None) -> dict:
    """Return real GPA metrics when present; otherwise label admission cutoff only."""
    q = select(SemesterRecord.student_id, func.avg(SemesterRecord.gpa).label("gpa")).join(
        Student, Student.id == SemesterRecord.student_id
    ).where(SemesterRecord.gpa.isnot(None)).group_by(SemesterRecord.student_id)
    if batch_year and batch_year != "all":
        try:
            q = q.where(Student.batch_year == int(batch_year))
        except ValueError:
            pass

    gpa_rows = db.execute(q).all()
    if gpa_rows:
        gpas = [float(row.gpa) for row in gpa_rows]
        return {
            "avg_gpa": round(sum(gpas) / len(gpas), 2),
            "avg_cutoff": None,
            "pass_percentage": None,
            "high_achievers": sum(gpa >= 9 for gpa in gpas),
            "low_performers": sum(gpa < 6 for gpa in gpas),
            "total": len(gpas),
            "data_basis": "semester_gpa",
        }

    cutoff_query = select(func.avg(Student.cutoff_xii_percentage), func.count()).where(
        Student.cutoff_xii_percentage.isnot(None),
        Student.cutoff_xii_percentage > 0,
    )
    if batch_year and batch_year != "all":
        try:
            cutoff_query = cutoff_query.where(Student.batch_year == int(batch_year))
        except ValueError:
            pass
    average_cutoff, total = db.execute(cutoff_query).one()
    return {
        "avg_gpa": None,
        "avg_cutoff": round(average_cutoff, 2) if average_cutoff is not None else None,
        "pass_percentage": None,
        "high_achievers": None,
        "low_performers": None,
        "total": total,
        "data_basis": "admission_cutoff_proxy",
    }


def get_cutoff_distribution_by_batch(db: Session) -> list[dict]:
    """
    Semester-wise average GPA line chart replacement:
    Returns avg cutoff per batch year (until real semester GPA data exists).
    """
    rows = db.execute(
        select(
            Student.batch_year,
            func.avg(Student.cutoff_xii_percentage).label("avg_cutoff"),
            func.max(Student.cutoff_xii_percentage).label("max_cutoff"),
            func.min(Student.cutoff_xii_percentage).label("min_cutoff"),
            func.count().label("count"),
        )
        .where(
            Student.cutoff_xii_percentage.isnot(None),
            Student.cutoff_xii_percentage > 0,
        )
        .group_by(Student.batch_year)
        .order_by(Student.batch_year)
    ).all()
    return [
        {
            "batch_year": r.batch_year,
            "avg_cutoff": round(r.avg_cutoff, 2) if r.avg_cutoff else None,
            "max_cutoff": r.max_cutoff,
            "min_cutoff": r.min_cutoff,
            "count": r.count,
        }
        for r in rows
    ]


# ---------------------------------------------------------------------------
# 4. ANALYTICS PAGE – DISTRIBUTIONS (18 dimensions)
# ---------------------------------------------------------------------------

def _count_by(db: Session, column, batch_year: str | None, extra_filters=None) -> list[dict]:
    """Generic GROUP BY counter for a single column."""
    q = (
        select(column, func.count().label("count"))
        .group_by(column)
        .order_by(func.count().desc())
    )
    if batch_year and batch_year != "all":
        try:
            q = q.where(Student.batch_year == int(batch_year))
        except ValueError:
            pass
    if extra_filters:
        for f in extra_filters:
            q = q.where(f)

    rows = db.execute(q).all()
    return [{"label": str(r[0]) if r[0] else "Unknown", "count": r[1]} for r in rows]


def get_distributions(db: Session, batch_year: str | None = None) -> dict:
    """
    Replaces AnalyticsPage.tsx `dimensions` array –
    18 different distribution charts all computed server-side.
    """
    batch_filter = []
    if batch_year and batch_year != "all":
        try:
            batch_filter = [Student.batch_year == int(batch_year)]
        except ValueError:
            pass

    def cnt(col, extra=None):
        return _count_by(db, col, batch_year, extra)

    # Income category (derived)
    income_rows = db.execute(
        select(Student.annual_income).where(*batch_filter) if batch_filter
        else select(Student.annual_income)
    ).scalars().all()
    income_counts: dict[str, int] = {}
    for inc in income_rows:
        cat = _income_category(inc if inc and inc > 0 else None)
        income_counts[cat] = income_counts.get(cat, 0) + 1

    # Residence normalisation
    res_rows = db.execute(
        select(Student.hosteller_dayscholar).where(*batch_filter) if batch_filter
        else select(Student.hosteller_dayscholar)
    ).scalars().all()
    res_counts: dict[str, int] = {}
    for v in res_rows:
        label = "Hosteller" if v and "host" in str(v).lower() else "Dayscholar"
        res_counts[label] = res_counts.get(label, 0) + 1

    # GPA bands (reuse utility; response also identifies proxy vs actual data)
    cutoff_dist = get_cgpa_distribution(db, batch_year)

    return {
        "gender":         cnt(Student.gender),
        "community":      cnt(Student.community),
        "residence":      [{"label": k, "count": v} for k, v in res_counts.items()],
        "quota":          cnt(Student.admission_quota),
        "first_generation": _count_by(db, Student.first_graduate, batch_year),
        "agriculture":    cnt(Student.agri_background),
        "school_type":    cnt(Student.school_type),
        "income":         [{"label": k, "count": v} for k, v in income_counts.items()],
        "district":       cnt(Student.district),
        "state":          cnt(Student.state),
        "cutoff_bands":   cutoff_dist,
        "cutoff_bands_basis": get_gpa_data_basis(db, batch_year),
        "area_type":      cnt(Student.area_type),
        "religion":       cnt(Student.religion),
        "board_of_study": cnt(Student.board_of_study),
        "medium":         cnt(Student.medium_of_study),
        "studied_tamil":  _count_by(db, Student.studied_tamil_in_xii, batch_year),
        "family_background": cnt(Student.family_background),
        "school_medium":  cnt(Student.x_medium),
    }


# ---------------------------------------------------------------------------
# 5. ANALYTICS – BATCH COMPARE
# ---------------------------------------------------------------------------

def _batch_summary(db: Session, batch_year: int) -> dict:
    rows = db.execute(
        select(Student).where(Student.batch_year == batch_year)
    ).scalars().all()
    if not rows:
        return {"batch_year": batch_year, "count": 0}

    cutoffs = [r.cutoff_xii_percentage for r in rows if r.cutoff_xii_percentage and r.cutoff_xii_percentage > 0]
    male = sum(1 for r in rows if r.gender and r.gender.lower() == "male")
    female = sum(1 for r in rows if r.gender and r.gender.lower() == "female")
    hostel = sum(1 for r in rows if r.hosteller_dayscholar and "host" in r.hosteller_dayscholar.lower())
    first_gen = sum(1 for r in rows if r.first_graduate is True)

    avg_cutoff = sum(cutoffs) / len(cutoffs) if cutoffs else None
    max_cutoff = max(cutoffs) if cutoffs else None
    min_cutoff = min(cutoffs) if cutoffs else None

    return {
        "batch_year": batch_year,
        "count": len(rows),
        "male": male,
        "female": female,
        "hostel_count": hostel,
        "first_gen_count": first_gen,
        "avg_cutoff": round(avg_cutoff, 2) if avg_cutoff else None,
        "max_cutoff": max_cutoff,
        "min_cutoff": min_cutoff,
    }


def get_batch_compare(db: Session, batch1: int, batch2: int) -> dict:
    """
    Replaces AnalyticsPage.tsx compare tab summary cards and charts.
    """
    return {
        "batch1": _batch_summary(db, batch1),
        "batch2": _batch_summary(db, batch2),
    }


# ---------------------------------------------------------------------------
# 6. ANALYTICS – TREND
# ---------------------------------------------------------------------------

def get_trend(db: Session, metric: str = "strength") -> dict:
    """
    Replaces AnalyticsPage.tsx trend tab `trendMetric` computation.
    Metric options: strength | avg_cutoff | hostel_pct | first_gen_pct
    """
    years = get_batch_years(db)
    values = []
    for yr in years:
        summary = _batch_summary(db, yr)
        if metric == "strength":
            values.append(summary["count"])
        elif metric == "avg_cutoff":
            values.append(summary.get("avg_cutoff"))
        elif metric == "hostel_pct":
            pct = (summary["hostel_count"] / summary["count"] * 100) if summary["count"] else 0
            values.append(round(pct, 1))
        elif metric == "first_gen_pct":
            pct = (summary["first_gen_count"] / summary["count"] * 100) if summary["count"] else 0
            values.append(round(pct, 1))
        else:
            values.append(summary["count"])

    return {"years": [str(y) for y in years], "values": values, "metric": metric}


# ---------------------------------------------------------------------------
# 7. STUDENT LIST (with filters & sorting)
# ---------------------------------------------------------------------------

def get_students(
    db: Session,
    batch_year: str | None = None,
    gender: str | None = None,
    residence: str | None = None,
    district: str | None = None,
    search: str | None = None,
    sort_by: str = "name",
    page: int = 1,
    page_size: int = 20,
) -> dict:
    """
    Replaces StudentProfilesPage.tsx filtered / sorted list.
    """
    q = select(Student)

    if batch_year and batch_year != "all":
        try:
            q = q.where(Student.batch_year == int(batch_year))
        except ValueError:
            pass

    if gender and gender != "all":
        q = q.where(func.lower(Student.gender) == gender.lower())

    if residence and residence != "all":
        if residence == "hostel":
            q = q.where(func.lower(Student.hosteller_dayscholar).contains("host"))
        elif residence == "day":
            q = q.where(~func.lower(Student.hosteller_dayscholar).contains("host"))

    if district and district != "all":
        q = q.where(func.lower(Student.district) == district.lower())

    if search:
        term = f"%{search.lower()}%"
        q = q.where(
            func.lower(Student.student_name).like(term)
            | func.lower(Student.id_number).like(term)
            | func.lower(Student.reg_no).like(term)
            | func.lower(Student.district).like(term)
        )

    # Sorting
    sort_col = {
        "name": Student.student_name,
        "batch": Student.batch_year,
        "cutoff": Student.cutoff_xii_percentage,
        "district": Student.district,
    }.get(sort_by, Student.student_name)
    q = q.order_by(sort_col)

    total = db.execute(select(func.count()).select_from(q.subquery())).scalar() or 0
    rows = db.execute(q.offset((page - 1) * page_size).limit(page_size)).scalars().all()

    student_ids = [row.id for row in rows]
    academic = {student_id: {} for student_id in student_ids}
    if student_ids:
        for model, count_key in (
            (SemesterRecord, "semester_count"),
            (AttendanceRecord, "attendance_count"),
            (ArrearRecord, "arrear_count"),
            (PlacementRecord, "placement_count"),
        ):
            counts = db.execute(
                select(model.student_id, func.count())
                .where(model.student_id.in_(student_ids))
                .group_by(model.student_id)
            ).all()
            for student_id, count in counts:
                academic[student_id][count_key] = count

        semesters = db.execute(
            select(
                SemesterRecord.student_id,
                func.avg(SemesterRecord.gpa),
                func.max(SemesterRecord.semester),
                func.sum(SemesterRecord.credits_earned),
                func.sum(SemesterRecord.total_credits),
            )
            .where(SemesterRecord.student_id.in_(student_ids))
            .group_by(SemesterRecord.student_id)
        ).all()
        for student_id, gpa, current_semester, earned, total_credits in semesters:
            academic[student_id].update({
                "cgpa": float(gpa) if gpa is not None else None,
                "current_semester": current_semester,
                "credits_earned": float(earned) if earned is not None else 0,
                "total_credits": float(total_credits) if total_credits is not None else 0,
            })

        attendances = db.execute(
            select(AttendanceRecord.student_id, func.avg(AttendanceRecord.attendance_percentage))
            .where(AttendanceRecord.student_id.in_(student_ids))
            .group_by(AttendanceRecord.student_id)
        ).all()
        for student_id, attendance in attendances:
            academic[student_id]["attendance"] = float(attendance)

        open_arrears = db.execute(
            select(ArrearRecord.student_id, func.count())
            .where(
                ArrearRecord.student_id.in_(student_ids),
                ArrearRecord.cleared.is_(False),
            )
            .group_by(ArrearRecord.student_id)
        ).all()
        for student_id, count in open_arrears:
            academic[student_id]["backlogs"] = count

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "students": [_student_summary(row, academic[row.id]) for row in rows],
    }


def _student_summary(r: Student, academic: dict | None = None) -> dict:
    """Lightweight student object for the list view."""
    academic = academic or {}
    return {
        "id": r.id,
        "name": r.student_name,
        "id_number": r.id_number,
        "reg_no": r.reg_no,
        "batch_year": r.batch_year,
        "gender": r.gender,
        "district": r.district,
        "state": r.state,
        "residence": "Hosteller" if r.hosteller_dayscholar and "host" in str(r.hosteller_dayscholar).lower() else "Dayscholar",
        "cutoff": r.cutoff_xii_percentage,
        "community": r.community,
        "admission_quota": r.admission_quota,
        "first_graduate": r.first_graduate,
        "cgpa": academic.get("cgpa"),
        "attendance": academic.get("attendance"),
        "backlogs": academic.get("backlogs", 0),
        "credits_earned": academic.get("credits_earned", 0),
        "total_credits": academic.get("total_credits", 0),
        "current_semester": academic.get("current_semester"),
        "academic_data_available": any(
            academic.get(count_key, 0)
            for count_key in ("semester_count", "attendance_count", "arrear_count", "placement_count")
        ),
        "gpa_data_available": academic.get("cgpa") is not None,
        "attendance_data_available": academic.get("attendance_count", 0) > 0,
        "arrear_data_available": academic.get("arrear_count", 0) > 0,
    }


def get_student_detail(db: Session, student_id: int) -> dict | None:
    """Full student profile for the modal view."""
    r = db.execute(select(Student).where(Student.id == student_id)).scalar_one_or_none()
    if not r:
        return None

    acts = db.execute(
        select(Activity).where(Activity.student_id == student_id)
    ).scalars().all()
    semesters = db.execute(
        select(SemesterRecord)
        .where(SemesterRecord.student_id == student_id)
        .order_by(SemesterRecord.semester)
    ).scalars().all()
    attendance = db.execute(
        select(AttendanceRecord)
        .where(AttendanceRecord.student_id == student_id)
        .order_by(AttendanceRecord.semester)
    ).scalars().all()
    arrears = db.execute(
        select(ArrearRecord)
        .where(ArrearRecord.student_id == student_id)
        .order_by(ArrearRecord.semester, ArrearRecord.course_code)
    ).scalars().all()
    placements = db.execute(
        select(PlacementRecord).where(PlacementRecord.student_id == student_id)
    ).scalars().all()

    return {
        # Identity
        "id": r.id,
        "name": r.student_name,
        "id_number": r.id_number,
        "reg_no": r.reg_no,
        "dob": str(r.dob) if r.dob else None,
        "gender": r.gender,
        "blood_group": r.blood_group,
        # Socio-cultural
        "nationality": r.nationality,
        "religion": r.religion,
        "community": r.community,
        "caste": r.caste,
        "mother_tongue": r.mother_tongue,
        # Admission
        "batch_year": r.batch_year,
        "admission_type": r.admission_type,
        "admission_quota": r.admission_quota,
        "first_graduate": r.first_graduate,
        "cutoff": r.cutoff_xii_percentage,
        # Address
        "district": r.district,
        "state": r.state,
        "pin_code": r.pin_code,
        "address_comm": r.address_comm,
        "permanent_address": r.permanent_address,
        # Contact
        "mobile": r.mobile_number,
        "whatsapp": r.whatsapp_number,
        "email": r.email,
        # School
        "x_board": r.x_board,
        "x_school": r.x_school_name,
        "x_year": r.x_month_year_passing,
        "x_medium": r.x_medium,
        "x_marks": r.x_mark_scored,
        "xii_board": r.xii_board,
        "xii_school": r.xii_school_name,
        "xii_year": r.xii_month_year_passing,
        "xii_medium": r.xii_medium,
        "xii_marks": r.xii_mark_scored,
        # Subject marks
        "marks": {
            "language": r.marks_language,
            "english": r.marks_english,
            "maths": r.marks_maths,
            "physics": r.marks_physics,
            "chemistry": r.marks_chemistry,
            "biology": r.marks_biology,
            "botany": r.marks_botany,
            "zoology": r.marks_zoology,
            "computer_science": r.marks_computer_science,
            "total": r.marks_total,
        },
        # Family
        "father_name": r.father_guardian_name,
        "father_qualification": r.father_qualification,
        "father_occupation": r.father_occupation,
        "father_mobile": r.father_mobile,
        "mother_name": r.mother_name,
        "mother_qualification": r.mother_qualification,
        "mother_occupation": r.mother_occupation,
        "annual_income": r.annual_income,
        "income_category": _income_category(r.annual_income),
        "crops_planted": r.crops_planted,
        "agri_land_locality": r.agri_land_locality,
        # Background
        "board_of_study": r.board_of_study,
        "medium_of_study": r.medium_of_study,
        "school_type": r.school_type,
        "family_background": r.family_background,
        "agri_land_acres": r.agri_land_availability,
        "area_type": r.area_type,
        "studied_tamil_xii": r.studied_tamil_in_xii,
        "residence": "Hosteller" if r.hosteller_dayscholar and "host" in str(r.hosteller_dayscholar).lower() else "Dayscholar",
        # Activities
        "activities": [
            {
                "category": a.activity_category,
                "name": a.activity_name,
                "level": a.achievement_level,
                "type": a.achievement_type,
                "description": a.achievement_description,
            }
            for a in acts
        ],
        "semester_records": [
            {
                "semester": record.semester,
                "academic_year": record.academic_year,
                "gpa": float(record.gpa) if record.gpa is not None else None,
                "credits_earned": float(record.credits_earned) if record.credits_earned is not None else None,
                "total_credits": float(record.total_credits) if record.total_credits is not None else None,
            }
            for record in semesters
        ],
        "attendance_records": [
            {
                "semester": record.semester,
                "attendance_percentage": float(record.attendance_percentage),
            }
            for record in attendance
        ],
        "arrears": [
            {
                "semester": record.semester,
                "course_code": record.course_code,
                "course_name": record.course_name,
                "cleared": record.cleared,
            }
            for record in arrears
        ],
        "placements": [
            {
                "company": record.company,
                "job_title": record.job_title,
                "status": record.status,
                "package_lpa": float(record.package_lpa) if record.package_lpa is not None else None,
                "placement_date": str(record.placement_date) if record.placement_date else None,
            }
            for record in placements
        ],
    }
