/* global Resolved, gmail */
'use strict';

// One colour per mailbox, in the order Google lists the signed-in accounts
const PALETTE = ['#3567e6', '#169b62', '#d9822b', '#d23f3a', '#8b55d9', '#138fa8', '#c9447f', '#5e7a1f', '#a8612a', '#4f5b6b'];
const ICONS = {
  refresh: ['M20 12a8 8 0 1 1-2.34-5.66', 'M20 4v5h-5'],
  open: ['M14 4h6v6', 'M20 4l-9 9', 'M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5'],
  compose: ['M12 20h8', 'M16.5 3.6a2.1 2.1 0 0 1 3 3L7.5 18.6 4 19.5l.9-3.5Z'],
  tune: ['M4 7h9', 'M17 7h3', 'M13 7a2 2 0 1 0 4 0a2 2 0 1 0-4 0', 'M4 17h3', 'M11 17h9', 'M7 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0'],
  read: ['M3 10l9-6 9 6v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z', 'M3 10l9 6 9-6'],
  readAll: ['M2 12.5l4.5 4.5L16 7.5', 'M11.5 16.5l.5.5L21.5 7.5'],
  archive: ['M4.5 4h15A1.5 1.5 0 0 1 21 5.5v2A1.5 1.5 0 0 1 19.5 9h-15A1.5 1.5 0 0 1 3 7.5v-2A1.5 1.5 0 0 1 4.5 4Z', 'M5 9v9.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9', 'M10 13h4'],
  trash: ['M4 7h16', 'M6.5 7l.9 12a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4l.9-12', 'M9.5 7V4.5h5V7'],
  spam: ['M12 3l8 3.5v5.5c0 4.5-3.4 7.7-8 9-4.6-1.3-8-4.5-8-9V6.5Z', 'M12 8.5v4', 'M12 15.8v.2'],
  back: ['M15 5l-7 7 7 7'],
  done: ['M4 12.5l5 5L20 6.5'],
  copy: ['M11 9h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z', 'M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3'],
  reply: ['M9.5 14.5L4 9l5.5-5.5', 'M4 9h10a6 6 0 0 1 6 6v4'],
  star: ['M12 3.6l2.55 5.2 5.7.83-4.13 4.02.98 5.68L12 16.65l-5.1 2.68.98-5.68-4.13-4.02 5.7-.83Z'],
  mail: ['M4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11A1.5 1.5 0 0 1 4.5 5Z', 'M3.5 7l8.5 6 8.5-6']
};
// the strings live in _locales as panel_*; a language without one falls back to English
const t = (key, ...subs) => chrome.i18n.getMessage('panel_' + key, subs.map(String)) || key;
const LANG = chrome.i18n.getUILanguage();
const ACTIONS = {
  'rd': {icon: 'read', title: t('markRead') + ' (R)', done: t('doneRead')},
  'rc_^i': {icon: 'archive', title: t('archive') + ' (E)', done: t('doneArchive')},
  'tr': {icon: 'trash', title: t('delete') + ' (Delete)', done: t('doneDelete'), danger: true},
  'sp': {icon: 'spam', title: t('spam') + ' (!)', done: t('doneSpam'), danger: true}
};
// how long an action waits for its Undo before it reaches Gmail
const UNDO_MS = 5000;
// Mailboxes whose senders share one domain; their logo says nothing about the sender
const FREEMAIL = /^(gmail|googlemail|yahoo|ymail|outlook|hotmail|live|icloud|me|mail|yandex|ya|proton|protonmail|pm|aol|gmx|inbox|bk|list|rambler)\./;

const $ = id => document.getElementById(id);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const dark = matchMedia('(prefers-color-scheme: dark)');

const state = {
  objs: [], // the accounts as the background published them
  hidden: new Set(), // links acted on here, until the feed stops listing them
  reading: null, // {e, o}
  only: null, // the mailbox the chips narrowed the list to
  rows: new Map(), // link -> {e, o}
  pending: null, // the action waiting for its Undo: {cmd, links, ready, timer}
  // starred here; the feed does not say which mail is starred, so it starts empty
  starred: new Set()
};
let refreshing = false;

const h = (tag, props, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (k === 'class') {
      el.className = v;
    }
    else if (k === 'style') {
      el.style.cssText = v;
    }
    else if (k.startsWith('data-') || k.startsWith('aria-')) {
      el.setAttribute(k, v);
    }
    else {
      el[k] = v;
    }
  }
  el.append(...kids.flat().filter(k => k !== null && k !== undefined && k !== false));
  return el;
};
const icon = name => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = ICONS[name].map(d => `<path d="${d}"/>`).join('');
  return svg;
};
const btn = (name, title, onclick, extra = '') => h('button', {
  class: 'icon-btn ' + extra,
  type: 'button',
  title,
  'aria-label': title,
  onclick: ev => {
    ev.stopPropagation();
    onclick(ev);
  }
}, icon(name));
// a check stands in for the icon for a moment, so a copy needs no look at the toast
const copyBtn = text => btn('copy', t('copyAddress'), ev => {
  const el = ev.currentTarget;
  navigator.clipboard.writeText(text).then(() => {
    el.replaceChildren(icon('done'));
    el.classList.add('copied');
    setTimeout(() => {
      el.replaceChildren(icon('copy'));
      el.classList.remove('copied');
    }, 1200);
  }, () => toast(t('copyFailed'), true));
}, 'copy');

const when = iso => {
  const d = new Date(iso);
  if (isNaN(d)) {
    return '';
  }
  const now = new Date();
  const mins = (now - d) / 60000;
  if (mins < 1) {
    return t('now');
  }
  if (mins < 60) {
    return t('minutes', Math.floor(mins));
  }
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString(LANG, {hour: 'numeric', minute: '2-digit'});
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return t('yesterday');
  }
  return d.toLocaleDateString(LANG, d.getFullYear() === now.getFullYear() ? {day: 'numeric', month: 'short'} : {});
};
const fullDate = iso => {
  const d = new Date(iso);
  return isNaN(d) ? '' : d.toLocaleString(LANG, {dateStyle: 'long', timeStyle: 'short'});
};

const avatar = e => {
  const name = e.author_name || e.author_email || '';
  const hash = [...(e.author_email || name)].reduce((p, c) => (p * 31 + c.charCodeAt(0)) >>> 0, 0);
  const el = h('span', {class: 'avatar', style: `--c:${PALETTE[hash % PALETTE.length]}`},
    (name.match(/[\p{L}\p{N}]/u) || ['?'])[0].toUpperCase());
  const parts = (e.author_email.split('@')[1] || '').toLowerCase().split('.');
  // keep the registrable part: news.binance.com -> binance.com, mail.example.co.uk -> example.co.uk
  const root = parts.slice(parts.length > 2 && parts.at(-2).length <= 3 && parts.at(-1).length === 2 ? -3 : -2).join('.');
  if (root.includes('.') && !FREEMAIL.test(root)) {
    const img = h('img', {alt: '', referrerPolicy: 'no-referrer'});
    // the service answers an unknown domain with a 16px globe
    img.onload = () => img.naturalWidth >= 32 && el.classList.add('logo');
    img.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(root)}&sz=64`;
    el.append(img);
  }
  return el;
};

// the accounts with what this panel already acted on taken out
const view = () => Resolved.apply(state.objs, [...state.hidden].map(link => ({link})))
  .filter(o => o.meta?.ignored !== true)
  .map((o, i) => ({...o, color: PALETTE[i % PALETTE.length]}));

const accountName = o => o.xml.title + (o.xml.label ? ` [${o.xml.label}]` : '');

const gmailLink = (e, o) => {
  const id = gmail.get.id(e.link);
  if (!id) {
    return e.link;
  }
  return o.xml.link.includes('#') ? o.xml.link + '/' + id : gmail.get.base(e.link) + '/?shva=1#inbox/' + id;
};
const openUrl = url => chrome.runtime.sendMessage({method: 'open', url}, () => {
  chrome.runtime.lastError;
  window.close();
});
const openEntry = (e, o, ev) => {
  const background = ev && (ev.button === 1 || ev.metaKey || ev.ctrlKey);
  chrome.runtime.sendMessage({
    method: 'open',
    url: {link: gmailLink(e, o), button: background ? 1 : 0}
  }, () => {
    chrome.runtime.lastError;
    if (!background) {
      window.close();
    }
  });
};
// Gmail has no link that opens a reply to a thread, so the compose window gets the sender and the subject
const replyUrl = e => {
  const n = (e.link.match(/u\/(\d+)/) || [])[1] || 0;
  const subject = e.title || '';
  const su = /^re:/i.test(subject) ? subject : 'Re: ' + subject;
  return `https://mail.google.com/mail/u/${n}/?view=cm&fs=1&to=${encodeURIComponent(e.author_email)}&su=${encodeURIComponent(su)}`;
};

/* toast */
let toastTimer;
const hideToast = () => $('toast').classList.remove('show');
const toast = (text, error, undo) => {
  const el = $('toast');
  el.replaceChildren(text, undo ? h('button', {
    class: 'undo',
    type: 'button',
    title: t('undo') + ' (Z)',
    onclick: undo
  }, t('undo')) : '');
  el.classList.toggle('error', Boolean(error));
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, undo ? UNDO_MS : error ? 4000 : 1800);
};

/* actions */
// Gmail accepts an action only with the GMAIL_AT cookie, which its print view sets
const ensureAt = async link => {
  const n = (link.match(/u\/(\d+)/) || [])[1];
  const at = await chrome.runtime.sendMessage({method: 'get-at', n}).catch(() => null);
  if (!at) {
    await gmail.body(link, true).catch(() => {});
  }
};
const send = ({cmd, links}) => chrome.runtime.sendMessage({method: 'gmail.action', cmd, links}, failure => {
  if (chrome.runtime.lastError || failure) {
    links.forEach(link => state.hidden.delete(link));
    render();
    toast(t('actionFailed'), true);
  }
});
// the mail leaves the list at once, while Gmail hears of it only once the Undo is gone
const commit = async p => {
  if (state.pending !== p) {
    return;
  }
  state.pending = null;
  clearTimeout(p.timer);
  await p.ready;
  send(p);
};
// the panel can close any moment; what is pending goes out right away, without waiting for the cookie
const flush = () => {
  const p = state.pending;
  if (p) {
    state.pending = null;
    clearTimeout(p.timer);
    send(p);
  }
};
const undo = () => {
  const p = state.pending;
  if (!p) {
    return;
  }
  state.pending = null;
  clearTimeout(p.timer);
  hideToast();
  p.links.forEach(link => state.hidden.delete(link));
  state.focus = p.links[0];
  render();
};
const act = (cmd, links) => {
  if (links.length === 0) {
    return;
  }
  // one Undo at a time: the action before this one is final now
  if (state.pending) {
    commit(state.pending);
  }
  const rows = links.map(link => document.querySelector(`.row[data-link="${CSS.escape(link)}"]`)).filter(Boolean);
  const after = rows.at(-1)?.nextElementSibling;
  state.focus = after?.classList.contains('row') ? after.dataset.link : null;

  links.forEach(link => state.hidden.add(link));
  const duration = reducedMotion ? 0 : 180;
  rows.forEach(el => el.animate([
    {height: el.offsetHeight + 'px', opacity: 1},
    {height: '0px', opacity: 0, paddingTop: 0, paddingBottom: 0}
  ], {duration, easing: 'ease-in', fill: 'forwards'}));
  setTimeout(render, duration);

  const p = {cmd, links, ready: ensureAt(links[0])};
  p.timer = setTimeout(() => commit(p), UNDO_MS);
  state.pending = p;
  toast(ACTIONS[cmd].done + (links.length > 1 ? `: ${links.length}` : ''), false, undo);
};
// the feed does not tell a starred mail apart, so the first click stars it
const star = (e, el) => {
  const on = !state.starred.has(e.link);
  const paint = on => {
    state.starred[on ? 'add' : 'delete'](e.link);
    el.classList.toggle('on', on);
    el.title = el.ariaLabel = on ? t('unstar') : t('star');
  };
  paint(on);
  ensureAt(e.link).then(() => chrome.runtime.sendMessage({method: 'gmail.action', cmd: on ? 'st' : 'xst', links: [e.link]}, failure => {
    if (chrome.runtime.lastError || failure) {
      paint(!on);
      toast(t('starFailed'), true);
    }
  }));
};

/* header */
const renderBar = objs => {
  const total = objs.reduce((p, o) => p + o.xml.fullcount, 0);
  const busy = objs.filter(o => o.xml.fullcount).length;
  $('sub').textContent = !objs.length ? '' :
    total ? (busy === 1 ? t('summaryOne', total) : t('summaryMany', total, busy)) : t('noNewMailTitle');
  $('tools').replaceChildren(
    btn('refresh', t('checkMail'), ev => {
      refreshing = true;
      ev.currentTarget.classList.add('spin');
      chrome.runtime.sendMessage({method: 'update', forced: true});
      setTimeout(stopSpin, 15000);
    }, refreshing ? 'refresh spin' : 'refresh'),
    btn('compose', t('compose'), () => openUrl('https://mail.google.com/mail/u/0/?view=cm&fs=1')),
    btn('tune', t('settings'), () => chrome.runtime.openOptionsPage())
  );
};
const stopSpin = () => {
  refreshing = false;
  document.querySelector('.refresh')?.classList.remove('spin');
};

/* one chip per mailbox with mail; a click shows only that mailbox */
const renderChips = objs => {
  const busy = objs.filter(o => o.xml.fullcount);
  if (!busy.some(o => o.xml.link === state.only)) {
    state.only = null;
  }
  const chip = (o, label, n) => h('button', {
    'class': 'chip' + ((o?.xml.link ?? null) === state.only ? ' on' : ''),
    'type': 'button',
    'aria-pressed': String((o?.xml.link ?? null) === state.only),
    'style': o ? `--c:${o.color}` : '',
    'onclick': () => {
      state.only = o?.xml.link ?? null;
      render();
    }
  }, o && h('span', {class: 'dot'}), label, h('span', {class: 'count'}, n > 999 ? '999+' : n));
  $('chips').replaceChildren(...(busy.length < 2 ? [] : [
    chip(null, t('all'), busy.reduce((p, o) => p + o.xml.fullcount, 0)),
    ...busy.map(o => chip(o, o.xml.title.split('@')[0] + (o.xml.label ? ` [${o.xml.label}]` : ''), o.xml.fullcount))
  ]));
};

/* list */
const row = (e, o) => {
  state.rows.set(e.link, {e, o});
  return h('article', {
    'class': 'row',
    'tabIndex': 0,
    'data-link': e.link,
    'onclick': ev => ev.metaKey || ev.ctrlKey ? openEntry(e, o, ev) : read(e, o),
    'onauxclick': ev => ev.button === 1 && openEntry(e, o, ev)
  },
  avatar(e),
  h('span', {class: 'from'}, e.author_name),
  h('time', {class: 'when', dateTime: e.modified, title: fullDate(e.modified)}, when(e.modified)),
  h('span', {class: 'subject'}, e.title || t('noSubject')),
  h('span', {class: 'snippet'}, e.summary),
  h('div', {class: 'acts'},
    ['rd', 'rc_^i', 'tr'].map(cmd => btn(ACTIONS[cmd].icon, ACTIONS[cmd].title, () => act(cmd, [e.link]), ACTIONS[cmd].danger ? 'danger' : '')),
    btn('open', t('openInGmail') + ' (O)', ev => openEntry(e, o, ev))
  ));
};
// every signed-in mailbox gets its line, with its unread mail under it
const section = o => {
  const n = o.xml.fullcount;
  const rest = n - o.xml.entries.length;
  return h('section', {class: 'section' + (n ? '' : ' idle'), style: `--c:${o.color}`},
    h('header', {class: 'section-head', title: t('openInbox'), onclick: () => openUrl(o.xml.link)},
      h('span', {class: 'dot'}),
      h('span', {class: 'addr'}, accountName(o)),
      n ? h('span', {class: 'n'}, n > 999 ? '999+' : n) : h('span', {class: 'none'}, t('noNewMail')),
      copyBtn(o.xml.title),
      h('span', {class: 'grow'}),
      o.xml.entries.length > 0 && btn('readAll', t('markAllRead'), () => act('rd', o.xml.entries.map(e => e.link))),
      btn('open', t('openInbox'), () => openUrl(o.xml.link))
    ),
    o.xml.entries.length > 0 && h('div', {class: 'cards'}, o.xml.entries.map(e => row(e, o)),
      rest > 0 && h('button', {class: 'more', type: 'button', onclick: () => openUrl(o.xml.link)},
        t('moreInGmail', rest)))
  );
};
const signIn = () => h('div', {class: 'empty'},
  h('span', {class: 'badge mail'}, icon('mail')),
  h('h3', {}, t('signIn')),
  h('p', {}, t('signInText')),
  h('button', {class: 'text-btn', type: 'button', onclick: () => openUrl('https://accounts.google.com/AddSession?continue=https://mail.google.com/mail/')}, t('signIn'))
);
// every mailbox is empty: say so, and keep a way into each of them
const caughtUp = objs => h('div', {},
  h('div', {class: 'empty'},
    h('span', {class: 'badge'}, icon('done')),
    h('h3', {}, t('caughtUp')),
    h('p', {}, objs.length > 1 ? t('caughtUpMany', objs.length) : t('caughtUpOne'))
  ),
  h('div', {class: 'accounts'}, objs.map(o => h('div', {class: 'acc', style: `--c:${o.color}`, onclick: () => openUrl(o.xml.link)},
    h('span', {class: 'dot'}),
    h('span', {class: 'addr'}, accountName(o)),
    copyBtn(o.xml.title),
    h('button', {class: 'go', type: 'button'}, t('open'), icon('open'))
  )))
);
const renderList = objs => {
  const list = $('list');
  const top = list.scrollTop;
  const focused = state.focus || document.activeElement?.dataset?.link;
  state.focus = null;
  state.rows.clear();

  const shown = state.only ? objs.filter(o => o.xml.link === state.only) : objs;
  list.replaceChildren(...(!objs.length ? [signIn()] :
    objs.some(o => o.xml.fullcount) ? shown.map(section) : [caughtUp(objs)]));
  list.scrollTop = top;
  if (focused) {
    list.querySelector(`.row[data-link="${CSS.escape(focused)}"]`)?.focus();
  }
};

const render = () => {
  const objs = view();
  renderBar(objs);
  renderChips(objs);
  renderList(objs);
};
const update = objs => {
  state.objs = objs || [];
  const listed = new Set(state.objs.flatMap(o => o.xml.entries.map(e => e.link)));
  for (const link of state.hidden) {
    if (!listed.has(link)) {
      state.hidden.delete(link);
    }
  }
  render();
};

/* reader */
const frame = $('body');
const frameReady = new Promise(resolve => {
  const ready = () => {
    const doc = frame.contentDocument;
    doc.head.append(h('style', {}, `
      body { font: 14px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; padding: 16px 20px 28px; color: #1b1f24; }
      body, td { font-size: 14px; }
      body.summary { color: #5f6772; }
      html.dark, html.dark body { background: #e1e1df; }
      .note { margin-top: 16px; color: #5f6772; }
    `));
    resolve(doc);
  };
  if (frame.contentDocument?.readyState === 'complete' && frame.contentDocument.querySelector('base')) {
    ready();
  }
  else {
    frame.addEventListener('load', ready, {once: true});
  }
});
frameReady.then(doc => {
  const paint = () => doc.documentElement.classList.toggle('dark', dark.matches);
  paint();
  dark.addEventListener('change', paint);
});

const read = async (e, o) => {
  state.reading = {e, o};
  const starred = state.starred.has(e.link);
  $('reader-bar').replaceChildren(
    btn('back', t('back') + ' (Esc)', back),
    h('span', {class: 'pos'}, t('position', [...state.rows.keys()].indexOf(e.link) + 1, state.rows.size)),
    ...Object.entries(ACTIONS).map(([cmd, a]) => btn(a.icon, a.title, () => {
      back();
      act(cmd, [e.link]);
    }, a.danger ? 'danger' : '')),
    h('span', {class: 'sep'}),
    btn('star', starred ? t('unstar') : t('star'), ev => star(e, ev.currentTarget), starred ? 'star on' : 'star'),
    btn('reply', t('reply'), () => openUrl(replyUrl(e))),
    btn('open', t('openInGmail') + ' (O)', ev => openEntry(e, o, ev))
  );
  $('reader-account').style.setProperty('--c', o.color);
  $('reader-account').lastChild.textContent = accountName(o);
  $('reader-subject').textContent = e.title || t('noSubject');
  $('reader-avatar').replaceChildren(avatar(e));
  $('reader-name').textContent = e.author_name;
  $('reader-addr').replaceChildren(h('span', {}, e.author_email), copyBtn(e.author_email));
  $('reader-date').textContent = fullDate(e.modified);
  $('app').classList.add('reading');

  const doc = await frameReady;
  doc.querySelector('base').href = e.link;
  doc.body.className = 'summary';
  doc.body.textContent = e.summary;
  $('reader').classList.add('loading');
  try {
    const node = await gmail.body(e.link, true);
    if (state.reading?.e !== e) {
      return;
    }
    if (!node) {
      throw Error('empty');
    }
    doc.body.className = '';
    doc.body.replaceChildren(node);
  }
  catch (err) {
    if (state.reading?.e === e) {
      doc.body.append(h('p', {class: 'note'}, t('bodyFailed')));
    }
  }
  finally {
    $('reader').classList.remove('loading');
  }
};
const back = () => {
  const link = state.reading?.e.link;
  state.reading = null;
  $('app').classList.remove('reading');
  if (link) {
    document.querySelector(`.row[data-link="${CSS.escape(link)}"]`)?.focus({preventScroll: true});
  }
};

/* keyboard: layout independent, so it works with the Russian layout too */
document.addEventListener('keydown', ev => {
  if (ev.metaKey || ev.ctrlKey || ev.altKey) {
    return;
  }
  const rowEl = document.activeElement?.closest?.('.row');
  const target = state.reading || (rowEl && state.rows.get(rowEl.dataset.link));
  const move = step => {
    const rows = [...document.querySelectorAll('.row')];
    const next = rows[Math.min(rows.length - 1, Math.max(0, rows.indexOf(rowEl) + step))];
    next?.focus();
    next?.scrollIntoView({block: 'nearest'});
  };
  const run = cmd => {
    if (target) {
      if (state.reading) {
        back();
      }
      act(cmd, [target.e.link]);
    }
  };

  if (ev.code === 'Escape' && state.reading) {
    back();
  }
  else if (ev.code === 'KeyZ' && state.pending) {
    undo();
  }
  else if (ev.code === 'KeyS' && state.reading) {
    $('reader-bar').querySelector('.star')?.click();
  }
  else if (state.reading && ['ArrowDown', 'ArrowUp', 'KeyJ', 'KeyK', 'Enter'].includes(ev.code)) {
    return;
  }
  else if (ev.code === 'ArrowDown' || ev.code === 'KeyJ') {
    move(1);
  }
  else if (ev.code === 'ArrowUp' || ev.code === 'KeyK') {
    move(-1);
  }
  else if (ev.code === 'Enter' && rowEl && rowEl === document.activeElement) {
    read(target.e, target.o);
  }
  else if (ev.code === 'KeyO' && target) {
    openEntry(target.e, target.o, ev);
  }
  else if (ev.code === 'KeyE') {
    run('rc_^i');
  }
  else if (ev.code === 'KeyR') {
    run('rd');
  }
  else if (ev.code === 'Delete' || ev.code === 'Backspace' || (ev.code === 'Digit3' && ev.shiftKey)) {
    run('tr');
  }
  else if (ev.code === 'Digit1' && ev.shiftKey) {
    run('sp');
  }
  else {
    return;
  }
  ev.preventDefault();
});

/* background */
chrome.runtime.onMessage.addListener(request => {
  if (request.method === 'update' || request.method === 'update-reset' || request.method === 'update-date') {
    stopSpin();
    update(request.data);
  }
  else if (request.method === 'close-popup') {
    flush();
    window.close();
  }
});
addEventListener('pagehide', flush);
document.addEventListener('visibilitychange', () => document.hidden && flush());

document.documentElement.lang = LANG;
for (const el of document.querySelectorAll('[data-i18n]')) {
  el.textContent = t(el.dataset.i18n);
}
for (const el of document.querySelectorAll('[data-i18n-label]')) {
  el.setAttribute(el.tagName === 'IFRAME' ? 'title' : 'aria-label', t(el.dataset.i18nLabel));
}

chrome.storage.session.get({
  'cached-objects': [],
  [Resolved.KEY]: []
}, prefs => update(Resolved.apply(prefs['cached-objects'], prefs[Resolved.KEY])));
