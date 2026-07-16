import Reveal from "./Reveal";
import CtaLink from "./CtaLink";

const TRUST = [
  "천연 유래 향료 기반",
  "아로마 실무 전문가 블렌딩",
  "국내 제조 · 소량 블렌딩",
  "사용법 카드 동봉",
];

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <Reveal as="div" className="hero-copy">
          <span className="eyebrow">FOCUS SWITCH ON</span>
          <h1>
            회의 전, 나를 바꾸는
            <br />
            <span className="hl">1분</span> 향 스위치
          </h1>
          <p className="hero-sub">
            발표, 피칭, 미팅 직전.
            <br />
            향으로 숨을 고르고, 모드를 전환하세요.
          </p>
          <div className="hero-cta">
            <CtaLink href="#diag" className="btn btn-primary" loc="hero">
              내 회의 모드 찾기 <span className="dim">(3문항 진단)</span> →
            </CtaLink>
            <a href="#routine" className="btn btn-ghost">
              ▶ 1분 루틴 알아보기
            </a>
          </div>
          <ul className="trust-row">
            {TRUST.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="div" className="hero-scene">
          <div className="stage" aria-hidden="true">
            <div className="stone" />
            <div className="inhaler float">
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
            </div>
            <div className="lid" />
            <div className="rx float-slow">
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
            </div>
          </div>
        </Reveal>
      </div>
      <div className="scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
