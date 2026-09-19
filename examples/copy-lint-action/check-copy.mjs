#!/usr/bin/env node
// examples/copy-lint-action/check-copy.mjs
// Lints HTML / Markdown / text files for medical or body-metric claims using the
// claim guard from @maum/ritual-card. Exits 1 when a violation is found.
//
//   node check-copy.mjs index.html README.md "content/**/*.md"
//
// 웰니스 카피 린터. 신체지표·질환·의학 효과로 읽힐 수 있는 표현을 찾아 CI를 실패시킵니다.

import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { findClaimViolation } from '@maum/ritual-card/guard';

const patterns = process.argv.slice(2);
if (!patterns.length) {
  console.error('usage: check-copy.mjs <file or glob> ...');
  process.exit(2);
}

let failures = 0;
for (const pattern of patterns) {
  for (const file of globSync(pattern)) {
    const text = readFileSync(file, 'utf8').replace(/<[^>]+>/g, ' ');
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      const v = findClaimViolation(line);
      if (v) {
        failures += 1;
        console.log(`${file}:${i + 1}: "${v.match}" — ${line.trim().slice(0, 100)}`);
      }
    });
  }
}

if (failures) {
  console.error(`\n${failures} claim(s) need rewording. See README copy guidelines.`);
  process.exit(1);
}
console.log('copy check passed');
