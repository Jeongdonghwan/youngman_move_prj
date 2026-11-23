// 데이터 로더 — data/site-pages.json(키워드 페이지), places.json(지역). 빌드 전용.
import pagesData from '../data/site-pages.json';
import placesData from '../data/places.json';
import stockData from '../data/stock.json';
import { OPEN_WAVE } from './site';

export interface Page {
  n: number; no: number; kw: string; slug: string; place: string; hub: string; unit: string;
  word: string; mod: string; prio: number; wave: number; alt: string[];
}
export interface Place { key: string; name: string; hub: string; unit: string; ctx: string; homes: string; note: string; admin: string }
export interface Hub { full: string; sido: string; route: string; spots: string[] }

export const ALL_PAGES = pagesData.pages as Page[];
export const OPEN_PAGES = ALL_PAGES.filter((p) => p.wave <= OPEN_WAVE);
export const PLACES = placesData.places as Record<string, Place>;
export const HUBS = placesData.hubs as Record<string, Hub>;
export const HUB_ORDER = placesData.hubOrder as string[];

export const pagePath = (p: Page) => `/${p.slug}/`;
export const pageEncodedPath = (p: Page) => `/${encodeURIComponent(p.slug)}/`;
export const hubSlug = (h: string) => h.replace(/ /g, '-');
export const hubPath = (h: string) => `/area/${hubSlug(h)}/`;
export const hubEncodedPath = (h: string) => `/area/${encodeURIComponent(hubSlug(h))}/`;

const bySlug = new Map(OPEN_PAGES.map((p) => [p.slug, p]));
export function getPage(slug: string): Page | undefined {
  let key = slug;
  try { key = decodeURIComponent(slug); } catch {}
  return bySlug.get(key);
}

export const openHubs = () => HUB_ORDER.filter((h) => OPEN_PAGES.some((p) => p.hub === h));
export const hubPages = (h: string) => OPEN_PAGES.filter((p) => p.hub === h);

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h;
};
export const seedOf = hash;
export const rotate = <T,>(arr: T[], seed: string, salt = ''): T[] => {
  if (!arr.length) return arr;
  const k = hash(`${seed}::${salt}`) % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
};

// 관련 페이지 — 열린 페이지만. 같은 지역 다른 이사 / 같은 허브 다른 동네 같은 단어 / 다른 허브 같은 단어
const byPlace = new Map<string, Page[]>();
for (const x of OPEN_PAGES) { const a = byPlace.get(x.place) || []; a.push(x); byPlace.set(x.place, a); }
export function related(p: Page, n = 6) {
  const samePlace = rotate((byPlace.get(p.place) || []).filter((x) => x.slug !== p.slug && x.word !== p.word), p.slug, 'sp').slice(0, n);
  const sameHub = rotate(OPEN_PAGES.filter((x) => x.hub === p.hub && x.place !== p.place && x.word === p.word), p.slug, 'sh').slice(0, n);
  const otherHubs = rotate(OPEN_PAGES.filter((x) => x.hub !== p.hub && x.unit !== '동·읍면' && x.word === p.word && x.mod === p.mod), p.slug, 'oh').slice(0, n > 5 ? 6 : 3);
  return { samePlace, sameHub, otherHubs };
}

// 서비스(엑셀 단어)별 대표 페이지 — 메인 레일에서 링크
export const firstPageOf = (word: string) => OPEN_PAGES.find((p) => p.word === word && !p.mod) || OPEN_PAGES.find((p) => p.word === word);

// 무료 스톡 사진(data/stock.json, Unsplash License) — 슬러그 해시로 고정 선택. 업체 현장 사진 아님 → alt 는 장면만 쓴다.
export interface Stock { id: string; file: string; w: number; h: number; source: string; author: string; license: string; alt: string }
export const STOCK = stockData as Stock[];
export const stock = (id: string) => STOCK.find((s) => s.id === id)!;
export const stockFor = (seed: string, salt = '') => STOCK[hash(`${seed}::${salt}`) % STOCK.length];
