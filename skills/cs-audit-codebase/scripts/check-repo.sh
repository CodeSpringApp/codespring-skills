#!/usr/bin/env bash
# check-repo.sh — is this clone the code you think you are auditing?
#
# Run this FIRST, before the fan-out. Every answer below caveats every finding.
# Read-only: `git fetch` updates remote-tracking refs only — it does not touch the
# working tree, any branch, or any file. Nothing here writes to the repo.
#
# Usage:
#   bash check-repo.sh [--repo /path/to/repo] [--paths file1 file2 ...]
#
#   --paths  files or directories you suspect are out of scope. For each one it
#            prints first commit, last commit and commit count, so "unreferenced"
#            can be told apart from "unfinished" (see the rule in
#            codespring/references/auditing-and-fixing.md §3a).
#
# Exit codes: 0 = clone is current · 2 = clone is behind the remote · 1 = not a git repo

set -u

REPO="$PWD"
PATHS=()

while [ $# -gt 0 ]; do
  case "$1" in
    --repo) REPO="${2:-}"; shift 2 ;;
    --paths) shift; while [ $# -gt 0 ] && [ "${1#--}" = "$1" ]; do PATHS+=("$1"); shift; done ;;
    -h|--help) grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "unknown argument: $1" >&2; exit 1 ;;
  esac
done

git -C "$REPO" rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  echo "NOT A GIT REPO: $REPO"
  echo "There is no version history at all. Say so plainly — it is a finding in its own right:"
  echo "  nothing can be rolled back, and no change can be traced to a reason."
  exit 1
}

BRANCH="$(git -C "$REPO" rev-parse --abbrev-ref HEAD 2>/dev/null)"
HEAD_FULL="$(git -C "$REPO" rev-parse HEAD)"
HEAD_SHORT="$(git -C "$REPO" rev-parse --short HEAD)"

echo "=== The commit these findings apply to (record this in FINDINGS.md) ==="
echo "branch: $BRANCH"
echo "commit: $HEAD_SHORT ($HEAD_FULL)"
git -C "$REPO" log -1 --format='date:   %ad%nauthor: %an%nsubject:%s' --date=iso

echo
echo "=== Is this clone current with the remote? ==="
if git -C "$REPO" remote | grep -q .; then
  git -C "$REPO" fetch --all --quiet 2>/dev/null || echo "(fetch failed — no network, or no access to the remote)"
  UPSTREAM="$(git -C "$REPO" rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"
  if [ -n "${UPSTREAM:-}" ]; then
    COUNTS="$(git -C "$REPO" rev-list --left-right --count "HEAD...$UPSTREAM" 2>/dev/null || echo "0	0")"
    AHEAD="$(printf '%s' "$COUNTS" | cut -f1)"
    BEHIND="$(printf '%s' "$COUNTS" | cut -f2)"
    echo "upstream: $UPSTREAM — $AHEAD ahead, $BEHIND behind"
    if [ "${BEHIND:-0}" -gt 0 ]; then
      echo
      echo "*** BEHIND BY $BEHIND COMMIT(S). Tell the owner in one line and offer to update BEFORE auditing."
      echo "*** Auditing a stale clone produces findings that may already be fixed."
      echo "Commits you do not have yet, and the files they touch:"
      git -C "$REPO" log --oneline --name-only "HEAD..$UPSTREAM" | head -60
    else
      echo "up to date with $UPSTREAM"
    fi
  else
    echo "no upstream set for $BRANCH — cannot tell whether it is behind. Compare against origin's default branch by hand."
  fi
else
  echo "no remote configured — this code exists only on this machine. That is a finding: there is no off-machine copy."
fi

echo
echo "=== What else is in flight? (do not write findings against superseded work) ==="
echo "remote branches:"
git -C "$REPO" for-each-ref --sort=-committerdate --format='  %(refname:short)  %(committerdate:short)  %(authorname)  %(contents:subject)' refs/remotes 2>/dev/null | head -30
echo "recent authors (last 50 commits):"
git -C "$REPO" log -50 --format='%an' | sort | uniq -c | sort -rn
echo
echo "Ask the owner: is anyone else working in this repo right now?"
echo "If yes: the findings are a snapshot at $HEAD_SHORT, recommend a dedicated branch for the fixes,"
echo "and say plainly that merge conflicts will need managing. Do not lecture them about git."

echo
echo "=== Working tree ==="
if [ -n "$(git -C "$REPO" status --porcelain)" ]; then
  echo "DIRTY — uncommitted work is present, so the audited state is not any commit:"
  git -C "$REPO" status --short | head -20
else
  echo "clean"
fi

echo
echo "=== Delivery: is anything gated? ==="
if [ -d "$REPO/.github/workflows" ]; then
  ls -1 "$REPO/.github/workflows"
else
  echo "no .github/workflows — no automated check, so merging ships straight to production unless the host gates it"
fi

if [ "${#PATHS[@]}" -gt 0 ]; then
  echo
  echo "=== Suspected out-of-scope paths: unreferenced, or just unfinished? ==="
  echo "A file untouched since the initial import while its siblings change weekly is"
  echo "a strong signal of \"not finished yet\", NOT \"not part of this product\"."
  echo "Repo activity window, for comparison:"
  git -C "$REPO" log -1 --format='  newest commit: %ad' --date=short
  git -C "$REPO" log --reverse -1 --format='  oldest commit: %ad' --date=short
  for p in "${PATHS[@]}"; do
    echo
    echo "--- $p"
    COUNT="$(git -C "$REPO" log --oneline -- "$p" | wc -l | tr -d ' ')"
    echo "  commits touching it: $COUNT"
    git -C "$REPO" log -1 --format='  last:  %ad  %s' --date=short -- "$p"
    git -C "$REPO" log --reverse --format='  first: %ad  %s' --date=short -- "$p" | head -1
  done
  echo
  echo "Then ASK THE OWNER before concluding anything is out of scope."
fi

if [ -n "${BEHIND:-}" ] && [ "${BEHIND:-0}" -gt 0 ]; then exit 2; fi
exit 0
