import { SITE_URL, SITE_NAME, BRAND, CONTACT, BUSINESS, SERVICES, hasPhone, UPDATED } from './site';

// 업체 — 주소는 플레이스 표기(광주 북구 장운길 49-4), 행정구역은 2026 통합 표기. 전화는 lib/site.ts 에 있을 때만.
export const businessJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'MovingCompany',
  '@id': `${SITE_URL}/#business`,
  name: BRAND,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/img/shelf.jpg`,
  ...(hasPhone ? { telephone: CONTACT.phone } : {}),
  address: {
    '@type': 'PostalAddress', addressCountry: 'KR', addressRegion: BUSINESS.sido, addressLocality: BUSINESS.locality, streetAddress: BUSINESS.street,
  },
  openingHours: 'Mo-Su 00:00-24:00',
  areaServed: ['광주 북구', '광주 광산구', '광주 서구', '담양군', '나주시', '장성군'],
  knowsAbout: SERVICES,
});

export const webSiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  inLanguage: 'ko',
  publisher: { '@id': `${SITE_URL}/#business` },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: i === 0 ? BRAND : it.name, item: `${SITE_URL}${it.path}` })),
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const serviceJsonLd = (o: { name: string; type: string; description: string; path: string; area: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: o.name,
  serviceType: o.type,
  description: o.description,
  url: `${SITE_URL}${o.path}`,
  areaServed: { '@type': 'Place', name: o.area },
  dateModified: UPDATED,
  provider: { '@id': `${SITE_URL}/#business` },
});

// 캐러셀 ItemList — 같은 도메인 절대 URL, path 는 인코딩된 경로
export const itemListJsonLd = (items: { name: string; path: string; image?: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem', position: i + 1, url: `${SITE_URL}${it.path}`, name: it.name,
    ...(it.image ? { image: `${SITE_URL}${it.image}` } : {}),
  })),
});
