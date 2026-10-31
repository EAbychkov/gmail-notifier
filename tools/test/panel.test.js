// The panel in headless Chrome, with chrome.* and Gmail replaced by panel/stub.js.
// A small server hands out the extension and the stub; each scenario of
// panel/test.js posts what it saw, and the checks below decide.
// CHROME names the browser; by default Google Chrome on macOS, google-chrome elsewhere.
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const {spawn} = require('child_process');

const EXT = path.join(__dirname, '../../extension');
const HERE = path.join(__dirname, 'panel');
const MAC = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CHROME = process.env.CHROME || (fs.existsSync(MAC) ? MAC : 'google-chrome');
const TYPES = {'.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.woff2': 'font/woff2'};

const waiting = new Map();
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (req.method === 'POST' && url.pathname === '/__result') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      res.end('ok');
      waiting.get(url.searchParams.get('scenario'))?.(JSON.parse(body));
    });
    return;
  }
  let file;
  let content;
  if (url.pathname === '/__panel.html') {
    content = fs.readFileSync(path.join(EXT, 'data/panel/index.html'), 'utf8')
      .replace('<head>', '<head><base href="/data/panel/"><script src="/__stub.js"></script>')
      .replace('</body>', '<script src="/__test.js"></script></body>');
    file = 'x.html';
  }
  else {
    file = url.pathname.startsWith('/__') ? path.join(HERE, url.pathname.slice(3)) : path.join(EXT, decodeURIComponent(url.pathname));
    if (!file.startsWith(EXT) && !file.startsWith(HERE) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end();
      return;
    }
    content = fs.readFileSync(file);
  }
  res.writeHead(200, {'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream'});
  res.end(content);
});

const run = (port, scenario, query = '') => new Promise(resolve => {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'mail-deck-chrome-'));
  const args = ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    `--user-data-dir=${profile}`, '--window-size=800,600',
    ...(process.platform === 'linux' ? ['--no-sandbox'] : []),
    `http://127.0.0.1:${port}/__panel.html?lang=en&scenario=${scenario}${query}`];
  const chrome = spawn(CHROME, args, {stdio: 'ignore'});
  const done = result => {
    clearTimeout(timer);
    waiting.delete(scenario);
    chrome.kill();
    resolve(result);
  };
  const timer = setTimeout(() => done({error: 'no result in 30 s'}), 30000);
  waiting.set(scenario, done);
  chrome.on('error', e => done({error: 'cannot start ' + CHROME + ': ' + e.message}));
});

const checks = {
  main: r => ({
    'the feed\'s mail shows': r.rowsBefore >= 3,
    'show more adds the search\'s extra mail': r.moreShown && r.rowsAfterMore === r.rowsBefore + 3,
    'starred mail is marked': r.starred >= 2,
    'signed-out accounts are listed': r.signedOut?.some(s => s.includes('gone@example.com')),
    'an action reaches the background at once, with its Undo window': r.action?.cmd === 'rc_^i' && r.action.delay === 5000 && r.action.id && r.rowsAfterAction === 1,
    'Undo cancels that same action and brings the row back': r.cancelSameId && r.rowsAfterUndo,
    'remind me later offers its times and writes the reminder': r.menuItems >= 3 && ['from', 'link', 'open', 'title', 'until'].every(k => r.reminder?.includes(k)),
    'a dragged mailbox moves, the order is saved': r.orderAfter?.[0] === r.orderBefore?.[1] && JSON.stringify(r.orderSaved) === JSON.stringify(r.orderAfter),
    'every mailbox keeps its colour when moved': r.coloursKept,
    'the reader shows the whole thread, newest open': r.thread?.messages === 3 && r.thread.lastOpen && r.thread.olderClosed && r.thread.to,
    'an attachment becomes a chip, Gmail\'s table goes': r.thread?.chips >= 1 && r.thread.attTableGone,
    'Google\'s redirect is taken off links': r.thread?.redirectUnwrapped,
    'Esc inside the message goes back': r.reading && r.escInFrameBack,
    'search every mailbox': r.searchFocused && r.searchCalls >= 2 && r.searchSections >= 1 && r.searchSeen >= 1
  }),
  speed: r => ({
    'the first panel asks the search': r.firstOpenSearches >= 1 && r.cached >= 1,
    'a second panel asks nothing and shows the same': r.secondOpenSearches === 0 && r.extraBack >= 3,
    'pointing at a mail fetches it': r.printsAfterHover === 1,
    'opening it then needs no second request': r.printsAfterOpen === 1 && r.keptForSession >= 1,
    'an action drops the kept answers': r.cacheDroppedAfterAction
  }),
  services: r => ({
    'Meet is Gmail\'s alone': JSON.stringify(r.meet) === '[true,false,false]',
    'a service mail says where it opens': r.openTitle?.includes('Yahoo Mail'),
    'a signed-out service mailbox signs in on its own site': r.signedOut?.some(s => s.includes('gone@yahoo.com')) && r.signInOpened?.startsWith('https://login.yahoo.com/'),
    'a service mail reads in the panel, older messages folded': r.bodyAsked?.startsWith('https://mail.yahoo.com/') && r.messages === 2,
    'nothing of the service\'s markup can run or leave': r.safeText.startsWith('second') && r.dangerous === 0 && !r.ran && r.relative.startsWith('https://mail.yahoo.com/'),
    'no star where the service has none': r.star === false && r.noStarHint,
    'a mail the panel cannot read opens on its site': r.protonReader === false && r.protonOpened?.startsWith('https://mail.proton.me/'),
    'pointing at a service mail fetches nothing': r.hoverFetched === 0,
    'search asks Gmail only': JSON.stringify(r.searchUrls) === '["https://mail.google.com/mail/u/0"]'
  }),
  wide: r => ({
    'a 700px newsletter fits without a sideways scroll': r.clientWidth > 0 && r.scrollWidth <= r.clientWidth + 1
  })
};

server.listen(0, '127.0.0.1', async () => {
  const {port} = server.address();
  let failed = 0;
  for (const [scenario, query] of [['main', ''], ['speed', ''], ['services', '&s=services'], ['wide', '&wide=1']]) {
    const r = await run(port, scenario, query);
    if (r.error) {
      failed += 1;
      console.log('not ok', scenario, '-', r.error);
      continue;
    }
    for (const [name, pass] of Object.entries(checks[scenario](r))) {
      if (!pass) {
        failed += 1;
      }
      console.log(pass ? 'ok' : 'not ok', name + (pass ? '' : ' - ' + JSON.stringify(r)));
    }
  }
  server.close();
  process.exit(failed ? 1 : 0);
});
