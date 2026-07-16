"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import Reveal from "./Reveal";

/** 색 구분 없음 — 이름·설명·태그로만 구분(브랜드 컬러 1색 원칙). */
const SCENTS = [
  {
    key: "a",
    name: "CALM BASIL",
    desc: "긴장되는 순간, 마음을 정돈하고 싶을 때",
    tags: ["정돈", "여유", "차분한 집중"],
  },
  {
    key: "b",
    name: "CLEAR MINT",
    desc: "생각을 또렷하게 정리하고 싶을 때",
    tags: ["집중", "선명", "사고 정리"],
  },
  {
    key: "c",
    name: "ENERGY CITRUS",
    desc: "분위기를 산뜻하게 바꾸고 싶을 때",
    tags: ["산뜻함", "전환", "리프레시"],
  },
];

export default function Scents() {
  const reduce = useReducedMotion();
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.5, ease: EASE } },
  };

  return (
    <Reveal className="scents-sec wrap" stagger>
      <div className="sec-head">
        <span className="eyebrow center">세 가지 향</span>
        <h2>오늘 필요한 스위치를 고르세요</h2>
      </div>
      <div className="scents">
        {SCENTS.map((s) => (
          <motion.div
            className={`scent s-${s.key}`}
            key={s.key}
            variants={item}
            whileHover={reduce ? undefined : { y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="scent-name">{s.name}</div>
            <p>{s.desc}</p>
            <div className="tags">
              {s.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Reveal>
  );
}
