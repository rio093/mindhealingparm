import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "마음약방 — 1분 향 스위치",
  description:
    "회의·발표·피칭 직전, 향으로 숨을 고르고 모드를 전환하는 흡입 향 스위치. 영업·컨설턴트를 위한 준비 루틴.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        {/* motion은 등장 전 상태(opacity:0)를 SSR에 심는다.
            JS가 죽으면 그대로 안 보이므로, JS 없을 때는 강제로 보이게 한다. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        {children}
        {/* 분석: Plausible (쿠키리스). 커스텀 도메인 붙이면 data-domain 교체 */}
        <Script
          defer
          data-domain="maum-yakbang-next.vercel.app"
          src="https://plausible.io/js/script.tagged-events.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
