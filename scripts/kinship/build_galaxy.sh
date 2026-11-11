#!/usr/bin/env bash
# Rebuilds public/breed-galaxy.html from the private pedigree folder.
#   scripts/kinship/build_galaxy.sh [out.html]      (default: public/breed-galaxy.html)
# The folder (default ~/pedigree-data, override with PEDIGREE_DIR) holds the data and a
# build.env with the private settings; none of it lives in this repo. See README.md there.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
PD="${PEDIGREE_DIR:-$HOME/pedigree-data}"
[ -f "$PD/build.env" ] || { echo "No $PD/build.env. Run sync_pedigree_data.sh pull, or set PEDIGREE_DIR." >&2; exit 1; }
# shellcheck disable=SC1091
source "$PD/build.env"
OUT="${1:-$HERE/../../public/breed-galaxy.html}"

# python packages for the force layout and clustering (installed once into the data folder)
export PYTHONPATH="$PD/pylib${PYTHONPATH:+:$PYTHONPATH}"
python3 -c 'import igraph, leidenalg' 2>/dev/null || {
  echo "Installing igraph and leidenalg into $PD/pylib"
  pip install -q --break-system-packages --target "$PD/pylib" igraph leidenalg
}

# the layout cache is keyed on the input files, so changed data never reuses a stale layout
KEY=$( (cd "$PD"; stat -c '%n %s %Y' "$PEDIGREE_MAIN" $EXTRA_DBW; cd "$HERE/../.."; stat -c '%n %s %Y' ezra-*-pedigree.html) | md5sum | cut -c1-12)
CACHE="$PD/cache/$KEY"; mkdir -p "$CACHE"

# dogs from the pedigree-explorer pages that the export lacks
python3 "$HERE/supplement_from_explorers.py" "$PD/$PEDIGREE_MAIN" "$CACHE/supp.dbw" \
  "$HERE/../../ezra-mia-pedigree.html" "$HERE/../../ezra-piper-pedigree.html"

EXTRA=(--extra "$CACHE/supp.dbw"); for f in $EXTRA_DBW; do EXTRA+=(--extra "$PD/$f"); done
KENNEL_EXCLUDE="${KENNEL_EXCLUDE:-}" python3 "$HERE/build_family_galaxy.py" \
  "$PD/$PEDIGREE_MAIN" "$HERE/galaxy.template.html" "$OUT" --cache "$CACHE" "${EXTRA[@]}" --ours-regs "$OURS_REGS"
echo "Wrote $OUT. Review it, then commit and push."
