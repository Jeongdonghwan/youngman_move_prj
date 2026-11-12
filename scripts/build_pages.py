"""키워드 엑셀 → data/places.json + data/site-pages.json (사이트 라우트의 단일 출처)

  python -I scripts/build_pages.py

원본: keywords/젊은사람익스프레스_키워드.xlsx '키워드' 시트 — '생성 대상' 열이 O 인 행만 페이지가 된다.
오픈 묶음(wave):
  - 처음 빌드: O 행 전부를 (우선순위, 순번) 순서로 4묶음(누적 25→50→75→100%)
  - 다시 빌드: 이미 있는 페이지는 묶음을 그대로 두고, 새로 O 로 표시한 행만 '다음 묶음'(5, 6, …)으로 붙인다
    → data/drip.json extra 에 {"wave": 5, "date": "YYYY-MM-DD"} 를 넣으면 그날 열린다.
"""
import json, sys
from collections import Counter
from pathlib import Path
from openpyxl import load_workbook

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE)); sys.path.insert(0, str(HERE / 'drip'))
from places_src import places, dump  # noqa: E402
from rebatch import rebatch  # noqa: E402

ROOT = HERE.parent
SRC = ROOT / 'keywords' / '젊은사람익스프레스_키워드.xlsx'
OUT = ROOT / 'data' / 'site-pages.json'

PL = places()
dump(ROOT / 'data' / 'places.json')

ws = load_workbook(SRC, read_only=True)['키워드']
rows = list(ws.iter_rows(values_only=True))
H = {h: i for i, h in enumerate(rows[0])}
want = []
for r in rows[1:]:
    if (r[H['생성 대상']] or '').strip() != 'O':
        continue
    place = r[H['지역(대표)']]
    assert place in PL, f'지역 데이터 없음: {place}'
    alt = [a.strip() for a in (r[H['표기변형(alt)']] or '').split('|') if a.strip()]
    want.append(dict(n=r[H['순번']], kw=r[H['키워드']], slug=r[H['슬러그']], place=place, hub=PL[place]['hub'], unit=r[H['지역단위']],
                     word=r[H['단어']], mod=r[H['수식어']] or '', prio=r[H['우선순위']], alt=alt))
want.sort(key=lambda p: (p['prio'], p['n']))
assert len({p['slug'] for p in want}) == len(want), '슬러그 중복'

old = {p['slug']: p for p in json.load(open(OUT, encoding='utf-8'))['pages']} if OUT.exists() else {}
if not old:
    for i, p in enumerate(want, 1):
        p['no'], p['wave'] = i, 1
    rebatch(want, plan=[25, 50, 75, 100])
else:
    nxt = max(p['wave'] for p in old.values()) + 1
    for i, p in enumerate(want, 1):
        p['no'] = i
        p['wave'] = old[p['slug']]['wave'] if p['slug'] in old else nxt
json.dump({'pages': want}, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

sys.stdout.reconfigure(encoding='utf-8')
c = Counter(p['wave'] for p in want)
acc = 0
for w in sorted(c):
    acc += c[w]
    print(f'묶음 {w}: {c[w]} (누적 {acc}) {dict(Counter(p["unit"] for p in want if p["wave"] == w))}')
