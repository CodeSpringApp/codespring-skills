// state.mjs — the state-detection block, as a deterministic script.
//
// Prints the one-line summary every skill must show before it does anything,
// then the booleans and counts from references/project-state.md. Read-only.
//
// Usage:
//   bash fetch-project.sh --out /tmp/cs-state
//   node state.mjs /tmp/cs-state [--json]
//
// Exit codes: 0 = state read · 1 = snapshot unusable (not linked, or the mindmap could not be parsed)

import { readJson, mindmapModel, featureModel, taskModel, prdModel, highestTaskNumber } from './parse.mjs';

const dir = process.argv[2];
const jsonOnly = process.argv.includes('--json');

if (!dir) {
  console.error('usage: node state.mjs <snapshot-dir> [--json]   (make one with: bash fetch-project.sh --out <dir>)');
  process.exit(1);
}

const repo = readJson(dir, 'repo.json', {});
if (repo.linked === false) {
  console.error('NOT LINKED — no local .codespring/config.json. Link the project before anything else.');
  process.exit(1);
}

const map = mindmapModel(readJson(dir, 'mindmap.json'));
const features = featureModel(readJson(dir, 'features.json'));
const tasks = taskModel(readJson(dir, 'tasks.json'));
const prds = prdModel(readJson(dir, 'prds.json'));

// Core-feature count: the mindmap's node-features items are authoritative
// (that is the list the canvas draws, and the list pitfalls.md §2 inflates).
const coreCount = map.ok ? map.coreItems.length : features.core.length;
const subCount = map.subGroups.length
  ? map.subGroups.reduce((n, g) => n + g.items.length, 0)
  : features.sub.length;

const state = {
  projectId: repo.projectId ?? null,
  cwd: repo.cwd ?? null,
  linked: true,
  coreFeatures: coreCount,
  subFeatures: subCount,
  notes: map.noteIds.length,
  prds: prds.length,
  tasks: tasks.length,
  tasksByStatus: tasks.reduce((acc, t) => ({ ...acc, [t.status || 'unknown']: (acc[t.status || 'unknown'] ?? 0) + 1 }), {}),
  highestTaskNumber: highestTaskNumber(tasks),
  audited: Boolean(repo.findingsMd),
  stack: map.techItems.length > 0,
  mindmapParsed: map.ok,
};

if (jsonOnly) {
  console.log(JSON.stringify(state, null, 2));
} else {
  const bits = [
    `${state.coreFeatures} core features`,
    `${state.subFeatures} sub-features`,
    `${state.notes} notes`,
    `${state.prds} PRDs`,
    `${state.tasks} tasks`,
  ];
  console.log(`Project ${state.projectId} — ${bits.join(', ')}. Audit: ${state.audited ? 'FINDINGS.md present' : 'not yet'}.`);
  console.log(JSON.stringify(state, null, 2));
  if (!map.ok) console.error(`WARNING: ${map.reason} — counts fell back to \`codespring features\`.`);
  if (state.notes !== state.coreFeatures) {
    console.error(`WARNING: ${state.notes} notes for ${state.coreFeatures} core features — every core feature needs one before any PRD or task.`);
  }
}

process.exit(0);
