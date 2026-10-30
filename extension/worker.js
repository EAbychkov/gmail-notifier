/* global checkEmails, repeater, sound, offscreen, Resolved */

if (typeof importScripts !== 'undefined') {
  self.importScripts('/core/utils/log.js');
  self.importScripts('/core/open.js');
  self.importScripts('/core/offscreen.js');
  self.importScripts('/core/context.js');
  self.importScripts('/core/button.js');
  self.importScripts('/core/sound.js');
  self.importScripts('/core/check.js');
  self.importScripts('/core/repeater.js');
  self.importScripts('/core/watch.js');
  self.importScripts('/core/remind.js');
}

const toast = (message = 'Unknown Error') => chrome.notifications.create({
  type: 'basic',
  iconUrl: '/data/icons/notification/48.png',
  title: chrome.i18n.getMessage('gmail'),
  message
}, id => setTimeout(chrome.notifications.clear, 5000, id));

const onClicked = link => {
  if (link) {
    self.openLink(link);
    return;
  }
  chrome.storage.local.get({
    'url': 'https://mail.google.com/mail/u/0/',
    'smartOpen': true
  }, async prefs => {
    if (prefs.smartOpen) {
      try {
        const objs = await checkEmails.getCached();
        if (objs && objs.length) {
          // Selected account
          const unreadEntries = [].concat([], ...objs.map(obj => obj.xml.entries));
          // selecting the correct account
          if (unreadEntries.length) {
            // newest first
            const newestEntry = unreadEntries.sort((p, c) => new Date(c.modified) - new Date(p.modified))[0];
            if (newestEntry) {
              self.checkEmails.opened(newestEntry.link);
              return self.openLink(newestEntry.link);
            }
          }
          try {
            const link = objs[0].xml.entries[0].link;
            self.checkEmails.opened(link);
            return self.openLink(link);
          }
          catch (e) {}
        }
      }
      catch (e) {}
    }
    return self.openLink(prefs.url);
  });
};

// user interactions
chrome.action.onClicked.addListener(() => onClicked());

// messaging
// a closed panel has closed its port too; answering it then throws, and what
// comes after the answer would never run
const reply = (response, value) => {
  try {
    response(value);
  }
  catch (e) {}
};
// actions waiting out the panel's Undo window: id -> {links, response, timer}
const later = new Map();
chrome.runtime.onMessage.addListener((request, sender, response) => {
  const method = request.method;

  if (method === 'update' && request.forced) {
    repeater.reset('popup.forced');
  }
  else if (method === 'update') {
    repeater.reset('popup', 500);
  }
  else if (method === 'open') {
    const url = request.url;
    if (typeof url === 'string') {
      self.openLink(url);
    }
    else if (url.button === 2 || !url.link) {
      return;
    }
    else {
      // opening a mail marks it as read
      if (url.isPrivate !== true) {
        self.checkEmails.opened(url.link);
      }
      if (url.button === 1 || (url.button === 0 && (url.ctrlKey || url.metaKey))) {
        self.openLink(url.link, true, null, url.isPrivate);
      }
      else {
        self.openLink(url.link, null, null, url.isPrivate);
      }
    }
  }
  else if (method === 'test-play') {
    sound.play().catch(e => toast(e.message));
  }
  else if (method === 'gmail.action.cancel') {
    const o = later.get(request.id);
    if (o) {
      clearTimeout(o.timer);
      later.delete(request.id);
      Resolved.forget(o.links).then(() => self.checkEmails.refresh());
      // the panel still waits for an answer to the action itself
      reply(o.response);
    }
  }
  else if (method === 'gmail.action') {
    const {cmd, links} = request;
    const run = () => chrome.storage.local.get({
      doReadOnArchive: true
    }, prefs => {
      request.prefs = prefs;
      offscreen.command({
        cmd: 'gmail.action',
        request
      }).then(e => {
        if (e === true) {
          // the feed cannot report it yet; store the links and let the panel
          // and the badge hide them until it does
          if (cmd !== 'st' && cmd !== 'xst') {
            Resolved.record(links).then(() => self.checkEmails.refresh());
          }
          reply(response);
        }
        else {
          console.error(e);
          Resolved.forget(links).then(() => self.checkEmails.refresh());
          // do we have access to the basic HTML view?
          if (e?.details?.links?.length) {
            self.openLink(e.details.links[0]);
            toast(chrome.i18n.getMessage('msg_6'));
          }
          else {
            toast(e?.message || 'Unknown Error - 1');
          }
          reply(response, e || {message: 'Unknown Error - 1'});
        }
      }).finally(() => repeater.reset('popup.action', 500));
    });
    // the panel's Undo window: the mail leaves the badge now and reaches Gmail
    // once the window is over, whether the panel is still open or not
    if (request.delay) {
      Resolved.record(links, request.delay + 10000).then(() => self.checkEmails.refresh());
      later.set(request.id, {
        links,
        response,
        timer: setTimeout(() => {
          later.delete(request.id);
          run();
        }, request.delay)
      });
    }
    else {
      run();
    }

    return true;
  }
  else if (method === 'gmail.search') {
    offscreen.command({
      cmd: 'gmail.search',
      request
    }).then(r => {
      if (!r) {
        reply(response);
        console.error('Empty response from offscreen');
      }
      else if (r.message) {
        // do we have access to the basic HTML view?
        if (r.details && r.details.links && r.details.links.length) {
          self.openLink(r.details.links[0]);
          toast(chrome.i18n.getMessage('msg_6'));
        }
        reply(response);
        console.error(r);
      }
      else {
        reply(response, r.entries);
      }
    });
    return true;
  }
  else if (method === 'stop-sound') {
    sound.stop();
  }
  else if (method === 'get-at') {
    chrome.cookies.get({name: 'GMAIL_AT', url: 'https://mail.google.com/mail/u/' + request.n}, o => {
      response(o?.value);
    });
    return true;
  }
});
