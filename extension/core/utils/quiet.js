// Whether new mail may make a noise: the "never" and "only" word lists and the
// quiet hours. The mail itself stays in the panel and the badge either way.
// This file is loaded by the background (importScripts) and by the tests in
// node, so it must not rely on anything else.
const Quiet = {};

// one word or address per line, compared without case
Quiet.words = text => String(text || '').split('\n').map(s => s.trim().toLowerCase()).filter(Boolean);

// the sender's name and address and the subject are what the lists look at
Quiet.has = (e, words) => words.some(w => [e.author_name, e.author_email, e.title]
  .some(s => String(s || '').toLowerCase().includes(w)));

// a mail is told about unless a "never" word is in it, or an "only" list exists and none of its words is
Quiet.wanted = (e, prefs) => {
  const only = Quiet.words(prefs['notify.only']);
  return !Quiet.has(e, Quiet.words(prefs['notify.never'])) && (only.length === 0 || Quiet.has(e, only));
};

// "22:30" -> 1350; anything else is NaN
Quiet.minutes = value => {
  const m = /^(\d{1,2}):(\d{2})/.exec(value || '');
  return m ? Number(m[1]) * 60 + Number(m[2]) : NaN;
};

// the weekend of the user's region, 1 is Monday and 7 is Sunday
Quiet.weekend = (lang = navigator.language) => {
  try {
    const locale = new Intl.Locale(lang);
    const info = locale.getWeekInfo ? locale.getWeekInfo() : locale.weekInfo;
    if (info && info.weekend && info.weekend.length) {
      return info.weekend;
    }
  }
  catch (e) {}
  return [6, 7];
};

// from-to may cross midnight (22:00-08:00); equal ends mean no quiet hours at all
Quiet.hours = (prefs, now = new Date(), weekend = Quiet.weekend()) => {
  if (!prefs['quiet.hours']) {
    return false;
  }
  if (prefs['quiet.weekend'] && weekend.includes(now.getDay() || 7)) {
    return true;
  }
  const from = Quiet.minutes(prefs['quiet.from']);
  const to = Quiet.minutes(prefs['quiet.to']);
  if (isNaN(from) || isNaN(to) || from === to) {
    return false;
  }
  const t = now.getHours() * 60 + now.getMinutes();
  return from < to ? t >= from && t < to : t >= from || t < to;
};
