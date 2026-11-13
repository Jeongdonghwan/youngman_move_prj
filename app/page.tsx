import type { Metadata } from 'next';
import Link from 'next/link';
import { OPEN_PAGES, HUBS, openHubs, hubPath, hubEncodedPath, pagePath, pageEncodedPath, firstPageOf, PLACES, stock } from '../lib/data';
import { getPosts, postPath } from '../lib/blog';
import { itemListJsonLd, faqJsonLd } from '../lib/jsonld';
import { BRAND, CONTACT, BUSINESS, SITE_NAME, shareMeta } from '../lib/site';
import { Actions, Flow, IconArrow, JsonLd, Label, PhotoHero, SectionHead, StockImg } from '../components/Common';

const DESC = `광주 이사업체 ${BRAND}. 포장이사·일반이사·원투룸이사·가정이사·보관이사·아파트이사·사무실이사·관공서이사를 견적 상담, 방문 견적, 포장, 운반, 정리 순서로 진행합니다. ${CONTACT.hours}.`;
export const metadata: Metadata = {
  title: SITE_NAME,
  description: DESC,
  alternates: { canonical: '/', types: { 'application/rss+xml': '/rss.xml' } },
  ...shareMeta('home', `${BRAND} 광주 포장이사`, { title: SITE_NAME, description: DESC, url: '/' }),
};

const STEPS = [
  { t: '견적 상담', d: '이삿날, 지금 집과 새집 주소, 집 형태를 듣습니다. 24시간·연중무휴로 받습니다.' },
  { t: '방문 견적', d: '집을 직접 보고 짐 양, 분해할 가구, 엘리베이터·사다리차를 확인해 견적서를 드립니다.' },
  { t: '포장', d: '정한 범위대로 주방부터 쌉니다. 그릇은 한 점씩, 옷은 옷걸이째, 박스엔 방 이름을 답니다.' },
  { t: '운반', d: '무거운 가구와 가전을 먼저 싣고, 깨지는 박스는 위에 둡니다. 골목·단지 사정에 맞는 차로 갑니다.' },
  { t: '정리', d: '새집에서 가구 자리를 잡고 박스를 풀어 수납합니다. 빈 박스와 포장재는 가져갑니다.' },
];

// 업체가 하는 이사 8가지(플레이스 소개) → 가장 가까운 키워드 페이지로
const KINDS: { name: string; type: string; d: string; word: string; img?: string }[] = [
  { name: '포장이사', type: '짐 싸기부터 수납까지', d: '주방 그릇, 옷장, 가구 분해·조립, 새집 수납까지 이사팀이 맡습니다.', word: '포장이사', img: 'packing' },
  { name: '일반이사', type: '운반 위주', d: '짐은 직접 싸 두고 차량과 운반만 맡깁니다. 가구·가전은 보호재를 감아 옮깁니다.', word: '용달이사', img: 'truck' },
  { name: '원투룸이사', type: '짐이 적은 집', d: '원룸·투룸 짐을 작은 차와 적은 인원으로 옮깁니다. 계단 건물도 인원을 맞춥니다.', word: '원룸이사', img: 'moveout' },
  { name: '가정이사', type: '집 형태에 맞춰', d: '아파트·주택·빌라마다 다른 동선을 보고 포장 범위를 정합니다.', word: '이사', img: 'emptyroom' },
  { name: '보관이사', type: '날짜가 안 맞을 때', d: '나가는 날과 들어가는 날 사이 짐을 맡겨 두었다가 새집으로 옮깁니다.', word: '보관이사', img: 'storage' },
  { name: '아파트이사', type: '엘리베이터·사다리차', d: '관리사무소 신고, 엘리베이터 예약, 사다리차 자리를 먼저 맞춥니다.', word: '반포장이사', img: 'apartment' },
  { name: '사무실이사', type: '배치도·번호표', d: '책상·PC·서류에 번호를 붙여 새 사무실 배치도대로 놓습니다.', word: '사무실이사', img: 'office' },
  { name: '관공서이사', type: '책·문서 순서 유지', d: '도서실·자료실 책을 칸 순서대로 담아 같은 순서로 다시 꽂습니다.', word: '이삿짐센터', img: 'library' },
];

const FAQ = [
  { q: '방문 견적은 어디까지 오나요?', a: `광주 북구·광산구·서구와 담양·나주·장성을 다닙니다. ${BUSINESS.address}에서 출발하고, 읍면 지역은 날짜와 시작 시간을 먼저 맞춥니다.` },
  { q: '밤이나 휴일에도 상담하나요?', a: `${CONTACT.hours}로 상담을 받습니다. 방문 견적과 이삿날은 예약으로 잡습니다.` },
  { q: '전화로 금액을 알 수 있나요?', a: '짐 양·층수·포장 범위에 따라 달라 통화로는 범위만 말씀드립니다. 집을 본 뒤 견적서로 드립니다.' },
  { q: '첨단지구는 북구인가요, 광산구인가요?', a: '첨단지구는 두 구에 걸친 생활권입니다. 첨단1·2동(쌍암·월계동 일대)은 광산구, 오룡동 쪽 첨단2지구는 북구입니다. 두 곳 모두 방문 견적을 갑니다.' },
  { q: '이삿짐이 파손되면 어떻게 하나요?', a: '짐을 내린 뒤 함께 확인하고, 파손이 있으면 사진을 남겨 처리 방법을 이야기합니다. 처리 기준은 계약 때 미리 확인해 두세요.' },
];

const fmt = (d: string) => d.replace(/-/g, '.');

export default function Home() {
  const hubs = openHubs();
  const posts = getPosts().slice(0, 5);
  const showcase = OPEN_PAGES.filter((p) => !p.mod).slice(0, 30);
  return (
    <main>
      <JsonLd data={[itemListJsonLd(showcase.map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))), faqJsonLd(FAQ)]} />

      <PhotoHero
        s={stock('hero-boxes')}
        aside={<Label title="이사 접수표" rows={[['접수', CONTACT.intake], ['다니는 곳', '광주 북구·광산구·서구 · 담양 · 나주 · 장성']]} />}
      >
        <p className="hero-meta">{CONTACT.hours}</p>
        <h1><span><i>광주 <em>포장이사</em>,</i></span><span><i>상담부터 정리까지</i></span></h1>
        <p className="hero-lead">{BRAND}는 광주 북구·광산구·서구와 담양·나주·장성에서 가정·원투룸·사무실·관공서 이사를 합니다. 집을 직접 보고 견적을 내고, 정한 범위대로 싸고 옮기고 풀어 놓습니다.</p>
        <Actions />
      </PhotoHero>

      <section className="sec" id="kinds">
        <div className="wrap">
          <SectionHead center title="이사 종류" sub="집과 짐에 맞는 방식을 고르세요. 각 항목에서 지역별 안내로 이어집니다." />
          <div className="kinds">
            {KINDS.map((k) => {
              const to = firstPageOf(k.word);
              return (
                <article className={k.img ? 'kind has-img' : 'kind'} key={k.name} data-reveal>
                  {k.img && <StockImg s={stock(k.img)} className="kind-img" />}
                  <h3>{k.name}</h3>
                  <p className="k-type">{k.type}</p>
                  <p>{k.d}</p>
                  {to && <Link href={pagePath(to)}>{to.kw}<IconArrow /></Link>}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="band" id="steps">
        <div className="wrap">
          <SectionHead center title="이사는 다섯 단계로 진행합니다" sub="견적 상담 → 방문 견적 → 포장 → 운반 → 정리. 이사 종류가 달라도 순서는 같고, 단계마다 맡는 범위만 달라집니다." />
          <Flow steps={STEPS} />
        </div>
      </section>

      <section className="sec">
        <div className="wrap cols">
          <div data-reveal>
            <SectionHead title="책 한 칸, 서류 한 묶음까지 순서대로" />
            <p className="big-lead">관공서·학교·사무실 이사는 짐보다 순서가 중요합니다.</p>
            <figure className="shelf mask" data-reveal>
              <img src="/img/shelf.jpg" alt={`${BRAND} 관공서이사 현장 - 도서실 책장을 옮겨 책을 다시 꽂은 모습`} width={1200} height={771} loading="lazy" decoding="async" />
              <figcaption>도서실 책장 이전 현장. 칸 순서대로 담은 책을 새 책장에 같은 순서로 꽂았습니다.</figcaption>
            </figure>
          </div>
          <div className="prose" data-reveal>
            <p>책장 칸마다 번호를 붙여 박스에 담고, 새 자리에서 같은 번호 순서로 다시 꽂습니다. 책상과 캐비닛, PC도 자리별 번호표로 묶어 새 사무실 배치도대로 내려놓습니다.</p>
            <p>업무를 멈추는 날을 줄이려면 건물 반출입 시간과 통신 이전 날짜를 먼저 맞춰 두세요. 연중무휴로 상담을 받으니 주말·업무 시간 밖 일정도 함께 정합니다.</p>
          </div>
        </div>
      </section>

      <section className="sec alt">
        <div className="wrap">
          <SectionHead title="다니는 지역" sub="담양 고서·가사문학면은 바로 넘어가고, 나주·장성은 날짜와 시작 시간을 먼저 맞춥니다." />
          <ul className="areas">
            {hubs.map((h) => (
              <li key={h} data-reveal>
                <b>{h}</b>
                <p>{PLACES[h].homes}</p>
                <Link href={hubPath(h)} className="more">{h} 이사 안내<IconArrow /></Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cta-band has-bg" id="visit">
        <StockImg s={stock('carry')} className="cta-bg" />
        <div className="wrap cta-in">
          <div>
            <h2>방문 견적 때 알려 주시면 좋은 것</h2>
            <ul className="sq">
              <li>이삿날과 새집 입주 가능 시간</li>
              <li>지금 집·새집의 층수와 엘리베이터 유무</li>
              <li>버릴 가구, 에어컨 이전처럼 따로 정할 일</li>
            </ul>
          </div>
          <Actions sms={false} />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SectionHead center title="자주 묻는 질문" />
          <div className="faq">
            {FAQ.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}
          </div>
        </div>
      </section>

      <section className="sec alt">
        <div className="wrap">
          <SectionHead title="이사 준비 글" sub="이사 준비 체크리스트, 보관이사 쓰는 때, 원룸이사 짐 줄이기처럼 이사 전에 알아 두면 좋은 내용을 한 편씩 씁니다." />
          {posts.length > 0 ? (
            <ol className="post-list">
              {posts.map((p) => <li key={p.slug}><Link href={postPath(p)}><span className="meta">{fmt(p.publishedAt)}</span><h3>{p.title}</h3><p>{p.description}</p></Link></li>)}
            </ol>
          ) : (
            <ul className="linklist">
              {hubs.map((h) => <li key={h}><Link href={hubPath(h)}>{h} 이사 지역 안내<IconArrow /></Link></li>)}
            </ul>
          )}
          <p><Link href="/blog/" className="more">블로그 전체 보기 <IconArrow /></Link></p>
        </div>
      </section>

      <section className="closing split">
        <div className="wrap closing-in" data-reveal>
          <StockImg s={stock('newhome')} className="closing-img" />
          <div>
          <h2>이삿날과 두 집 주소, 짐 양만 알려 주세요</h2>
          <p>그 세 가지로 방문 견적 날짜를 잡습니다. {HUBS[hubs[0]]?.full ?? '광주 북구'}부터 담양·나주·장성까지, {CONTACT.hours} 상담합니다.</p>
          <Actions />
          </div>
        </div>
      </section>
    </main>
  );
}
