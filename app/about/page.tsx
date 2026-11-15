// 소개 — 사실만 평서문으로 (무엇을·어디서·어떻게 연락). lib/site.ts 와 페이지 데이터에 있는 것만 쓴다. 없는 정보는 줄을 내지 않는다.
import type { Metadata } from 'next';
import Link from 'next/link';
import { HUBS, openHubs, stock } from '../../lib/data';
import { breadcrumbJsonLd, businessJsonLd } from '../../lib/jsonld';
import { JsonLd, SectionHead, StockImg } from '../../components/Common';
import { BRAND, BUSINESS, CONTACT, SERVICES, UPDATED, hasPhone, shareMeta, tel, smsHref } from '../../lib/site';

const TITLE = `소개 | ${BRAND}`;
const DESC = `${BRAND}는 광주에서 포장이사·원룸이사·사무실이사를 하는 곳입니다. 하는 일, 다니는 지역, 연락 방법을 정리했습니다.`;
export const metadata: Metadata = {
  title: TITLE, description: DESC, alternates: { canonical: '/about/' },
  ...shareMeta('home', `${BRAND} 소개`, { title: TITLE, description: DESC, url: '/about/' }),
};

export default function About() {
  return (
    <main>
      <JsonLd data={[businessJsonLd(), breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '소개', path: '/about/' }])]} />
      <section className="page-hero">
        <div className="wrap ph2">
          <div>
          <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><span>소개</span></nav>
          <h1>{BRAND} 소개</h1>
          <p>{BRAND}는 가정집과 사무실 이사를 하는 이사 업체입니다.</p>
          </div>
          <StockImg s={stock('truck')} eager className="ph2-img" />
        </div>
      </section>
      <div className="wrap">
        <section className="sec">
          <SectionHead title="하는 일" />
          <div className="prose"><p>{SERVICES.join(', ')}를 합니다.</p></div>
        </section>
        <section className="sec">
          <SectionHead title="다니는 지역" />
          <div className="prose"><p>{openHubs().map((h) => HUBS[h].full).join(', ')} 지역을 다닙니다. 동네별 안내는 <Link href="/area/">지역 안내</Link>에 있습니다.</p></div>
        </section>
        <section className="sec">
          <SectionHead title="연락 방법" />
          <div className="prose">
            {hasPhone && <p>전화 <a href={tel}>{CONTACT.phone}</a> 또는 <a href={smsHref}>문자</a>로 받습니다.</p>}
            <p>접수 방식은 {CONTACT.intake}입니다. 영업시간은 {CONTACT.hours}입니다.</p>
            {BUSINESS.address && <p>주소는 {BUSINESS.address}입니다.</p>}
            {BUSINESS.bizNumber && <p>사업자등록번호는 {BUSINESS.bizNumber}입니다.</p>}
            <p>이 페이지의 최종 수정일은 <time dateTime={UPDATED}>{UPDATED}</time>입니다.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
