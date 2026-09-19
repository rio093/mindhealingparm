/**
 * @maum/ritual-card — personalised one-minute ritual cards from quiz answers.
 * 3문항 진단 답변을 받아 1분 준비 루틴 카드를 생성하는 모듈.
 *
 * - Calls the OpenAI Responses API with a strict JSON schema.
 * - Runs every generated string through the claim guard.
 * - Falls back to rule-based copy when there is no key, the call fails,
 *   or the copy trips the guard — so a page using this never breaks.
 *
 * Zero runtime dependencies. Node 18+ (global fetch).
 */
import { BLENDS, QUESTIONS, resolveBlend } from './blends.js';
import { checkCard } from './guard.js';
import { fallbackCard } from './fallback.js';

export { BLENDS, QUESTIONS, resolveBlend } from './blends.js';
export { checkCard, findClaimViolation, FORBIDDEN_PATTERNS } from './guard.js';
export { fallbackCard } from './fallback.js';

export const DEFAULT_MODEL = 'gpt-5-mini';
export const DEFAULT_ENDPOINT = 'https://api.openai.com/v1/responses';

/** JSON schema for structured output. Kept strict so the model cannot add fields. */
export const CARD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'opening', 'steps', 'closing', 'why'],
  properties: {
    title: { type: 'string', description: 'Card title, 2-6 words.' },
    opening: { type: 'string', description: 'One sentence that names the moment the user is about to enter.' },
    steps: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: { type: 'string' },
      description: 'Three short instructions: scent (3 seconds), breathing (about 40 seconds), one mental focus.',
    },
    closing: { type: 'string', description: 'One short sentence that closes the ritual.' },
    why: { type: 'string', description: 'One sentence explaining why this blend matches the answer to question 2.' },
  },
};

const STYLE_RULES = {
  ko: `한국어로 쓴다. 짧고 자연스러운 문장. 슬로건이나 과장된 표현은 쓰지 않는다.
허용 어휘: 정돈, 또렷, 전환, 준비, 루틴, 의식, 스위치, 한 박자.
금지: 스트레스 해소, 불안 완화, 집중력 향상, 치료, 효능, 진정 효과, 혈압, 심박 등
신체 지표·질환·의학적 효과를 암시하는 모든 표현. 향은 "결"과 "분위기"로만 설명한다.`,
  en: `Write in plain, natural English. Short sentences, no slogans, no hype.
Preferred vocabulary: settle, clear, switch, prepare, ritual, routine, one beat.
Never imply stress relief, anxiety reduction, improved focus or memory, treatment,
efficacy, sedation, or any body metric. Describe scent only as character and mood.`,
};

function describeAnswers(answers, locale) {
  const lines = [];
  for (const id of [1, 2, 3]) {
    const q = QUESTIONS[id];
    const code = answers[`q${id}`];
    const opt = q.options[code];
    lines.push(`${q[locale]} -> ${opt ? opt[locale] : '(no answer)'}`);
  }
  return lines.join('\n');
}

export function buildPrompt(answers, locale = 'ko') {
  const resolved = resolveBlend(answers);
  if (!resolved) throw new Error('answers.q2 must be one of a, b, c');
  const { blend, mismatch } = resolved;
  const instructions = `You write one-minute pre-meeting ritual cards for an inhalation-only scent stick brand.
The product is a switch into "meeting mode": three seconds of scent, then one minute of breathing.
${STYLE_RULES[locale] || STYLE_RULES.ko}
Return only the JSON object described by the schema.`;
  const input = `Quiz answers:
${describeAnswers(answers, locale)}

Recommended blend (decided by question 2, do not change it): ${blend.name} — ${blend[locale].label}, ${blend[locale].notes}.
${mismatch ? 'The user prefers a different scent character; acknowledge it gently in "why" without changing the blend.' : ''}
Write the card for exactly this moment and this blend.`;
  return { instructions, input, blend, mismatch };
}

/** Extracts the text of the first message in a Responses API payload. */
export function extractOutputText(payload) {
  if (typeof payload?.output_text === 'string') return payload.output_text;
  for (const item of payload?.output || []) {
    if (item.type !== 'message') continue;
    for (const part of item.content || []) {
      if (part.type === 'output_text' && typeof part.text === 'string') return part.text;
      if (part.type === 'refusal') throw new Error(`model refused: ${part.refusal}`);
    }
  }
  throw new Error('no output_text in response');
}

function validateShape(card) {
  if (!card || typeof card !== 'object') return false;
  const strings = ['title', 'opening', 'closing', 'why'];
  if (!strings.every((k) => typeof card[k] === 'string' && card[k].trim())) return false;
  if (!Array.isArray(card.steps) || card.steps.length !== 3) return false;
  return card.steps.every((s) => typeof s === 'string' && s.trim());
}

/**
 * Generate a ritual card.
 *
 * @param {{ q1?: string, q2: 'a'|'b'|'c', q3?: string }} answers  quiz answer codes
 * @param {object} [options]
 * @param {string} [options.apiKey]      defaults to process.env.OPENAI_API_KEY
 * @param {string} [options.model]       defaults to OPENAI_MODEL or gpt-5-mini
 * @param {'ko'|'en'} [options.locale]   default 'ko'
 * @param {string} [options.endpoint]    override the API URL (proxies, tests)
 * @param {typeof fetch} [options.fetch] injectable fetch (tests)
 * @param {number} [options.timeoutMs]   default 12000
 * @returns {Promise<object>} card with `source: 'openai' | 'fallback'` and `fallbackReason` when applicable
 */
export async function generateRitualCard(answers, options = {}) {
  const locale = options.locale === 'en' ? 'en' : 'ko';
  const resolved = resolveBlend(answers);
  if (!resolved) throw new Error('answers.q2 must be one of a, b, c');
  const { blend, mismatch } = resolved;

  const env = typeof process !== 'undefined' ? process.env : {};
  const apiKey = options.apiKey ?? env.OPENAI_API_KEY;
  const model = options.model ?? env.OPENAI_MODEL ?? DEFAULT_MODEL;
  const endpoint = options.endpoint ?? env.OPENAI_ENDPOINT ?? DEFAULT_ENDPOINT;
  const doFetch = options.fetch ?? globalThis.fetch;
  const timeoutMs = options.timeoutMs ?? 12000;

  const withFallback = (reason) => ({ ...fallbackCard(answers, locale, mismatch), fallbackReason: reason });

  if (!apiKey) return withFallback('no_api_key');
  if (typeof doFetch !== 'function') return withFallback('no_fetch');

  const { instructions, input } = buildPrompt(answers, locale);
  const body = {
    model,
    instructions,
    input,
    max_output_tokens: 600,
    text: { format: { type: 'json_schema', name: 'ritual_card', strict: true, schema: CARD_SCHEMA } },
  };

  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const res = await doFetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body),
      signal: controller?.signal,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return withFallback(`http_${res.status}${detail ? `: ${detail.slice(0, 200)}` : ''}`);
    }
    const payload = await res.json();
    let card;
    try {
      card = JSON.parse(extractOutputText(payload));
    } catch (e) {
      return withFallback(`parse_error: ${e.message}`);
    }
    if (!validateShape(card)) return withFallback('invalid_shape');
    const guard = checkCard(card);
    if (!guard.ok) return withFallback(`claim_guard: ${guard.field} contains "${guard.match}"`);

    return {
      blend: blend.id,
      blendName: blend.name,
      locale,
      title: card.title.trim(),
      opening: card.opening.trim(),
      steps: card.steps.map((s) => s.trim()),
      closing: card.closing.trim(),
      why: card.why.trim(),
      mismatchNote: mismatch ? fallbackCard(answers, locale, true).mismatchNote : '',
      moment: QUESTIONS[1].options[answers.q1]?.[locale] || null,
      source: 'openai',
      model,
    };
  } catch (e) {
    return withFallback(e.name === 'AbortError' ? 'timeout' : `network: ${e.message}`);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export default generateRitualCard;
