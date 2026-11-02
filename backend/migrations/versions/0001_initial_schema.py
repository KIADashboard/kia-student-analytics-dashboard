"""Create or baseline the dashboard schema.

For an existing installation, create_all adds new tables without replacing
existing data. This baseline is intentionally irreversible; later migrations
should provide targeted reversible changes.
"""
from alembic import op
from sqlalchemy import inspect

from app.models.database import Base
from app.models import schema  # noqa: F401

revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    Base.metadata.create_all(bind=bind)
    if bind.dialect.name == "postgresql":
        columns = {column["name"]: column for column in inspect(bind).get_columns("students")}
        blood_group = columns.get("blood_group")
        if blood_group and 0 < (getattr(blood_group["type"], "length", None) or 0) < 30:
            op.alter_column(
                "students",
                "blood_group",
                existing_type=blood_group["type"],
                type_=schema.Student.__table__.c.blood_group.type,
                existing_nullable=True,
            )


def downgrade() -> None:
    raise RuntimeError("The initial schema baseline cannot be downgraded without risking data loss.")
