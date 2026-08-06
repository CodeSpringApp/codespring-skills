#!/usr/bin/env bash
# fetch-project.sh — snapshot the linked CodeSpring project to a directory of JSON files.
#
# READ-ONLY. It runs only `codespring` read commands and writes nothing to the
# project, the mindmap or the repo. Its output directory is disposable.
#
# Why a script: the state-detection block must produce the SAME answer every run.
# Prose invites the agent to skip a command or eyeball a count. This does not.
#
# Usage:
#   bash fetch-project.sh --out /tmp/cs-state [--repo /path/to/repo]
#
# Then:
#   node state.mjs     /tmp/cs-state
#   node check-map.mjs /tmp/cs-state --expect-core 6
#
# Writes into --out:
#   mindmap.json features.json prds.json tasks.json   (raw CLI output)
#   repo.json                                         (projectId, cwd, FINDINGS.md present?)
#   errors.log                                        (any command that failed)
#
# Exit codes: 0 = every command succeeded · 1 = not linked / CLI missing · 2 = some command failed (see errors.log)

set -u

OUT=""
REPO="$PWD"

while [ $# -gt 0 ]; do
  case "$1" in
    --out)  OUT="${2:-}"; shift 2 ;;
    --repo) REPO="${2:-}"; shift 2 ;;
    -h|--help)
      grep '^#' "$0" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *) echo "unknown argument: $1" >&2; exit 1 ;;
  esac
done

[ -n "$OUT" ] || { echo "fetch-project.sh: --out <dir> is required" >&2; exit 1; }

CLI="codespring"
command -v codespring >/dev/null 2>&1 || CLI="npx @codespring-app/cli"

mkdir -p "$OUT"
: > "$OUT/errors.log"

CONFIG="$REPO/.codespring/config.json"
if [ ! -f "$CONFIG" ]; then
  echo "NOT LINKED: no $CONFIG" | tee -a "$OUT/errors.log"
  echo "Link it first: codespring projects  →  codespring init --project <id> --force" >&2
  printf '{"linked":false,"cwd":"%s"}\n' "$REPO" > "$OUT/repo.json"
  exit 1
fi

PROJECT_ID="$(node -e 'const fs=require("fs");try{const c=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));process.stdout.write(String(c.projectId||c.project_id||c.id||""))}catch(e){}' "$CONFIG")"
[ -n "$PROJECT_ID" ] || { echo "NOT LINKED: no projectId in $CONFIG" | tee -a "$OUT/errors.log" >&2; exit 1; }

# Print the projectId before anything else — the local config is the only one to trust.
echo "projectId: $PROJECT_ID  (from $CONFIG)"

FINDINGS=false
[ -f "$REPO/FINDINGS.md" ] && FINDINGS=true

node -e '
  const [id, cwd, findings] = process.argv.slice(1);
  process.stdout.write(JSON.stringify({ linked: true, projectId: id, cwd, findingsMd: findings === "true" }, null, 2));
' "$PROJECT_ID" "$REPO" "$FINDINGS" > "$OUT/repo.json"

STATUS=0
fetch() { # fetch <outfile> <args...>
  local file="$1"; shift
  if ( cd "$REPO" && $CLI "$@" --json ) > "$OUT/$file" 2>>"$OUT/errors.log"; then
    [ -s "$OUT/$file" ] || { echo "empty output: $CLI $* --json" >> "$OUT/errors.log"; STATUS=2; }
  else
    echo "failed: $CLI $* --json" >> "$OUT/errors.log"
    echo 'null' > "$OUT/$file"
    STATUS=2
  fi
}

fetch mindmap.json  mindmap
fetch features.json features
fetch prds.json     prds
fetch tasks.json    tasks

if [ "$STATUS" -ne 0 ]; then
  echo "some commands failed — see $OUT/errors.log (auth expired? run: codespring auth login)" >&2
fi

echo "snapshot: $OUT"
exit "$STATUS"
