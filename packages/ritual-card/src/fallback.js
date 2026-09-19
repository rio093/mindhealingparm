/**
 * Rule-based fallback cards. Used when no API key is set, the API fails,
 * or the generated copy trips the claim guard.
 * 규칙 기반 폴백 카드. API 키가 없거나, 호출이 실패하거나,
 * 생성 문구가 클레임 가드에 걸리면 이 카드를 돌려줍니다.
 */
import { BLENDS, QUESTIONS } from './blends.js';

const CARDS = {
  ko: {
    a: {
      title: '정돈의 1분',
      opening: '들어가기 전, 흩어진 생각을 한 줄로 모으는 시간입니다.',
      steps: [
        '스틱을 코앞에 두고 3초, 베르가못과 바질의 결을 천천히 들이마십니다.',
        '4초 들이쉬고 6초 내쉬기를 세 번 반복하며 어깨의 힘을 내려놓습니다.',
        '오늘 꼭 전할 한 문장을 마음속으로 정리합니다.',
      ],
      closing: '준비됐습니다. 정돈된 채로 들어가세요.',
      why: '원하는 상태로 "정돈된 집중"을 골라서, 차분하게 정리되는 CALM BASIL을 추천합니다.',
    },
    b: {
      title: '또렷함의 1분',
      opening: '시작 직전, 생각의 초점을 또렷하게 맞추는 시간입니다.',
      steps: [
        '스틱을 코앞에 두고 3초, 자몽과 페퍼민트의 결을 짧고 선명하게 들이마십니다.',
        '코로 4초 들이쉬고 입으로 4초 내쉬기를 세 번 반복합니다.',
        '첫 문장을 소리 내지 않고 한 번 되뇌어 봅니다.',
      ],
      closing: '준비됐습니다. 또렷하게 시작하세요.',
      why: '원하는 상태로 "또렷한 모드"를 골라서, 생각을 선명하게 정리하는 CLEAR MINT를 추천합니다.',
    },
    c: {
      title: '리프레시의 1분',
      opening: '분위기를 가볍게 바꾸고 새로 시작하는 시간입니다.',
      steps: [
        '스틱을 코앞에 두고 3초, 시트러스의 밝은 결을 들이마십니다.',
        '크게 한 번 들이쉬고 길게 내쉰 뒤, 편안한 호흡을 세 번 이어갑니다.',
        '지금 이 자리에서 기대하는 분위기를 한 단어로 떠올립니다.',
      ],
      closing: '준비됐습니다. 산뜻하게 들어가세요.',
      why: '원하는 상태로 "산뜻한 리프레시"를 골라서, 분위기를 가볍게 바꾸는 ENERGY CITRUS를 추천합니다.',
    },
    mismatch: '평소 끌리는 향의 결과는 다르지만, 지금 원하는 상태에는 이 블렌드가 더 맞습니다.',
  },
  en: {
    a: {
      title: 'One minute to settle',
      opening: 'Before you walk in, gather scattered thoughts into a single line.',
      steps: [
        'Hold the stick just below your nose for three seconds and take in the bergamot and basil.',
        'Breathe in for four counts and out for six, three times, letting your shoulders drop.',
        'Name the one sentence you must deliver today.',
      ],
      closing: 'Ready. Walk in settled.',
      why: 'You chose "settled and focused", so CALM BASIL is the blend that fits this moment.',
    },
    b: {
      title: 'One minute to sharpen',
      opening: 'Right before you start, bring your thinking into focus.',
      steps: [
        'Hold the stick just below your nose for three seconds and take a short, crisp breath of grapefruit and peppermint.',
        'Breathe in through your nose for four counts and out through your mouth for four, three times.',
        'Run your opening line once in your head.',
      ],
      closing: 'Ready. Start clear.',
      why: 'You chose "clear and alert", so CLEAR MINT is the blend that fits this moment.',
    },
    c: {
      title: 'One minute to reset',
      opening: 'Lighten the mood and begin again.',
      steps: [
        'Hold the stick just below your nose for three seconds and take in the bright citrus.',
        'One big breath in, a long breath out, then three easy breaths.',
        'Picture the mood you want in the room in a single word.',
      ],
      closing: 'Ready. Walk in fresh.',
      why: 'You chose "fresh and reset", so ENERGY CITRUS is the blend that fits this moment.',
    },
    mismatch: 'It is not the scent character you usually lean toward, but it fits the state you want right now.',
  },
};

/**
 * @param {{ q1?: string, q2: 'a'|'b'|'c', q3?: string }} answers
 * @param {'ko'|'en'} locale
 */
export function fallbackCard(answers, locale = 'ko', mismatch = false) {
  const lang = CARDS[locale] ? locale : 'ko';
  const blend = BLENDS[answers?.q2] || BLENDS.a;
  const base = CARDS[lang][blend.id];
  const moment = QUESTIONS[1].options[answers?.q1]?.[lang] || null;
  return {
    blend: blend.id,
    blendName: blend.name,
    locale: lang,
    title: base.title,
    opening: base.opening,
    steps: [...base.steps],
    closing: base.closing,
    why: base.why,
    mismatchNote: mismatch ? CARDS[lang].mismatch : '',
    moment,
    source: 'fallback',
  };
}
