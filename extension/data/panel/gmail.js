'use strict';

const gmail = {};

/* gmail.get */
gmail.get = {
  base: url => /[^?]*/.exec(url)[0],
  id: url => {
    const tmp = /message_id=([^&]*)/.exec(url);
    if (tmp && tmp.length) {
      return tmp[1];
    }
    return null;
  }
};

/* gmail.body */
{
  // the thread's print view; a mail back from snooze answers msg= with 400, so th= gets a try too
  const print = async (url, thread) => {
    let status;
    for (const key of ['msg', 'th']) {
      const href = url + '/?ui=2&view=pt&dsqt=1&search=all&' + key + '=' + thread;
      const r = await fetch(href, {
        credentials: 'include'
      });
      if (r.ok) {
        return {href, content: await r.text()};
      }
      status = r.status;
      if (status !== 400) {
        break;
      }
    }
    throw Error('body -> print failed -> ' + status);
  };

  // The print views of the last mails opened or pointed at stay for the browser
  // session (in memory, not on disk), so such a mail opens again at once. A
  // version, the feed's time of the thread, keeps a thread with new mail apart.
  const KEEP = 12;
  const LARGEST = 800000;
  const STORE = 'print:';
  const INDEX = 'print.index';
  let writing = Promise.resolve();
  const keep = (key, value) => writing = writing.then(async () => {
    if (value.content.length > LARGEST) {
      return;
    }
    const {[INDEX]: index = []} = await chrome.storage.session.get(INDEX);
    const next = [key, ...index.filter(k => k !== key)];
    await chrome.storage.session.set({[STORE + key]: value, [INDEX]: next.slice(0, KEEP)});
    if (next.length > KEEP) {
      await chrome.storage.session.remove(next.slice(KEEP).map(k => STORE + k));
    }
  }).catch(() => {});
  const kept = key => chrome.storage.session.get(STORE + key).then(prefs => prefs[STORE + key], () => null);

  // one request per mail and panel, however many times it is pointed at or opened
  const cache = {};

  gmail.body = (link, mode, version = '') => {
    link = link.replace('http://', 'https://');

    const url = gmail.get.base(link);
    const thread = gmail.get.id(link);

    if (!thread) {
      return Promise.reject(Error('body -> Error at resolving thread. Please switch back to the summary mode.'));
    }
    const key = link + '#' + version;
    const id = key + (mode ? '#html' : '#text');
    if (!cache[id]) {
      cache[id] = (async () => {
        const saved = version ? await kept(key) : null;
        const page = saved || await print(url, thread);
        if (version && !saved) {
          keep(key, page);
        }
        return gmail.render[mode ? 'getHTMLText' : 'getPlainText'](page.content, page.href);
      })();
      cache[id].catch(() => delete cache[id]);
    }
    return cache[id];
  };
}

/* gmail.render */
{
  const el = (tag, className, ...kids) => {
    const e = document.createElement(tag);
    e.className = className;
    e.append(...kids);
    return e;
  };

  // every message of the thread: who, when, to whom, its attachments and its body cell
  const getMessages = (content, href) => {
    const doc = new DOMParser().parseFromString(content, 'text/html');
    // the print view links relative to itself
    const base = doc.createElement('base');
    base.href = href;
    doc.head.prepend(base);

    return [...doc.querySelectorAll('table.message')].map(table => {
      const rows = [...table.rows];
      const head = rows[0];
      const body = rows.at(-1)?.cells[rows.at(-1).cells.length - 1];
      if (!head || !body || rows.length < 2) {
        return null;
      }
      for (const a of body.querySelectorAll('a[href]')) {
        let url = a.href;
        // prevent Google redirection
        if (url.startsWith('https://www.google.com/url?q=')) {
          try {
            url = (new URL(url)).searchParams.get('q') || url;
          }
          catch (e) {}
        }
        a.setAttribute('href', url);
      }
      for (const img of body.querySelectorAll('img[src]')) {
        img.setAttribute('src', img.src);
      }
      const recipient = table.querySelector('.recipient');
      return {
        name: head.querySelector('b')?.textContent.trim() || head.cells[0]?.textContent.trim() || '',
        date: head.cells.length > 1 ? head.cells[head.cells.length - 1].textContent.trim() : '',
        to: recipient ? [...recipient.querySelectorAll('div')].map(d => d.textContent.trim()).filter(Boolean)
          .join('\n') || recipient.textContent.trim() : '',
        files: attachments(body),
        body
      };
    }).filter(Boolean);
  };
  // Gmail lists a file with a View and a Download link, its name in bold next to them
  const attachments = body => {
    const found = new Map();
    for (const a of body.querySelectorAll('a[href*="view=att"]')) {
      let url;
      try {
        url = new URL(a.href);
      }
      catch (e) {
        continue;
      }
      const id = url.searchParams.get('attid');
      const disp = url.searchParams.get('disp');
      if (!id || !['attd', 'safe', 'inline'].includes(disp)) {
        continue;
      }
      const o = found.get(id) || {};
      o[disp === 'attd' ? 'download' : 'view'] = url.href;
      for (let p = a.parentElement, i = 0; p && i < 5 && !o.name; p = p.parentElement, i += 1) {
        o.name = p.querySelector('b')?.textContent.trim();
      }
      found.set(id, o);
    }
    if (found.size) {
      // their links are on the chips now
      for (const table of body.querySelectorAll('table.att')) {
        if (table.previousElementSibling?.tagName === 'HR') {
          table.previousElementSibling.remove();
        }
        table.remove();
      }
    }
    return [...found.values()];
  };

  const root = body => {
    // remove extra padding
    for (const table of body.querySelectorAll('table[cellpadding="12"]')) {
      table.removeAttribute('cellpadding');
    }
    const table = el('table', 'root');
    const tr = document.createElement('tr');
    table.append(tr);
    tr.append(body);
    return table;
  };
  const files = list => list.length ? el('p', 'files', ...list.map(f => {
    const a = el('a', 'file', '📎 ' + (f.name || chrome.i18n.getMessage('panel_attachment')));
    a.href = f.view || f.download;
    if (f.view && f.download) {
      const d = el('a', 'download', '↓');
      d.href = f.download;
      d.title = chrome.i18n.getMessage('panel_download');
      return el('span', 'file-pair', a, d);
    }
    return a;
  })) : '';
  const card = (m, open) => {
    const d = el('details', 'msg');
    d.open = open;
    d.append(
      el('summary', '',
        el('b', 'who', m.name),
        el('span', 'date', m.date),
        el('span', 'snippet', m.body.textContent.trim().replace(/\s+/g, ' ').slice(0, 160))),
      m.to ? el('p', 'to', m.to) : '',
      files(m.files),
      root(m.body)
    );
    return d;
  };

  gmail.render = {
    // the newest message open; older ones fold to a line, a long run of them to one line
    getHTMLText(content, href) {
      const messages = getMessages(content, href);
      if (messages.length === 0) {
        return '';
      }
      const last = messages.at(-1);
      if (messages.length === 1) {
        return el('div', 'thread single', last.to ? el('p', 'to', last.to) : '', files(last.files), root(last.body));
      }
      const older = messages.slice(0, -1);
      const shown = older.length > 3 ? older.slice(-2) : older;
      const folded = older.slice(0, older.length - shown.length);
      return el('div', 'thread',
        folded.length ? el('details', 'earlier',
          el('summary', '', chrome.i18n.getMessage('panel_earlier', [String(folded.length)])),
          ...folded.map(m => card(m, false))) : '',
        ...shown.map(m => card(m, false)),
        card(last, true)
      );
    },
    getPlainText(content, href) {
      const last = getMessages(content, href).at(-1);
      if (last) {
        const span = document.createElement('span');
        span.style['white-space'] = 'pre-line';
        span.textContent = last.body.innerText;
        return span;
      }
      return '';
    }
  };
}
