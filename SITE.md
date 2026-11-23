# 젊은사람익스프레스 SEO 사이트 — 기획·운영

광주 포장이사 전문(주소 광주 북구 장운길 49-4 — 푸터·JSON-LD 주소에만 쓰고 "출발지" 표현은 쓰지 않음). 광주 북구(첨단지구 포함)·광산구(수완지구 포함)·서구, 담양·나주·장성.
Next.js 14 정적 export. 코드 구조는 woori_prj 재사용, 디자인은 새 템플릿. node_modules 는 woori_prj 로 junction.

## 확인 필요 (위에서부터)
- [x] **전화번호** — 010-3692-0024 (사용자 제공 2026-11-12, `lib/site.ts` CONTACT.phone). 비우면 전화 버튼·하단 바·JSON-LD telephone 이 자동으로 빠지고 '방문 견적 안내'만 남는다.
- [ ] 오픈일 — 정해지면 `python -I scripts/drip/schedule_posts.py <YYYY-MM-DD>` (블로그 45편 date 채움 + data/drip.json launch)
- [ ] 도메인 → `lib/site.ts` SITE_URL, `data/drip.json` siteUrl (지금 미리보기 `https://xn--4i2b6iw2uw4bba981exkas3bn03e.kr`)
- [ ] 서치어드바이저·서치콘솔 소유확인 코드 (`lib/site.ts` NAVER_VERIFY·GOOGLE_VERIFY, 지금 빈 값)
- [ ] 사업자등록번호 (`BUSINESS.bizNumber`, 넣으면 푸터에 나옴)
- [ ] 업체 사진 추가 — 업체 실제 사진은 shelf.jpg 1장뿐. 차량·작업 사진을 받으면 스톡 대신 히어로·OG에 넣기 (지금은 아래 스톡 사진)
- [ ] GitHub 저장소(deploy 브랜치용 remote) — 아직 없음, 푸시 안 함

## 사실 근거 (source/facts.md, 네이버 플레이스 2074721611)
- 상호는 사용자 지정 **젊은사람익스프레스** (`lib/site.ts` BRAND 한 곳 — og 스크립트도 여기서 읽음). 플레이스 표기 상호는 사이트 어디에도 쓰지 않는다.
- 주소 광주 북구 장운길 49-4. 행정구역은 region_kw_prj/data/regions-kr.json(2026 전남광주통합특별시) 기준 → JSON-LD addressRegion 만 '전남광주통합특별시', 본문은 '광주 북구'.
- 24시간·연중무휴, 방문접수/출장·예약. 서비스 8종: 포장이사·일반이사·원투룸이사·가정이사·보관이사·아파트이사·사무실이사·관공서이사.
- 쓰지 않음: 가격·견적 금액, 경력("오랜 경험"), 리뷰 수, 만족도, "믿을 수 있는" 류 소개 문구. 손해 보상·허가는 일반 설명만.
- 첨단지구: 첨단1·2동(쌍암·월계동 일대)은 광산구, 오룡동 쪽 첨단2지구·광주과학기술원은 북구 — 본문·FAQ 모두 이 기준.
- 사진: raw 4장 중 **02(도서실 책장)만** 사용 → `public/img/shelf.jpg` (아래 운반 대차 부분은 잘라냄). 01은 트럭에 다른 상호 글자, 03·04는 바구니에 다른 상호 로고·전화번호가 보여 제외.

## 스톡 사진 (2026-11-13, `data/stock.json`)
전부 Unsplash License(무료·상업 사용 가능·출처 표기 의무 없음). `public/img/*.webp` (히어로 1920×1080, 나머지 1200×800 으로 잘라 변환).
업체 현장 사진이 아니므로 alt·캡션은 장면 설명만 쓴다("현장", "작업 사진", "시공 사례" 금지). 다른 이삿짐 업체 상호·전화번호·간판이 보이는 사진은 뺐다.

| id | 쓰는 곳 | 출처 | 작가 |
|---|---|---|---|
| hero-boxes | 홈 히어로 + 키워드 페이지 | unsplash.com/photos/bV7WI-AeiTA | Alicia Christin Gerald |
| packing | 이사 종류 포장이사 칸 배경 + 키워드 | unsplash.com/photos/j7vbBmTHmjY | Dina Badamshina |
| truck | 이사 종류 일반이사 + 키워드 | unsplash.com/photos/Jv1swO4FghI | Infinity Movers Cape Coral (사진에 상호 안 보임) |
| moveout | 이사 종류 원투룸이사 + 키워드 | unsplash.com/photos/3BzftacwOzg | Dyana Wing So |
| office | 이사 종류 사무실이사 + 키워드 | unsplash.com/photos/-_QbEWD1If8 | Brooke Balentine (문서 상자 제품 글자만 작게 보임) |
| carry | 홈 짙은 상담 구역 배경 + 키워드 | unsplash.com/photos/x8l4lN6-xd0 | Vitaly Gariev |
| newhome | 홈 주황 마무리 + 키워드 | unsplash.com/photos/HckpKWZTFLw | Alex Tyson |
| boxes | 키워드 | unsplash.com/photos/gh6uXXV9a5I | Andrew Bright |
| emptyroom | 키워드 | unsplash.com/photos/4YhNRgL59Fc | Christian Lue |

키워드 페이지는 `rotate(STOCK, slug, 'img')` 앞 다섯 장 — 히어로 1장 + 요약 상자 바로 아래 사진 줄 3장 + '맞는 경우' 상자 아래 1장(서로 다름, 슬러그마다 고정). 지역·블로그 목록 머리에도 사진 1장.
문구 규칙: 업체 "출발지/○○에서 출발/거리가 멀어" 같은 표현 금지 — "△△까지 방문 견적" 처럼 다니는 범위로 쓴다. 바꾸려면 stock.json 만 고치면 된다.

## 구조
| 경로 | 내용 |
|---|---|
| `/` | 사진 히어로(화면 너비 사진·왼쪽 어둡게·접수표 카드, 모바일은 카드 숨김) → 히어로에 걸친 사진 줄 4장(shelf.jpg 현장 + carry·boxes·newhome) → 이사 종류 모자이크 → 5단계 진행(회색) → 관공서 이사(글) → 지역 칸(회색) → 짙은 상담 구역 → FAQ → 블로그 → 주황 마무리 |
| `/<키워드>/` | 키워드 페이지 1,000 (`lib/compose.ts` 조합기) |
| `/area/`, `/area/<허브>/` | 허브 6곳(광주-북구·광산구·광주-서구·담양·나주·장성) — 열린 페이지 전부로 가는 크롤 경로 |
| `/blog/`, `/blog/<슬러그>/` | 이사 준비 글 45편 (content/blog, date 비움 → 비공개) |
| `/sitemap.xml`, `/robots.txt`, `/rss.xml` | 열린 묶음만 |

## 키워드·오픈 묶음
원본 `keywords/젊은사람익스프레스_키워드.xlsx`(region_kw_prj 복사) '키워드' 시트에서 **'생성 대상' = O** 인 행만 페이지(1,000).
(우선순위, 순번) 순으로 4묶음 각 250(누적 25→50→75→100%).
- 추가 페이지(extra): 엑셀에서 다른 행을 O 로 바꾸고 `build_pages.py` 를 다시 돌리면 기존 페이지 묶음은 그대로, 새 행만 다음 묶음(5, 6…)이 된다 → `data/drip.json` extra 에 `{"wave":5,"date":"YYYY-MM-DD"}`.

```bash
python -I scripts/build_pages.py        # 엑셀 → data/places.json + data/site-pages.json
python -I scripts/make_og.py            # 페이지별 og (public/og, 없는 것만, --force 전부)
OPEN_WAVE=4 npx next build && rm -rf out/blog/_none
python -I ~/.claude/skills/site-launch/scripts/check_all.py C:/side_Prj/youngman_move_prj
python -I scripts/drip/drip_status.py data/drip.json      # launch null → WAVE=0 POST=0
python -I scripts/drip/schedule_posts.py 2026-12-01       # 오픈일 정해지면 (블로그 예약 공개)
bash scripts/deploy.sh <묶음> <https://도메인>            # remote 필요
```
미리보기: `cd out && python -m http.server 18995 --bind 127.0.0.1` → https://xn--4i2b6iw2uw4bba981exkas3bn03e.kr/

## 점검 결과 (2026-11-13 리디자인 후 재점검, OPEN_WAVE=4 — 수치 동일)
check_all 4항목 통과(SEO 구조·중복 문서·AI 티·화면 버그) · 본문 평균 약 1,590자(최소 1,337) · 같은 문장 평균 15% · pseo_lint 바이그램 유사도 평균 0.48 · 조사 오류 0 · design_lint 경고 0 · 390/1366px 가로 넘침 없음.

## 디자인 (2026-11-13 리디자인 — 이사 견적 랜딩 톤)
- 참고: `C:/side_Prj/web_Agency/public/references/moving/index.html` (이사 견적 서비스 랜딩). 빌린 것: 고정 흰 헤더(사각 로고 + 회색 메뉴 + 주황 전화 버튼), 좌글·우시각 2열 히어로(흰→회색), 가운데 정렬 섹션 머리, 흰/회색 교대 리듬, 원형 아이콘을 선으로 잇는 진행 단계, 짙은 상담 구역(왼쪽 안내 + 오른쪽 흰 판), 짙은 푸터 3열, Pretendard 800 제목. 뺀 것: 크림 그라데이션(#FFF7ED), 알약 배지, 통계 숫자(15,000+·98.7%), 후기·가격표(사실 근거 없음), STEP 번호, "지금 바로" 카피.
- 색: 흰 #fff · 회색 #eff1f4 · 남흑 #12161d / #0c0f14 · 강조 주황 #e8590c (#f2f3f5 는 design_lint 베이지 정규식에 걸려 #eff1f4).
- 글꼴: Pretendard 하나(제목 800) + 날짜만 ui-monospace. Noto Serif 링크 제거.
- 버튼: 주황 각진 버튼(반경 4px, 그림자) + 밑줄 텍스트 링크. 알약·라벨 칩·섹션 번호·숫자 띠·마키·이모지·가짜 지도/차트 없음.
- 고유 장치: 화면 너비 사진 히어로(천천히 확대, 왼쪽 어두운 덧칠, 오른쪽 '이사 접수표' 카드; 모바일은 사진이 위에서 아래로 짙어지며 그 위에 글), shelf.jpg 는 관공서 이사 구역으로 옮김(캡션 유지), 이사 종류 4칸에 사진, 짙은 상담 구역 사진 배경, 주황 마무리는 사진+글 2열, 이사 종류 3열 모자이크(포장이사 칸만 짙게·2행), 범위 목록은 회색 칸 + 사각 표시(번호 표시 없앰), 키워드 페이지 요약 상자는 히어로에 걸친 흰 판.
- 파비콘은 이전 진녹 버전 그대로(다음 작업 때 주황으로 맞출 것).

## h1 수식어·레이 구조 적용(2026-11-24)
키워드 페이지 1,000쪽 본문을 레이 모범 구조로: 분류 줄 → h1 `{키워드}` + `.hero-sub` 수식어(수식어 묶음별 3벌) → 설명 → "{키워드} 핵심 요약"(결론 + 안내 4칸) → 번호 절 6개(한 문단, 4개 h2 에 키워드) → "{키워드} 자주 묻는 질문" → "{키워드} 관련 안내"(5+5+3+허브). 조합기 `lib/ray.ts`(재료는 compose.ts 그대로), 점검 `npx tsx scripts/ray_check.ts`.
description 45~80자(키워드 — 집 형태·방문 견적 + 같은 동네 다른 이사 종류 + 전화). title·주소 그대로.
측정: h1 중복 0 · 조사 오류 0 · 절 문단 평균 232자 · description 50~72자 중복 0 · 같은 문장(같은 단어·수식어, 동네 다름) 평균 13% 최대 32%(기존 구조 평균 42% 최대 62%) · (참고: 같은 동네 다른 이사 평균 40%, 기존 30%).
