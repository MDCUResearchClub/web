/**
 * Web app behind the live sections of the Google Site. Each Sites embed loads
 * the deployment URL with ?view=…:
 *
 *   opportunities   project finder                     (Opportunities page)
 *   open-now        three newest projects, dark panel  (Home, hero)
 *   hero-actions    buttons + headline numbers, dark   (Home, hero)
 *   stats           headline numbers only, dark        (spare)
 *   events-home     next event + latest activities     (Home)
 *   events          all upcoming events                (Events page)
 *   showcase-home   numbers + three latest talks       (Home)
 *   showcase-stats  showcase numbers, dark             (Showcase page, hero)
 *   showcase        filterable presentations           (Showcase page)
 *
 * Add &full=1 for a standalone page (the "Open full screen" link on phones).
 */
var VIEWS = ['opportunities', 'open-now', 'hero-actions', 'stats', 'events-home', 'events', 'showcase-home',
  'showcase-stats', 'showcase'];

function doGet(e) {
  var params = (e && e.parameter) || {};
  var view = VIEWS.indexOf(params.view) !== -1 ? params.view : 'opportunities';
  var data;
  try {
    data = loadView_(view, params);
  } catch (err) {
    console.error('Could not load view "%s": %s', view, err && err.stack);
    data = { error: true };
  }
  var template = HtmlService.createTemplateFromFile('Widget');
  template.view = view;
  template.data = toScriptJson_(data);
  template.config = toScriptJson_({
    links: CONFIG.LINKS,
    self: appUrl_(),
    membersUrl: CONFIG.MEMBERS_APP_URL,
    memberDomain: CONFIG.MEMBER_DOMAIN,
    fullPage: params.full === '1'
  });
  return template.evaluate()
    .setTitle('MDCU Research Division')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Used by Widget.html to pull in Styles.html and App.html. */
function include(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

/**
 * Run from the editor once after deploying, or whenever the site says a section "couldn't load":
 * it makes Google ask for any permission that hasn't been granted yet (tick every box).
 */
function authorize() {
  ScriptApp.requireAllScopes(ScriptApp.AuthMode.FULL);
  return SpreadsheetApp.openById(CONFIG.OPPORTUNITIES_SHEET_ID).getName();
}

/** Run from the editor to make sheet edits show up immediately instead of within CACHE_SECONDS. */
function clearCache() {
  var cache = CacheService.getScriptCache();
  var today = today_();
  cache.removeAll(['opp:latest', 'events:' + today, 'showcase']);
}

function loadView_(view, params) {
  if (view === 'opportunities' || view === 'open-now') {
    var member = isMember_();
    var opp = opportunities_(view === 'opportunities' ? params.year : undefined);
    var items = member ? opp.items : Parse.publicOpportunities(opp.items, CONFIG.PUBLIC_OPPORTUNITY_FIELDS);
    if (view === 'opportunities') return { year: opp.year, years: opp.years, items: items, viewer: { member: member } };
    return {
      year: opp.year,
      total: items.length,
      items: items.filter(function (i) { return i.kind === 'project'; }).slice(0, 3),
      viewer: { member: member }
    };
  }
  // Full write-ups and photos of past activities live as hand-made posts in Google Sites;
  // Home only shows the two latest as short "What's new" teasers.
  if (view === 'events') return { upcoming: events_().upcoming };
  if (view === 'events-home') {
    var ev = events_();
    return { next: ev.upcoming[0] || null, upcomingCount: ev.upcoming.length, recent: ev.past.slice(0, 2) };
  }
  var items = showcase_();
  var stats = Parse.showcaseStats(items);
  if (view === 'showcase') return { stats: stats, items: items };
  if (view === 'showcase-stats') return { stats: stats };
  if (view === 'showcase-home') {
    return { stats: stats, items: items.slice(0, 3), conferences: conferenceNames_(items) };
  }
  return { openProjects: opportunities_().items.length, stats: stats }; // 'stats' and 'hero-actions'
}

/**
 * The web app's address in the club-domain form (/a/macros/docchula.com/…). The plain form sends
 * people signed in to several Google accounts to the wrong one and Google shows an error instead.
 */
function appUrl_() {
  var url = ScriptApp.getService().getUrl() || '';
  var m = url.match(/\/macros\/(?:u\/\d+\/)?s\/([\w-]+)\/(?:exec|dev)/);
  return m ? 'https://script.google.com/a/macros/' + CONFIG.MEMBER_DOMAIN + '/s/' + m[1] + '/exec' : url;
}

/**
 * True when the visitor is signed in with a MEMBER_DOMAIN account. Google only tells a script
 * who the visitor is when the script's owner is in the same Workspace domain, so deploy it from
 * the club's docchula.com account.
 */
function isMember_() {
  var email = '';
  try {
    email = Session.getActiveUser().getEmail() || '';
  } catch (err) {
    email = '';
  }
  var suffix = '@' + CONFIG.MEMBER_DOMAIN.toLowerCase();
  return email.toLowerCase().slice(-suffix.length) === suffix;
}

function opportunities_(year) {
  return cached_('opp:' + (year || 'latest'), function () {
    var ss = SpreadsheetApp.openById(CONFIG.OPPORTUNITIES_SHEET_ID);
    var tabs = ss.getSheets()
      .map(function (s) { return s.getName(); })
      .filter(function (n) { return /^\d{4}\s*-\s*\d{4}$/.test(n); })
      .sort()
      .reverse();
    var name = year && tabs.indexOf(year) !== -1 ? year : tabs[0];
    if (!name) return { year: '', years: [], items: [] };
    var rows = ss.getSheetByName(name).getDataRange().getDisplayValues();
    var items = Parse.parseOpportunities(rows, { deptAliases: CONFIG.DEPT_ALIASES });
    // Defined projects first, then open labs; newest form answers (lowest in the sheet) first.
    items.sort(function (a, b) {
      if (a.kind !== b.kind) return a.kind === 'project' ? -1 : 1;
      return Number(b.id.slice(4)) - Number(a.id.slice(4));
    });
    return { year: name, years: tabs, items: items };
  });
}

function events_() {
  var today = today_();
  return cached_('events:' + today, function () {
    return Parse.parseEvents(readTab_(CONFIG.WEBSITE_DATA_SHEET_ID, CONFIG.EVENTS_TAB), today);
  });
}

function showcase_() {
  return cached_('showcase', function () {
    return Parse.parseShowcase(readTab_(CONFIG.WEBSITE_DATA_SHEET_ID, CONFIG.SHOWCASE_TAB));
  });
}

function conferenceNames_(items) {
  var seen = {};
  return items
    .map(function (i) { return Parse.clean(i.conf).replace(/\s*(19|20)\d{2}$/, ''); })
    .filter(function (n) {
      var key = n.toLowerCase();
      if (!n || seen[key]) return false;
      seen[key] = true;
      return true;
    });
}

/**
 * Reads a tab as display strings, except real dates, which become YYYY-MM-DD so
 * the parser never has to guess between day/month orders. Time-only cells keep
 * their display text.
 */
function readTab_(spreadsheetId, tabName) {
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(tabName);
  if (!sheet) return [];
  var range = sheet.getDataRange();
  var raw = range.getValues();
  return range.getDisplayValues().map(function (row, r) {
    return row.map(function (text, c) {
      var value = raw[r][c];
      if (Object.prototype.toString.call(value) === '[object Date]' && value.getFullYear() > 1900) {
        return Utilities.formatDate(value, CONFIG.TIME_ZONE, 'yyyy-MM-dd');
      }
      return text;
    });
  });
}

function today_() {
  return Utilities.formatDate(new Date(), CONFIG.TIME_ZONE, 'yyyy-MM-dd');
}

// CacheService holds at most 100 KB per key, and Thai text is 3 bytes a character,
// so larger values are stored in pieces.
var CACHE_PIECE = 30000;

function cached_(key, compute) {
  var cache = CacheService.getScriptCache();
  var count = Number(cache.get(key));
  if (count) {
    var keys = [];
    for (var i = 0; i < count; i++) keys.push(key + ':' + i);
    var parts = cache.getAll(keys);
    if (keys.every(function (k) { return parts[k] != null; })) {
      return JSON.parse(keys.map(function (k) { return parts[k]; }).join(''));
    }
  }
  var value = compute();
  var text = JSON.stringify(value);
  var entries = {};
  var pieces = 0;
  for (var p = 0; p < text.length; p += CACHE_PIECE) {
    entries[key + ':' + pieces] = text.slice(p, p + CACHE_PIECE);
    pieces++;
  }
  entries[key] = String(pieces);
  cache.putAll(entries, CONFIG.CACHE_SECONDS);
  return value;
}

/** JSON that is safe to drop inside a <script> tag. */
function toScriptJson_(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
