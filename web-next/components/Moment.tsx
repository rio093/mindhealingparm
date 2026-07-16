import Reveal from "./Reveal";

export default function Moment() {
  return (
    <Reveal className="moment" id="moment">
      <div className="wrap">
        <span className="eyebrow">그 순간</span>
        <p className="moment-lead">
          중요한 피칭 직전.
          <br />
          <em>스스로를 다잡고 싶은</em> 그 3분.
        </p>
        <p className="moment-body">
          커피는 이미 세 잔. 심호흡은 자리에서 하기 어색하고, 명상 앱은 지금 이 순간엔 켤 수 없다.
          영업·컨설턴트에게 그 순간은 매주 몇 번씩 온다. 마음약방은 그 3분을 위한 나만의 준비 의식을
          손안에 담았다.
        </p>
      </div>
    </Reveal>
  );
}
