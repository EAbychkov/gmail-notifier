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
  const cache = {};

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

  gmail.body = (link, mode) => {
    link = link.replace('http://', 'https://');

    if (cache[link]) {
      return Promise.resolve(cache[link]);
    }

    const url = gmail.get.base(link);
    const thread = gmail.get.id(link);

    if (!thread) {
      return Promise.reject(Error('body -> Error at resolving thread. Please switch back to the summary mode.'));
    }

    return print(url, thread).then(({href, content}) => {
      const body = gmail.render[mode ? 'getHTMLText' : 'getPlainText'](content, href);
      cache[link] = body;
      return body;
    });
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
