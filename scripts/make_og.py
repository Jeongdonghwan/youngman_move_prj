"""페이지별 og 이미지(1200x630 JPEG) → public/og/<key>.jpg  (home, area, cases, blog, area-<시구>, <키워드 슬러그>, blog-<글 슬러그>)
   python -I scripts/make_og.py           # 없는 것만 생성
   python -I scripts/make_og.py --force   # 전부 다시
배경 = 진녹색 단색 + 아래 점선 띠(사이트 히어로와 같은 장치), 글자 = 굵은 한글 키워드. 사진은 1장뿐이라 쓰지 않는다.
상호·전화는 lib/site.ts 에서 읽는다(전화가 비어 있으면 상호만).
네이버는 og 이미지를 가운데 정사각형으로 잘라 보여 주므로 글자는 가운데 630px 안쪽에 둔다.
"""
import datetime, json, os, re, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'og'
W, H = 1200, 630
SAFE_L, SAFE_W = 300, 600  # 가운데 정사각형(285~915) 안쪽
BRAND = re.search(r"BRAND = '([^']+)'", open(ROOT / 'lib' / 'site.ts', encoding='utf-8').read()).group(1)  # lib/site.ts 한 곳에서
PHONE = re.search(r"phone: '([^']*)'", open(ROOT / 'lib' / 'site.ts', encoding='utf-8').read()).group(1)
GREEN, ACCENT = (18, 59, 44), (238, 116, 81)  # 진녹색·코랄 (app/globals.css)
# 윈도우는 맑은 고딕, 리눅스(예약 작업)는 Noto CJK — fonts-noto-cjk 패키지
_FONTS = [(r'C:\Windows\Fonts\malgunbd.ttf', r'C:\Windows\Fonts\malgun.ttf'),
          ('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'),
          ('/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc', '/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc')]
BOLD, REG = next((f for f in _FONTS if Path(f[0]).exists()), _FONTS[0])


def fnv(s):  # lib/data.ts hash 와 같은 FNV-1a
    h = 2166136261
    for ch in s:
        h = ((h ^ ord(ch)) * 16777619) & 0xFFFFFFFF
    return h


def base():
    im = Image.new('RGB', (W, H), GREEN)
    d = ImageDraw.Draw(im)
    for x in range(0, W, 46):
        d.rectangle((x, H - 16, x + 34, H), fill=(11, 38, 28))
    return im


def wrap(d, text, font, maxw):
    lines, cur = [], ''
    for w in text.split():
        t = (cur + ' ' + w).strip()
        if d.textlength(t, font=font) <= maxw:
            cur = t
        else:
            lines.append(cur); cur = w
    return lines + [cur] if cur else lines


def render(bases, key, title, sub):
    im = bases[0].copy()
    d = ImageDraw.Draw(im)
    size = 76
    while True:
        f = ImageFont.truetype(BOLD, size)
        lines = wrap(d, title, f, SAFE_W)
        if (len(lines) <= 3 and all(d.textlength(x, font=f) <= SAFE_W for x in lines)) or size <= 40:
            break
        size -= 4
    y = 300 - len(lines) * size * 0.62
    d.rectangle((SAFE_L, y - 34, SAFE_L + 70, y - 26), fill=ACCENT)
    for ln in lines:
        d.text((SAFE_L, y), ln, font=f, fill='white'); y += size * 1.2
    d.text((SAFE_L, y + 14), sub, font=ImageFont.truetype(REG, 28), fill=(205, 222, 213))
    d.text((SAFE_L, 540), f'{BRAND}  ·  {PHONE}' if PHONE else BRAND, font=ImageFont.truetype(BOLD, 28), fill=ACCENT)
    im.save(OUT / f'{key}.jpg', 'JPEG', quality=80, optimize=True, progressive=True)


def blog_posts():  # content/blog/*.md ('_' 시작 = 비공개, 공개일이 빌드일보다 미래면 제외 — lib/blog.ts 와 같은 규칙) → [(slug, title)]
    today = os.environ.get('BUILD_DATE') or (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=9)).strftime('%Y-%m-%d')
    out = []
    for f in sorted((ROOT / 'content' / 'blog').glob('[!_]*.md')):
        head = f.read_text(encoding='utf-8').split('\n---', 1)[0]  # 첫 '---' ~ 닫는 '---' 앞
        meta = dict(re.findall(r'^(\w+):\s*(.*?)\s*$', head, re.M))
        date = meta.get('date') or meta.get('publishedAt') or ''
        if meta.get('slug') and meta.get('title') and re.fullmatch(r'\d{4}-\d{2}-\d{2}', date) and date <= today:
            out.append((meta['slug'], meta['title'].strip('\'"')))
    return out


def main():
    force = '--force' in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    pages = json.loads((ROOT / 'data' / 'site-pages.json').read_text(encoding='utf-8'))['pages']
    hubs = json.loads((ROOT / 'data' / 'places.json').read_text(encoding='utf-8'))['hubOrder']
    jobs = [('home', '광주 포장이사, 상담부터 정리까지', '견적 상담 · 방문 견적 · 포장 · 운반 · 정리'),
            ('area', '이사 지역 안내', '광주 북구·광산구·서구 · 담양 · 나주 · 장성'),
            ('blog', '이사 준비 블로그', '체크리스트 · 보관이사 · 원룸 짐 줄이기')] +            [(f"area-{h.replace(' ', '-')}", f'{h} 이사 지역 안내', '포장이사 · 원룸이사 · 사무실이사') for h in hubs] +            [(p['slug'], p['kw'], '방문 견적 · 포장 · 운반 · 정리') for p in pages] +            [(f'blog-{s}', t, '이사 준비 블로그') for s, t in blog_posts()]
    jobs = [j for j in jobs if force or not (OUT / f'{j[0]}.jpg').exists()]
    bases = [base()]
    for i, (key, title, sub) in enumerate(jobs, 1):
        render(bases, key, title, sub)
        if i % 200 == 0:
            print(i, '/', len(jobs))
    print('생성', len(jobs))


if __name__ == '__main__':
    assert fnv('a') == 0xE40C292C  # FNV-1a 기준값
    main()
