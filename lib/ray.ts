// 키워드 페이지 본문 — 레이 모범 구조(2026-11-24, programmatic-seo composer-patterns §5-1·5-2·5-3)
// 분류 줄 → h1(키워드 + 수식어) → 설명 → 핵심 요약(결론 + 정보 4칸) → 번호 절 6개(한 문단) → FAQ → 관련 링크.
// 문장 재료는 lib/compose.ts 가 만든 것(source/facts.md·places.json 사실)만 다시 엮는다. 새 사실 없음.
import { Page, PLACES, HUBS, seedOf, related } from './data';
import { compose, SVC_DATA, CTX_DATA, modGroup } from './compose';
import { BRAND, CONTACT, hasPhone } from './site';
import { j } from './ko';

// FNV 아랫비트는 슬러그 끝 글자에 따라 같이 움직여 윗비트로 고른다
const hi = (k: string) => seedOf(k) >>> 15;
const pick = <T,>(arr: T[], seed: string, salt: string): T => arr[hi(`${seed}::${salt}`) % arr.length];
const shuffle = <T,>(arr: T[], seed: string, salt: string) => arr.map((x, i) => [hi(`${i}::${salt}::${seed}`), x] as [number, T]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
const end = (s: string) => (/[.?!]$/.test(s) ? s : `${s}.`);
const paraAll = (sents: string[], max = 268) => {
  let out = '';
  for (const t of sents) { if (!t) continue; const n = out ? `${out} ${t}` : t; if (n.length <= max) out = n; }
  return out.replace(/\s+/g, ' ');
};
const MOD_CAT: Record<string, string> = { base: '순서·범위', price: '비용 기준', quote: '견적 받기', pick: '업체 고르기', weekend: '주말 일정', today: '당일 이사' };

export function composeRay(p: Page) {
  const c = compose(p);
  const used = new Set<string>(); // 한 페이지 안에서 같은 문장 두 번 쓰지 않기
  const para = (sents: string[], max = 268) => paraAll(sents.filter((t) => t && !used.has(t)).filter((t) => (used.add(t), true)), max);
  const P = PLACES[p.place];
  const H = HUBS[p.hub];
  const svc = SVC_DATA[p.word];
  const C = CTX_DATA[P.ctx as keyof typeof CTX_DATA];
  const g = modGroup(p.mod);
  const s = p.slug;
  const kw = p.kw;
  const nm = P.name;
  const wl = p.word;
  const sc = svc.scope;
  const where = c.label[0][1];

  const h1sub = pick({
    base: [`${C.noun} 동선부터 새집 정리까지`, `${sc[0].t}·${sc[1].t} 범위와 순서`, `방문 견적 뒤 다섯 단계`],
    price: [`짐 양·층수·날짜로 달라지는 견적`, `${C.noun} 동선이 바꾸는 비용`, `견적서에 적히는 항목부터`],
    quote: [`방문 견적 받는 순서`, `${C.noun} 짐 양 확인부터`, `견적서에 적을 다섯 항목`],
    pick: [`업체에 물어볼 세 가지`, `${C.noun} 동선을 먼저 묻는 업체`, `방문 견적부터 마무리 확인까지`],
    weekend: [`주말 날짜 잡는 순서`, `${C.noun} 주말 이사 확인할 것`, `관리 규정부터 보는 주말 일정`],
    today: [`당일 가능 여부 먼저 확인`, `${C.noun} 급한 이사 준비`, `짐 목록·층수부터 알려 주기`],
  }[g], s, 'h1sub');

  const cat = `${p.hub} · ${svc.type} · ${MOD_CAT[g]}`;

  // ---- 핵심 요약 ----
  const summary = para([
    `${kw}${j(kw, '은').slice(kw.length)} ${svc.what.split(' — ')[0]}입니다.`,
    c.answer.split(/(?<=\.)\s+/)[0],
    `${nm}에는 ${j(P.homes, '이')} 있어 ${C.check[0]}부터 여쭙니다.`,
    `${j(BRAND, '는')} ${j(CONTACT.hours, '으로')} 상담을 받고, ${where}까지 방문 견적을 갑니다.`,
  ], 330);
  const facts: [string, string][] = c.info;

  // ---- 번호 절 6개 ----
  const st = c.flow.steps;
  const fit = shuffle(svc.fit, s, 'fit');
  const access = shuffle(C.access.map((f) => f(nm)), s, 'acc');
  const modP = c.mod
    ? para([
      c.mod.paras[0],
      `${nm} ${C.noun} 견적서에는 ${shuffle(c.mod.table, s, 'mt').slice(0, 3).map(([k]) => k).join('·')}${j(shuffle(c.mod.table, s, 'mt')[Math.min(2, c.mod.table.length - 1)][0], '을').slice(-1)} 그대로 적습니다.`,
      `같은 ${nm} 안에서도 ${C.check[1]}에 따라 이삿날 순서가 달라집니다.`,
      access[access.length - 1],
      `${nm} ${j(wl, '은')} ${C.consult.replace('함께 여쭙니다', '방문 견적 전에 여쭙니다')}`,
    ])
    : para([
      `${j(wl, '은')} ${svc.what.split(' — ')[0]}입니다.`,
      `${fit[0]}, ${fit[1]}에 맞습니다.`,
      `${nm} 견적은 짐 양, 포장 범위, 층수와 동선, 날짜, 추가 작업을 합쳐서 정해집니다.`,
      `같은 ${nm} 안에서도 ${C.check[1]}에 따라 이삿날 순서가 달라집니다.`,
      `${nm} 방문 견적 때 이 항목을 하나씩 짚어 견적서에 적습니다.`,
      access[access.length - 1],
    ]);
  const secs: { sub: string[]; p: string }[] = [
    { sub: [`${nm} 동네와 집 사정`, `${C.noun} 이사 동선`, `${nm}에서 먼저 볼 것`],
      p: para([...c.region.paras[0].split(/(?<=\.)\s+/).slice(0, 1), ...shuffle([...c.region.paras[0].split(/(?<=\.)\s+/).slice(1), ...access.flatMap((x) => x.split(/(?<=\.)\s+/)), `${nm} ${wl}에서 먼저 볼 것은 ${C.check[hi(`${s}::c1`) % 3]}입니다.`], s, 'p1')]) },
    { sub: [`${wl}에 들어가는 일`, `어디까지 맡기나`, `${nm} ${wl} 범위`],
      p: para([
        pick([`${nm} 방문 견적 때 다음 항목을 하나씩 짚어 범위를 정합니다.`, `${nm}에서 ${j(wl, '을')} 맡기면 이사팀이 하는 일은 이렇습니다.`], s, 'si'),
        ...shuffle(sc, s, 'sc').slice(0, 1).map((x) => `${x.t} — ${end(x.d)}`),
        `${nm} ${C.noun}에서는 ${shuffle(sc, s, 'sc').slice(1).map((x) => x.t).join('·')}도 같은 방문 견적에서 범위를 나눕니다.`,
        `${fit[0]}처럼 사정이 분명하면 범위를 정하기 쉽습니다.`,
        `${C.consult.replace('함께 여쭙니다', `${nm} 방문 견적 전에 여쭙니다`)}`,
      ]) },
    { sub: [`견적 상담부터 정리까지`, `${nm} 이사 다섯 단계`, `이삿날 진행 순서`],
      p: para([
        `${nm} ${j(wl, '은')} ${st.map((x) => x.t).join(' → ')} 순서로 진행합니다.`,
        ...shuffle(st.map((x) => x.d.split(/(?<=\.)\s+/)).flat().filter((x) => x.includes(nm)), s, 'st'),
        ...shuffle(st.map((x) => x.d.split(/(?<=\.)\s+/)).flat().filter((x) => !x.includes(nm)), s, 'st2').slice(0, 2),
      ]) },
    { sub: [c.mod ? c.mod.heading.replace(`${nm} `, '') : `${wl} 견적이 정해지는 방식`, `${MOD_CAT[g]}, ${C.noun} 기준`, c.mod ? `${p.mod} 전에 알아 둘 것` : '견적서에 적는 것'],
      p: modP },
    { sub: [`${nm} ${wl} 전에 챙길 것`, '이삿날 전 준비 목록', `${wl} 준비, 이것부터`],
      p: para([
        `${nm} ${wl} 전에는 ${shuffle(svc.ready, s, 'rd').slice(0, 3).join(', ')}부터 챙겨 두세요.`,
        ...shuffle([
          `${C.noun} 이사라면 ${C.check[2]}도 미리 확인합니다.`,
          svc.miss.split(/(?<=\.)\s+/)[hi(`${s}::miss`) % 2],
          `${shuffle(svc.ready, s, 'rd')[3]}도 이삿날 전에 끝내 두면 좋습니다.`,
          pick([`${nm} 주소와 이삿날을 알려 주시면 방문 견적 날짜부터 잡습니다.`, `이삿날 시작 시간은 ${nm} 도착지 사정에 맞춰 정합니다.`], s, 'rt'),
        ], s, 'p5'),
      ]) },
    { sub: [`${BRAND} 방문 견적 범위`, `${p.hub} 방문 견적`, `${nm}까지 오는 방식`],
      p: para([
        ...shuffle(c.region.paras[2].split(/(?<=\.)\s+/), s, 'p6').slice(0, 1),
        `${nm}에서 ${p.hub} 다른 동네로 옮기는 ${j(wl, '도')} 같은 방식으로 봅니다.`,
        `${nm} ${C.noun} 방문 견적 때는 ${C.check[hi(`${s}::c6`) % 3]}도 함께 봅니다.`,
        `${nm} ${j(wl, '도')} ${j(CONTACT.intake, '으로')} 일정을 잡고 집을 본 뒤 견적서를 드립니다${hasPhone ? `(상담 ${CONTACT.phone})` : ''}.`,
        pick([`${nm}에서 ${C.check[0]}부터 알려 주시면 방문 날짜를 바로 잡습니다.`, `${nm} 방문 견적은 ${C.noun} 동선을 보는 데서 시작합니다.`], s, 's6'),
      ]) },
  ];
  const KW_AT = new Set([0, 1, 2, 5]); // 6개 중 4개 h2 에 키워드 전체
  const sections = secs.map((x, i) => {
    const sub = pick(x.sub, s, `h${i}`);
    return { h: KW_AT.has(i) ? `${kw}${i % 2 ? ' — ' : ': '}${sub}` : sub, p: x.p };
  });

  // description 45~80자: 키워드 — 하는 일 2~3개 + 장소 사실 + 전화
  // 관련 키워드 = 이 페이지 관련 링크에 있는 같은 동네 다른 이사 종류
  const others = [...new Set(related(p, 5).samePlace.map((x) => x.word))].slice(0, 3);
  const tail = hasPhone ? `상담 ${CONTACT.phone}` : '방문 견적 예약';
  const ways = pick([`${C.noun} 방문 견적부터 정리까지`, `${C.noun} 동선과 포장 범위 안내`], s, 'df');
  const description = [
    `${kw} — ${kw.includes(nm) ? '' : `${nm} `}${ways}. ${others.slice(0, 3).join('·')}도 ${tail}`,
    `${kw} — ${kw.includes(nm) ? '' : `${nm} `}${ways}. ${others.slice(0, 2).join('·')}도 ${tail}`,
    `${kw} — ${ways}. ${others.slice(0, 2).join('·')}도 ${tail}`,
    `${kw} — ${nm} ${ways}. ${tail}`,
    `${kw} — ${ways}. ${tail}`,
  ].filter((x) => !x.includes('. 도 ')).find((x) => x.length <= 80 && x.length >= 50) || `${kw} — ${where} ${ways}. 방문 견적 ${tail}`; // static_audit 하한 50자

  // FAQ: 이사 종류 질문 + 수식어 질문은 그대로, 나머지는 동네 이름이 든 답만 (같은 문장 비율↓)
  const fq = c.faq.filter((f, i) => i < 2 || f.a.includes(nm));
  const faq = fq.length >= 3 ? fq : c.faq.slice(0, 3);

  return { ...c, h1sub, cat, summaryText: summary, facts, sections, description, faq };
}
