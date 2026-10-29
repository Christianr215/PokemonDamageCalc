import { readFileSync, writeFileSync } from 'node:fs';

const FORMAT = 'gen9championsvgc2026regmc';
const ROOT = `https://www.pikalytics.com/pokedex/${FORMAT}`;
const headers = { 'User-Agent': 'personal-champions-calc (one-off fetch)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const MAX_PAGES = 450;

const LINK = new RegExp(`/pokedex/${FORMAT}/([A-Za-z0-9%.'’_-]+)`, 'g');
const safeDecode = (s) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};
const isMega = (n) => /-Mega(-[XYZ])?$/i.test(n);
const findNames = (html) =>
  [...html.matchAll(LINK)].map((m) => m[1]).filter((n) => !isMega(safeDecode(n)));

// Seed the crawl with every single-word Pokémon in the roster file
let rosterNames = [];
try {
  const src = readFileSync('src/ChampionsRoster.ts', 'utf8');
  const block = src.match(/`([^`]*)`/)?.[1] ?? '';
  rosterNames = block
    .split(',')
    .map((s) => s.trim())
    .filter((s) => /^[A-Za-z]+$/.test(s));
} catch {
  console.log('Could not read src/ChampionsRoster.ts, crawling from links only');
}

const index = await (await fetch(ROOT, { headers })).text();
const queue = [...new Set([...rosterNames, ...findNames(index)])];
const seen = new Set(queue);
const table = {};

for (let i = 0; i < queue.length && i < MAX_PAGES; i++) {
  const name = queue[i];
  const label = safeDecode(name);
  try {
    const res = await fetch(`${ROOT}/${name}`, { headers });
    if (!res.ok) {
      console.log(`[${i + 1}/${queue.length}] ${label}: HTTP ${res.status}`);
      await sleep(1200);
      continue;
    }
    const html = await res.text();

    // Discover more forms from this page's teammate / next-Pokémon links
    for (const n of findNames(html)) {
      if (!seen.has(n)) {
        seen.add(n);
        queue.push(n);
      }
    }

    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const m = text.match(/top moves for .*? are (.*?)\. These represent/i);
    const moves = m
      ? m[1]
          .split(/\)\s*,\s*/)
          .map((s) => s.replace(/\s*\([^)]*\)?\s*$/, '').trim())
          .filter(Boolean)
      : [];

    if (moves.length === 0) {
      console.log(`[${i + 1}/${queue.length}] ${label}: no moves`);
    } else {
      table[label] = moves.slice(0, 4);
      console.log(`[${i + 1}/${queue.length}] ${label}: ${table[label].join(', ')}`);
    }
  } catch (e) {
    console.log(`[${i + 1}/${queue.length}] ${label}: ${e.message}`);
  }
  await sleep(1200);
}

const body = Object.entries(table)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([n, m]) => `  ${JSON.stringify(n)}: ${JSON.stringify(m)},`)
  .join('\n');

const out = `// Generated ${new Date().toISOString().slice(0, 10)} from Pikalytics (${FORMAT}).
// Forms with no entry (like most Megas) fall back to their base Pokémon.
const topMoves: Record<string, string[]> = {
${body}
};

export function topMovesFor(species: string): string[] {
  const base = species.replace(/-Mega(-[XYZ])?$/i, '');
  const own = topMoves[species];
  if (own && own.length > 0) return own;
  return topMoves[base] ?? [];
}
`;
writeFileSync('src/TopMoves.ts', out);

const missing = rosterNames.filter((n) => !table[n]);
console.log(`\nWrote ${Object.keys(table).length} entries to src/TopMoves.ts`);
console.log(`Roster Pokémon with no preset (${missing.length}): ${missing.join(', ')}`);