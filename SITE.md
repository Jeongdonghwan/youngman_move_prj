# 젊은사람익스프레스 SEO 사이트 — 기획·운영

광주 포장이사 전문(광주 북구 장운길 49-4 출발). 광주 북구(첨단지구 포함)·광산구(수완지구 포함)·서구, 담양·나주·장성.
Next.js 14 정적 export. 코드 구조는 woori_prj 재사용, 디자인은 새 템플릿. node_modules 는 woori_prj 로 junction.

## 확인 필요 (위에서부터)
- [x] **전화번호** — 010-3692-0024 (사용자 제공 2026-11-12, `lib/site.ts` CONTACT.phone). 비우면 전화 버튼·하단 바·JSON-LD telephone 이 자동으로 빠지고 '방문 견적 안내'만 남는다.
- [ ] 오픈일 — 정해지면 `python -I scripts/drip/schedule_posts.py <YYYY-MM-DD>` (블로그 45편 date 채움 + data/drip.json launch)
- [ ] 도메인 → `lib/site.ts` SITE_URL, `data/drip.json` siteUrl (지금 미리보기 `http://127.0.0.1:18995`)
- [ ] 서치어드바이저·서치콘솔 소유확인 코드 (`lib/site.ts` NAVER_VERIFY·GOOGLE_VERIFY, 지금 빈 값)
- [ ] 사업자등록번호 (`BUSINESS.bizNumber`, 넣으면 푸터에 나옴)
- [ ] 업체 사진 추가 — 지금 쓸 수 있는 사진이 1장뿐(아래). 차량·작업 사진을 받으면 히어로·OG에 넣기
- [ ] GitHub 저장소(deploy 브랜치용 remote) — 아직 없음, 푸시 안 함

## 사실 근거 (source/facts.md, 네이버 플레이스 2074721611)
- 상호는 사용자 지정 **젊은사람익스프레스** (`lib/site.ts` BRAND 한 곳 — og 스크립트도 여기서 읽음). 플레이스 표기 상호는 사이트 어디에도 쓰지 않는다.
- 주소 광주 북구 장운길 49-4. 행정구역은 region_kw_prj/data/regions-kr.json(2026 전남광주통합특별시) 기준 → JSON-LD addressRegion 만 '전남광주통합특별시', 본문은 '광주 북구'.
- 24시간·연중무휴, 방문접수/출장·예약. 서비스 8종: 포장이사·일반이사·원투룸이사·가정이사·보관이사·아파트이사·사무실이사·관공서이사.
- 쓰지 않음: 가격·견적 금액, 경력("오랜 경험"), 리뷰 수, 만족도, "믿을 수 있는" 류 소개 문구. 손해 보상·허가는 일반 설명만.
- 첨단지구: 첨단1·2동(쌍암·월계동 일대)은 광산구, 오룡동 쪽 첨단2지구·광주과학기술원은 북구 — 본문·FAQ 모두 이 기준.
- 사진: raw 4장 중 **02(도서실 책장)만** 사용 → `public/img/shelf.jpg` (아래 운반 대차 부분은 잘라냄). 01은 트럭에 다른 상호 글자, 03·04는 바구니에 다른 상호 로고·전화번호가 보여 제외.

## 구조
| 경로 | 내용 |
|---|---|
| `/` | 히어로(송장 카드) → 5단계 타임라인(진녹 띠) → 이사 종류 가로 레일 → 사진+관공서 이사 → 지역 목록 → 코랄 띠 → FAQ → 블로그 → 마무리 |
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
미리보기: `cd out && python -m http.server 18995 --bind 127.0.0.1` → http://127.0.0.1:18995/

## 점검 결과 (2026-11-12, OPEN_WAVE=4)
check_all 4항목 통과(SEO 구조·중복 문서·AI 티·화면 버그) · 본문 평균 약 1,590자(최소 1,337) · 같은 문장 평균 15% · pseo_lint 바이그램 유사도 평균 0.48 · 조사 오류 0 · design_lint 경고 0 · 390/1366px 가로 넘침 없음.

## 디자인 (생활 서비스 — 새 템플릿)
- 색: 흰 #fff · 민트회색 #edf2ef · 진녹 #123b2c / #0b261c · 강조 코랄 #ee7451 (베이지 없음). 다른 작업자 사이트(비계 그라파이트+노랑, 스카이 검정+주황, 누수 흰+청록/남색+빨강, 호이스트 회색+도면)와 겹치지 않게.
- 글꼴: Pretendard 800(제목) + Noto Serif KR 700(타임라인 단계명만).
- 버튼: 각진 진녹 슬랩 + 코랄 오프셋 그림자(호버 때 눌림). 보조는 밑줄 링크. 알약·라벨 칩·섹션 번호·숫자 띠·마키·이모지 없음.
- 고유 장치: 히어로 오른쪽 '이사 접수표' 송장 카드(위쪽 톱니 절취선, 모바일에서 제목 위로), 히어로 아래 점선 띠, 5단계 타임라인(진행선이 코랄로 채워짐), 이사 종류 가로 레일(세로 선 구분), 범위 목록 01~04.
- 참고: web-design 4번 로컬 서비스 프리셋(표면 리듬), woori_prj(구조), 송장·이삿짐 라벨(시각 모티프).
- 파비콘: 진녹 사각 + 흰 상자 윤곽 + 코랄 띠 (app/icon.png·apple-icon.png·public/favicon.ico).
