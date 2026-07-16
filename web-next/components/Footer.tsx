const LINKS = [
  { href: "#product", label: "제품소개" },
  { href: "#diag", label: "향 매칭 진단" },
  { href: "#routine", label: "루틴 가이드" },
  { href: "#trust", label: "성분 & 원료" },
  { href: "#story", label: "스토리" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot-inner">
        <div className="brand">
          <span className="brand-ko">마음약방</span>
          <span className="brand-en">MAUM YAKBANG</span>
        </div>
        <nav className="foot-links" aria-label="푸터 메뉴">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="disclaimer wrap">
        마음약방은 향을 활용한 기분 전환·준비 루틴 제품입니다. 질병의 예방·치료를 목적으로 하지
        않으며, 의약품이 아닙니다. © 2026 마음약방 · korrio093@gmail.com
      </p>
    </footer>
  );
}
