// The background check of core/check.js against a fake Gmail: a number of
// signed-in accounts whose feeds answer after a delay, and past them the index
// Gmail redirects to /u/0/, the way it tells a signed-out account.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const EXT = path.join(__dirname, '../../extension');

const feedXml = n => `<?xml version="1.0" encoding="UTF-8"?><feed version="0.3" xmlns="http://purl.org/atom/ns#"><title>Gmail - Inbox for user${n}@gmail.com</title><tagline>New messages in your Gmail Inbox</tagline><fullcount>1</fullcount><link rel="alternate" href="https://mail.google.com/mail/u/${n}" type="text/html"/><modified>2026-10-31T10:00:00Z</modified><entry><title>Hi ${n}</title><summary>s</summary><link rel="alternate" href="https://mail.google.com/mail?account_id=user${n}@gmail.com&amp;message_id=m${n}&amp;view=conv&amp;extsrc=atom" type="text/html"/><modified>2026-10-31T09:00:00Z</modified><issued>2026-10-31T09:00:00Z</issued><id>tag:gmail.google.com,2004:${n}</id><author><name>A</name><email>a@x.com</email></author></entry></feed>`;

// signedIn accounts, each feed answering after delay ms; known is what the last
// check remembered (undefined: nothing); the feed of index hang never answers
const check = ({signedIn, delay = 100, known, hang = -1, timeout = 9000}) => {
  const deep = () => new Proxy(function() {}, {get: (t, k) => k === 'then' ? undefined : deep(), apply: () => deep()});
  const session = known === undefined ? {} : {'accounts.count': known};
  const local = {timeout};
  const area = store => ({
    get: (d, cb) => {
      const keys = typeof d === 'string' ? {[d]: undefined} : d;
      const o = {};
      for (const k in keys) {
        o[k] = k in store ? store[k] : keys[k];
      }
      cb && cb(o);
      return Promise.resolve(o);
    },
    set: (o, cb) => {
      Object.assign(store, o);
      cb && cb();
      return Promise.resolve();
    },
    remove: () => Promise.resolve()
  });
  const chrome = new Proxy({}, {get: (t, k) => {
    if (k === 'storage') {
      return {session: area(session), local: area(local), onChanged: {addListener() {}}};
    }
    if (k === 'i18n') {
      return {getMessage: () => 'x'};
    }
    if (k === 'runtime') {
      return {sendMessage: (m, cb) => cb && cb(), lastError: null, onMessage: {addListener() {}}};
    }
    return deep();
  }});
  let requests = 0;
  const fetch = (href, o = {}) => new Promise((resolve, reject) => {
    requests += 1;
    const n = Number(/u\/(\d+)/.exec(href)[1]);
    o.signal?.addEventListener('abort', () => reject(Error('aborted')));
    if (n === hang) {
      return;
    }
    setTimeout(() => {
      const out = n < signedIn ? n : 0;
      resolve({ok: true, status: 200, url: `https://mail.google.com/mail/u/${out}/feed/atom`, text: async () => feedXml(out)});
    }, delay);
  });
  const quiet = {log() {}, info() {}, warn() {}, error() {}};
  const ctx = {chrome, fetch, console: quiet, setTimeout, clearTimeout, AbortController, URL, Intl, Date, Promise, Map, Set,
    navigator: {userAgent: 'Chrome', platform: 'Mac', language: 'en'}};
  ctx.self = ctx;
  ctx.importScripts = (...files) => files.forEach(p => vm.runInContext(fs.readFileSync(EXT + p, 'utf8'), ctx, {filename: p}));
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(EXT + '/core/utils/log.js', 'utf8'), ctx);
  vm.runInContext(`var button = new Proxy({}, {set: () => true, get: () => () => {}});
    var context = {accounts() {}}; var repeater = {reset() {}}; var sound = {play: () => Promise.resolve()};
    var offscreen = {}; var toast = () => {}; self.openLink = () => {};`, ctx);
  vm.runInContext(fs.readFileSync(EXT + '/core/check.js', 'utf8'), ctx, {filename: 'check.js'});
  const t0 = Date.now();
  return ctx.checkEmails.execute(false).then(() => ({
    ms: Date.now() - t0,
    requests,
    // copied out of the context, whose arrays are not this one's
    found: [...(session['cached-objects'] || []).map(o => String(o.xml.title))],
    saved: session['accounts.count']
  }));
};
const users = (...ns) => ns.map(n => `user${n}@gmail.com`);
const range = n => [...Array(n).keys()];

const tests = [
  ['the accounts known from the last check come at once, with no extra requests', async () => {
    const r = await check({signedIn: 9, delay: 100, known: 9});
    assert.deepStrictEqual(r.found, users(...range(9)));
    assert.strictEqual(r.requests, 10);
    assert.ok(r.ms < 450, `took ${r.ms} ms`);
    assert.strictEqual(r.saved, 9);
  }],
  ['a first check walks the accounts one by one', async () => {
    const r = await check({signedIn: 9, delay: 50});
    assert.deepStrictEqual(r.found, users(...range(9)));
    assert.strictEqual(r.requests, 10);
    assert.ok(r.ms >= 9 * 50, `took ${r.ms} ms`);
    assert.strictEqual(r.saved, 9);
  }],
  ['accounts added since the last check are all found', async () => {
    const r = await check({signedIn: 9, delay: 30, known: 3});
    assert.deepStrictEqual(r.found, users(...range(9)));
    assert.strictEqual(r.saved, 9);
  }],
  ['accounts signed out since the last check are left out', async () => {
    const r = await check({signedIn: 3, delay: 30, known: 9});
    assert.deepStrictEqual(r.found, users(0, 1, 2));
    assert.strictEqual(r.saved, 3);
  }],
  ['one account', async () => {
    const r = await check({signedIn: 1, delay: 30, known: 1});
    assert.deepStrictEqual(r.found, users(0));
    assert.strictEqual(r.requests, 2);
  }],
  ['a feed that never answers is given up after the timeout; the rest are found', async () => {
    const r = await check({signedIn: 9, delay: 30, known: 9, hang: 4, timeout: 300});
    assert.deepStrictEqual(r.found, users(0, 1, 2, 3, 5, 6, 7, 8));
    assert.ok(r.ms < 2000, `took ${r.ms} ms`);
  }]
];

(async () => {
  let failed = 0;
  for (const [name, fn] of tests) {
    try {
      await fn();
      console.log('ok', name);
    }
    catch (e) {
      failed += 1;
      console.log('not ok', name, '-', e.message);
    }
  }
  process.exit(failed ? 1 : 0);
})();
