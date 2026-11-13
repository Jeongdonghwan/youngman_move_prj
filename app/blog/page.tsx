import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, postPath, postEncodedPath } from '../../lib/blog';
import { OPEN_PAGES, pagePath, pageEncodedPath, stock } from '../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { Actions, IconArrow, JsonLd, SectionHead, StockImg } from '../../components/Common';
import { BRAND, shareMeta } from '../../lib/site';

const TITLE = `이사 준비 블로그 | ${BRAND}`;
const DESC = `이사 준비 체크리스트, 보관이사를 쓰는 때, 원룸이사 짐 줄이기, 방문 견적 전에 정리할 것처럼 ${BRAND}가 상담 때 자주 받는 질문을 글로 정리합니다.`;
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/blog/', types: { 'application/rss+xml': '/rss.xml' } },
  ...shareMeta('blog', `${BRAND} 이사 준비 블로그`, { title: TITLE, description: DESC, url: '/blog/' }),
};

const fmt = (d: string) => d.replace(/-/g, '.');

export default function BlogIndex() {
  const posts = getPosts();
  // 글이 없을 때도 목록이 비지 않게 열린 대표 페이지로 이어 준다
  const hubs = OPEN_PAGES.filter((p) => !p.mod && (p.unit === '구' || p.unit === '시·군')).slice(0, 10);
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '블로그', path: '/blog/' }]),
        itemListJsonLd(posts.length ? posts.map((p) => ({ name: p.title, path: postEncodedPath(p) })) : hubs.map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />
      <section className="page-hero">
        <div className="wrap ph2">
          <div>
          <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><span>블로그</span></nav>
          <h1>이사 준비 블로그</h1>
          <p>상담 때 자주 듣는 질문을 한 편에 하나씩 답합니다. 집집마다 다른 견적 금액은 적지 않고, 이사 방식을 고르고 준비하는 데 필요한 내용만 씁니다.</p>
          </div>
          <StockImg s={stock('packing')} eager className="ph2-img" />
        </div>
      </section>
      <div className="wrap">
        <section className="sec">
          <SectionHead title="최근 글" />
          {posts.length > 0 ? (
            <ol className="post-list">
              {posts.map((p) => (
                <li key={p.slug} data-reveal><Link href={postPath(p)}><span className="meta">{fmt(p.publishedAt)}</span><h3>{p.title}</h3><p>{p.description}</p></Link></li>
              ))}
            </ol>
          ) : (
            <p>첫 글을 준비하고 있습니다. 그동안 아래 지역 안내 페이지를 참고해 주세요.</p>
          )}
        </section>
        <section className="sec">
          <SectionHead title="지역별 이사 안내" />
          <ul className="linklist">{hubs.map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}</ul>
          <Actions />
        </section>
      </div>
    </main>
  );
}
