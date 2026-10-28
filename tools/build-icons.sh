#!/bin/sh
# Rasterises tools/icons.html into extension/data/icons/<state>/<size>.png with headless Chrome.
set -e
cd "$(dirname "$0")"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --user-data-dir="$(mktemp -d)" --virtual-time-budget=8000 --dump-dom "file://$PWD/icons.html" 2>/dev/null |
python3 -c '
import base64, html, json, os, re, sys
out = html.unescape(re.search(r"<pre id=\"out\">(.*?)</pre>", sys.stdin.read(), re.S).group(1))
for f in json.loads(out)["files"]:
    path = os.path.join("../extension/data/icons", f["path"])
    open(path, "wb").write(base64.b64decode(f["data"].split(",", 1)[1]))
    print(path)
'
