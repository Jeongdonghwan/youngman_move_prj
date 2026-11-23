// 사이트 설정 — 상호·연락처·주소·도메인은 이 파일만 고치면 전 페이지에 반영된다.
// 근거: source/facts.md (네이버 플레이스 2074721611 수집 2026-11-12). 상호는 사용자 지정 — 플레이스 표기 상호는 쓰지 않는다.

// 미리보기 주소(임시). 도메인이 정해지면 SITE_URL 과 data/drip.json siteUrl 을 같이 바꾼다.
export const SITE_URL = process.env.SITE_URL || 'https://xn--4i2b6iw2uw4bba981exkas3bn03e.kr';
export const BRAND = '젊은사람익스프레스'; // 상호 — 여기 한 곳만 바꾸면 된다 (og 이미지는 scripts/make_og.py 가 이 줄을 읽음)
export const SITE_NAME = `${BRAND} | 광주 포장이사·원룸이사·사무실이사`;

export const CONTACT = {
  // 비우면('') 전화 버튼·하단 바·JSON-LD telephone 이 모두 빠지고 방문 견적 안내만 나온다
  phone: '010-3692-0024', // 사용자 제공 2026-11-12 (플레이스는 번호 비공개)
  hours: '24시간 · 연중무휴',
  intake: '방문 견적 · 예약 접수',
};

export const BUSINESS = {
  name: BRAND,
  address: '광주 북구 장운길 49-4', // 본문 표기
  sido: '전남광주통합특별시', // 2026 통합 행정구역 (JSON-LD addressRegion)
  locality: '북구',
  street: '장운길 49-4',
  bizNumber: '', // TODO 사업자등록번호 (받으면 푸터에 표시)
};

export const SERVICES = ['포장이사', '일반이사', '원투룸이사', '가정이사', '보관이사', '아파트이사', '사무실이사', '관공서이사'];

// 순차 오픈: 이 묶음 이하의 페이지만 빌드·사이트맵·내부링크에 포함된다 (data/drip.json, scripts/drip/drip_status.py)
export const OPEN_WAVE = Number(process.env.OPEN_WAVE || 1);
export const UPDATED = '2026-11-24'; // content revision date - bump when page text changes

const digits = CONTACT.phone.replace(/[^0-9]/g, '');
export const hasPhone = digits.length >= 9;
export const tel = hasPhone ? `tel:${digits}` : '';
export const smsHref = hasPhone ? `sms:${digits}` : '';
export const absUrl = (path: string) => `${SITE_URL}${path}`;

// og·트위터 카드: public/og/<key>.jpg (scripts/make_og.py 로 생성)
export const shareMeta = (key: string, alt: string, o: { title?: string; description?: string; url?: string } = {}) => {
  const images = [{ url: `${SITE_URL}/og/${encodeURIComponent(key)}.jpg`, width: 1200, height: 630, alt }];
  return {
    openGraph: { type: 'website' as const, siteName: SITE_NAME, locale: 'ko_KR', ...o, images },
    twitter: { card: 'summary_large_image' as const, title: o.title, description: o.description, images },
  };
};

// 서치어드바이저(네이버)·서치콘솔(구글) HTML 태그 소유확인 — content 값만 (도메인 확정 후 받기)
export const NAVER_VERIFY = 'e28467cd357538f05b765c74c7dd709904f158ca';
export const GOOGLE_VERIFY = '8BOmJKBhboFJhnt2cxsMeiUccj2VF_8FDjrUF5SjK6c';
