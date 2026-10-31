#!/bin/sh
# Starts the browser Claude drives for the Chrome Web Store dashboard, which extensions such as
# Claude in Chrome may not touch: Google Chrome with a profile of its own
# (~/.config/mail-deck/browser-profile, signed in to the publisher's Google account once) and the
# DevTools port on 127.0.0.1:9333, where the Playwright MCP server connects.
# While it runs, any program on this Mac can drive that profile: close it when the work is done.
set -e
profile="$HOME/.config/mail-deck/browser-profile"
mkdir -p "$profile"
chmod 700 "$profile"
open -na "Google Chrome" --args \
  --user-data-dir="$profile" \
  --remote-debugging-port=9333 \
  --no-first-run --no-default-browser-check \
  "${1:-https://chrome.google.com/webstore/devconsole}"
