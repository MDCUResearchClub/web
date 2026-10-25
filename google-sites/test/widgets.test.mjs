// Run with: node --test google-sites/test/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fixtures from './fixtures.mjs';
import { render, payload } from './harness.mjs';

const VIEWS = ['opportunities', 'open-now', 'hero-actions', 'stats', 'events-home', 'events', 'showcase-home', 'showcase-stats', 'showcase'];

test('every view renders a complete page without the error fallback', () => {
  for (const view of VIEWS) {
    const html = render(view, { fixtures });
    const data = payload(html);
    assert.ok(!data.error, view + ' loaded with an error');
    assert.match(html, /<div id="app"><\/div>/, view);
    assert.match(html, /:root \{/, view + ' is missing Styles.html');
    assert.match(html, /function renderOpportunities/, view + ' is missing App.html');
    assert.ok(!/<\?/.test(html), view + ' has an unevaluated scriptlet');
  }
});

const MEMBER = 'student@docchula.com';

test('opportunities: newest academic year, projects before open labs, closed hidden', () => {
  const data = payload(render('opportunities', { fixtures, email: MEMBER }));
  assert.equal(data.viewer.member, true);
  assert.equal(data.year, '2026-2027');
  assert.deepEqual(data.years, ['2026-2027', '2025-2026']);
  assert.deepEqual(data.items.map((i) => i.kind), ['project', 'project', 'open']);
  assert.equal(data.items[0].title, 'การศึกษาปัจจัยเสี่ยงของภาวะหกล้มในผู้สูงอายุในชุมชน', 'newest answer first');
  assert.equal(data.items[2].advisor, 'ศ. นพ. ตัวอย่าง สาม');
  assert.equal(data.items[2].dept, 'จุลชีววิทยา');
});

test('open-now: only defined projects, with the total for the button', () => {
  const data = payload(render('open-now', { fixtures }));
  assert.equal(data.total, 3);
  assert.equal(data.items.length, 2);
  assert.ok(data.items.every((i) => i.kind === 'project'));
});

test('events: only upcoming events are sent; real date cells are read regardless of display format', () => {
  const data = payload(render('events', { fixtures }));
  assert.deepEqual(data.upcoming.map((e) => e.date), ['2026-11-20', '2026-12-05']);
  assert.equal(data.upcoming[0].time, '16:00–18:30');
  assert.equal(data.upcoming[0].poster, 'https://lh3.googleusercontent.com/d/1AbCdEfGhIjKlMnOpQrStUvWxYz012345=w1200');
  assert.equal(data.past, undefined, 'past activities are hand-made posts in Google Sites');
});

test('events-home: next event, or an empty state once it has passed, plus the two latest activities', () => {
  const later = payload(render('events-home', { fixtures, now: '2027-01-10T09:00:00+07:00' }));
  assert.equal(later.next, null);
  assert.equal(later.upcomingCount, 0);
  assert.deepEqual(later.recent.map((e) => e.date), ['2026-12-05', '2026-11-20']);
  const now = payload(render('events-home', { fixtures }));
  assert.equal(now.next.title, 'Sample workshop: writing your first abstract');
  assert.equal(now.upcomingCount, 2);
  assert.deepEqual(now.recent.map((e) => e.title), ['Sample First Meet', 'Sample statistics workshop']);
});

test('hero-actions and showcase-stats send only numbers', () => {
  const hero = payload(render('hero-actions', { fixtures }));
  assert.equal(hero.openProjects, 3);
  assert.equal(hero.stats.presentations, 4);
  const sc = payload(render('showcase-stats', { fixtures }));
  assert.deepEqual(Object.keys(sc), ['stats']);
});

test('links to the standalone page use the club-domain address', () => {
  const html = render('opportunities', { fixtures });
  assert.match(html, /"self":"https:\/\/script\.google\.com\/a\/macros\/docchula\.com\/s\/TEST\/exec"/);
});

test('showcase: approved rows only, stats across conferences and countries', () => {
  const data = payload(render('showcase', { fixtures }));
  assert.equal(data.items.length, 4);
  assert.deepEqual(data.stats, { presentations: 4, conferences: 4, countries: 3, since: 2024 });
  const home = payload(render('showcase-home', { fixtures }));
  assert.equal(home.items.length, 3);
  assert.deepEqual(home.conferences, ['SVM', 'SCS', 'SEM', 'SAM']);
});

test('a broken sheet ID shows the friendly fallback instead of a Google error page', () => {
  const html = render('events', { fixtures, config: { WEBSITE_DATA_SHEET_ID: 'MISSING' } });
  assert.equal(payload(html).error, true);
});

test('signed-out visitors only receive the public opportunity fields', () => {
  const html = render('opportunities', { fixtures });
  const data = payload(html);
  assert.equal(data.viewer.member, false);
  assert.equal(data.items.length, 3, 'every project is still listed');
  for (const item of data.items) {
    assert.deepEqual(Object.keys(item).sort(), ['dept', 'id', 'keywords', 'kind', 'lang', 'locked', 'seats', 'status', 'title']);
  }
  for (const secret of ['example.one@example.com', 'example-two', 'Build and validate a model', 'Curriculum vitae', 'ตัวอย่าง หนึ่ง', 'Mar 2027']) {
    assert.ok(!html.includes(secret), 'sent to a signed-out visitor: ' + secret);
  }
});

test('only accounts on the member domain unlock details', () => {
  const member = payload(render('opportunities', { fixtures, email: 'Student@DocChula.com' }));
  assert.equal(member.viewer.member, true);
  assert.equal(member.items[1].contact, 'example.one@example.com');
  for (const email of ['someone@gmail.com', 'x@notdocchula.com', 'x@docchula.com.evil.example']) {
    const data = payload(render('opportunities', { fixtures, email }));
    assert.equal(data.viewer.member, false, email);
    assert.ok(data.items.every((i) => i.locked && !('advisor' in i) && !('contact' in i)), email);
  }
});

test('the home "open now" panel never carries hidden fields for signed-out visitors', () => {
  const data = payload(render('open-now', { fixtures }));
  assert.equal(data.total, 3);
  assert.ok(data.items.every((i) => i.locked && !('advisor' in i) && !('duration' in i)));
});

test('the members copy opens as a full page with the sign-in link pointing at it', () => {
  const html = render('opportunities', {
    fixtures, email: MEMBER, params: { full: '1' },
    config: { MEMBERS_APP_URL: 'https://script.google.com/a/macros/docchula.com/s/MEMBERS/exec' }
  });
  assert.match(html, /"fullPage":true/);
  assert.match(html, /"membersUrl":"https:\/\/script\.google\.com\/a\/macros\/docchula\.com\/s\/MEMBERS\/exec"/);
});

test('sheet text cannot break out of the data script tag', () => {
  const hostile = structuredClone(fixtures.events);
  hostile[1][4] = '</script><script>alert(1)</script>';
  const html = render('events', { fixtures: { ...fixtures, events: hostile } });
  assert.ok(!html.includes('</script><script>alert(1)'));
  assert.equal(payload(html).upcoming[0].title, '</script><script>alert(1)</script>');
});
