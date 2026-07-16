"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

export default function BuyCard() {
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (closed) return null;

  return (
    <aside className={`buycard ${show ? "show" : ""}`}>
      <div className="buycard-thumb" aria-hidden="true" />
      <div className="buycard-info">
        <b>마음약방 아로마 인헤일러 키트</b>
        <small>인헤일러(15g) + 1분 호흡 카드 + 전용 파우치</small>
        <div className="buycard-price">
          19,000<span>원</span>
        </div>
      </div>
      <a href="#preorder" className="btn btn-primary" onClick={() => track("CTA", { loc: "buycard" })}>
        지금 구매하기
      </a>
      <button className="buycard-x" aria-label="닫기" onClick={() => setClosed(true)}>
        ×
      </button>
    </aside>
  );
}
