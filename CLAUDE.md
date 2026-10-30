# Mail Deck for Gmail

Chrome extension in `extension/` (no build step). `tools/package.sh` zips it into `dist/`.

## Publishing

Use the `publish` skill (`.claude/skills/publish/SKILL.md`), or directly:

    python3 tools/publish.py status    # live / in review / last upload
    python3 tools/publish.py submit    # package, upload, send to review

Credentials are in `~/.config/mail-deck/` (not in the repo). Commit and bump `version` in
`extension/manifest.json` before submitting.
