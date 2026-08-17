// parse.mjs — shared, shape-tolerant readers for a `fetch-project.sh` snapshot.
//
// The CLI's JSON envelope has changed before (bare array vs { data: [...] } vs
// { features: [...] }), and the mindmap arrives as a record wrapping flowJson.
// So nothing here indexes a fixed path: it searches for the shape it needs and
// says so loudly when it cannot find it. Read-only; pure functions.
//
// Node model it expects (see codespring/references/mindmap-structure.md):
//   node-features        → data.items = the CORE features
//   sub-feature group    → one node per core feature, data.parentFeatureId = coreId, data.items = sub-features
//   bridge-feature-<id>  → connector from a feature card to its detail nodes
//   notes-<featureId>    → the single "how it works" note card for that core feature
//   node-tech-stack      → data.items = the tech stack

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export function readJson(dir, name, fallback = null) {
  const p = join(dir, name);
  if (!existsSync(p)) return fallback;
  const raw = readFileSync(p, 'utf8').trim();
  if (!raw || raw === 'null') return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    // Some CLI versions print a human line before the JSON body.
    const start = raw.search(/[[{]/);
    if (start > 0) {
      try { return JSON.parse(raw.slice(start)); } catch { /* fall through */ }
    }
    return fallback;
  }
}

/** Breadth-first search for the first array of objects reachable from `root`. */
export function findArray(root, preferKeys = []) {
  if (Array.isArray(root)) return root;
  if (!root || typeof root !== 'object') return null;
  for (const key of preferKeys) {
    if (Array.isArray(root[key])) return root[key];
  }
  const queue = [root];
  const seen = new Set();
  while (queue.length) {
    const node = queue.shift();
    if (!node || typeof node !== 'object' || seen.has(node)) continue;
    seen.add(node);
    for (const key of preferKeys) {
      if (Array.isArray(node[key])) return node[key];
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value) && value.some((v) => v && typeof v === 'object')) return value;
      if (value && typeof value === 'object') queue.push(value);
    }
  }
  return null;
}

/** The mindmap's flow nodes, wherever they are wrapped. */
export function mindmapNodes(mindmap) {
  if (!mindmap) return null;
  const candidates = [
    mindmap?.flowJson?.nodes,
    mindmap?.mindmap?.flowJson?.nodes,
    mindmap?.data?.flowJson?.nodes,
    mindmap?.nodes,
  ];
  for (const c of candidates) if (Array.isArray(c)) return c;
  const found = findArray(mindmap, ['nodes']);
  return Array.isArray(found) ? found : null;
}

const itemsOf = (node) => {
  const items = node?.data?.items ?? node?.items;
  return Array.isArray(items) ? items : [];
};

export function mindmapModel(mindmap) {
  const nodes = mindmapNodes(mindmap);
  if (!nodes) {
    return { ok: false, reason: 'could not find the mindmap nodes array', nodes: [], coreItems: [], subGroups: [], noteIds: [], techItems: [] };
  }
  const featuresNode = nodes.find((n) => n?.id === 'node-features');
  const techNode = nodes.find((n) => n?.id === 'node-tech-stack');
  const noteIds = nodes
    .filter((n) => String(n?.id ?? '').startsWith('notes-') || n?.data?.type === 'notes')
    .map((n) => String(n.id));
  const subGroups = nodes
    .filter((n) => n?.id !== 'node-features' && n?.data?.parentFeatureId && itemsOf(n).length >= 0)
    .filter((n) => Array.isArray(n?.data?.items ?? n?.items))
    .map((n) => ({ id: String(n.id), parentFeatureId: String(n.data.parentFeatureId), items: itemsOf(n) }));
  return {
    ok: Boolean(featuresNode),
    reason: featuresNode ? null : 'no node with id "node-features" — is the mindmap for this project initialised?',
    nodes,
    coreItems: itemsOf(featuresNode),
    subGroups,
    noteIds,
    techItems: itemsOf(techNode),
  };
}

/** Features as reported by `codespring features --json`, split core vs sub. */
export function featureModel(features) {
  const list = findArray(features, ['features', 'items', 'data']) ?? [];
  const norm = list
    .filter((f) => f && typeof f === 'object')
    .map((f) => ({
      id: String(f.id ?? f.featureId ?? ''),
      title: String(f.title ?? f.name ?? ''),
      parentFeatureId: f.parentFeatureId ?? f.parent_feature_id ?? f.parentId ?? null,
    }));
  return {
    all: norm,
    core: norm.filter((f) => !f.parentFeatureId),
    sub: norm.filter((f) => Boolean(f.parentFeatureId)),
  };
}

export function taskModel(tasks) {
  const list = findArray(tasks, ['tasks', 'items', 'data']) ?? [];
  return list
    .filter((t) => t && typeof t === 'object')
    .map((t) => ({
      id: String(t.id ?? ''),
      title: String(t.title ?? t.name ?? ''),
      status: String(t.status ?? ''),
      priority: t.priority ?? null,
      featureId: t.featureId ?? t.feature_id ?? t.feature?.id ?? null,
    }));
}

export function prdModel(prds) {
  const list = findArray(prds, ['prds', 'items', 'data']) ?? [];
  return list
    .filter((p) => p && typeof p === 'object')
    .map((p) => ({
      id: String(p.id ?? ''),
      name: String(p.name ?? p.title ?? ''),
      featureId: p.featureId ?? p.feature_id ?? null,
      prdType: String(p.prdType ?? p.type ?? ''),
    }));
}

export const normTitle = (s) => String(s ?? '').trim().toLowerCase().replace(/\s+/g, ' ');

/** Leading task number, so numbering can be continued rather than restarted. */
export function highestTaskNumber(tasks) {
  let max = 0;
  for (const t of tasks) {
    const m = /^\s*(\d+)\s*[.)\-:]/.exec(t.title);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max;
}
