"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import Reveal from "./Reveal";

const CARDS = [
  {
    k: "MAKER",
    h: "업계 5년 실무",
    p: "아로마 제품 기획·제조를 오래 다뤄온 사람이 직접 블렌딩합니다.",
  },
  {
    k: "MATERIAL",
    h: "천연 향료",
    p: "EU IFRA 기준을 따른 천연 유래 향료. 흡입 전용으로 설계했습니다.",
  },
  {
    k: "MADE IN",
    h: "국내 자체 제조",
    p: "보유 제조 설비에서 소량 정성 제작. 매 배치를 직접 관리합니다.",
  },
];

export default function Trust() {
  const reduce = useReducedMotion();
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.5, ease: EASE } },
  };

  return (
    <Reveal className="trust-sec wrap" id="trust" stagger>
      <span className="eyebrow center">성분 &amp; 원료</span>
      <h2>왜 마음약방</h2>
      <div className="trust-cards">
        {CARDS.map((c) => (
          <motion.div className="tcard" key={c.k} variants={item}>
            <span className="tk">{c.k}</span>
            <h3>{c.h}</h3>
            <p>{c.p}</p>
          </motion.div>
        ))}
      </div>
    </Reveal>
  );
}
