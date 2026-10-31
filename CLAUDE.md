# Mail Deck for Gmail

Chrome extension in `extension/` (no build step). `tools/package.sh` zips it into `dist/`.

## Publishing

Use the `publish` skill (`.claude/skills/publish/SKILL.md`), or directly:

    python3 tools/publish.py status    # live / in review / last upload
    python3 tools/publish.py submit    # package, upload, send to review
    python3 tools/publish.py cancel    # take back the version in review
    python3 tools/publish.py reviews   # latest reviews; stats [DAYS]: rating, installs, users
    python3 tools/publish.py rollback VERSION NEW REASON   # ship an earlier version again

The store listing (text per language, screenshots) and the Privacy tab have no API: they are
changed in the Developer Dashboard, through Claude in Chrome (start with `claude --chrome`).

Credentials are in `~/.config/mail-deck/` (not in the repo). Commit and bump `version` in
`extension/manifest.json` before submitting.
