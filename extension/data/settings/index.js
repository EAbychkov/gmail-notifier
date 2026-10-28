'use strict';

// Every setting this page shows, with the background's defaults
const DEFAULTS = {
  'period': 120,
  'initialPeriod': 3,
  'network.watch': true,
  'idle.watch': true,
  'alphabetic': false,
  'notification': true,
  'notificationTime': 10,
  'notification.state.active': true,
  'notification.state.idle': true,
  'notification.state.locked': true,
  'notification.buttons.markasread': true,
  'notification.buttons.archive': true,
  'notification.buttons.trash': false,
  'combined': false,
  'threatAsNew': 10,
  'notificationFormat': chrome.i18n.getMessage('notification'),
  'notificationTruncate': 70,
  'silentTime': 10,
  'alert': true,
  'soundVolume': 80,
  'sound.state.active': true,
  'sound.state.idle': true,
  'sound.state.locked': true,
  'badge': true,
  'backgroundColor': '#e5484d',
  'minimal': true,
  'oldFashion': 0,
  'smartOpen': true,
  'currentTab': false,
  'newWindow': false,
  'ignoreOpens': false,
  'searchMode': true,
  'background': false,
  'relatedToCurrent': false,
  'onGmailNotification': true,
  'doReadOnArchive': true
};
// the default sound and five special ones, each a type (0-3 built in, 4 own file), a file and a mime
const MEDIA = ['default', 'custom0', 'custom1', 'custom2', 'custom3', 'custom4'].map(n => 'notification.sound.media.' + n);
for (const m of MEDIA) {
  DEFAULTS[m + '.type'] = 0;
}
for (const m of MEDIA.slice(1)) {
  DEFAULTS[m + '.selector'] = 0;
  DEFAULTS[m + '.filter'] = '';
}
for (let i = 0; i < 10; i += 1) {
  DEFAULTS['feeds_' + i] = '';
}
const SOUNDS = ['Chime', 'Bell', 'Ding', 'Classic'];
const SWATCHES = ['#e5484d', '#4352e3', '#169b62', '#d9822b', '#8b55d9', '#4f5b6b'];

const store = chrome.storage.local;
const $ = id => document.getElementById(id);
const h = (tag, props, ...kids) => {
  const el = Object.assign(document.createElement(tag), props);
  el.append(...kids.filter(k => k !== null && k !== undefined && k !== false));
  return el;
};
let prefs = {};

/* saving */
let toastTimer;
const toast = text => {
  const el = $('toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1400);
};
const save = values => {
  Object.assign(prefs, values);
  return store.set(values).then(() => toast('Saved'), e => toast(e.message));
};

// a row that depends on a switch fades out while the switch is off
const syncNeeds = () => {
  for (const row of document.querySelectorAll('[data-needs]')) {
    const on = prefs[row.dataset.needs];
    row.classList.toggle('off', !on);
    row.querySelectorAll('input, select, button, textarea').forEach(el => el.disabled = !on);
  }
};

/* plain fields: data-key names the stored setting */
const paintFields = () => {
  for (const el of document.querySelectorAll('[data-key]')) {
    const value = prefs[el.dataset.key];
    if (el.type === 'checkbox') {
      el.checked = el.hasAttribute('data-invert') ? !value : value;
    }
    else {
      if (el.tagName === 'SELECT' && ![...el.options].some(o => o.value === String(value))) {
        el.add(new Option(`${value} (custom)`, value));
      }
      el.value = value;
    }
  }
  const mode = prefs.currentTab ? 'current' : prefs.newWindow ? 'window' : 'tab';
  document.querySelector(`input[name="open"][value="${mode}"]`).checked = true;
};
document.addEventListener('change', ({target}) => {
  const key = target.dataset.key;
  if (key) {
    let value = target.value;
    if (target.type === 'checkbox') {
      value = target.hasAttribute('data-invert') ? !target.checked : target.checked;
    }
    else if (target.dataset.type === 'number') {
      value = Number(value);
    }
    save({[key]: value});
    syncNeeds();
  }
  else if (target.name === 'open') {
    save({currentTab: target.value === 'current', newWindow: target.value === 'window'});
  }
  else if (target.name === 'scope') {
    document.body.dataset.scope = target.value;
    try {
      localStorage.setItem('scope', target.value);
    }
    catch (e) {}
  }
});

/* badge colour: a few presets and any other colour */
const paintSwatches = () => {
  const color = prefs.backgroundColor;
  const pick = h('input', {type: 'color', className: 'pick', title: 'Any colour', value: SWATCHES.includes(color) ? '#e5484d' : color});
  pick.classList.toggle('on', !SWATCHES.includes(color));
  pick.setAttribute('aria-label', 'Any colour');
  pick.onchange = () => save({backgroundColor: pick.value}).then(paintSwatches);
  $('swatches').replaceChildren(...SWATCHES.map(c => {
    const input = h('input', {type: 'radio', name: 'swatch', value: c, checked: c === color, title: c});
    input.style.setProperty('--c', c);
    input.setAttribute('aria-label', c);
    input.onchange = () => save({backgroundColor: c}).then(paintSwatches);
    return input;
  }), pick);
};

/* sounds */
const pickFile = () => new Promise((resolve, reject) => {
  const input = $('file');
  input.value = '';
  input.oncancel = () => reject(Error('cancelled'));
  input.onchange = () => {
    const file = input.files[0];
    if (!file || !(file.type.startsWith('audio/') || file.type.startsWith('video/'))) {
      toast('Pick an audio file');
      return reject(Error('not audio'));
    }
    const reader = new FileReader();
    reader.onload = () => resolve({data: reader.result, type: file.type});
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  };
  input.click();
});
const soundPicker = media => {
  const select = h('select', {}, ...SOUNDS.map((name, i) => h('option', {value: i, textContent: name})),
    h('option', {value: 4, textContent: 'Your own file…'}));
  select.setAttribute('aria-label', 'Sound');
  select.value = prefs[media + '.type'];
  select.onchange = () => {
    if (select.value !== '4') {
      return save({[media + '.type']: Number(select.value)});
    }
    pickFile().then(file => save({[media + '.file']: file.data, [media + '.mime']: file.type, [media + '.type']: 4}))
      .catch(() => select.value = prefs[media + '.type']);
  };
  return select;
};

// special sounds: up to five "when this contains that, play this" rules
const shownRules = new Set();
const paintRules = () => {
  MEDIA.slice(1).forEach((m, i) => prefs[m + '.filter'] && shownRules.add(i));
  $('rules').replaceChildren(...[...shownRules].sort().map(i => {
    const m = MEDIA[i + 1];
    const field = h('select', {}, ...['Sender', 'Subject', 'Text'].map((name, v) => h('option', {value: v, textContent: name})));
    field.value = prefs[m + '.selector'];
    field.onchange = () => save({[m + '.selector']: Number(field.value)});
    const word = h('input', {type: 'text', value: prefs[m + '.filter'], placeholder: 'contains…', spellcheck: false});
    word.onchange = () => save({[m + '.filter']: word.value.trim()});
    const remove = h('button', {type: 'button', className: 'ghost round', textContent: '×', title: 'Remove this rule'});
    remove.onclick = () => {
      shownRules.delete(i);
      save({[m + '.filter']: '', [m + '.selector']: 0, [m + '.type']: 0}).then(paintRules);
    };
    return h('div', {className: 'rule'}, field, word, soundPicker(m), remove);
  }));
  $('add-rule').hidden = shownRules.size >= 5;
  syncNeeds();
};
$('add-rule').onclick = () => {
  const free = [0, 1, 2, 3, 4].find(i => !shownRules.has(i));
  shownRules.add(free);
  paintRules();
  $('rules').lastChild.querySelector('input').focus();
};

/* inboxes */
const cleanLabels = value => value.split(',')
  .map(tag => tag.trim().replace(/^"|"$/g, '').replace(/[\s/]+/g, '-').toLowerCase())
  .filter((tag, i, all) => tag && all.indexOf(tag) === i)
  .join(', ');
const paintAccounts = async () => {
  const {accounts} = await store.get({accounts: {}});
  const {'cached-objects': objs} = await chrome.storage.session.get({'cached-objects': []});
  // labels belong to the account's slot in the browser, /mail/u/<n>
  const slot = {};
  for (const o of objs) {
    const m = /\/u\/(\d+)/.exec(o.xml.rootLink || o.xml.link || '');
    if (m) {
      slot[o.xml.title] = Number(m[1]);
    }
  }
  const names = Object.keys(accounts);
  if (names.length === 0) {
    $('accounts').replaceChildren(h('p', {className: 'empty', textContent: 'Your inboxes show up here after the first check.'}));
    return;
  }
  $('accounts').replaceChildren(...names.map(name => {
    const toggle = h('input', {type: 'checkbox', checked: accounts[name].ignored !== true});
    toggle.setAttribute('role', 'switch');
    toggle.setAttribute('aria-label', 'Show ' + name);
    toggle.onchange = () => store.get({accounts: {}}).then(p => {
      p.accounts[name] = {...p.accounts[name], ignored: !toggle.checked};
      return save({accounts: p.accounts});
    });
    const n = slot[name];
    let labels = null;
    if (n !== undefined && n < 10) {
      labels = h('input', {type: 'text', className: 'labels adv', value: prefs['feeds_' + n], placeholder: 'Labels: inbox', spellcheck: false});
      labels.setAttribute('aria-label', 'Labels for ' + name);
      labels.onchange = () => {
        labels.value = cleanLabels(labels.value);
        save({['feeds_' + n]: labels.value});
      };
    }
    return h('div', {className: 'row'},
      h('span', {className: 'face', textContent: name[0].toUpperCase()}),
      h('span', {className: 'text'}, h('b', {textContent: name})),
      labels,
      toggle);
  }));
};
$('forget').onclick = () => store.remove('accounts').then(() => {
  toast('Inbox list cleared');
  paintAccounts();
});

/* the rest */
$('reset').onclick = () => {
  if (confirm('Put every setting back to its default? Inbox switches and labels reset too.')) {
    store.set({...DEFAULTS, accounts: {}}).then(() => location.reload());
  }
};
document.addEventListener('click', ({target}) => {
  if (target.id === 'play') {
    chrome.runtime.sendMessage({method: 'test-play'});
  }
});

let scope = 'essentials';
try {
  scope = localStorage.getItem('scope') || scope;
}
catch (e) {}
document.body.dataset.scope = scope;
document.querySelector(`input[name="scope"][value="${scope}"]`).checked = true;

store.get(DEFAULTS).then(stored => {
  prefs = stored;
  paintFields();
  paintSwatches();
  $('default-sound').replaceChildren(soundPicker(MEDIA[0]), h('button', {type: 'button', className: 'ghost', id: 'play', textContent: 'Play'}));
  paintRules();
  syncNeeds();
  return paintAccounts();
});
