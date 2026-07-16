"use client";

import { useCallback, useState } from "react";
import Reveal from "./Reveal";

const STATS = [
  { to: 5, suffix: "+", label: "아로마 실무 경력 (년)" },
  { to: 3, suffix: "", label: "v1 블렌드" },
  { to: 1, suffix: "분", label: "호흡 카드" },
];

function useCountUp(to: number, run: boolean) {
  const [n, setN] = useState(0);
  const start = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    const dur = 1200;
    let t0: number | null = null;
    const step = (ts: number) => {
      if (t0 === null) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to]);
  return { n: run ? n : 0, start };
}

export default function Stats() {
  const [entered, setEntered] = useState(false);
  const a = useCountUp(STATS[0].to, entered);
  const b = useCountUp(STATS[1].to, entered);
  const c = useCountUp(STATS[2].to, entered);
  const counters = [a, b, c];

  const onEnter = () => {
    if (entered) return;
    setEntered(true);
    counters.forEach((x) => x.start());
  };

  return (
    <Reveal className="stats wrap" id="story" onEnter={onEnter}>
      <div className="quote">
        <p>
          &ldquo;향은 마음의 언어입니다.
          <br />
          당신의 하루를 정돈하는 작은 약방이 되겠습니다.&rdquo;
        </p>
      </div>
      {STATS.map((s, i) => (
        <div className="stat" key={s.label}>
          <span className="num">
            {counters[i].n}
            {s.suffix}
          </span>
          <small>{s.label}</small>
        </div>
      ))}
      <div className="stat made">
        <b>MADE IN KOREA</b>
        <small>한국에서 정성 제조</small>
      </div>
    </Reveal>
  );
}
