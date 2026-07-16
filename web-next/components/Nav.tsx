"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

const LINKS = [
  { href: "#product", label: "제품소개" },
  { href: "#diag", label: "향 매칭 진단" },
  { href: "#routine", label: "루틴 가이드" },
  { href: "#trust", label: "성분 & 원료" },
  { href: "#story", label: "스토리" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hambRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 860 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // 포커스 관리: 열면 첫 링크로, 닫으면 햄버거로 복귀
  useEffect(() => {
    if (open) firstLinkRef.current?.focus();
    else if (document.activeElement !== document.body) hambRef.current?.focus();
  }, [open]);

  return (
    <header className={`nav ${scrolled ? "scrolled" : ""} ${open ? "menu-open" : ""}`}>
      <div className="wrap nav-inner">
        <a className="brand" href="#top">
          <span className="brand-ko">마음약방</span>
          <span className="brand-en">MAUM YAKBANG</span>
        </a>

        <nav className="nav-links" aria-label="주 메뉴">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-right">
          <a href="#diag" className="btn btn-cta" onClick={() => track("CTA", { loc: "nav" })}>
            내 향 찾기
          </a>
        </div>

        <button
          ref={hambRef}
          className="hamb"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="mobileMenu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "≡"}
        </button>
      </div>

      <nav className="mobile-menu" id="mobileMenu" aria-label="모바일 메뉴" aria-hidden={!open}>
        {LINKS.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            ref={i === 0 ? firstLinkRef : undefined}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </a>
        ))}
        <a
          href="#preorder"
          className="btn btn-primary block"
          onClick={() => {
            setOpen(false);
            track("CTA", { loc: "nav-mobile" });
          }}
        >
          사전 주문
        </a>
      </nav>
    </header>
  );
}
