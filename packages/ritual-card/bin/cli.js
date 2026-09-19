#!/usr/bin/env node
/**
 * ritual-card CLI
 *   npx ritual-card --q1 presentation --q2 b --q3 a --locale ko
 *   OPENAI_API_KEY=sk-... npx ritual-card --q2 a
 * Without a key it prints the rule-based fallback card.
 */
import { generateRitualCard } from '../src/index.js';

const args = process.argv.slice(2);
const opts = { q1: 'presentation', q2: 'a', q3: '?', locale: 'ko', json: false };
for (let i = 0; i < args.length; i += 1) {
  const a = args[i];
  if (a === '--json') opts.json = true;
  else if (a === '--help' || a === '-h') {
    console.log(`usage: ritual-card [--q1 presentation|meeting|call] [--q2 a|b|c] [--q3 a|b|c|?] [--locale ko|en] [--json]`);
    process.exit(0);
  } else if (a.startsWith('--')) {
    opts[a.slice(2)] = args[i + 1];
    i += 1;
  }
}

const card = await generateRitualCard({ q1: opts.q1, q2: opts.q2, q3: opts.q3 }, { locale: opts.locale });

if (opts.json) {
  console.log(JSON.stringify(card, null, 2));
} else {
  console.log(`\n${card.blendName} · ${card.title}\n`);
  console.log(card.opening);
  card.steps.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
  console.log(card.closing);
  console.log(`\n— ${card.why}`);
  if (card.mismatchNote) console.log(`— ${card.mismatchNote}`);
  console.log(`\n[source: ${card.source}${card.fallbackReason ? ` / ${card.fallbackReason}` : ''}]`);
}
