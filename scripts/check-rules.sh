#!/usr/bin/env bash
# Smoke-check the .agents/rules against the codebase.
# Read-only: verifies structure and factual consistency, changes nothing.
# Usage: bash scripts/check-rules.sh   (run from repo root)

set -uo pipefail

RULES_DIR=".agents/rules"
fail=0

note() { printf '  %s\n' "$1"; }
ok()   { printf 'OK   %s\n' "$1"; }
bad()  { printf 'FAIL %s\n' "$1"; fail=1; }

echo "=== 1. Rule files present & non-empty ==="
if ! compgen -G "$RULES_DIR/*.md" > /dev/null; then
  bad "no rule files found in $RULES_DIR"
else
  for f in "$RULES_DIR"/*.md; do
    if [ -s "$f" ]; then ok "$(wc -l < "$f" | tr -d ' ') lines  $f"; else bad "empty  $f"; fi
  done
fi

echo
echo "=== 2. Each rule has Scope + Rationale ==="
for f in "$RULES_DIR"/*.md; do
  grep -q "Scope" "$f"     || bad "missing Scope     $f"
  grep -q "Rationale" "$f" || bad "missing Rationale $f"
  grep -q "Scope" "$f" && grep -q "Rationale" "$f" && ok "$f"
done

echo
echo "=== 3. Endpoints named in backend.md exist in routes.py ==="
routes=$(grep -oE '"/[a-z0-9/]*"' backend/app/routes.py | tr -d '"' | sort -u)
for ep in $(grep -oE '/(health|api/metrics|facets|summary|categories/top|comparison|alerts|b2b|b2c)' "$RULES_DIR/backend.md" | sort -u); do
  # normalize bare suffixes to their full /api/metrics/... path
  case "$ep" in
    /health|/api/metrics) full="$ep" ;;
    *) full="/api/metrics$ep" ;;
  esac
  echo "$routes" | grep -qx "$full" && ok "endpoint $full" || bad "endpoint missing in routes.py: $full (from $ep)"
done

echo
echo "=== 4. File paths referenced in rules exist ==="
for p in \
  frontend/vite.config.ts \
  frontend/.env.example \
  frontend/src/App.tsx \
  frontend/src/lib/financial-types.ts \
  frontend/src/lib/financial-utils.ts \
  frontend/src/lib/mock-data.ts \
  backend/app/routes.py \
  backend/tests/test_routes.py ; do
  [ -e "$p" ] && ok "$p" || bad "referenced path missing: $p"
done

echo
echo "=== 5. Domain literals aligned (frontend types vs backend) ==="
fe_cat=$(grep -oE "'(suppliers|sales|operational|administrative|others)'" frontend/src/lib/financial-types.ts | tr -d "'" | sort -u | paste -sd' ' -)
be_cat=$(grep -oE '"(suppliers|sales|operational|administrative|others)"' backend/app/routes.py | tr -d '"' | sort -u | paste -sd' ' -)
if [ "$fe_cat" = "$be_cat" ] && [ -n "$fe_cat" ]; then ok "categories match: $fe_cat"; else bad "category mismatch  FE:[$fe_cat]  BE:[$be_cat]"; fi

echo
echo "=== 6. Anti-pattern warnings still valid ==="
if grep -q "2024" frontend/src/App.tsx; then ok "hard-coded 2024 still present (frontend.md warning valid)"; else note "no 2024 in App.tsx — update frontend.md if this was fixed"; fi
if grep -q "mock-data" frontend/src/App.tsx; then note "mock-data now imported in App.tsx — update rules"; else ok "mock-data.ts still unused by App.tsx (rule warning valid)"; fi

echo
if [ "$fail" -eq 0 ]; then echo "ALL CHECKS PASSED"; else echo "SOME CHECKS FAILED"; fi
exit "$fail"
