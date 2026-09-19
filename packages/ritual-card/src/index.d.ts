export type BlendId = 'a' | 'b' | 'c';
export type Locale = 'ko' | 'en';
export type MomentCode = 'presentation' | 'meeting' | 'call';
export type PreferenceCode = BlendId | '?';

export interface QuizAnswers {
  /** When the user wants to use it. Context only. */
  q1?: MomentCode | string;
  /** Desired state. Decides the blend. */
  q2: BlendId;
  /** Preferred scent character. Recorded as a preference signal only. */
  q3?: PreferenceCode | string;
}

export interface RitualCard {
  blend: BlendId;
  blendName: string;
  locale: Locale;
  title: string;
  opening: string;
  steps: [string, string, string];
  closing: string;
  why: string;
  mismatchNote: string;
  moment: string | null;
  source: 'openai' | 'fallback';
  model?: string;
  /** Present when source is 'fallback'. e.g. 'no_api_key', 'http_429', 'timeout', 'claim_guard: why contains "..."' */
  fallbackReason?: string;
}

export interface GenerateOptions {
  apiKey?: string;
  model?: string;
  locale?: Locale;
  endpoint?: string;
  fetch?: typeof fetch;
  timeoutMs?: number;
}

export interface BlendInfo {
  id: BlendId;
  name: string;
  ko: { label: string; notes: string };
  en: { label: string; notes: string };
}

export const BLENDS: Readonly<Record<BlendId, BlendInfo>>;
export const QUESTIONS: Readonly<Record<1 | 2 | 3, { ko: string; en: string; options: Record<string, { ko: string; en: string }> }>>;
export const DEFAULT_MODEL: string;
export const DEFAULT_ENDPOINT: string;
export const CARD_SCHEMA: object;
export const FORBIDDEN_PATTERNS: RegExp[];

export function resolveBlend(answers: QuizAnswers): { blend: BlendInfo; mismatch: boolean } | null;
export function findClaimViolation(text: string): { pattern: string; match: string } | null;
export function checkCard(card: unknown, path?: string): { ok: true } | { ok: false; field: string; match: string };
export function fallbackCard(answers: QuizAnswers, locale?: Locale, mismatch?: boolean): RitualCard;
export function buildPrompt(answers: QuizAnswers, locale?: Locale): { instructions: string; input: string; blend: BlendInfo; mismatch: boolean };
export function extractOutputText(payload: unknown): string;
export function generateRitualCard(answers: QuizAnswers, options?: GenerateOptions): Promise<RitualCard>;

export default generateRitualCard;
