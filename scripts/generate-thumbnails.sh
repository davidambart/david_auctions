#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source_dir="$repo_root/assets/images"
output_dir="$repo_root/assets/thumbnails"

if ! command -v sips >/dev/null 2>&1; then
  echo "This thumbnail generator requires macOS sips." >&2
  exit 1
fi

mkdir -p "$output_dir"

find "$source_dir" -type f -name '*.jpg' ! -regex '.*-[0-9][0-9]\.jpg' -print0 |
while IFS= read -r -d '' source; do
  output="$output_dir/$(basename "$source")"
  if [[ ! -f "$output" || "$source" -nt "$output" ]]; then
    sips -Z 800 -s format jpeg -s formatOptions 62 "$source" --out "$output" >/dev/null
    echo "Generated $(basename "$output")"
  fi
done
