import Reveal from "./Reveal";

const QA = [
  {
    q: "어떻게 사용하나요?",
    a: "스틱을 열어 코앞에 대고 천천히 향을 맡은 뒤, 동봉된 카드의 1분 호흡을 따라가면 됩니다. 피부에 바르지 않는 흡입 전용이라 자리에서도 티 나지 않게 쓸 수 있어요.",
  },
  {
    q: "세 가지 향, 뭐가 다른가요?",
    a: "Calm Basil은 정돈된 결, Clear Mint는 또렷한 결, Energy Citrus는 산뜻한 리프레시의 결입니다. 위 향 매칭 진단으로 지금 상황에 맞는 향을 추천받을 수 있어요.",
  },
  {
    q: "향이 너무 강하지 않나요?",
    a: "코앞에서 짧게 맡는 용도로 농도를 맞췄습니다. 주변에 퍼지지 않도록 설계했어요.",
  },
  {
    q: "배송은 언제 되나요?",
    a: "사전 주문은 수량 한정으로 받고, 제작 완료 후 순차 발송합니다. 주문 시 예상 일정을 안내드려요.",
  },
];

export default function Faq() {
  return (
    <Reveal className="faq wrap">
      <span className="eyebrow center">FAQ</span>
      <h2>자주 묻는 질문</h2>
      {QA.map((x) => (
        <details key={x.q}>
          <summary>{x.q}</summary>
          <p>{x.a}</p>
        </details>
      ))}
    </Reveal>
  );
}
