// The Yandex mail service of core/services/yandex.js against a stubbed Yandex:
// the passport account list, mailbox pages that carry a ckey, the liza1
// messages + app-badge-counter call, the do-messages writes, and the .eml body
// download with its MIME parser. No network, no credentials.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const FILE = path.join(__dirname, '../../../extension/core/services/yandex.js');

const tests = [];
const check = (name, fn) => tests.push([name, fn]);
const empty = v => {
  // arrays returned from the vm context have a different prototype, so deepStrictEqual
  // against a local [] fails; check emptiness instead
  assert.ok(Array.isArray(v) && v.length === 0);
};
// normalize vm-realm values (different Array/Object prototype) before comparing
const same = (actual, expected) => assert.deepStrictEqual(JSON.parse(JSON.stringify(actual)), expected);

// ---- an in-memory chrome.storage.session ----
const makeChrome = () => {
  const store = {};
  return {
    storage: {
      session: {
        get: keys => {
          const list = typeof keys === 'string' ? [keys] : Array.isArray(keys) ? keys : Object.keys(keys);
          const out = {};
          for (const k of list) {
            if (k in store) {
              out[k] = store[k];
            }
          }
          return Promise.resolve(out);
        },
        set: obj => {
          Object.assign(store, obj);
          return Promise.resolve();
        }
      }
    }
  };
};

// ---- load the service in its own context with a routed fetch ----
const load = fetchImpl => {
  const sandbox = {
    chrome: makeChrome(),
    fetch: fetchImpl,
    Response,
    Headers,
    URL,
    URLSearchParams,
    TextDecoder,
    TextEncoder,
    atob,
    btoa,
    console
  };
  sandbox.self = sandbox;
  vm.runInNewContext(fs.readFileSync(FILE, 'utf8'), sandbox);
  return sandbox.self.MailServices.yandex;
};

// An opaque-redirect stand-in: the service reads .type / .status / .ok.
const opaque = () => ({type: 'opaqueredirect', status: 0, ok: false, text: async () => '', json: async () => ({})});
const json = (body, status = 200) => new Response(JSON.stringify(body), {status, headers: {'Content-Type': 'application/json'}});
const page = (uid, email, ckey) =>
  new Response(`<script>window.x={"uid":"${uid}","ckey":"${ckey}","default_email":"${email}"}</script>`, {status: 200});

const passportBody = (accounts, defaultUid) => ({
  accounts: accounts.map(a => ({uid: a.uid, defaultEmail: a.email, login: 'x'})),
  default_uid: defaultUid
});
const messagesModel = msgs => ({name: 'messages', status: 'ok', data: {details: {'has-more': false}, message: msgs}});
const counterModel = unread => ({name: 'app-badge-counter', status: 'ok', data: {counters: {fresh: 0, unread}}});

const msg = (mid, over = {}) => ({
  mid, tid: 't' + mid, fid: '1', new: 1,
  subject: 's' + mid, firstline: 'line ' + mid,
  date: {timestamp: 1735420732000},
  field: [{type: 'from', name: 'Клоун', email: 'belka@yandex.ru'}, {type: 'to', email: 'me@yandex.ru'}],
  ...over
});

// ===================== collect =====================

check('collect: signed-in, two accounts, fields/order/counts/ids', async () => {
  const seen = [];
  const service = load(async (url, opts = {}) => {
    seen.push((opts.method || 'GET') + ' ' + url);
    if (url === 'https://api.passport.yandex.ru/accounts') {
      return json(passportBody([{uid: '200', email: 'work@company.ru'}, {uid: '100', email: 'me@yandex.ru'}], '100'));
    }
    if (url.startsWith('https://mail.yandex.ru/?uid=100')) {
      return page('100', 'me@yandex.ru', 'ck100');
    }
    if (url.startsWith('https://mail.yandex.ru/?uid=200')) {
      return opaque(); // not a personal mailbox
    }
    if (url.startsWith('https://mail.360.yandex.ru/?uid=200')) {
      return page('200', 'work@company.ru', 'ck200');
    }
    if (url.startsWith('https://mail.yandex.ru/web-api/models/liza1')) {
      return json({models: [messagesModel([msg('11'), msg('12')]), counterModel(5)]});
    }
    if (url.startsWith('https://mail.360.yandex.ru/web-api/models/liza1')) {
      return json({models: [messagesModel([msg('21')]), counterModel(1)]});
    }
    throw new Error('unexpected ' + url);
  });

  const boxes = await service.collect({signal: undefined});
  assert.strictEqual(boxes.length, 2);
  // default account (me@) first
  same(boxes.map(b => b.email), ['me@yandex.ru', 'work@company.ru']);
  const me = boxes[0];
  assert.strictEqual(me.unread, 5);
  assert.strictEqual(me.inbox, 'https://mail.yandex.ru/?uid=100#/inbox');
  assert.strictEqual(me.entries.length, 2);
  assert.strictEqual(me.entries[0].id, 'yandex:100:11');
  assert.strictEqual(me.entries[0].link, 'https://mail.yandex.ru/?uid=100#/message/11');
  assert.strictEqual(me.entries[0].title, 's11');
  assert.strictEqual(me.entries[0].summary, 'line 11');
  assert.strictEqual(me.entries[0].author_name, 'Клоун');
  assert.strictEqual(me.entries[0].author_email, 'belka@yandex.ru');
  assert.strictEqual(me.entries[0].modified, new Date(1735420732000).toISOString());
  // the 360 account was found on the 360 host after the .ru page redirected
  const work = boxes[1];
  assert.strictEqual(work.inbox, 'https://mail.360.yandex.ru/?uid=200#/inbox');
  assert.strictEqual(work.entries[0].link, 'https://mail.360.yandex.ru/?uid=200#/message/21');
  // ids and links unique across both mailboxes
  const ids = boxes.flatMap(b => b.entries.map(e => e.id));
  const links = boxes.flatMap(b => b.entries.map(e => e.link));
  assert.strictEqual(new Set(ids).size, ids.length);
  assert.strictEqual(new Set(links).size, links.length);
});

check('collect: unread counter floors at the number of entries', async () => {
  const service = load(async url => {
    if (url.endsWith('/accounts')) {
      return json(passportBody([{uid: '1', email: 'a@yandex.ru'}], '1'));
    }
    if (url.startsWith('https://mail.yandex.ru/?uid=1')) {
      return page('1', 'a@yandex.ru', 'ck');
    }
    return json({models: [messagesModel([msg('1'), msg('2')]), counterModel(0)]});
  });
  const boxes = await service.collect({});
  assert.strictEqual(boxes[0].unread, 2); // max(0, 2)
});

check('collect: signed out (passport 401) -> []', async () => {
  const service = load(async url => {
    if (url.endsWith('/accounts')) {
      return new Response('', {status: 401});
    }
    throw new Error('should not fetch ' + url);
  });
  empty(await service.collect({}));
});

check('collect: signed out, as the live passport answers (200 {}) -> []', async () => {
  const service = load(async url => {
    if (url.endsWith('/accounts')) {
      return new Response('{}', {status: 200, headers: {'content-type': 'application/json'}});
    }
    throw new Error('should not fetch ' + url);
  });
  empty(await service.collect({}));
});

check('collect: passport login redirect -> []', async () => {
  const service = load(async () => opaque());
  empty(await service.collect({}));
});

check('collect: network error throws', async () => {
  const service = load(async () => {
    throw new Error('offline');
  });
  await assert.rejects(() => service.collect({}), /offline/);
});

check('collect: stale ckey is refreshed once, then succeeds', async () => {
  let pageReads = 0;
  let liza = 0;
  const service = load(async (url, opts = {}) => {
    if (url.endsWith('/accounts')) {
      return json(passportBody([{uid: '1', email: 'a@yandex.ru'}], '1'));
    }
    if (url.startsWith('https://mail.yandex.ru/?uid=1')) {
      pageReads += 1;
      return page('1', 'a@yandex.ru', 'ck' + pageReads);
    }
    if (url.startsWith('https://mail.yandex.ru/web-api/models/liza1')) {
      liza += 1;
      const body = JSON.parse(opts.body);
      if (liza === 1) {
        assert.strictEqual(body._ckey, 'ck1');
        return json({models: [{name: 'messages', status: 'error', error: 'ckey'}]});
      }
      assert.strictEqual(body._ckey, 'ck2'); // re-read page gave a fresh ckey
      return json({models: [messagesModel([msg('9')]), counterModel(1)]});
    }
    throw new Error('unexpected ' + url);
  });
  const boxes = await service.collect({});
  assert.strictEqual(pageReads, 2);
  assert.strictEqual(liza, 2);
  assert.strictEqual(boxes[0].entries[0].id, 'yandex:1:9');
});

// ===================== actions =====================

const foldersModel = () => ({
  name: 'folders', status: 'ok',
  data: {folder: [
    {fid: '1', symbol: 'inbox'}, {fid: '4', symbol: 'sent'},
    {fid: '3', symbol: 'trash'}, {fid: '2', symbol: 'spam'}
  ]}
});
const seededRef = {uid: '1', host: 'mail.yandex.ru', mid: '555', fid: '1', tid: 't555'};

// seed the session cache with a ckey so action tests exercise only the write
const withCkey = routes => load(async (url, opts = {}) => {
  if (url.startsWith('https://mail.yandex.ru/?uid=1')) {
    return page('1', 'a@yandex.ru', 'ck');
  }
  return routes(url, opts);
});

check('action rd: posts do-messages mark', async () => {
  let body;
  const service = withCkey(async (url, opts) => {
    assert.strictEqual(opts.method, 'POST');
    assert.strictEqual(url, 'https://mail.yandex.ru/web-api/models/liza1?_m=do-messages');
    body = JSON.parse(opts.body);
    return json({models: [{name: 'do-messages', status: 'ok', data: {result: 'ok'}}]});
  });
  assert.strictEqual(await service.action({cmd: 'rd', email: 'a@yandex.ru', refs: [seededRef], prefs: {}}), true);
  assert.strictEqual(body.models[0].name, 'do-messages');
  assert.strictEqual(body.models[0].params.action, 'mark');
  assert.strictEqual(body.models[0].params.ids, '555'); // single id is a bare string
  assert.strictEqual(body._ckey, 'ck');
  assert.strictEqual(body._uid, '1');
});

check('action rd: several ids become an array', async () => {
  let body;
  const service = withCkey(async (url, opts) => {
    body = JSON.parse(opts.body);
    return json({models: [{name: 'do-messages', status: 'ok'}]});
  });
  const refs = [seededRef, {...seededRef, mid: '556'}];
  await service.action({cmd: 'rd', email: 'a@yandex.ru', refs, prefs: {}});
  same(body.models[0].params.ids, ['555', '556']);
});

check('action tr: reads folders then moves to trash (fid 3)', async () => {
  const urls = [];
  let body;
  const service = withCkey(async (url, opts) => {
    urls.push(url);
    if (url.endsWith('_m=folders')) {
      return json({models: [foldersModel()]});
    }
    body = JSON.parse(opts.body);
    return json({models: [{name: 'do-messages', status: 'ok'}]});
  });
  assert.strictEqual(await service.action({cmd: 'tr', email: 'a@yandex.ru', refs: [seededRef], prefs: {}}), true);
  assert.ok(urls.some(u => u.endsWith('_m=folders')));
  assert.strictEqual(body.models[0].params.action, 'delete');
  assert.strictEqual(body.models[0].params.movefile, '3');
  assert.strictEqual(body.models[0].params.with_sent, '0');
});

check('action sp: moves to spam (fid 2) with tospam', async () => {
  let body;
  const service = withCkey(async (url, opts) => {
    if (url.endsWith('_m=folders')) {
      return json({models: [foldersModel()]});
    }
    body = JSON.parse(opts.body);
    return json({models: [{name: 'do-messages', status: 'ok'}]});
  });
  await service.action({cmd: 'sp', email: 'a@yandex.ru', refs: [seededRef], prefs: {}});
  assert.strictEqual(body.models[0].params.action, 'tospam');
  assert.strictEqual(body.models[0].params.movefile, '2');
});

check('action: do-messages error status throws', async () => {
  const service = withCkey(async () => json({models: [{name: 'do-messages', status: 'error', error: 'boom'}]}));
  await assert.rejects(
    () => service.action({cmd: 'rd', email: 'a@yandex.ru', refs: [seededRef], prefs: {}}),
    /boom/
  );
});

check('action: archive is refused (can.archive false)', async () => {
  assert.strictEqual(service_archive_can(), false);
  const service = withCkey(async () => json({models: [{name: 'do-messages', status: 'ok'}]}));
  await assert.rejects(
    () => service.action({cmd: 'rc_^i', email: 'a@yandex.ru', refs: [seededRef], prefs: {}}),
    /not supported/
  );
});
function service_archive_can() {
  return load(async () => opaque()).can.archive;
}

// ===================== body / MIME parser =====================

// Build an .eml Response from raw bytes, honouring the source-template order.
const bodyService = emlBytes => load(async url => {
  if (url.includes('/web-api/message-source/')) {
    return new Response(emlBytes, {status: 200});
  }
  return new Response('', {status: 404});
});

const eml = s => new TextEncoder().encode(s); // for ASCII/UTF-8 fixtures
// a fixture whose single part is base64 of the given raw bytes in a charset
const base64Eml = (charset, bytes) => {
  const b64 = Buffer.from(bytes).toString('base64');
  const headers = [
    'From: =?utf-8?B?' + Buffer.from('Анна', 'utf8').toString('base64') + '?= <ann@yandex.ru>',
    'To: me@yandex.ru',
    'Date: Fri, 03 Jan 2025 10:52:54 +0300',
    'Subject: hi',
    'Content-Type: text/plain; charset="' + charset + '"',
    'Content-Transfer-Encoding: base64',
    '', b64, ''
  ].join('\r\n');
  // headers are ASCII, the base64 payload is ASCII: TextEncoder is safe here
  return eml(headers);
};

check('body: multipart/alternative prefers the HTML part', async () => {
  const boundary = 'BOUND1';
  const raw = [
    'From: =?utf-8?B?' + Buffer.from('Клоун', 'utf8').toString('base64') + '?= <belka@yandex.ru>',
    'To: me@yandex.ru',
    'Date: Fri, 03 Jan 2025 10:52:54 +0300',
    'Content-Type: multipart/alternative; boundary="' + boundary + '"',
    '',
    '--' + boundary,
    'Content-Type: text/plain; charset=utf-8',
    '',
    'plain body',
    '--' + boundary,
    'Content-Type: text/html; charset=utf-8',
    '',
    '<p>rich body</p>',
    '--' + boundary + '--',
    ''
  ].join('\r\n');
  const service = bodyService(eml(raw));
  const msgs = await service.body({email: 'me@yandex.ru', ref: {uid: '1', host: 'mail.yandex.ru', mid: '1'}});
  assert.strictEqual(msgs.length, 1);
  assert.strictEqual(msgs[0].html, '<p>rich body</p>');
  assert.strictEqual(msgs[0].name, 'Клоун'); // RFC 2047 not needed, but name parsed
  assert.strictEqual(msgs[0].email, 'belka@yandex.ru');
  assert.strictEqual(msgs[0].date, new Date('Fri, 03 Jan 2025 10:52:54 +0300').toISOString());
});

check('body: base64 text in windows-1251', async () => {
  const bytes = [0xCF, 0xF0, 0xE8, 0xE2, 0xE5, 0xF2]; // "Привет" in cp1251
  const service = bodyService(base64Eml('windows-1251', bytes));
  const msgs = await service.body({email: 'me@yandex.ru', ref: {uid: '1', host: 'mail.yandex.ru', mid: '1'}});
  const expected = new TextDecoder('windows-1251').decode(new Uint8Array(bytes));
  assert.strictEqual(msgs[0].html, expected);
  assert.strictEqual(expected, 'Привет');
  assert.strictEqual(msgs[0].name, 'Анна'); // RFC 2047 encoded-word in From decoded
});

check('body: base64 text in koi8-r', async () => {
  const bytes = [0xF0, 0xD2, 0xC9, 0xD7, 0xC5, 0xD4]; // "Привет" in koi8-r
  const service = bodyService(base64Eml('koi8-r', bytes));
  const msgs = await service.body({email: 'me@yandex.ru', ref: {uid: '1', host: 'mail.yandex.ru', mid: '1'}});
  const expected = new TextDecoder('koi8-r').decode(new Uint8Array(bytes));
  assert.strictEqual(msgs[0].html, expected);
  assert.strictEqual(expected, 'Привет');
});

check('body: base64 text in utf-8', async () => {
  const bytes = [...Buffer.from('Привет мир', 'utf8')];
  const service = bodyService(base64Eml('utf-8', bytes));
  const msgs = await service.body({email: 'me@yandex.ru', ref: {uid: '1', host: 'mail.yandex.ru', mid: '1'}});
  assert.strictEqual(msgs[0].html, 'Привет мир');
});

check('body: quoted-printable HTML', async () => {
  const raw = [
    'From: ann@yandex.ru',
    'To: me@yandex.ru',
    'Date: Fri, 03 Jan 2025 10:52:54 +0300',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: quoted-printable',
    '',
    '<p>Caf=C3=A9 =D0=BF=D1=80=D0=B8=D0=B2=\r\n=D0=B5=D1=82</p>',
    ''
  ].join('\r\n');
  const service = bodyService(eml(raw));
  const msgs = await service.body({email: 'me@yandex.ru', ref: {uid: '1', host: 'mail.yandex.ru', mid: '1'}});
  assert.strictEqual(msgs[0].html, '<p>Café привет</p>'); // =XX decoded, soft break joined
});

check('body: text/plain is escaped into HTML', async () => {
  const raw = [
    'From: ann@yandex.ru',
    'Date: Fri, 03 Jan 2025 10:52:54 +0300',
    'Content-Type: text/plain; charset=utf-8',
    '',
    'a < b & c\nsecond line',
    ''
  ].join('\r\n');
  const service = bodyService(eml(raw));
  const msgs = await service.body({email: 'me@yandex.ru', ref: {uid: '1', host: 'mail.yandex.ru', mid: '1'}});
  assert.strictEqual(msgs[0].html, 'a &lt; b &amp; c<br>second line');
});

check('body: multipart/mixed collects an attachment name, HTML stays the body', async () => {
  const boundary = 'MIX';
  const raw = [
    'From: ann@yandex.ru',
    'Date: Fri, 03 Jan 2025 10:52:54 +0300',
    'Content-Type: multipart/mixed; boundary="' + boundary + '"',
    '',
    '--' + boundary,
    'Content-Type: text/html; charset=utf-8',
    '',
    '<p>see attached</p>',
    '--' + boundary,
    'Content-Type: application/pdf; name="a.pdf"',
    'Content-Disposition: attachment; filename="a.pdf"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from('%PDF-1.4').toString('base64'),
    '--' + boundary + '--',
    ''
  ].join('\r\n');
  const service = bodyService(eml(raw));
  const msgs = await service.body({email: 'me@yandex.ru', ref: {uid: '1', host: 'mail.yandex.ru', mid: '1'}});
  assert.strictEqual(msgs[0].html, '<p>see attached</p>');
  same(msgs[0].files, [{name: 'a.pdf', url: ''}]);
});

check('body: no template matched -> throws', async () => {
  const service = load(async () => new Response('', {status: 404}));
  await assert.rejects(
    () => service.body({email: 'me@yandex.ru', ref: {uid: '1', host: 'mail.yandex.ru', mid: '1'}}),
    /could not download/
  );
});

check('static fields', () => {
  const service = load(async () => opaque());
  assert.strictEqual(service.id, 'yandex');
  assert.strictEqual(service.name, 'Yandex Mail');
  // object comes from the vm context, so compare fields rather than the prototype
  assert.strictEqual(service.can.archive, false);
  assert.strictEqual(service.can.spam, true);
  assert.strictEqual(service.can.body, true);
  assert.ok(service.origins.includes('https://api.passport.yandex.ru/*'));
  assert.ok(service.compose().startsWith('https://mail.yandex.ru/#compose'));
  assert.strictEqual(service.rewrite.length, 2);
});

(async () => {
  let n = 0;
  for (const [name, fn] of tests) {
    await fn();
    n += 1;
    console.log('ok', name);
  }
  console.log('# ' + n + ' checks');
})().catch(e => {
  console.error(e && e.stack || e);
  process.exit(1);
});
