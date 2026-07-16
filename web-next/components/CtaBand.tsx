import CtaLink from "./CtaLink";
import Reveal from "./Reveal";

export default function CtaBand() {
  return (
    <Reveal className="cta-band">
      <div className="wrap">
        <h2>다음 회의, 당신의 스위치와 함께.</h2>
        <CtaLink href="#diag" className="btn btn-primary" loc="cta-band">
          내 향 찾기 →
        </CtaLink>
      </div>
    </Reveal>
  );
}
