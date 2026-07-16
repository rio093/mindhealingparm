"use client";

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
    note: "주 결정",
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
  // State: 문항별 선택 하나. 결과는 여기서 파생 — 별도 결과 상태를 두지 않는다.
  const [picked, setPicked] = useState<Partial<Record<QId, Choice>>>({});
  const [shown, setShown] = useState(false);
  const { setResult } = useLanding();
  const resultRef = useRef<HTMLDivElement>(null);

  const complete = QUESTIONS.every((q) => picked[q.id] !== undefined);

  // 파생 상태: Q2 = 주 배정축, Q3 = 선호 불일치 신호(표준화 검증용)
  const derived = useMemo(() => {
    const q2 = picked[2]?.w;
    if (!q2 || q2 === "0" || q2 === "?") return null;
    const blend = q2 as Blend;
    const q3 = picked[3]?.w;
    const mismatch = q3 !== undefined && q3 !== "?" && q3 !== blend;
    const diag = `q1=${picked[1]?.t} q2=${picked[2]?.t} q3=${picked[3]?.t} blend=${blend} mismatch=${mismatch}`;
    return { blend, mismatch, diag };
  }, [picked]);

  function show() {
    if (!complete || !derived) return;
    setShown(true);
    setResult(derived.blend, derived.diag); // 폼이 이 상태를 구독
    track("진단완료", {
      blend: derived.blend,
      mismatch: String(derived.mismatch),
      preference: picked[3]?.w ?? "none",
    });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resultRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }

  return (
    <section className="diag-sec" id="diag">
      <div className="wrap">
        <Reveal as="div" className="diag-head">
          <span className="eyebrow center">향 매칭 진단</span>
          <h2>3가지 질문, 당신의 스위치</h2>
          <p>지금 필요한 상태를 고르면, 맞는 향을 추천합니다.</p>
        </Reveal>

        <Reveal as="div" className="diag">
          {QUESTIONS.map((q) => (
            <div className="q" key={q.id}>
              <div className="qt">
                <span className="qn">Q{q.id}</span> {q.label}
                {q.note && <em>{q.note}</em>}
              </div>
              <div className="opts">
                {q.opts.map((o) => {
                  const selected = picked[q.id]?.t === o.t;
                  return (
                    <button
                      key={o.t}
                      className={`opt ${selected ? "sel" : ""}`}
                      aria-pressed={selected}
                      onClick={() => setPicked((p) => ({ ...p, [q.id]: o }))}
                    >
                      {o.t}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="diag-actions">
            <button className="btn btn-primary" onClick={show}>
              내 스위치 보기 →
            </button>
            <span id="diagHint">
              {complete ? "준비 완료 — 결과를 확인하세요" : "세 질문에 모두 답해주세요"}
            </span>
          </div>

          <div
            className={`result ${shown && derived ? "show" : ""}`}
            ref={resultRef}
            aria-live="polite"
          >
            {shown && derived && (
              <>
                <span className="eyebrow">당신의 스위치</span>
                <div className={`rcard ${derived.blend}`}>
                  <div className="rswatch" />
                  <div className="rmeta">
                    <h3>{BLENDS[derived.blend].name}</h3>
                    <p>{BLENDS[derived.blend].desc}</p>
                  </div>
                </div>
                <div className="ractions">
                  <CtaLink href="#preorder" className="btn btn-primary" loc="result-preorder">
                    이 스위치로 사전 주문 →
                  </CtaLink>
                  <span id="rmismatch">
                    {derived.mismatch
                      ? "취향은 다른 결이지만, 지금 필요한 상태엔 이 쪽을 추천해요."
                      : ""}
                  </span>
                </div>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
