// The quiet hours and the word rules of core/utils/quiet.js.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const FILE = path.join(__dirname, '../../extension/core/utils/quiet.js');

const load = lang => vm.runInNewContext(fs.readFileSync(FILE, 'utf8') + ';Quiet', {navigator: {language: lang}, Intl});
const Quiet = load('en-US');

let n = 0;
const check = (name, fn) => {
  fn();
  n += 1;
  console.log('ok', name);
};

const mail = (author_name, author_email, title) => ({author_name, author_email, title, summary: 'body text'});
const news = mail('Daily Digest', 'news@shop.example', 'Sale today');
const boss = mail('Anna Petrova', 'anna@work.example', 'Budget');

check('words: trims, lowercases, drops empty lines', () => {
  assert.deepStrictEqual([...Quiet.words('  News \n\n@SHOP.example\r\n ')], ['news', '@shop.example']);
  assert.deepStrictEqual([...Quiet.words(undefined)], []);
});
check('wanted: no lists lets everything through', () => {
  assert.strictEqual(Quiet.wanted(news, {}), true);
});
check('wanted: never matches name, address and subject, case-insensitive', () => {
  assert.strictEqual(Quiet.wanted(news, {'notify.never': 'DIGEST'}), false);
  assert.strictEqual(Quiet.wanted(news, {'notify.never': 'shop.example'}), false);
  assert.strictEqual(Quiet.wanted(news, {'notify.never': 'sale'}), false);
  assert.strictEqual(Quiet.wanted(boss, {'notify.never': 'digest\nsale'}), true);
});
check('wanted: never does not look at the body', () => {
  assert.strictEqual(Quiet.wanted(news, {'notify.never': 'body'}), true);
});
check('wanted: only lets just the listed through', () => {
  assert.strictEqual(Quiet.wanted(boss, {'notify.only': '@work.example'}), true);
  assert.strictEqual(Quiet.wanted(news, {'notify.only': '@work.example'}), false);
});
check('wanted: never wins over only', () => {
  assert.strictEqual(Quiet.wanted(boss, {'notify.only': 'anna', 'notify.never': 'budget'}), false);
});
check('wanted: missing fields do not throw', () => {
  assert.strictEqual(Quiet.wanted({}, {'notify.never': 'x', 'notify.only': 'y'}), false);
});

const at = (day, hh, mm = 0) => new Date(2026, 9, 26 + day, hh, mm); // 2026-10-26 is a Monday
const night = {'quiet.hours': true, 'quiet.from': '22:00', 'quiet.to': '08:00'};
const WEEKEND = [6, 7];
check('hours: off when the switch is off', () => {
  assert.strictEqual(Quiet.hours({...night, 'quiet.hours': false}, at(0, 23), WEEKEND), false);
});
check('hours: overnight window crosses midnight', () => {
  assert.strictEqual(Quiet.hours(night, at(0, 21, 59), WEEKEND), false);
  assert.strictEqual(Quiet.hours(night, at(0, 22, 0), WEEKEND), true);
  assert.strictEqual(Quiet.hours(night, at(1, 3, 0), WEEKEND), true);
  assert.strictEqual(Quiet.hours(night, at(1, 7, 59), WEEKEND), true);
  assert.strictEqual(Quiet.hours(night, at(1, 8, 0), WEEKEND), false);
});
check('hours: same-day window', () => {
  const lunch = {'quiet.hours': true, 'quiet.from': '12:30', 'quiet.to': '13:15'};
  assert.strictEqual(Quiet.hours(lunch, at(0, 12, 29), WEEKEND), false);
  assert.strictEqual(Quiet.hours(lunch, at(0, 12, 30), WEEKEND), true);
  assert.strictEqual(Quiet.hours(lunch, at(0, 13, 15), WEEKEND), false);
});
check('hours: equal or broken ends mean no window', () => {
  assert.strictEqual(Quiet.hours({'quiet.hours': true, 'quiet.from': '09:00', 'quiet.to': '09:00'}, at(0, 9), WEEKEND), false);
  assert.strictEqual(Quiet.hours({'quiet.hours': true, 'quiet.from': '', 'quiet.to': '08:00'}, at(0, 3), WEEKEND), false);
});
check('hours: weekend is quiet all day only when asked', () => {
  const saturdayNoon = at(5, 12);
  const sundayNoon = at(6, 12);
  assert.strictEqual(saturdayNoon.getDay(), 6);
  assert.strictEqual(Quiet.hours(night, saturdayNoon, WEEKEND), false);
  assert.strictEqual(Quiet.hours({...night, 'quiet.weekend': true}, saturdayNoon, WEEKEND), true);
  assert.strictEqual(Quiet.hours({...night, 'quiet.weekend': true}, sundayNoon, WEEKEND), true);
  assert.strictEqual(Quiet.hours({...night, 'quiet.weekend': true}, at(0, 12), WEEKEND), false);
});
check('hours: weekend needs the quiet hours switch', () => {
  assert.strictEqual(Quiet.hours({'quiet.hours': false, 'quiet.weekend': true}, at(5, 12), WEEKEND), false);
});
check('hours: a Friday-Saturday weekend', () => {
  const friday = at(4, 12);
  assert.strictEqual(friday.getDay(), 5);
  assert.strictEqual(Quiet.hours({...night, 'quiet.weekend': true}, friday, [5, 6]), true);
  assert.strictEqual(Quiet.hours({...night, 'quiet.weekend': true}, at(6, 12), [5, 6]), false);
});
check('weekend: follows the region', () => {
  assert.deepStrictEqual([...load('en-US').weekend()], [6, 7]);
  assert.deepStrictEqual([...load('he-IL').weekend()], [5, 6]);
  assert.deepStrictEqual([...load('not a locale!').weekend()], [6, 7]);
});
console.log(n, 'checks passed');
