#!/usr/bin/env bash
# Keeps ~/pedigree-data and its private AWS backup bucket in step.
#   sync_pedigree_data.sh status   show what differs (changes nothing)
#   sync_pedigree_data.sh push     copy this computer's files up (never deletes in the bucket)
#   sync_pedigree_data.sh pull     copy the bucket's files down (never deletes locally)
# The bucket is private and versioned, so an overwritten file can be recovered.
# Not for huge files (genomics): those stay out of this folder.
set -euo pipefail
PD="${PEDIGREE_DIR:-$HOME/pedigree-data}"
BUCKET="s3://7sistersgreatdanes-pedigree-backup"
EXCL=(--exclude "pylib/*" --exclude "cache/*")
case "${1:-status}" in
  status) echo "--- would upload"; aws s3 sync "$PD" "$BUCKET" "${EXCL[@]}" --dryrun
          echo "--- would download"; aws s3 sync "$BUCKET" "$PD" "${EXCL[@]}" --dryrun ;;
  push)   aws s3 sync "$PD" "$BUCKET" "${EXCL[@]}" ;;
  pull)   mkdir -p "$PD"; aws s3 sync "$BUCKET" "$PD" "${EXCL[@]}" ;;
  *) sed -n '2,8p' "$0"; exit 1 ;;
esac
