// check-map.mjs — the deterministic half of map quality and post-write verification.
//
// These are CHECKS, not judgements. Whether a map is *good* — whether "Reports"
// is really a sidebar item, whether a sub-feature is a verb — needs reasoning and
// stays in prose (cs-build-import-codebase/references/target-map.md). Everything a
// machine can settle is settled here, identically every run. Read-only.
//
// Usage:
//   bash fetch-project.sh --out /tmp/cs-state
//   node check-map.mjs /tmp/cs-state [--expect-core N] [--min 4] [--max 8] [--json]
//
// Checks:
//   FAIL  duplicate feature titles (case-insensitive, trimmed)
//   FAIL  sub-features flattened to top level (a sub-feature also present in node-features)
//   FAIL  a core feature with no note card
//   FAIL  duplicate PRDs for the same (feature, type)
//   FAIL  a task with no feature link
//   FAIL  --expect-core N given and the count differs
//   WARN  core-feature count outside 4–8 (needs an argument, not a rewrite)
//   WARN  a core feature with no sub-features
//   WARN  a task with no priority
//
// Exit codes: 0 = all pass · 1 = at least one FAIL · 2 = only WARNs · 3 = snapshot unusable

import { readJson, mindmapModel, featureModel, taskModel, prdModel, normTitle } from './parse.mjs';

const args = process.argv.slice(2);
const dir = args[0];
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] !== undefined ? Number(args[i + 1]) : fallback;
};
const MIN = flag('min', 4);
const MAX = flag('max', 8);
const EXPECT = flag('expect-core', null);
const jsonOnly = args.includes('--json');

if (!dir) {
  console.error('usage: node check-map.mjs <snapshot-dir> [--expect-core N] [--min 4] [--max 8] [--json]');
  process.exit(3);
}

const map = mindmapModel(readJson(dir, 'mindmap.json'));
const features = featureModel(readJson(dir, 'features.json'));
const tasks = taskModel(readJson(dir, 'tasks.json'));
const prds = prdModel(readJson(dir, 'prds.json'));

if (!map.ok) {
  console.error(`CANNOT CHECK: ${map.reason}`);
  process.exit(3);
}

const results = [];
const add = (level, check, detail) => results.push({ level, check, detail });

const coreItems = map.coreItems;
const coreCount = coreItems.length;

// --- core-feature count -----------------------------------------------------
if (EXPECT !== null && coreCount !== EXPECT) {
  add('FAIL', 'core-feature count', `expected ${EXPECT}, found ${coreCount} — something created or flattened features`);
} else if (coreCount < MIN || coreCount > MAX) {
  add('WARN', 'core-feature count', `${coreCount} core features (target ${MIN}–${MAX}) — above ${MAX}, argue for each one; well above it usually means an output document or a form was split into features`);
} else {
  add('PASS', 'core-feature count', `${coreCount} core features`);
}

// --- duplicate titles -------------------------------------------------------
const byTitle = new Map();
for (const f of [...coreItems.map((i) => ({ id: String(i.id ?? ''), title: String(i.title ?? '') })), ...features.all]) {
  const key = normTitle(f.title);
  if (!key) continue;
  if (!byTitle.has(key)) byTitle.set(key, new Set());
  byTitle.get(key).add(f.id);
}
const dupes = [...byTitle.entries()].filter(([, ids]) => ids.size > 1);
if (dupes.length) {
  add('FAIL', 'no duplicate titles', dupes.map(([t, ids]) => `"${t}" → ${[...ids].join(', ')}`).join(' · ') + ' — recover with: codespring feature delete <id> --yes');
} else {
  add('PASS', 'no duplicate titles', `${byTitle.size} distinct titles`);
}

// --- flattened sub-features -------------------------------------------------
const coreIds = new Set(coreItems.map((i) => String(i.id ?? '')));
const coreTitles = new Set(coreItems.map((i) => normTitle(i.title)));
const flattened = [];
for (const group of map.subGroups) {
  for (const item of group.items) {
    const id = String(item?.id ?? '');
    if (coreIds.has(id) || coreTitles.has(normTitle(item?.title))) {
      flattened.push({ id, title: String(item?.title ?? ''), parent: group.parentFeatureId });
    }
  }
}
for (const item of coreItems) {
  if (item?.parentFeatureId) {
    flattened.push({ id: String(item.id ?? ''), title: String(item.title ?? ''), parent: String(item.parentFeatureId) });
  }
}
if (flattened.length) {
  add('FAIL', 'no flattened sub-features', flattened.map((f) => `"${f.title}" belongs under ${f.parent}`).join(' · ') + ' — fix with: codespring feature update <subId> --parent <coreId>');
} else {
  add('PASS', 'no flattened sub-features', `${map.subGroups.length} sub-feature groups intact`);
}

// --- a note per core feature ------------------------------------------------
const noteIds = new Set(map.noteIds);
const hasNote = (id) => noteIds.has(`notes-${id}`) || [...noteIds].some((n) => n.endsWith(String(id)));
const missingNotes = coreItems.filter((i) => !hasNote(String(i.id ?? ''))).map((i) => String(i.title ?? i.id));
if (missingNotes.length) {
  add('FAIL', 'a note per core feature', `no note for: ${missingNotes.join(', ')} — never generate a PRD or a task for a feature with no note`);
} else {
  add('PASS', 'a note per core feature', `${noteIds.size} notes`);
}

// --- sub-features present ---------------------------------------------------
const emptyCores = coreItems.filter((i) => !map.subGroups.some((g) => g.parentFeatureId === String(i.id ?? '') && g.items.length));
if (emptyCores.length) {
  add('WARN', 'sub-features present', `no sub-features under: ${emptyCores.map((i) => String(i.title ?? i.id)).join(', ')}`);
} else if (coreItems.length) {
  add('PASS', 'sub-features present', 'every core feature has sub-features');
}

// --- duplicate PRDs ---------------------------------------------------------
const prdKeys = new Map();
for (const p of prds) {
  const key = `${p.featureId ?? '?'}::${normTitle(p.prdType)}`;
  if (!prdKeys.has(key)) prdKeys.set(key, []);
  prdKeys.get(key).push(p.id);
}
const dupPrds = [...prdKeys.entries()].filter(([, ids]) => ids.length > 1);
if (dupPrds.length) {
  add('FAIL', 'no duplicate PRDs', dupPrds.map(([k, ids]) => `${k} × ${ids.length}`).join(' · ') + ' — a client timeout does not stop generation; keep the most complete per (feature, type)');
} else {
  add('PASS', 'no duplicate PRDs', `${prds.length} PRDs`);
}

// --- tasks linked -----------------------------------------------------------
const unlinked = tasks.filter((t) => !t.featureId);
if (unlinked.length) {
  add('FAIL', 'every task linked to a feature', `${unlinked.length} unlinked: ${unlinked.slice(0, 5).map((t) => t.title || t.id).join(' · ')}${unlinked.length > 5 ? ' …' : ''}`);
} else if (tasks.length) {
  add('PASS', 'every task linked to a feature', `${tasks.length} tasks`);
}
const noPriority = tasks.filter((t) => !t.priority);
if (noPriority.length) {
  add('WARN', 'every task carries a severity', `${noPriority.length} without a priority — Critical→urgent, High→high, Medium→medium, Low→low`);
}

// --- report -----------------------------------------------------------------
const fails = results.filter((r) => r.level === 'FAIL');
const warns = results.filter((r) => r.level === 'WARN');

if (jsonOnly) {
  console.log(JSON.stringify({ coreCount, fails: fails.length, warns: warns.length, results }, null, 2));
} else {
  for (const r of results) console.log(`${r.level.padEnd(4)}  ${r.check} — ${r.detail}`);
  console.log(`\n${fails.length} fail, ${warns.length} warn, ${results.length - fails.length - warns.length} pass`);
  if (fails.length) console.log('A FAIL is a machine-checkable defect: fix it before writing anything else.');
  if (warns.length && !fails.length) console.log('WARNs need a human judgement, not an automatic fix.');
}

process.exit(fails.length ? 1 : warns.length ? 2 : 0);
