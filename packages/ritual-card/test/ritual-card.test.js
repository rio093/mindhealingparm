import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateRitualCard,
  fallbackCard,
  resolveBlend,
  checkCard,
  findClaimViolation,
  buildPrompt,
  extractOutputText,
  CARD_SCHEMA,
} from '../src/index.js';

const GOOD_CARD = {
  title: '또렷함의 1분',
  opening: '시작 직전, 초점을 맞추는 시간입니다.',
  steps: ['스틱을 코앞에 두고 3초 들이마십니다.', '4초 들이쉬고 4초 내쉬기를 세 번.', '첫 문장을 되뇌어 봅니다.'],
  closing: '준비됐습니다.',
  why: '또렷한 모드를 골라서 CLEAR MINT를 추천합니다.',
};

function fakeFetch(handler) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init: { ...init, body: JSON.parse(init.body) } });
    return handler(url, init);
  };
  fn.calls = calls;
  return fn;
}

const okResponse = (card) => ({
  ok: true,
  status: 200,
  json: async () => ({ output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(card) }] }] }),
  text: async () => '',
});

test('resolveBlend: q2 decides, q3 is only a preference signal', () => {
  assert.equal(resolveBlend({ q2: 'b', q3: 'a' }).blend.id, 'b');
  assert.equal(resolveBlend({ q2: 'b', q3: 'a' }).mismatch, true);
  assert.equal(resolveBlend({ q2: 'b', q3: '?' }).mismatch, false);
  assert.equal(resolveBlend({ q2: 'b', q3: 'b' }).mismatch, false);
  assert.equal(resolveBlend({ q2: 'x' }), null);
});

test('fallbackCard returns a complete card for every blend and locale', () => {
  for (const q2 of ['a', 'b', 'c']) {
    for (const locale of ['ko', 'en']) {
      const c = fallbackCard({ q1: 'meeting', q2, q3: '?' }, locale);
      assert.equal(c.blend, q2);
      assert.equal(c.steps.length, 3);
      assert.equal(c.source, 'fallback');
      assert.ok(c.moment);
      assert.equal(checkCard(c).ok, true, `fallback ${locale}/${q2} must pass the claim guard`);
    }
  }
});

test('claim guard catches medical and body-metric language in both languages', () => {
  assert.ok(findClaimViolation('스트레스 해소에 도움'));
  assert.ok(findClaimViolation('불안을 완화합니다'));
  assert.ok(findClaimViolation('집중력 향상'));
  assert.ok(findClaimViolation('심박수를 낮춥니다'));
  assert.ok(findClaimViolation('Reduces anxiety before meetings'));
  assert.ok(findClaimViolation('lowers your heart rate'));
  assert.ok(findClaimViolation('clinically proven'));
  assert.equal(findClaimViolation('정돈된 집중으로 전환하는 준비 의식'), null);
  assert.equal(findClaimViolation('A one-beat switch into meeting mode.'), null);
});

test('generateRitualCard: no API key -> fallback with reason', async () => {
  const card = await generateRitualCard({ q1: 'call', q2: 'a', q3: 'a' }, { apiKey: '', fetch: fakeFetch(() => { throw new Error('must not be called'); }) });
  assert.equal(card.source, 'fallback');
  assert.equal(card.fallbackReason, 'no_api_key');
});

test('generateRitualCard: happy path sends strict schema and returns openai card', async () => {
  const f = fakeFetch(() => okResponse(GOOD_CARD));
  const card = await generateRitualCard({ q1: 'presentation', q2: 'b', q3: 'a' }, { apiKey: 'sk-test', fetch: f, model: 'test-model' });
  assert.equal(card.source, 'openai');
  assert.equal(card.model, 'test-model');
  assert.equal(card.blend, 'b');
  assert.equal(card.title, GOOD_CARD.title);
  assert.ok(card.mismatchNote, 'mismatch note present when q3 differs from blend');

  const req = f.calls[0];
  assert.equal(req.init.headers.authorization, 'Bearer sk-test');
  assert.equal(req.init.body.model, 'test-model');
  assert.equal(req.init.body.text.format.type, 'json_schema');
  assert.equal(req.init.body.text.format.strict, true);
  assert.deepEqual(req.init.body.text.format.schema, CARD_SCHEMA);
  assert.match(req.init.body.input, /CLEAR MINT/);
});

test('generateRitualCard: generated copy with a claim -> fallback', async () => {
  const bad = { ...GOOD_CARD, why: '스트레스 해소에 효과적입니다.' };
  const card = await generateRitualCard({ q2: 'a' }, { apiKey: 'sk-test', fetch: fakeFetch(() => okResponse(bad)) });
  assert.equal(card.source, 'fallback');
  assert.match(card.fallbackReason, /^claim_guard: why/);
});

test('generateRitualCard: HTTP error, bad JSON, wrong shape, network error all fall back', async () => {
  const cases = [
    [() => ({ ok: false, status: 429, text: async () => 'rate limited' }), /^http_429/],
    [() => ({ ok: true, status: 200, json: async () => ({ output: [{ type: 'message', content: [{ type: 'output_text', text: '{not json' }] }] }) }), /^parse_error/],
    [() => okResponse({ title: 'x' }), /^invalid_shape/],
    [() => { throw new Error('ECONNRESET'); }, /^network: ECONNRESET/],
  ];
  for (const [handler, reason] of cases) {
    const card = await generateRitualCard({ q2: 'c' }, { apiKey: 'sk-test', fetch: fakeFetch(handler) });
    assert.equal(card.source, 'fallback');
    assert.match(card.fallbackReason, reason);
  }
});

test('buildPrompt: english locale uses english rules and blend label', () => {
  const { instructions, input } = buildPrompt({ q1: 'meeting', q2: 'c', q3: 'c' }, 'en');
  assert.match(instructions, /plain, natural English/);
  assert.match(input, /ENERGY CITRUS — Fresh reset/);
  assert.throws(() => buildPrompt({ q2: 'z' }), /q2 must be one of/);
});

test('extractOutputText handles output_text shortcut and refusals', () => {
  assert.equal(extractOutputText({ output_text: 'hi' }), 'hi');
  assert.throws(() => extractOutputText({ output: [{ type: 'message', content: [{ type: 'refusal', refusal: 'no' }] }] }), /refused/);
  assert.throws(() => extractOutputText({ output: [] }), /no output_text/);
});
