import { Fragment } from "react";
import Reveal from "./Reveal";

const SVG = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** 사용법 3단계. 아이콘이 아니라 사용 설명 일러스트 — 적재적소라 유지. */
const STEPS = [
  {
    n: "01 · 열고",
    d: "스틱을 열고 코앞에 가져와요.",
    ill: (
      <svg viewBox="0 0 48 48" {...SVG}>
        <rect x="18" y="19" width="12" height="23" rx="6" />
        <rect x="19" y="7" width="10" height="8.5" rx="4" className="lift" />
        <path d="M32 10l3.5-2.2M33.5 14l3.5-1.4" className="lift" />
      </svg>
    ),
  },
  {
    n: "02 · 향을 맡고",
    d: "천천히 숨을 들이쉬며 3번 호흡해요.",
    ill: (
      <svg viewBox="0 0 48 48" {...SVG}>
        <path d="M31 9c-6.5 2-10.5 7.5-10.5 14.5 0 5 3 8.5 3 12.5M20.5 23h-4.5" />
        <path className="wave" d="M8 17c2.2-1.2 4.4-1.2 6.5 0" />
        <path className="wave" d="M7 23c2.2-1.2 4.4-1.2 6.5 0" />
        <path className="wave" d="M8 29c2.2-1.2 4.4-1.2 6.5 0" />
      </svg>
    ),
  },
  {
    n: "03 · 모드 전환",
    d: "1분간 집중하며 회의를 시작하세요.",
    ill: (
      <svg viewBox="0 0 48 48" {...SVG}>
        <circle cx="24" cy="16" r="5" />
        <path d="M13 39c0-6.5 5-11 11-11s11 4.5 11 11" />
        <circle className="calm" cx="24" cy="24" r="20" />
      </svg>
    ),
  },
];

export default function Product() {
  return (
    <Reveal className="prod-sec wrap" id="product">
      <div className="prod-grid">
        <div className="prod-copy">
          <span className="eyebrow">제품</span>
          <h2>
            흡입 스틱 +<br />1분 호흡 카드
          </h2>
          <p className="lead">
            피부에 바르지 않는 흡입 전용. 향을 코앞에 대고 맡은 뒤, 카드의 1분 호흡을 따라간다. 향과
            행동을 하나로 묶은 준비 루틴.
          </p>
        </div>

        <div className="routine" id="routine">
          {STEPS.map((s, i) => (
            <Fragment key={s.n}>
              {i > 0 && (
                <div className="arrow" aria-hidden="true">
                  →
                </div>
              )}
              <div className="step">
                <div className="step-ill" aria-hidden="true">
                  {s.ill}
                </div>
                <b>{s.n}</b>
                <small>{s.d}</small>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
