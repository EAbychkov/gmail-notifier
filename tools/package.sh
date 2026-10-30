#!/bin/sh
# Zips extension/ for the Chrome Web Store as dist/mail-deck-<version>.zip, the version taken from the manifest.
set -e
cd "$(dirname "$0")/.."
version=$(python3 -I -c 'import json; print(json.load(open("extension/manifest.json"))["version"])')
out="dist/mail-deck-$version.zip"
mkdir -p dist
rm -f "$out"
(cd extension && zip -qr -X "../$out" . -x '*.DS_Store')
echo "$out"
