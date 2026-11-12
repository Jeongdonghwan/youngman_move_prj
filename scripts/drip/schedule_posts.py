"""오픈일이 정해지면 써 둔 블로그 글에 공개 날짜를 매긴다 (예약 공개).

  python -I scripts/drip/schedule_posts.py <오픈일 YYYY-MM-DD> [--dry]

- 순서 = content/blog/_data/keywordQueue.json 의 done 글 순서. 날짜별 편수는 drip_status.py 와 같은 규칙
  (data/drip.json postsPerDay·postDays — 1.5 면 하루 1·2편 번갈아, 30일 45편).
- 각 글 프런트매터 date·publishedAt 을 채우고, 큐 publishedAt 도 같이 적는다. data/drip.json launch 도 이 날짜로.
- 빌드일(KST 오늘)보다 미래 날짜 글은 lib/blog.ts 가 알아서 숨긴다 → 매일 빌드만 하면 하루 1~2편씩 열린다.
"""
import datetime as dt, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))
from drip_status import status  # noqa: E402


def dates(cfg, launch, n):
    out, d = [], dt.date.fromisoformat(launch)
    c = {**cfg, 'launch': launch, 'hold': None}
    for _ in range(cfg.get('postDays', 30) * 2):
        out += [d.isoformat()] * status(c, d)[1]
        d += dt.timedelta(days=1)
        if len(out) >= n:
            break
    return out[:n] + [out[-1]] * max(0, n - len(out))  # 글이 더 많으면 마지막 날에 몰아 둔다


def main():
    if len(sys.argv) < 2:
        cfg = {'everyDays': 2, 'maxWave': 4, 'postDays': 30, 'postsPerDay': 1.5}
        ds = dates(cfg, '2026-12-01', 45)
        assert ds[0] == '2026-12-01' and ds[1] == ds[2] == '2026-12-02' and ds[-1] == '2026-12-30', ds
        print('demo ok'); return
    launch = sys.argv[1]
    dt.date.fromisoformat(launch)
    cfg_path = ROOT / 'data' / 'drip.json'
    cfg = json.load(open(cfg_path, encoding='utf-8'))
    qpath = ROOT / 'content' / 'blog' / '_data' / 'keywordQueue.json'
    Q = json.load(open(qpath, encoding='utf-8'))
    done = [q for q in Q['queue'] if q['status'] == 'done' and q.get('publishedSlug')]
    ds = dates(cfg, launch, len(done))
    for q, d in zip(done, ds):
        f = ROOT / 'content' / 'blog' / f"{q['publishedSlug']}.md"
        s = f.read_text(encoding='utf-8')
        s = re.sub(r'^date:.*$', f'date: {d}', s, count=1, flags=re.M)
        s = re.sub(r'^publishedAt:.*$', f'publishedAt: {d}', s, count=1, flags=re.M)
        if '--dry' not in sys.argv:
            f.write_text(s, encoding='utf-8', newline='\n')
        q['publishedAt'] = d
    print(f'{len(done)}편: {ds[0]} ~ {ds[-1]}')
    if '--dry' not in sys.argv:
        json.dump(Q, open(qpath, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        cfg['launch'] = launch
        json.dump(cfg, open(cfg_path, 'w', encoding='utf-8'), ensure_ascii=False)
        print('저장: 글 프런트매터 · keywordQueue.json · data/drip.json launch')


if __name__ == '__main__':
    main()
