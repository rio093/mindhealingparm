"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import { useMemo, useRef, useState } from "react";
import Reveal from "./Reveal";
import CtaLink from "./CtaLink";
import { BLENDS, useLanding, type Blend } from "./LandingProvider";
import { track } from "@/lib/analytics";

type Weight = Blend | "0" | "?";
type QId = 1 | 2 | 3;
type Choice = { w: Weight; t: string };

const QUESTIONS: { id: QId; label: string; note?: string; opts: Choice[] }[] = [
  {
    id: 1,
    label: "주로 언제 쓰고 싶나요?",
    opts: [
      { w: "0", t: "발표·피칭 직전" },
      { w: "0", t: "긴장되는 오후 미팅" },
      { w: "0", t: "아침 첫 콜·중요 통화" },
    ],
  },
  {
    id: 2,
    label: "그 순간, 원하는 나의 상태는?",
    note: "이 답이 향을 결정해요",
    opts: [
      { w: "a", t: "정돈된 집중" },
      { w: "b", t: "또렷한 모드" },
      { w: "c", t: "산뜻한 리프레시" },
    ],
  },
  {
    id: 3,
    label: "끌리는 향의 결은?",
    opts: [
      { w: "a", t: "은은하고 부드러운" },
      { w: "b", t: "상큼하고 시원한" },
      { w: "c", t: "밝고 산뜻한" },
      { w: "?", t: "잘 모르겠어요" },
    ],
  },
];

export default function Diagnostic() {
  // 한 번에 한 문항. step·선택·방향만 상태, 나머지는 파생.
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [picked, setPicked] = useState<Partial<Record<QId, Choice>>>({});
  const [finished, setFinished] = useState(false);
  const { setResult } = useLanding();
  const resultRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const q = QUESTIONS[step];
  // 라벨이 "질문 1/3"이면 바도 1/3 — 첫 화면에 빈 바가 뜨지 않게
  const progress = finished ? 100 : ((step + 1) / QUESTIONS.length) * 100;

  const derived = useMemo(() => {
    const q2 = picked[2]?.w;
    if (!q2 || q2 === "0" || q2 === "?") return null;
    const blend = q2 as Blend;
    const q3 = picked[3]?.w;
    const mismatch = q3 !== undefined && q3 !== "?" && q3 !== blend;
    return { blend, mismatch };
  }, [picked]);

  function choose(o: Choice) {
    const next = { ...picked, [q.id]: o };
    setPicked(next);

    if (step < QUESTIONS.length - 1) {
      setDir(1);
      setStep(step + 1);
      return;
    }

    // 마지막 답 → next로 직접 계산 (setPicked 반영 전)
    const q2 = next[2]?.w;
    if (!q2 || q2 === "0" || q2 === "?") return;
    const blend = q2 as Blend;
    const q3 = next[3]?.w;
    const mismatch = q3 !== undefined && q3 !== "?" && q3 !== blend;
    const diag = `q1=${next[1]?.t} q2=${next[2]?.t} q3=${next[3]?.t} blend=${blend} mismatch=${mismatch}`;

    setFinished(true);
    setResult(blend, diag);
    track("진단완료", { blend, mismatch: String(mismatch), preference: q3 ?? "none" });
    requestAnimationFrame(() =>
      resultRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }),
    );
  }

  function restart() {
    setDir(-1);
    setPicked({});
    setStep(0);
    setFinished(false);
  }

  const slide = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 28 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -28 }),
  };
  const dur = reduce ? 0 : 0.28;

  return (
    <section className="diag-sec" id="diag">
      <div className="wrap">
        <Reveal as="div" className="diag-head">
          <span className="eyebrow center">향 매칭 진단</span>
          <h2>3가지 질문, 당신의 스위치</h2>
          <p>지금 필요한 상태를 고르면, 맞는 향을 추천합니다.</p>
        </Reveal>

        <Reveal as="div" className="diag">
          <div className="diag-progress">
            <div className="diag-progress-head">
              <span>{finished ? "완료" : `질문 ${step + 1} / ${QUESTIONS.length}`}</span>
              {!finished && step > 0 && (
                <button
                  className="diag-back"
                  onClick={() => {
                    setDir(-1);
                    setStep(step - 1);
                  }}
                >
                  ← 이전
                </button>
              )}
            </div>
            <div
              className="diag-track"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {/* 진행률도 모션: 스텝마다 부드럽게 채워짐 */}
              <motion.div
                className="diag-fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait" custom={dir} initial={false}>
            {!finished ? (
              <motion.div
                key={step}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: dur, ease: EASE }}
              >
                <div className="qt">
                  <span className="qn">Q{q.id}</span> {q.label}
                  {q.note && <em>{q.note}</em>}
                </div>
                <div className="opts">
                  {q.opts.map((o) => {
                    const selected = picked[q.id]?.t === o.t;
                    return (
                      <motion.button
                        key={o.t}
                        className={`opt ${selected ? "sel" : ""}`}
                        aria-pressed={selected}
                        onClick={() => choose(o)}
                        whileHover={reduce ? undefined : { y: -2 }}
                        whileTap={reduce ? undefined : { scale: 0.98 }}
                      >
                        {o.t}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              derived && (
                <motion.div
                  key="result"
                  ref={resultRef}
                  aria-live="polite"
                  initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
                >
                  <span className="eyebrow">당신의 스위치</span>
                  <motion.div
                    className={`rcard ${derived.blend}`}
                    initial={{ scale: reduce ? 1 : 0.97 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.05, type: reduce ? false : "spring", stiffness: 260, damping: 22 }}
                  >
                    <div className="rswatch" />
                    <div className="rmeta">
                      <h3>{BLENDS[derived.blend].name}</h3>
                      <p>{BLENDS[derived.blend].desc}</p>
                    </div>
                  </motion.div>
                  <div className="ractions">
                    <CtaLink href="#preorder" className="btn btn-primary" loc="result-preorder">
                      이 스위치로 사전 주문 →
                    </CtaLink>
                    <button className="btn btn-ghost" onClick={restart}>
                      다시 진단하기
                    </button>
                  </div>
                  {derived.mismatch && (
                    <p id="rmismatch">취향은 다른 결이지만, 지금 필요한 상태엔 이 쪽을 추천해요.</p>
                  )}
                </motion.div>
              )
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
