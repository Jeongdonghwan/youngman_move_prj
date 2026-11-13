import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OPEN_PAGES, PLACES, getPage, pagePath, pageEncodedPath, hubPath, hubEncodedPath, related, rotate, STOCK } from '../../lib/data';
import { compose } from '../../lib/compose';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, serviceJsonLd } from '../../lib/jsonld';
import { BRAND, shareMeta } from '../../lib/site';
import { j } from '../../lib/ko';
import { Actions, Flow, IconArrow, JsonLd, Label, PhotoHero, SectionHead, StockImg } from '../../components/Common';

export const dynamicParams = false;

// 순차 오픈: lib/site.ts 의 OPEN_WAVE 이하 페이지만 생성
export function generateStaticParams() {
  return OPEN_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(params.slug);
  if (!p) return {};
  const c = compose(p);
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
  const c = compose(p);
  const P = PLACES[p.place];
  const rel = related(p);
  const path = pageEncodedPath(p);
  const relList = [...rel.samePlace, ...rel.sameHub, ...rel.otherHubs].map((x) => ({ name: x.kw, path: pageEncodedPath(x) }));
  const words = p.kw.split(' ');
  const cut = Math.max(1, words.length - (p.mod ? 2 : 1));
  const h1a = words.slice(0, cut).join(' ');
  const h1b = words.slice(cut).join(' ');
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
        <h1><span><i>{h1a}</i></span>{h1b && <span><i><em>{h1b}</em></i></span>}</h1>
        <p className="hero-lead">{c.lead}</p>
        <Actions />
      </PhotoHero>

      <div className="wrap">
        <section className="answer" aria-label="요약" data-reveal>
          <p>{c.answer}</p>
          <ul className="sq">{c.region.aside.map((x) => <li key={x}>{x}</li>)}</ul>
        </section>
        <div className="strip strip-3">
          {restImg.slice(0, 3).map((s) => <figure key={s.id}><StockImg s={s} /></figure>)}
        </div>
      </div>

      <div className="wrap">
        <section className="sec">
          <SectionHead title={c.region.heading} />
          <div className="cols">
            <div className="prose" data-reveal>
              {c.region.paras.map((t, i) => <p key={i} className={i === 0 ? 'first' : ''}>{t}</p>)}
            </div>
            <aside className="aside-box" data-reveal>
              <h3>{j(c.wl, '이')} 맞는 경우</h3>
              <ul className="sq">{c.scope.fit.map((x) => <li key={x}>{x}</li>)}</ul>
              <StockImg s={midImg} className="aside-img" />
            </aside>
          </div>
        </section>
      </div>

      <section className="band">
        <div className="wrap">
          <SectionHead center title={c.flow.heading} sub="견적 상담 → 방문 견적 → 포장 → 운반 → 정리" />
          <Flow steps={c.flow.steps} />
        </div>
      </section>

      <div className="wrap">
        <section className="sec">
          <SectionHead title={c.scope.heading} sub={c.scope.intro} />
          <ol className="scope reveal-group">{c.scope.items.map((x) => <li key={x.t}><div><b>{x.t}</b><span>{x.d}</span></div></li>)}</ol>
        </section>

        {c.mod && (
          <section className="sec alt">
            <SectionHead title={c.mod.heading} />
            <div className="cols">
              <div className="prose" data-reveal>{c.mod.paras.map((t, i) => <p key={i}>{t}</p>)}</div>
              <dl className="info" data-reveal>{c.mod.table.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            </div>
          </section>
        )}
      </div>

      <section className="cta-band">
        <div className="wrap cta-in">
          <p>{c.cta}</p>
          <Actions sms={false} />
        </div>
      </section>

      <div className="wrap">
        <section className="sec">
          <SectionHead title={c.ready.heading} />
          <div className="cols">
            <ul className="sq reveal-group">{c.ready.items.map((x) => <li key={x}>{x}</li>)}</ul>
            <p className="miss" data-reveal>{c.ready.miss}</p>
          </div>
        </section>

        <section className="sec alt">
          <SectionHead title={`${P.name} 이사 안내`} />
          <dl className="info" data-reveal>{c.info.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </section>

        <section className="sec" id="faq">
          <SectionHead title="자주 묻는 질문" />
          <div className="faq">
            {c.faq.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}
          </div>
        </section>

        <section className="sec">
          <SectionHead title={`${p.kw} 관련 안내`} />
          <div className="related">
            {rel.samePlace.length > 0 && <div><h3>{P.name} 다른 이사</h3><ul className="linklist">{rel.samePlace.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
            {rel.sameHub.length > 0 && <div><h3>{p.hub} 다른 동네</h3><ul className="linklist">{rel.sameHub.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
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
