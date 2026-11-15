// 공통 UI — 이모지 없이 선 아이콘, 각진 주황 버튼(반경 4px), 그림자 진 접수표 카드, 원형 아이콘 진행 단계.
// 전화번호가 비어 있으면(lib/site.ts CONTACT.phone = '') 전화 버튼·하단 바가 빠지고 방문 견적 안내만 남는다.
import Link from 'next/link';
import { BRAND, CONTACT, BUSINESS, UPDATED, tel, smsHref, hasPhone } from '../lib/site';

export const JsonLd = ({ data }: { data: object | object[] }) => (
  <>{(Array.isArray(data) ? data : [data]).map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }} />)}</>
);

export const Svg = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
export const IconPhone = () => <Svg d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />;
export const IconMsg = () => <Svg d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
export const IconArrow = () => <Svg d="M5 12h14M13 6l6 6-6 6" size={16} />;
export const IconBox = () => <Svg d="M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8" />;

// 주 행동 1개(전화 슬랩) + 보조 텍스트 링크. 전화가 없으면 방문 견적 안내 링크만.
export const Actions = ({ sms = true, children }: { sms?: boolean; children?: React.ReactNode }) => (
  <div className="actions">
    {hasPhone
      ? <a className="btn" href={tel}><IconPhone /><span>{CONTACT.phone}</span></a>
      : <Link className="btn" href="/#visit"><IconBox /><span>방문 견적 안내</span></Link>}
    {children}
    {sms && hasPhone && <a className="btn-text" href={smsHref}><IconMsg /><span>이삿날·주소 문자로 보내기</span><IconArrow /></a>}
  </div>
);

// 송장 모양 정보 카드 — 히어로 시각 요소 (라벨 칩 대신 dl)
export const Label = ({ rows, title = '이사 접수표' }: { rows: [string, string][]; title?: string }) => (
  <aside className="label" aria-label={title} data-reveal>
    <p className="label-top"><b>{BRAND}</b><span>{title}</span></p>
    <dl>{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
    <p className="label-foot">{CONTACT.hours}</p>
  </aside>
);

export const SectionHead = ({ title, sub, center }: { title: string; sub?: string; center?: boolean }) => (
  <header className={center ? 'sh c' : 'sh'} data-reveal>
    <h2>{title}</h2>
    {sub && <p>{sub}</p>}
  </header>
);

// 5단계 진행 — 견적 상담 → 방문 견적 → 포장 → 운반 → 정리 (단계마다 선 아이콘, 번호 없음)
const STEP_ICONS = [
  'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z',
  'M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6',
  'M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  'M1 6h13v10H1zM14 10h4l3 3v3h-7M5.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  'M20 6L9 17l-5-5',
];
export const Flow = ({ steps }: { steps: { t: string; d: string }[] }) => (
  <ol className="flow reveal-group">
    {steps.map((x, i) => <li key={x.t}><span className="flow-ico"><Svg d={STEP_ICONS[i % STEP_ICONS.length]} size={26} /></span><strong>{x.t}</strong><p>{x.d}</p></li>)}
  </ol>
);

export const Header = () => (
  <header className="site-header">
    <div className="wrap header-inner">
      <Link href="/" className="logo" aria-label={`${BRAND} 홈`}>
        <span className="logo-mark" aria-hidden="true"><i /></span>
        <span className="logo-text"><b>{BRAND}</b><small>광주 포장이사 · 원투룸 · 사무실</small></span>
      </Link>
      <nav className="nav" aria-label="주 메뉴">
        <Link href="/#kinds" className="hide-m">이사 종류</Link>
        <Link href="/#steps" className="hide-m">진행 순서</Link>
        <Link href="/area/" className="hide-m">지역</Link>
        <Link href="/blog/" className="hide-m">블로그</Link>
        {hasPhone
          ? <a href={tel} className="nav-call" aria-label={`전화 ${CONTACT.phone}`}><IconPhone /><span>{CONTACT.phone}</span></a>
          : <Link href="/area/" className="nav-call show-m">지역</Link>}
      </nav>
    </div>
  </header>
);

export const Footer = () => (
  <footer className="site-footer">
    <div className="wrap foot-grid">
      <div>
        <strong className="foot-brand"><span className="logo-mark" aria-hidden="true"><i /></span>{BRAND}</strong>
        <p>포장이사 · 일반이사 · 원투룸이사 · 가정이사 · 보관이사 · 아파트이사 · 사무실이사 · 관공서이사<br />광주 북구 · 광산구 · 서구 · 담양 · 나주 · 장성 · {CONTACT.hours}</p>
      </div>
      <ul className="foot-links">
        <li><Link href="/#kinds">이사 종류</Link></li>
        <li><Link href="/about/">소개</Link></li>
        <li><Link href="/area/">지역 안내</Link></li>
        <li><Link href="/blog/">블로그</Link></li>
        <li><a href="/rss.xml">RSS</a></li>
      </ul>
      <ul className="foot-info">
        <li><span>상호</span>{BRAND}</li>
        <li><span>주소</span>{BUSINESS.address}</li>
        {BUSINESS.bizNumber && <li><span>사업자</span>{BUSINESS.bizNumber}</li>}
        {hasPhone && <li><span>전화</span><a href={tel}>{CONTACT.phone}</a></li>}
        <li><span>접수</span>{CONTACT.intake}</li>
      </ul>
    </div>
    <div className="wrap foot-bottom">© {new Date().getFullYear()} {BRAND} · 최종 수정 <time dateTime={UPDATED}>{UPDATED}</time> · 상담 때 받은 주소·연락처는 견적과 이사 안내에만 씁니다.</div>
  </footer>
);

export const StickyBar = () => hasPhone ? (
  <div className="sticky-bar">
    <a href={tel} className="sb-call"><IconPhone />{CONTACT.phone}</a>
    <a href={smsHref} className="sb-sms"><IconMsg />문자</a>
  </div>
) : null;

// 스톡 사진 — 히어로(eager)가 아니면 lazy. 크기는 stock.json 의 실제 픽셀.
export const StockImg = ({ s, eager, className }: { s: { file: string; w: number; h: number; alt: string }; eager?: boolean; className?: string }) => (
  <img src={s.file} alt={s.alt} width={s.w} height={s.h} className={className} loading={eager ? 'eager' : 'lazy'} decoding={eager ? undefined : 'async'} {...(eager ? { fetchPriority: 'high' as const } : {})} />
);

// 사진 히어로 — 화면 너비 사진 + 왼쪽 어두운 덧칠 + 흰 제목. 오른쪽(aside)은 접수표 카드 자리.
export const PhotoHero = ({ s, children, aside, className = '' }: { s: { file: string; w: number; h: number; alt: string }; children: React.ReactNode; aside?: React.ReactNode; className?: string }) => (
  <section className={`hero photo-hero ${className}`}>
    <div className="ph-bg"><StockImg s={s} eager /></div>
    <div className="wrap hero-in">
      <div className="ph-text">{children}</div>
      {aside}
    </div>
  </section>
);
