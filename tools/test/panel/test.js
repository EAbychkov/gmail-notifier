// Runs in the panel page next to stub.js; ?scenario= picks what to do. It reports
// what it saw to /__result, and panel.test.js decides what passes.
(async () => {
  const scenario = new URLSearchParams(location.search).get('scenario');
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const key = (target, code, extra = {}) => target.dispatchEvent(new KeyboardEvent('keydown', {code, bubbles: true, cancelable: true, ...extra}));
  const sent = method => window.__sent.filter(m => m.method === method);
  const rows = () => document.querySelectorAll('#list .row').length;
  const out = {};
  const report = () => fetch('/__result?scenario=' + scenario, {method: 'POST', body: JSON.stringify(out)});
  const until = async (test, ms = 3000) => {
    for (const end = Date.now() + ms; Date.now() < end; await wait(25)) {
      if (test()) {
        return true;
      }
    }
    return false;
  };
  try {
    await until(() => rows() > 0 || document.querySelector('#list .acc'));
    await wait(200);

    if (scenario === 'main') {
      // the feed's 20, then the search's extra mail behind "show more"
      out.rowsBefore = rows();
      const more = document.querySelector('#list .section .more');
      out.moreShown = Boolean(more);
      more?.click();
      await wait(50);
      out.rowsAfterMore = rows();
      out.starred = document.querySelectorAll('#list .row .starred').length;
      out.signedOut = [...document.querySelectorAll('#list .away .acc')].map(e => e.textContent);

      // an action goes to the background at once with its Undo window; Z cancels that same one
      const before = rows();
      document.querySelector('#list .row').focus();
      key(document, 'KeyE');
      await wait(250);
      const action = sent('gmail.action').at(-1);
      out.action = action && {cmd: action.cmd, delay: action.delay, id: Boolean(action.id)};
      out.rowsAfterAction = before - rows();
      key(document, 'KeyZ');
      await wait(100);
      const cancel = sent('gmail.action.cancel').at(-1);
      out.cancelSameId = Boolean(cancel && action && cancel.id === action.id);
      out.rowsAfterUndo = rows() === before;

      // remind me later: B opens the times, the first one writes the reminder
      document.querySelector('#list .row').focus();
      key(document, 'KeyB');
      await wait(50);
      const items = [...document.querySelectorAll('#menu button')];
      out.menuItems = items.length;
      window.__set = [];
      items[0]?.click();
      await wait(250);
      const reminder = window.__set.find(o => o['remind.links'])?.['remind.links']?.[0];
      out.reminder = reminder ? Object.keys(reminder).sort() : null;
      key(document, 'KeyZ');
      await wait(100);

      // drag the second mailbox above the first: the order is saved, every mailbox keeps its colour
      const colours = () => Object.fromEntries([...document.querySelectorAll('#list .section[data-key]')]
        .map(s => [s.dataset.key, s.style.getPropertyValue('--c')]));
      const coloursBefore = colours();
      const secs = [...document.querySelectorAll('#list .section[data-key]')];
      const dt = new DataTransfer();
      const r = secs[0].getBoundingClientRect();
      (secs[1].querySelector('[draggable="true"]') || secs[1]).dispatchEvent(new DragEvent('dragstart', {bubbles: true, dataTransfer: dt}));
      secs[0].dispatchEvent(new DragEvent('dragover', {bubbles: true, cancelable: true, dataTransfer: dt, clientY: r.top + 5}));
      secs[0].dispatchEvent(new DragEvent('drop', {bubbles: true, cancelable: true, dataTransfer: dt, clientY: r.top + 5}));
      await wait(100);
      out.orderBefore = secs.map(s => s.dataset.key);
      out.orderAfter = [...document.querySelectorAll('#list .section[data-key]')].map(s => s.dataset.key);
      out.orderSaved = window.__set.find(o => o.accountOrder)?.accountOrder || null;
      out.coloursKept = JSON.stringify(colours()) === JSON.stringify(Object.fromEntries(Object.keys(colours()).map(k => [k, coloursBefore[k]])));

      // the reader: the whole thread, a chip for the attachment, Google's redirect taken off
      document.querySelector('#list .row').click();
      const doc = document.getElementById('body').contentDocument;
      await until(() => doc.querySelector('.thread'));
      const msgs = [...doc.querySelectorAll('details.msg')];
      out.thread = {
        messages: msgs.length,
        lastOpen: msgs.at(-1)?.open === true,
        olderClosed: msgs.slice(0, -1).every(d => !d.open),
        to: Boolean(doc.querySelector('details[open] .to')?.textContent.trim()),
        chips: [...doc.querySelectorAll('.files a')].filter(a => a.getAttribute('href').includes('view=att')).length,
        attTableGone: !doc.querySelector('table.att'),
        redirectUnwrapped: [...doc.querySelectorAll('a')].some(a => a.getAttribute('href') === 'https://figma.com/file/x')
      };
      out.reading = document.getElementById('app').classList.contains('reading');
      // the keys work from inside the message too
      key(doc.body, 'Escape');
      await wait(100);
      out.escInFrameBack = !document.getElementById('app').classList.contains('reading');

      // search every mailbox
      key(document, 'Slash');
      await wait(50);
      out.searchFocused = document.activeElement?.id === 'search-input';
      document.getElementById('search-input').value = 'invoice';
      document.getElementById('search').requestSubmit();
      await until(() => document.querySelector('#list .row.seen'));
      out.searchSections = document.querySelectorAll('#list .section').length;
      out.searchSeen = document.querySelectorAll('#list .row.seen').length;
      out.searchCalls = sent('gmail.search').filter(m => m.query === 'invoice').length;
    }

    if (scenario === 'speed') {
      // the first panel asks; a second one finds the answers in the session and asks nothing
      await until(() => chrome.storage.session.area['extra.cache']);
      out.firstOpenSearches = sent('gmail.search').length;
      out.cached = Object.keys(chrome.storage.session.area['extra.cache'] || {}).length;
      extraLoaded = false;
      state.extra.clear();
      const asked = sent('gmail.search').length;
      await loadExtra();
      out.secondOpenSearches = sent('gmail.search').length - asked;
      out.extraBack = [...state.extra.values()].flat().length;

      // pointing at a mail fetches it; opening it then needs no second request
      const row = document.querySelector('#list .row');
      row.dispatchEvent(new MouseEvent('mouseenter'));
      await until(() => window.__prints > 0, 1500);
      out.printsAfterHover = window.__prints;
      row.click();
      const doc = document.getElementById('body').contentDocument;
      await until(() => doc.querySelector('.thread'));
      out.printsAfterOpen = window.__prints;
      out.keptForSession = (chrome.storage.session.area['print.index'] || []).length;

      // an action makes the kept answers old
      const archive = [...document.querySelectorAll('#reader-bar button')].find(b => b.title.startsWith(t('archive')));
      archive?.click();
      await wait(100);
      out.cacheDroppedAfterAction = !('extra.cache' in chrome.storage.session.area);
    }

    if (scenario === 'wide') {
      // a 700px newsletter fits the reader without a sideways scroll
      document.querySelector('#list .row').click();
      const doc = document.getElementById('body').contentDocument;
      await until(() => doc.querySelector('.root'));
      await wait(400);
      out.scrollWidth = doc.documentElement.scrollWidth;
      out.clientWidth = doc.documentElement.clientWidth;
    }
  }
  catch (e) {
    out.error = String(e && e.stack || e);
  }
  report();
})();
