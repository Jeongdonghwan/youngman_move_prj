import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HUBS, PLACES, openHubs, hubPages, hubSlug, hubEncodedPath, pagePath, pageEncodedPath, rotate, STOCK } from '../../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../../lib/jsonld';
import { Actions, IconArrow, JsonLd, SectionHead, StockImg } from '../../../components/Common';
import { BRAND, shareMeta } from '../../../lib/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return openHubs().map((h) => ({ hub: hubSlug(h) }));
}
const find = (s: string) => { let k = s; try { k = decodeURIComponent(s); } catch {} return openHubs().find((h) => hubSlug(h) === k); };
const GROUPS: [string, string][] = [['전체', ''], ['생활권', '생활권'], ['동·읍면', '동·읍면']];

export function generateMetadata({ params }: { params: { hub: string } }): Metadata {
  const h = find(params.hub);
  if (!h) return {};
  const title = `${h} 포장이사·원룸이사 지역 안내 | ${BRAND}`;
  const description = `${HUBS[h].full} 동네별 포장이사·원룸이사·사무실이사·보관이사 안내. ${PLACES[h].note}.`.slice(0, 158);
  return { title, description, alternates: { canonical: hubEncodedPath(h) }, ...shareMeta(`area-${hubSlug(h)}`, `${h} 이사 지역 안내`, { title, description, url: hubEncodedPath(h) }) };
}

// 허브 — 그 지역의 열린 키워드 페이지 전부로 가는 크롤 경로
export default function Hub({ params }: { params: { hub: string } }) {
  const h = find(params.hub);
  if (!h) notFound();
  const H = HUBS[h];
  const pages = hubPages(h);
  const keys = Array.from(new Set(pages.map((p) => p.place)));
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }, { name: `${h} 이사`, path: hubEncodedPath(h) }]),
        itemListJsonLd(pages.map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />
      <section className="page-hero">
        <div className="wrap ph2">
          <div>
          <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><Link href="/area/">지역</Link><span>/</span><span>{h}</span></nav>
          <h1>{h} 포장이사·원룸이사 지역 안내</h1>
          <p>{PLACES[h].note}. 주거 형태는 {PLACES[h].homes}입니다. {H.route}.</p>
          <Actions />
          </div>
          <StockImg s={rotate(STOCK, h, 'hub')[0]} eager className="ph2-img" />
        </div>
      </section>
      <div className="wrap">
        {GROUPS.map(([label, unit]) => {
          const ks = keys.filter((k) => (unit ? PLACES[k].unit === unit : k === h));
          if (!ks.length) return null;
          return (
            <section key={label} className="sec">
              <SectionHead title={`${h} ${label}`} />
              {ks.map((k) => (
                <div key={k} className="area-block" data-reveal>
                  <h3>{PLACES[k].name} <small>· {PLACES[k].homes}</small></h3>
                  <ul className="links-inline">
                    {pages.filter((p) => p.place === k).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}</Link></li>)}
                  </ul>
                </div>
              ))}
            </section>
          );
        })}
        <p><Link href="/area/" className="more">다른 지역 보기 <IconArrow /></Link></p>
      </div>
    </main>
  );
}
