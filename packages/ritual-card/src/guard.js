/**
 * Claim guard — keeps generated copy on the "situation / mood / ritual" side.
 * 클레임 가드 — 생성된 문구가 상황·무드·루틴 표현에 머물도록 검사합니다.
 *
 * Anything that could read as a body-metric, disease, or medical claim is
 * rejected so the caller can fall back to safe template copy.
 * Patterns are deliberately broad. Loosen them only with a compliance review.
 */

export const FORBIDDEN_PATTERNS = [
  // 의학·질환·치료 (KO)
  /치료|치유|처방|효능|효과가\s*입증|임상|의학적|약효|증상|질환|질병/,
  /불안(을|이|감)?\s*(해소|완화|감소|줄)/,
  /스트레스\s*(해소|완화|감소|줄|없)/,
  /우울|공황|불면|수면\s*(개선|유도)|진정\s*(효과|작용)|안정제/,
  // 신체 지표·인지 능력 (KO)
  /혈압|심박|맥박|코르티솔|호르몬|뇌파|산소포화도/,
  /집중력\s*(향상|개선|상승|증가)|기억력|인지\s*(능력|기능)|두뇌\s*활성/,
  /피로\s*(회복|해소)|면역|다이어트|체중/,
  // Medical / disease / treatment (EN)
  /\b(cure|cures|treat|treats|treatment|therapy|therapeutic|clinical|clinically|medical|medicine|prescri\w+|symptom\w*|disease|disorder)\b/i,
  /\b(anxiety|depress\w*|panic|insomnia|sedat\w*|stress relief|relieve[sd]? stress|reduce[sd]? stress)\b/i,
  // Body metrics / cognitive performance (EN)
  /\b(blood pressure|heart rate|pulse|cortisol|hormone\w*|brain ?waves?|oxygen)\b/i,
  /\b(boost\w* (focus|memory|concentration|cognition)|improve[sd]? (focus|memory|concentration|cognition)|cognitive (performance|function)|memory)\b/i,
  /\b(immune|immunity|weight loss|fatigue)\b/i,
];

/** Returns the first forbidden match in `text`, or null if the text is clean. */
export function findClaimViolation(text) {
  if (typeof text !== 'string' || !text) return null;
  for (const re of FORBIDDEN_PATTERNS) {
    const m = text.match(re);
    if (m) return { pattern: re.source, match: m[0] };
  }
  return null;
}

/**
 * Checks every string field (recursively) in a card object.
 * Returns `{ ok: true }` or `{ ok: false, field, match }`.
 */
export function checkCard(card, path = '') {
  if (typeof card === 'string') {
    const v = findClaimViolation(card);
    return v ? { ok: false, field: path || '(root)', match: v.match } : { ok: true };
  }
  if (Array.isArray(card)) {
    for (let i = 0; i < card.length; i += 1) {
      const r = checkCard(card[i], `${path}[${i}]`);
      if (!r.ok) return r;
    }
    return { ok: true };
  }
  if (card && typeof card === 'object') {
    for (const [k, v] of Object.entries(card)) {
      const r = checkCard(v, path ? `${path}.${k}` : k);
      if (!r.ok) return r;
    }
  }
  return { ok: true };
}
