from pathlib import Path

from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, inspect, text


def test_initial_migration_is_repeatable_and_records_version(tmp_path, monkeypatch):
    database = tmp_path / "migration-test.db"
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{database.as_posix()}")
    config = Config(str(Path(__file__).resolve().parents[1] / "alembic.ini"))

    command.upgrade(config, "head")
    command.upgrade(config, "head")

    engine = create_engine(f"sqlite:///{database.as_posix()}")
    try:
        tables = set(inspect(engine).get_table_names())
        assert {
            "students",
            "users",
            "semester_records",
            "attendance_records",
            "arrear_records",
            "placement_records",
            "alembic_version",
        }.issubset(tables)
        with engine.connect() as connection:
            revision = connection.execute(text("SELECT version_num FROM alembic_version")).scalar_one()
        assert revision == "0001_initial_schema"
    finally:
        engine.dispose()
