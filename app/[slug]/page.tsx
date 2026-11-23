import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OPEN_PAGES, PLACES, getPage, pagePath, pageEncodedPath, hubPath, hubEncodedPath, related, rotate, STOCK } from '../../lib/data';
import { composeRay } from '../../lib/ray';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, serviceJsonLd } from '../../lib/jsonld';
import { BRAND, shareMeta } from '../../lib/site';
import { Actions, IconArrow, JsonLd, Label, PhotoHero, StockImg } from '../../components/Common';

export const dynamicParams = false;

// 순차 오픈: lib/site.ts 의 OPEN_WAVE 이하 페이지만 생성
export function generateStaticParams() {
  return OPEN_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(params.slug);
  if (!p) return {};
  const c = composeRay(p);
  const url = pageEncodedPath(p);
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: url },
    ...shareMeta(p.slug, `${p.kw} - ${BRAND}`, { title: c.title, description: c.description, url }),
  };
}

export default function KeywordPage({ params }: { params: { slug: string } }) {
  const p = getPage(params.slug);
  if (!p) notFound();
  const c = composeRay(p);
  const P = PLACES[p.place];
  const rel = related(p, 5);
  const path = pageEncodedPath(p);
  const relList = [...rel.samePlace, ...rel.sameHub, ...rel.otherHubs].map((x) => ({ name: x.kw, path: pageEncodedPath(x) }));
  const [heroImg, midImg, ...restImg] = rotate(STOCK, p.slug, 'img'); // 슬러그마다 고정, 서로 다른 사진

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }, { name: `${p.hub} 이사`, path: hubEncodedPath(p.hub) }, { name: p.kw, path }]),
          serviceJsonLd({ name: p.kw, type: c.type, description: c.description, path, area: P.admin }),
          faqJsonLd(c.faq),
          itemListJsonLd(relList.length ? relList : [{ name: `${p.hub} 이사 지역 안내`, path: hubEncodedPath(p.hub) }]),
        ]}
      />

      <PhotoHero s={heroImg} aside={<Label title={p.word} rows={c.label} />}>
        <nav className="crumbs" aria-label="경로">
          <Link href="/">홈</Link><span>/</span><Link href="/area/">지역</Link><span>/</span><Link href={hubPath(p.hub)}>{p.hub}</Link>
        </nav>
        <p className="hero-meta">{c.cat}</p>
        <h1><span>{p.kw}</span>{' '}<span className="hero-sub">{c.h1sub}</span></h1>
        <p className="hero-lead">{c.lead}</p>
        <Actions />
      </PhotoHero>

      <div className="wrap">
        <section className="answer ray-sum" data-reveal>
          <div>
            <h2>{p.kw} 핵심 요약</h2>
            <p>{c.summaryText}</p>
          </div>
          <dl className="info">{c.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </section>

        <article className="ray">
          {c.sections.map((x, i) => (
            <section key={i} data-reveal>
              <h2><span>{String(i + 1).padStart(2, '0')}</span>{x.h}</h2>
              <p>{x.p}</p>
            </section>
          ))}
        </article>
        <div className="strip strip-3">
          {[midImg, ...restImg].slice(0, 3).map((s) => <figure key={s.id}><StockImg s={s} /></figure>)}
        </div>
      </div>

      <section className="cta-band">
        <div className="wrap cta-in">
          <p>{c.cta}</p>
          <Actions sms={false} />
        </div>
      </section>

      <div className="wrap">
        <section className="sec" id="faq">
          <h2 className="ray-h">{p.kw} 자주 묻는 질문</h2>
          <div className="faq">
            {c.faq.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}
          </div>
        </section>

        <section className="sec">
          <h2 className="ray-h">{p.kw} 관련 안내</h2>
          <div className="related">
            {rel.samePlace.length > 0 && <div><h3>{P.name}, 다른 이사도</h3><ul className="linklist">{rel.samePlace.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
            {rel.sameHub.length > 0 && <div><h3>같은 {p.word}, {p.hub} 다른 동네</h3><ul className="linklist">{rel.sameHub.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
            <div><h3>다른 지역</h3><ul className="linklist">
              {rel.otherHubs.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}
              <li><Link href={hubPath(p.hub)}>{p.hub} 이사 지역 안내 전체<IconArrow /></Link></li>
            </ul></div>
          </div>
        </section>
      </div>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>{c.closing.heading}</h2>
          <p>{c.closing.text}</p>
          <Actions />
        </div>
      </section>
    </main>
  );
}
