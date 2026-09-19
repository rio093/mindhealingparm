// node examples/node-usage.js
// Generates a card for each blend. Without OPENAI_API_KEY you get the fallback cards.
import { generateRitualCard } from '../packages/ritual-card/src/index.js';

for (const q2 of ['a', 'b', 'c']) {
  const card = await generateRitualCard({ q1: 'presentation', q2, q3: '?' }, { locale: 'ko' });
  console.log(`\n[${card.blendName}] ${card.title} (${card.source})`);
  card.steps.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
}
