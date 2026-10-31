// core/services.js, the runner of the mail services besides Gmail, with a fake service:
// which services are asked, the mailboxes it builds, new mail, a failed check, the Origin
// rules, and where actions and the reader go.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const EXT = path.join(__dirname, '../../extension');

const setup = ({on = ['fake'], granted = true, fake = {}} = {}) => {
  const local = {services: on};
  const session = {};
  const area = store => ({
    get: async d => {
      const keys = typeof d === 'string' ? {[d]: undefined} : Array.isArray(d) ? Object.fromEntries(d.map(k => [k, undefined])) : d;
      const o = {};
      for (const k in keys) {
        if (k in store) {
          o[k] = structuredClone(store[k]);
        }
        else if (keys[k] !== undefined) {
          o[k] = keys[k];
        }
      }
      return o;
    },
    set: async o => Object.assign(store, structuredClone(o))
  });
  let rules = [];
  const sent = {offscreen: [], collect: 0, action: [], body: []};
  const service = {
    id: 'fake',
    name: 'Fake Mail',
    origins: ['https://mail.fake.test/*'],
    hosts: ['https://mail.fake.test/'],
    signIn: 'https://mail.fake.test/login',
    compose: () => 'https://mail.fake.test/compose',
    can: {archive: true, spam: true, body: true},
    rewrite: [{urlFilter: '||mail.fake.test/api/', origin: 'https://mail.fake.test'}],
    boxes: [{
      email: 'Ann@Fake.test',
      inbox: 'https://mail.fake.test/inbox',
      unread: 30,
      entries: [
        {id: 'fake:1', link: 'https://mail.fake.test/m/1', ref: {mid: '1'}, title: 'New', summary: 's', modified: new Date().toISOString(), author_name: 'Bo', author_email: 'bo@x.test'},
        {id: 'fake:2', link: 'https://mail.fake.test/m/2', ref: {mid: '2'}, title: '', modified: '2020-01-01T00:00:00Z', author_email: 'cy@x.test'}
      ]
    }],
    async collect({signal}) {
      sent.collect += 1;
      if (service.fail) {
        throw Error('down');
      }
      if (service.hang) {
        await new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(Error('aborted'))));
      }
      return structuredClone(service.boxes);
    },
    async action(o) {
      sent.action.push({cmd: o.cmd, email: o.email, refs: o.refs, prefs: o.prefs});
      if (service.refuse) {
        throw Error('refused');
      }
      return true;
    },
    async body(o) {
      sent.body.push(o.ref);
      return [{name: 'Bo', date: '2026-10-31T09:00:00Z', html: '<p>hi</p>'}];
    },
    ...fake
  };
  const chrome = {
    runtime: {id: 'extid'},
    tabs: {TAB_ID_NONE: -1},
    i18n: {getMessage: k => k === 'msg_1' ? '(unknown sender)' : ''},
    storage: {local: area(local), session: area(session), onChanged: {addListener() {}}},
    permissions: {contains: async () => granted, onAdded: {addListener() {}}, onRemoved: {addListener() {}}},
    declarativeNetRequest: {
      getSessionRules: async () => rules,
      updateSessionRules: async ({removeRuleIds, addRules}) => {
        rules = [...rules.filter(r => !removeRuleIds.includes(r.id)), ...addRules];
      }
    }
  };
  const ctx = {chrome, console, setTimeout, clearTimeout, AbortController, AbortSignal, URL, Date, Promise, Map, Set, structuredClone,
    log() {},
    offscreen: {command: async o => {
      sent.offscreen.push(o.request);
      return true;
    }}};
  ctx.self = ctx;
  ctx.MailServices = {fake: service};
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(EXT + '/core/services.js', 'utf8'), ctx, {filename: 'services.js'});
  return {Services: ctx.Services, service, local, session, sent, rules: () => rules};
};
const signal = () => new AbortController().signal;
// values made in the context are of its realm: compared as plain data
const eq = (a, b) => assert.deepStrictEqual(JSON.parse(JSON.stringify(a)), b);

const tests = [
  ['nothing turned on: no service is asked', async () => {
    const t = setup({on: []});
    eq(await t.Services.collect(signal(), 9000), []);
    assert.strictEqual(t.sent.collect, 0);
  }],
  ['turned on but its hosts not granted: not asked', async () => {
    const t = setup({granted: false});
    eq(await t.Services.collect(signal(), 9000), []);
    assert.strictEqual(t.sent.collect, 0);
  }],
  ['a mailbox is built like a Gmail one', async () => {
    const t = setup();
    const [o] = await t.Services.collect(signal(), 9000);
    assert.strictEqual(o.network, true);
    assert.strictEqual(o.notAuthorized, false);
    assert.strictEqual(o.xml.title, 'ann@fake.test');
    assert.strictEqual(o.xml.service, 'fake');
    assert.strictEqual(o.xml.fullcount, 30);
    assert.strictEqual(o.xml.rootLink, 'https://mail.fake.test/inbox');
    assert.strictEqual(o.xml.link, 'https://mail.fake.test/inbox');
    assert.strictEqual(o.xml.label, '');
    assert.ok(!isNaN(Date.parse(o.xml.modified)));
    assert.strictEqual(o.xml.entries[1].title, '');
    assert.strictEqual(o.xml.entries[1].summary, '');
    assert.strictEqual(o.xml.entries[1].author_name, 'cy@x.test');
  }],
  ['the count is never below what is listed', async () => {
    const t = setup();
    t.service.boxes[0].unread = 0;
    const [o] = await t.Services.collect(signal(), 9000);
    assert.strictEqual(o.xml.fullcount, 2);
  }],
  ['recent mail not seen before is new, once', async () => {
    const t = setup();
    const [o] = await t.Services.collect(signal(), 9000);
    eq([...o.newIDs], ['fake:1']);
    o.commit();
    await new Promise(r => setTimeout(r, 0));
    const [again] = await t.Services.collect(signal(), 9000);
    eq([...again.newIDs], []);
  }],
  ['the Origin rule touches only this extension\'s requests to the service', async () => {
    const t = setup();
    await t.Services.collect(signal(), 9000);
    const [rule] = t.rules();
    assert.ok(rule.id >= 1000);
    assert.strictEqual(rule.condition.urlFilter, '||mail.fake.test/api/');
    eq([...rule.condition.initiatorDomains], ['extid']);
    eq([...rule.condition.tabIds], [-1]);
    eq(rule.action.requestHeaders.map(h => h.value), ['https://mail.fake.test', 'https://mail.fake.test/']);
  }],
  ['a failed check keeps the last answer, without telling its mail again', async () => {
    const t = setup();
    await t.Services.collect(signal(), 9000);
    t.service.fail = true;
    const [o] = await t.Services.collect(signal(), 9000);
    assert.strictEqual(o.xml.title, 'ann@fake.test');
    eq([...o.newIDs], []);
  }],
  ['a failed check with nothing before it lists nothing', async () => {
    const t = setup();
    t.service.fail = true;
    eq(await t.Services.collect(signal(), 9000), []);
  }],
  ['a service that hangs is given up after the timeout', async () => {
    const t = setup();
    t.service.hang = true;
    const t0 = Date.now();
    eq(await t.Services.collect(signal(), 200), []);
    assert.ok(Date.now() - t0 < 1000);
  }],
  ['an aborted check returns nothing', async () => {
    const t = setup();
    const c = new AbortController();
    const p = t.Services.collect(c.signal, 9000);
    c.abort();
    eq(await p, []);
  }],
  ['an action reaches the service with the refs of its mailbox', async () => {
    const t = setup();
    await t.Services.collect(signal(), 9000);
    const r = await t.Services.action({cmd: 'rc_^i', links: ['https://mail.fake.test/m/1', 'https://mail.fake.test/m/2'], prefs: {doReadOnArchive: true}});
    assert.strictEqual(r, true);
    assert.strictEqual(t.sent.action.length, 1);
    assert.strictEqual(t.sent.action[0].email, 'ann@fake.test');
    eq(t.sent.action[0].refs.map(r => r.mid), ['1', '2']);
    assert.strictEqual(t.sent.action[0].prefs.doReadOnArchive, true);
  }],
  ['a refused action comes back with the service name', async () => {
    const t = setup();
    await t.Services.collect(signal(), 9000);
    t.service.refuse = true;
    const r = await t.Services.action({cmd: 'tr', links: ['https://mail.fake.test/m/1']});
    assert.strictEqual(r.message, 'Fake Mail: refused');
  }],
  ['archive is not sent to a service without one', async () => {
    const t = setup({fake: {can: {archive: false, spam: true, body: true}}});
    await t.Services.collect(signal(), 9000);
    const r = await t.Services.action({cmd: 'rc_^i', links: ['https://mail.fake.test/m/1'], prefs: {doReadOnArchive: true}});
    assert.ok(r.message);
    assert.strictEqual(t.sent.action.length, 0);
  }],
  ['an unknown mail is not sent anywhere', async () => {
    const t = setup();
    const r = await t.Services.action({cmd: 'rd', links: ['https://mail.fake.test/m/9']});
    assert.ok(r.message);
    assert.strictEqual(t.sent.action.length, 0);
  }],
  ['Gmail links go to the offscreen document, a service\'s to the service', async () => {
    const t = setup();
    await t.Services.collect(signal(), 9000);
    const gmail = 'https://mail.google.com/mail/u/0?message_id=abc';
    const r = await t.Services.dispatch({cmd: 'rd', links: [gmail, 'https://mail.fake.test/m/1']});
    assert.strictEqual(r, true);
    eq([...t.sent.offscreen[0].links], [gmail]);
    eq(t.sent.action[0].refs.map(r => r.mid), ['1']);
  }],
  ['only Gmail: the services are not involved', async () => {
    const t = setup();
    await t.Services.dispatch({cmd: 'rd', links: ['https://mail.google.com/mail/u/1?message_id=x']});
    assert.strictEqual(t.sent.action.length, 0);
    assert.strictEqual(t.sent.offscreen.length, 1);
  }],
  ['the reader gets the messages of a listed mail', async () => {
    const t = setup();
    await t.Services.collect(signal(), 9000);
    const r = await t.Services.body('https://mail.fake.test/m/2');
    assert.strictEqual(r.messages[0].html, '<p>hi</p>');
    assert.strictEqual(t.sent.body[0].mid, '2');
  }],
  ['a service without bodies says so', async () => {
    const t = setup({fake: {can: {archive: true, spam: true, body: false}}});
    await t.Services.collect(signal(), 9000);
    const r = await t.Services.body('https://mail.fake.test/m/1');
    assert.ok(r.message);
    assert.strictEqual(t.sent.body.length, 0);
  }],
  ['the diagnostics see what the service answers', async () => {
    const t = setup();
    const r = await t.Services.check('fake');
    eq(r.boxes.map(b => [b.email, b.unread]), [['Ann@Fake.test', 30]]);
  }],
  ['a link tells its service', async () => {
    const t = setup();
    assert.strictEqual(t.Services.of('https://mail.fake.test/m/1').id, 'fake');
    assert.strictEqual(t.Services.of('https://mail.google.com/mail/u/0'), undefined);
    assert.strictEqual(t.Services.of(undefined), undefined);
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
