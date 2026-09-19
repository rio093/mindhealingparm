/**
 * Blend catalogue shared by the landing page quiz and the ritual-card module.
 * 랜딩 페이지 진단과 ritual-card 모듈이 함께 쓰는 블렌드 목록.
 *
 * Keys match `data-w` values in index.html and `Blend` in web-next.
 * Replace this file to adapt the module to your own product line.
 */
export const BLENDS = Object.freeze({
  a: Object.freeze({
    id: 'a',
    name: 'CALM BASIL',
    ko: { label: '정돈된 집중', notes: '베르가못·바질 결' },
    en: { label: 'Settled focus', notes: 'bergamot and basil' },
  }),
  b: Object.freeze({
    id: 'b',
    name: 'CLEAR MINT',
    ko: { label: '또렷한 모드', notes: '자몽·페퍼민트 결' },
    en: { label: 'Clear mode', notes: 'grapefruit and peppermint' },
  }),
  c: Object.freeze({
    id: 'c',
    name: 'ENERGY CITRUS',
    ko: { label: '산뜻한 리프레시', notes: '시트러스 결' },
    en: { label: 'Fresh reset', notes: 'bright citrus' },
  }),
});

/** Quiz option text, used to turn raw answer codes into readable context. */
export const QUESTIONS = Object.freeze({
  1: Object.freeze({
    ko: '주로 언제 쓰고 싶나요?',
    en: 'When would you use it most?',
    options: Object.freeze({
      presentation: { ko: '발표·피칭 직전', en: 'right before a presentation or pitch' },
      meeting: { ko: '긴장되는 오후 미팅', en: 'a tense afternoon meeting' },
      call: { ko: '아침 첫 콜·중요 통화', en: 'the first call of the morning or an important call' },
    }),
  }),
  2: Object.freeze({
    ko: '그 순간, 원하는 나의 상태는?',
    en: 'In that moment, how do you want to feel?',
    options: Object.freeze({
      a: { ko: '정돈된 집중', en: 'settled and focused' },
      b: { ko: '또렷한 모드', en: 'clear and alert' },
      c: { ko: '산뜻한 리프레시', en: 'fresh and reset' },
    }),
  }),
  3: Object.freeze({
    ko: '끌리는 향의 결은?',
    en: 'Which scent character appeals to you?',
    options: Object.freeze({
      a: { ko: '은은하고 부드러운', en: 'soft and subtle' },
      b: { ko: '상큼하고 시원한', en: 'crisp and cool' },
      c: { ko: '밝고 산뜻한', en: 'bright and fresh' },
      '?': { ko: '잘 모르겠어요', en: 'not sure' },
    }),
  }),
});

/**
 * Same rule as the landing page: question 2 decides the blend,
 * question 3 is only a preference signal.
 */
export function resolveBlend(answers) {
  const blend = BLENDS[answers?.q2];
  if (!blend) return null;
  const pref = answers?.q3;
  const mismatch = pref != null && pref !== '?' && pref !== blend.id;
  return { blend, mismatch };
}
