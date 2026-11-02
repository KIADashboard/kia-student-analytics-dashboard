"""
seed_sqlite_test.py – Validates the seed logic against a local SQLite DB.
Run this to verify the seed before Docker is ready.

Usage:
  python backend/seed/seed_sqlite_test.py
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

# Override DATABASE_URL to SQLite for local testing
os.environ['DATABASE_URL'] = 'sqlite:///./kia_test.db'

# Monkey-patch the engine in database.py
from app.models import database as db_mod
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

db_mod.engine = create_engine('sqlite:///./kia_test.db', connect_args={"check_same_thread": False})
db_mod.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_mod.engine)

from pathlib import Path
from seed.seed_students import seed, engine, Session, Base, Student, Activity

# Re-point seed's engine
import seed.seed_students as seed_mod
seed_mod.engine = db_mod.engine
seed_mod.Session = db_mod.SessionLocal
seed_mod.Base.metadata.bind = db_mod.engine

from sqlalchemy import text as _text

EXCEL = Path(__file__).resolve().parent.parent.parent / 'src' / 'assets' / 'master_students.xlsx'

if __name__ == '__main__':
    Base.metadata.create_all(bind=db_mod.engine)
    seed(EXCEL)

    # Verify
    with db_mod.SessionLocal() as s:
        total = s.execute(_text('SELECT COUNT(*) FROM students')).scalar()
        acts  = s.execute(_text('SELECT COUNT(*) FROM activities')).scalar()
        years = s.execute(_text('SELECT DISTINCT batch_year FROM students ORDER BY batch_year')).fetchall()
        male  = s.execute(_text("SELECT COUNT(*) FROM students WHERE gender='Male'")).scalar()
        female= s.execute(_text("SELECT COUNT(*) FROM students WHERE gender='Female'")).scalar()
        print(f'\n=== VALIDATION ===')
        print(f'Total students : {total}')
        print(f'Activities     : {acts}')
        print(f'Batch years    : {[r[0] for r in years]}')
        print(f'Male / Female  : {male} / {female}')
        sample = s.execute(_text('SELECT student_name, batch_year, district, cutoff_xii_percentage FROM students LIMIT 5')).fetchall()
        print(f'\nSample rows:')
        for r in sample:
            print(f'  {r}')
