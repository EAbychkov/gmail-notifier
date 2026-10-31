// What can be told without running anything: every script parses; the scripts
// that share one global scope (the background's, each page's) do not declare
// the same name twice; every locale has the panel's and the settings' strings.
const fs = require('fs');
const os = require('os');
const path = require('path');
const {spawnSync} = require('child_process');

const EXT = path.join(__dirname, '../../extension');
const results = [];
const ok = (name, pass, detail = '') => results.push([name, pass, detail]);

const walk = dir => fs.readdirSync(dir, {withFileTypes: true}).flatMap(d =>
  d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]);
const parses = file => {
  const r = spawnSync(process.execPath, ['--check', file], {encoding: 'utf8'});
  return r.status === 0 ? '' : r.stderr.split('\n').slice(0, 5).join(' ');
};

// every script on its own
const scripts = walk(EXT).filter(f => f.endsWith('.js'));
const broken = scripts.map(f => [f, parses(f)]).filter(([, e]) => e);
ok(`${scripts.length} scripts parse`, broken.length === 0, broken.map(([f, e]) => path.relative(EXT, f) + ': ' + e).join('; '));

// the scripts of one scope, in the order they load
const together = (name, files) => {
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'mail-deck-')), 'scope.js');
  fs.writeFileSync(tmp, files.map(f => fs.readFileSync(f, 'utf8')).join('\n;\n'));
  const e = parses(tmp);
  ok(`${name}: ${files.length} scripts share one scope without a clash`, !e, e);
};
const manifest = JSON.parse(fs.readFileSync(path.join(EXT, 'manifest.json'), 'utf8'));
together('background', manifest.background.scripts.map(s => path.join(EXT, s)));
for (const page of walk(EXT).filter(f => f.endsWith('.html'))) {
  const html = fs.readFileSync(page, 'utf8');
  const srcs = [...html.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)].map(m => m[1])
    .map(src => src.startsWith('/') ? path.join(EXT, src) : path.join(path.dirname(page), src))
    .filter(f => fs.existsSync(f));
  if (srcs.length > 1) {
    together(path.relative(EXT, page), srcs);
  }
}

// every locale: parses, and has en's panel and settings strings with the same placeholders
const LOCALES = path.join(EXT, '_locales');
const read = lang => JSON.parse(fs.readFileSync(path.join(LOCALES, lang, 'messages.json'), 'utf8'));
const holes = text => (String(text).match(/\$\d/g) || []).sort().join(',');
const en = read('en');
const keys = Object.keys(en).filter(k => k.startsWith('panel_') || k.startsWith('opt_'));
for (const lang of fs.readdirSync(LOCALES)) {
  let d;
  try {
    d = read(lang);
  }
  catch (e) {
    ok(`locale ${lang} parses`, false, e.message);
    continue;
  }
  const missing = keys.filter(k => !d[k]);
  const wrong = keys.filter(k => d[k] && holes(d[k].message) !== holes(en[k].message));
  ok(`locale ${lang}: ${keys.length} strings, placeholders match`, missing.length + wrong.length === 0,
    [missing.length && 'missing ' + missing.slice(0, 6).join(' '), wrong.length && 'placeholders ' + wrong.slice(0, 6).join(' ')]
      .filter(Boolean).join('; '));
}

for (const [name, pass, detail] of results) {
  console.log(pass ? 'ok' : 'not ok', name + (pass || !detail ? '' : ' - ' + detail));
}
process.exit(results.every(([, pass]) => pass) ? 0 : 1);
