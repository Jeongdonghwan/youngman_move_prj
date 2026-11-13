import type { Metadata } from 'next';
import Link from 'next/link';
import { HUBS, PLACES, openHubs, hubPages, hubPath, hubEncodedPath, stock } from '../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { Actions, IconArrow, JsonLd, SectionHead, StockImg } from '../../components/Common';
import { BRAND, shareMeta } from '../../lib/site';

const TITLE = `광주·담양·나주·장성 이사 지역 안내 | ${BRAND}`;
const DESC = `${BRAND}가 다니는 광주 북구·광산구·서구와 담양·나주·장성의 동네별 포장이사·원룸이사·사무실이사·보관이사 안내. 지역마다 집 형태와 이사 동선을 정리했습니다.`;
export const metadata: Metadata = {
  title: TITLE, description: DESC, alternates: { canonical: '/area/' },
  ...shareMeta('area', `${BRAND} 이사 지역 안내`, { title: TITLE, description: DESC, url: '/area/' }),
};

export default function AreaIndex() {
  const hubs = openHubs();
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }]),
        itemListJsonLd(hubs.map((h) => ({ name: `${h} 이사`, path: hubEncodedPath(h) }))),
      ]} />
      <section className="page-hero">
        <div className="wrap ph2">
          <div>
          <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><span>지역</span></nav>
          <h1>이사 지역 안내</h1>
          <p>광주 북구·광산구·서구와 담양·나주·장성, 아파트 단지부터 읍면 마을까지 방문 견적을 갑니다. 구·시·군을 고르면 동네별 이사 안내로 이어집니다.</p>
          </div>
          <StockImg s={stock('truck')} eager className="ph2-img" />
        </div>
      </section>
      <div className="wrap">
        <section className="sec">
          <SectionHead title="구·시·군별 안내" />
          <ul className="areas">
            {hubs.map((h) => (
              <li key={h} data-reveal>
                <b>{HUBS[h].full}</b>
                <p>{PLACES[h].note}. 안내 {hubPages(h).length}곳.</p>
                <Link href={hubPath(h)} className="more">보기<IconArrow /></Link>
              </li>
            ))}
          </ul>
          <Actions />
        </section>
      </div>
    </main>
  );
}
