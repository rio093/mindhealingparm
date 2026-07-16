"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import CtaLink from "./CtaLink";

const TRUST = [
  "천연 유래 향료 기반",
  "아로마 실무 전문가 블렌딩",
  "국내 제조 · 소량 블렌딩",
  "사용법 카드 동봉",
];

export default function Hero() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: reduce ? 0 : 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.55, ease: EASE } },
  };
  // 부유 모션 — reduced-motion이면 정지
  const float = reduce
    ? {}
    : { y: [0, -8, 0], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const } };
  const floatSlow = reduce
    ? {}
    : { y: [0, -6, 0], transition: { duration: 8, repeat: Infinity, ease: "easeInOut" as const } };

  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <motion.div className="hero-copy" variants={container} initial="hidden" animate="show">
          <motion.span className="eyebrow" variants={item}>
            FOCUS SWITCH ON
          </motion.span>
          <motion.h1 variants={item}>
            회의 전, 나를 바꾸는
            <br />
            <span className="hl">1분</span> 향 스위치
          </motion.h1>
          <motion.p className="hero-sub" variants={item}>
            발표, 피칭, 미팅 직전.
            <br />
            향으로 숨을 고르고, 모드를 전환하세요.
          </motion.p>
          <motion.div className="hero-cta" variants={item}>
            <CtaLink href="#diag" className="btn btn-primary" loc="hero">
              내 회의 모드 찾기 <span className="dim">(3문항 진단)</span> →
            </CtaLink>
            <a href="#routine" className="btn btn-ghost">
              ▶ 1분 루틴 알아보기
            </a>
          </motion.div>
          <motion.ul className="trust-row" variants={item}>
            {TRUST.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          className="hero-scene"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.2 }}
        >
          <div className="stage" aria-hidden="true">
            <div className="stone" />
            <motion.div className="inhaler" animate={float}>
              <div className="cap" />
              <div className="body">
                <span className="label-ko">
                  마음
                  <br />
                  약방
                </span>
                <span className="label-en">
                  AROMA
                  <br />
                  INHALER
                </span>
              </div>
            </motion.div>
            <div className="lid" />
            <motion.div className="rx" animate={floatSlow}>
              <div className="rx-head">오늘의 스위치</div>
              <div className="rx-row">
                <b>상황</b>
                <span>중요한 발표 전</span>
              </div>
              <div className="rx-row">
                <b>무드</b>
                <span>정돈된 집중</span>
              </div>
              <div className="rx-row">
                <b>향</b>
                <span>Calm Basil</span>
              </div>
              <div className="rx-quote">
                숨을 고르고,
                <br />
                나의 중심으로 돌아가는 시간
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <div className="scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
