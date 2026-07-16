"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div";
  /** 화면에 들어왔을 때 1회 호출 (예: 카운트업 시작) */
  onEnter?: () => void;
};

/** 스크롤 리빌. reduced-motion이면 즉시 표시. */
export default function Reveal({ children, className = "", id, as = "section", onEnter }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // reduced-motion은 CSS(@media prefers-reduced-motion)가 이미 항상 보이게 처리한다.
    // 여기선 관측만 — setState는 콜백 안에서만 일어난다.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          onEnter?.();
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
    // onEnter는 마운트 시점에 고정 — 의도적으로 deps 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cls = `reveal ${inView ? "in" : ""} ${className}`.trim();
  const Tag = as;
  return (
    // @ts-expect-error — section/div 모두 HTMLElement ref 허용
    <Tag ref={ref} id={id} className={cls}>
      {children}
    </Tag>
  );
}
