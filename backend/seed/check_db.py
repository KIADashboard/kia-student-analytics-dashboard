import sys
sys.path.insert(0, r'D:\KIA\kia-student-analytics-dashboard\backend')
from sqlalchemy import create_engine, text
engine = create_engine('sqlite:///./kia_test.db', connect_args={'check_same_thread':False})
with engine.connect() as c:
    rows = c.execute(text('SELECT batch_year, COUNT(*) total, COUNT(cutoff_xii_percentage) with_cutoff, AVG(cutoff_xii_percentage) avg_co FROM students GROUP BY batch_year ORDER BY batch_year')).fetchall()
    print('batch | total | with_cutoff | avg_cutoff')
    for r in rows:
        print(f' {r[0]}  | {r[1]:5} | {r[2]:11} | {round(r[3],2) if r[3] else None}')
    print()
    r2 = c.execute(text('SELECT hosteller_dayscholar, COUNT(*) as cnt FROM students GROUP BY hosteller_dayscholar')).fetchall()
    print('Residence breakdown:', r2)
    print()
    r3 = c.execute(text('SELECT community, COUNT(*) cnt FROM students GROUP BY community ORDER BY cnt DESC LIMIT 8')).fetchall()
    print('Community top 8:', r3)
    print()
    r4 = c.execute(text('SELECT district, COUNT(*) cnt FROM students GROUP BY district ORDER BY cnt DESC LIMIT 8')).fetchall()
    print('District top 8:', r4)
