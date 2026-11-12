import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header, Footer, StickyBar, JsonLd } from '../components/Common';
import Motion from '../components/Motion';
import { businessJsonLd, webSiteJsonLd } from '../lib/jsonld';
import { SITE_URL, SITE_NAME, NAVER_VERIFY, GOOGLE_VERIFY } from '../lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s` },
  robots: { index: true, follow: true },
  verification: { google: GOOGLE_VERIFY || undefined, other: NAVER_VERIFY ? { 'naver-site-verification': NAVER_VERIFY } : undefined },
};

export const viewport: Viewport = { themeColor: '#123b2c', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@700&display=swap" />
      </head>
      <body>
        <JsonLd data={[businessJsonLd(), webSiteJsonLd()]} />
        <Header />
        {children}
        <Footer />
        <StickyBar />
        <Motion />
      </body>
    </html>
  );
}
