from app.models.database import SessionLocal
from app.models.schema import Student, User
from app.api.routers.students import StudentUpdate
from app.services.auth_service import hash_password


def create_student(client, headers, **overrides):
    body = {
        "batch_year": 2024,
        "student_name": "Test Student",
        "id_number": "KIA-TEST-001",
        "email": "student@test.kia",
    }
    body.update(overrides)
    response = client.post("/api/students", json=body, headers=headers)
    assert response.status_code == 201, response.text
    return response.json()


def test_student_endpoints_require_admin(client):
    assert client.get("/api/students").status_code == 401
    assert client.post("/api/students", json={}).status_code == 401


def test_student_update_schema_covers_all_profile_columns():
    assert set(StudentUpdate.model_fields) == {
        column.name for column in Student.__table__.columns if column.name != "id"
    }


def test_admin_can_create_update_list_and_delete_student(client, admin_headers):
    created = create_student(client, admin_headers)
    student_id = created["id"]
    assert created["id_number"] == "KIA-TEST-001"

    listed = client.get("/api/students", headers=admin_headers).json()
    assert listed["total"] == 1
    assert listed["students"][0]["id"] == student_id

    updated = client.patch(
        f"/api/students/{student_id}",
        json={"student_name": "Updated Student"},
        headers=admin_headers,
    )
    assert updated.status_code == 200
    assert updated.json()["name"] == "Updated Student"

    deleted = client.delete(f"/api/students/{student_id}", headers=admin_headers)
    assert deleted.status_code == 204
    assert client.get(f"/api/students/{student_id}", headers=admin_headers).status_code == 404


def test_student_crud_validates_duplicates_and_missing_rows(client, admin_headers):
    create_student(client, admin_headers)
    duplicate = client.post(
        "/api/students",
        json={"batch_year": 2024, "student_name": "Duplicate", "id_number": "KIA-TEST-001"},
        headers=admin_headers,
    )
    assert duplicate.status_code == 409
    assert client.patch("/api/students/9999", json={"gender": "F"}, headers=admin_headers).status_code == 404
    assert client.patch("/api/students/1", json={}, headers=admin_headers).status_code == 422


def test_student_with_login_account_cannot_be_deleted(client, admin_headers):
    student = create_student(client, admin_headers)
    with SessionLocal() as db:
        db.add(User(
            email="student@test.kia",
            password_hash=hash_password("student-test-password"),
            role="student",
            student_id=student["id"],
        ))
        db.commit()

    response = client.delete(f"/api/students/{student['id']}", headers=admin_headers)
    assert response.status_code == 409
    assert "login account" in response.json()["detail"]


def test_academic_csv_import_export_and_student_permissions(client, admin_headers):
    student = create_student(client, admin_headers, cutoff_xii_percentage=180)
    student_id = student["id"]
    cutoff_kpis = client.get("/api/kpis/academic", headers=admin_headers).json()
    assert cutoff_kpis["data_basis"] == "admission_cutoff_proxy"
    assert cutoff_kpis["avg_cutoff"] == 180
    assert cutoff_kpis["high_achievers"] is None

    imported = client.post(
        "/api/academic/import/semester.csv",
        files={"file": ("semester.csv", "id_number,semester,academic_year,gpa,credits_earned,total_credits\nKIA-TEST-001,1,2024-25,8.5,20,22\n", "text/csv")},
        headers=admin_headers,
    )
    assert imported.status_code == 200, imported.text
    assert imported.json() == {"inserted": 1, "updated": 0, "total": 1}

    updated = client.post(
        "/api/academic/import/semester.csv",
        files={"file": ("semester.csv", "id_number,semester,academic_year,gpa,credits_earned,total_credits\nKIA-TEST-001,1,2024-25,9.0,22,22\n", "text/csv")},
        headers=admin_headers,
    )
    assert updated.status_code == 200
    assert updated.json()["updated"] == 1

    records = client.get(f"/api/academic/students/{student_id}", headers=admin_headers)
    assert records.status_code == 200
    assert records.json()["semesters"][0]["gpa"] == 9.0
    gpa_distribution = client.get(
        "/api/charts/cgpa-distribution",
        headers=admin_headers,
    ).json()
    assert gpa_distribution["data_basis"] == "semester_gpa"
    assert next(
        band["count"] for band in gpa_distribution["data"]
        if band["label"] == "9 and above"
    ) == 1
    academic_kpis = client.get("/api/kpis/academic", headers=admin_headers).json()
    assert academic_kpis["data_basis"] == "semester_gpa"
    assert academic_kpis["avg_gpa"] == 9.0
    assert academic_kpis["avg_cutoff"] is None
    exported = client.get("/api/academic/export/semester.csv", headers=admin_headers)
    assert exported.status_code == 200
    assert "KIA-TEST-001" in exported.text

    with SessionLocal() as db:
        db.add(User(
            email="student@test.kia",
            password_hash=hash_password("student-test-password"),
            role="student",
            student_id=student_id,
        ))
        db.commit()
    login = client.post(
        "/api/auth/login",
        json={"email": "student@test.kia", "password": "student-test-password"},
    )
    student_headers = {"Authorization": f"Bearer {login.json()['access_token']}"}
    assert client.get(f"/api/academic/students/{student_id}", headers=student_headers).status_code == 200
    assert client.get("/api/academic/students/9999", headers=student_headers).status_code == 403
    assert client.post(
        "/api/academic/import/semester.csv",
        files={"file": ("semester.csv", "id_number,semester,gpa\nKIA-TEST-001,2,7.0\n", "text/csv")},
        headers=student_headers,
    ).status_code == 403


def test_invalid_academic_csv_is_transactional(client, admin_headers):
    create_student(client, admin_headers)
    response = client.post(
        "/api/academic/import/attendance.csv",
        files={"file": ("attendance.csv", "id_number,semester,attendance_percentage\nKIA-TEST-001,1,95\nKIA-TEST-001,2,140\n", "text/csv")},
        headers=admin_headers,
    )
    assert response.status_code == 422
    records = client.get("/api/academic/students/1", headers=admin_headers).json()
    assert records["attendance"] == []


def test_all_academic_record_import_types_are_upsertable(client, admin_headers):
    student = create_student(client, admin_headers)
    csv_files = {
        "attendance": "id_number,semester,attendance_percentage\nKIA-TEST-001,1,92.5\n",
        "arrears": "id_number,semester,course_code,course_name,cleared\nKIA-TEST-001,1,CS101,Programming,no\n",
        "placements": "id_number,company,job_title,status,package_lpa,placement_date\nKIA-TEST-001,Acme,Engineer,Placed,8.5,2026-05-01\n",
    }
    for record_type, content in csv_files.items():
        response = client.post(
            f"/api/academic/import/{record_type}.csv",
            files={"file": (f"{record_type}.csv", content, "text/csv")},
            headers=admin_headers,
        )
        assert response.status_code == 200, response.text
        assert response.json()["inserted"] == 1
        assert response.json()["updated"] == 0

    records = client.get(
        f"/api/academic/students/{student['id']}",
        headers=admin_headers,
    ).json()
    assert records["attendance"][0]["attendance_percentage"] == 92.5
    assert records["arrears"][0]["course_code"] == "CS101"
    assert records["placements"][0]["company"] == "Acme"
