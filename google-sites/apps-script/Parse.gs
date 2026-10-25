/**
 * Pure helpers that turn raw sheet rows (arrays of display strings) into clean
 * objects for the widgets. No Apps Script services are used in this file, so it
 * also runs under Node for the tests in ../test.
 */
var Parse = (function () {
  var THAI = /[฀-๿]/;

  function clean(value) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/ /g, ' ').replace(/[ \t]+/g, ' ').trim();
  }

  function lower(value) {
    return clean(value).toLowerCase();
  }

  function splitList(value) {
    return clean(value)
      .split(/\s*(?:,|;|\n|、)\s*/)
      .map(function (s) { return s.replace(/^[-–•\s]+/, '').trim(); })
      .filter(Boolean);
  }

  function langOf(text) {
    return THAI.test(text) ? 'th' : 'en';
  }

  function isChecked(value) {
    var v = lower(value);
    return v === 'true' || v === 'yes' || v === 'y' || v === '1' || v === '✓' || v === 'approved';
  }

  /** Index of the first row (within the first `limit` rows) that has a cell containing `token`. */
  function findHeaderRow(rows, tokens, limit) {
    var max = Math.min(rows.length, limit || 15);
    for (var i = 0; i < max; i++) {
      var cells = rows[i].map(lower);
      for (var t = 0; t < tokens.length; t++) {
        var token = tokens[t].toLowerCase();
        if (cells.some(function (c) { return c.indexOf(token) !== -1; })) return i;
      }
    }
    return -1;
  }

  /**
   * Maps logical keys to column indexes by looking for any of the key's tokens in
   * the header text, so columns can be reordered or renamed slightly in the sheet.
   * Exact matches win over partial matches.
   */
  function mapColumns(header, spec) {
    var cells = header.map(lower);
    var used = {};
    var out = {};
    Object.keys(spec).forEach(function (key) {
      var tokens = spec[key].map(function (t) { return t.toLowerCase(); });
      var idx = -1;
      for (var i = 0; i < cells.length && idx === -1; i++) {
        if (!used[i] && tokens.indexOf(cells[i]) !== -1) idx = i;
      }
      for (var j = 0; j < cells.length && idx === -1; j++) {
        if (used[j] || !cells[j]) continue;
        for (var t = 0; t < tokens.length; t++) {
          if (cells[j].indexOf(tokens[t]) !== -1) { idx = j; break; }
        }
      }
      if (idx !== -1) used[idx] = true;
      out[key] = idx;
    });
    return out;
  }

  function cell(row, idx) {
    return idx >= 0 && idx < row.length ? clean(row[idx]) : '';
  }

  /** Only http(s) and mailto links are allowed through to the page. */
  function safeUrl(url) {
    var u = clean(url);
    if (!u) return '';
    if (/^www\./i.test(u)) u = 'https://' + u;
    return /^(https?:\/\/|mailto:)/i.test(u) ? u : '';
  }

  /** Turns a Google Drive share link into an image URL that works in <img>. */
  function driveImageUrl(link) {
    var u = clean(link);
    if (!u) return '';
    var m = u.match(/\/d\/([\w-]{20,})/) || u.match(/[?&]id=([\w-]{20,})/);
    if (m) return 'https://lh3.googleusercontent.com/d/' + m[1] + '=w1200';
    return safeUrl(u);
  }

  // Academic rank first, then doctorate, then medical title — the usual Thai order.
  var TITLE_ORDER = [
    ['ศ.', 'ศาสตราจารย์'], ['รศ.', 'รองศาสตราจารย์'], ['ผศ.', 'ผู้ช่วยศาสตราจารย์'], ['อ.', 'อาจารย์'],
    ['ดร.'], ['นพ.'], ['พญ.']
  ];

  var TITLE_PREFIX = /^((?:ศ\.|รศ\.|ผศ\.|อ\.|ดร\.|นพ\.|พญ\.)\s*)+/;

  /** Splits titles typed into the name field ("ศ.นพ.ยง") into { titles, name }. */
  function splitNamePrefix(first) {
    var f = clean(first);
    var m = f.match(TITLE_PREFIX);
    if (!m) return { titles: '', name: f };
    return { titles: m[0].replace(/\./g, '. ').trim(), name: f.slice(m[0].length).trim() };
  }

  function normalizeTitle(raw) {
    var text = clean(raw);
    if (/ไม่มีตำแหน่ง/.test(text)) {
      var paren = text.match(/\(([^)]+)\)?/);
      return paren ? clean(paren[1]) : '';
    }
    var tokens = splitList(text).join(' ').split(/\s+/).filter(Boolean);
    var picked = [];
    TITLE_ORDER.forEach(function (forms) {
      var hit = tokens.some(function (t) { return forms.indexOf(t) !== -1; });
      if (hit) picked.push(forms[0]);
    });
    var known = [].concat.apply([], TITLE_ORDER);
    var rest = tokens.filter(function (t) { return known.indexOf(t) === -1; });
    if (picked.length === 0 && rest.length) return rest.join(' ');
    return picked.join(' ');
  }

  function normalizeDept(raw, aliases) {
    var d = clean(raw).replace(/^คณะแพทยศาสตร์\s*\/\s*/, '').replace(/^ภาควิชา\s*/, '').trim();
    var map = aliases || {};
    Object.keys(map).forEach(function (from) {
      if (d.indexOf(from) !== -1) d = map[from];
    });
    return d;
  }

  var OPPORTUNITY_COLUMNS = {
    topic: ['ชื่อหัวข้อโครงการวิจัย', 'research topic'],
    status: ['สเตตัส', 'status'],
    firstName: ['ชื่อจริง', 'first name'],
    lastName: ['นามสกุล', 'last name'],
    academicTitle: ['ตำแหน่งทางวิชาการ', 'academic title'],
    dept: ['สังกัด', 'department'],
    channel: ['ช่องทาง', 'preferred contact'],
    contact: ['คอนแทค', 'contact details'],
    projectTitle: ['ชื่อโครงการ (title)', 'project title'],
    summary: ['รายละเอียดของโครงการ', 'summary'],
    role: ['บทบาทหน้าที่', 'student role'],
    skills: ['ทักษะ', 'skills'],
    docs: ['สิ่งที่ต้องการให้นิสิต', 'documents'],
    duration: ['ระยะเวลา', 'duration'],
    poster: ['โปสเตอร์', 'poster'],
    keywords: ['keywords', 'คำสำคัญ'],
    notes: ['เรื่องอื่น', 'notes'],
    seats: ['จำนวนนิสิต', 'students needed']
  };

  var NO_PROJECT_YET = ['ยังไม่มีโครงการ', 'no project yet', 'open to interested'];
  var CLOSED = ['closed', 'full', 'ปิด', 'เต็ม', 'unavailable'];

  /**
   * rows: the whole tab as display strings (header rows included).
   * opts: { includeClosed, deptAliases }
   */
  function parseOpportunities(rows, opts) {
    opts = opts || {};
    var h = findHeaderRow(rows, ['ชื่อหัวข้อโครงการวิจัย', 'research topic']);
    if (h === -1) return [];
    var col = mapColumns(rows[h], OPPORTUNITY_COLUMNS);
    var out = [];
    for (var r = h + 1; r < rows.length; r++) {
      var row = rows[r];
      var topic = cell(row, col.topic);
      var first = cell(row, col.firstName);
      if (!topic && !first) continue;
      var status = cell(row, col.status);
      var closed = CLOSED.some(function (w) { return lower(status).indexOf(w) !== -1; });
      if (closed && !opts.includeClosed) continue;
      var openLab = !topic || NO_PROJECT_YET.some(function (w) { return lower(topic).indexOf(w) !== -1; });
      var keywords = splitList(cell(row, col.keywords));
      var projectTitle = cell(row, col.projectTitle);
      var title = openLab ? (keywords.join(' · ') || 'Open to interested students') : (projectTitle || topic);
      var split = splitNamePrefix(first);
      var rank = normalizeTitle([cell(row, col.academicTitle), split.titles].join(' '));
      var name = [split.name, cell(row, col.lastName)].filter(Boolean).join(' ');
      var summary = cell(row, col.summary);
      out.push({
        id: 'opp-' + r,
        kind: openLab ? 'open' : 'project',
        status: closed ? 'closed' : 'open',
        title: title,
        lang: openLab ? 'en' : langOf(title),
        advisor: [rank, name].filter(Boolean).join(' '),
        dept: normalizeDept(cell(row, col.dept), opts.deptAliases),
        channels: splitList(cell(row, col.channel)),
        contact: cell(row, col.contact),
        duration: openLab ? '' : cell(row, col.duration),
        keywords: keywords,
        seats: (cell(row, col.seats).match(/\d+/) || [''])[0],
        summary: summary === '-' ? '' : summary,
        textLang: langOf(summary),
        role: cell(row, col.role),
        skills: cell(row, col.skills),
        docs: splitList(cell(row, col.docs)),
        notes: cell(row, col.notes) === '-' ? '' : cell(row, col.notes),
        poster: driveImageUrl(cell(row, col.poster))
      });
    }
    return out;
  }

  /** Keeps only the fields anyone may see; the rest never leaves the server. */
  function publicOpportunities(items, fields) {
    return items.map(function (item) {
      var out = { locked: true };
      fields.forEach(function (f) {
        if (Object.prototype.hasOwnProperty.call(item, f)) out[f] = item[f];
      });
      return out;
    });
  }

  var MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
    'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4, 'พ.ค.': 5, 'มิ.ย.': 6, 'ก.ค.': 7, 'ส.ค.': 8, 'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12 };

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /** Accepts 2026-07-06, 6/7/2026 (day first), 6 Jul 2026 or 6 ก.ค. 2569; returns YYYY-MM-DD or ''. */
  function toIsoDate(value) {
    var v = clean(value);
    if (!v) return '';
    var y, m, d, x;
    if ((x = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) { y = +x[1]; m = +x[2]; d = +x[3]; }
    else if ((x = v.match(/^(\d{1,2})[\/.](\d{1,2})[\/.](\d{4})$/))) { d = +x[1]; m = +x[2]; y = +x[3]; }
    else if ((x = v.match(/^(\d{1,2})\s+([^\s\d]+)\s+(\d{4})$/))) {
      d = +x[1]; m = MONTHS[x[2].toLowerCase().slice(0, x[2].indexOf('.') !== -1 ? x[2].length : 3)]; y = +x[3];
    }
    if (!y || !m || !d) return '';
    if (y > 2400) y -= 543; // Buddhist Era → Common Era
    if (m < 1 || m > 12 || d < 1 || d > 31) return '';
    return y + '-' + pad(m) + '-' + pad(d);
  }

  var EVENT_COLUMNS = {
    date: ['date', 'วันที่'],
    start: ['start', 'เริ่ม'],
    end: ['end', 'สิ้นสุด'],
    type: ['type', 'ประเภท'],
    title: ['title', 'ชื่อกิจกรรม'],
    venue: ['venue', 'สถานที่'],
    description: ['description', 'รายละเอียด'],
    register: ['register', 'ลงทะเบียน', 'สมัคร'],
    poster: ['poster', 'โปสเตอร์'],
    recordings: ['recording', 'บันทึก'],
    seats: ['seats', 'จำนวนที่นั่ง'],
    status: ['status', 'สถานะ'],
    show: ['show on site', 'แสดงบนเว็บ']
  };

  var TYPE_LABELS = { workshop: 'Workshop', 'lab tour': 'Lab tour', labtour: 'Lab tour', talk: 'Research talk', 'research talk': 'Research talk', meetup: 'Meetup' };

  /** "Label | https://…" per line, or bare URLs. */
  function parseLinks(value) {
    return clean(value).split(/\n+/).map(function (line) {
      var parts = line.split('|');
      var url = safeUrl(parts[parts.length - 1]);
      var label = parts.length > 1 ? clean(parts[0]) : '';
      return url ? { label: label || 'Watch the recording', url: url } : null;
    }).filter(Boolean);
  }

  /** rows: display strings; today: 'YYYY-MM-DD' in the club's time zone. */
  function parseEvents(rows, today) {
    var h = findHeaderRow(rows, ['title', 'ชื่อกิจกรรม'], 5);
    if (h === -1) return { upcoming: [], past: [] };
    var col = mapColumns(rows[h], EVENT_COLUMNS);
    var all = [];
    for (var r = h + 1; r < rows.length; r++) {
      var row = rows[r];
      var title = cell(row, col.title);
      var date = toIsoDate(cell(row, col.date));
      if (!title || !date) continue; // a row with no title or an unreadable date is skipped, not fatal
      if (col.show !== -1 && cell(row, col.show) !== '' && !isChecked(cell(row, col.show))) continue;
      var status = lower(cell(row, col.status));
      if (status.indexOf('cancel') !== -1) continue;
      var typeRaw = lower(cell(row, col.type));
      var start = cell(row, col.start);
      var end = cell(row, col.end);
      all.push({
        id: 'ev-' + r,
        date: date,
        time: start && end ? start + '–' + end : start,
        type: (TYPE_LABELS[typeRaw] || cell(row, col.type) || 'Event'),
        typeKey: typeRaw.indexOf('lab') !== -1 ? 'labtour' : typeRaw.indexOf('workshop') !== -1 ? 'workshop' : 'talk',
        title: title,
        lang: langOf(title),
        venue: cell(row, col.venue),
        description: cell(row, col.description),
        descLang: langOf(cell(row, col.description)),
        register: safeUrl(cell(row, col.register)),
        poster: driveImageUrl(cell(row, col.poster)),
        recordings: parseLinks(cell(row, col.recordings)),
        seats: cell(row, col.seats),
        status: status.indexOf('full') !== -1 ? 'full' : status.indexOf('closed') !== -1 ? 'closed' : 'open'
      });
    }
    var upcoming = all.filter(function (e) { return e.date >= today; })
      .sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
    var past = all.filter(function (e) { return e.date < today; })
      .sort(function (a, b) { return a.date > b.date ? -1 : a.date < b.date ? 1 : 0; });
    return { upcoming: upcoming, past: past };
  }

  var SHOWCASE_COLUMNS = {
    approved: ['approved', 'อนุมัติ'],
    consent: ['consent', 'ยินยอม'],
    presenter: ['presenter', 'ชื่อผู้นำเสนอ'],
    cls: ['class', 'รุ่น'],
    confName: ['conference name', 'ชื่องานประชุม'],
    confShort: ['short name', 'ชื่อย่อ'],
    location: ['city', 'location', 'เมือง'],
    confDate: ['conference date', 'presentation date', 'วันที่นำเสนอ'],
    format: ['format', 'รูปแบบ'],
    title: ['research title', 'title', 'ชื่องานวิจัย'],
    field: ['field', 'สาขา'],
    keywords: ['keywords', 'คำสำคัญ'],
    advisors: ['advisor', 'อาจารย์ที่ปรึกษา'],
    abstract: ['abstract', 'บทคัดย่อ'],
    reflection: ['reflection', 'สิ่งที่ได้เรียนรู้'],
    photo: ['photo', 'รูป'],
    page: ['page link']
  };

  function formatOf(raw) {
    var v = lower(raw);
    if (v.indexOf('oral') !== -1) return 'Oral';
    if (v.indexOf('poster') !== -1) return 'Poster';
    return raw ? 'Other' : '';
  }

  function parseShowcase(rows) {
    var h = findHeaderRow(rows, ['presenter', 'ชื่อผู้นำเสนอ', 'research title'], 5);
    if (h === -1) return [];
    var col = mapColumns(rows[h], SHOWCASE_COLUMNS);
    var out = [];
    for (var r = h + 1; r < rows.length; r++) {
      var row = rows[r];
      var title = cell(row, col.title);
      if (!title) continue;
      if (col.approved === -1 || !isChecked(cell(row, col.approved))) continue;
      if (col.consent !== -1 && !cell(row, col.consent)) continue;
      var iso = toIsoDate(cell(row, col.confDate));
      var short = cell(row, col.confShort);
      var yearMatch = (iso || short).match(/(19|20)\d{2}/);
      var location = cell(row, col.location);
      out.push({
        id: 'sc-' + r,
        title: title,
        lang: langOf(title),
        conf: short || cell(row, col.confName),
        confFull: cell(row, col.confName),
        where: location,
        country: clean(location.split(',').pop()),
        date: iso,
        year: yearMatch ? yearMatch[0] : '',
        format: formatOf(cell(row, col.format)),
        field: cell(row, col.field),
        keywords: splitList(cell(row, col.keywords)),
        advisors: cell(row, col.advisors),
        abstract: cell(row, col.abstract),
        reflection: cell(row, col.reflection),
        presenter: cell(row, col.presenter),
        cls: cell(row, col.cls).toUpperCase().replace(/\s+/g, ''),
        photo: driveImageUrl(cell(row, col.photo)),
        page: safeUrl(cell(row, col.page))
      });
    }
    return out.sort(function (a, b) { return (b.date || b.year) > (a.date || a.year) ? 1 : -1; });
  }

  function showcaseStats(items) {
    var confs = {};
    var countries = {};
    var years = [];
    items.forEach(function (i) {
      if (i.conf) confs[lower(i.conf)] = true;
      if (i.country) countries[lower(i.country)] = true;
      if (i.year) years.push(+i.year);
    });
    return {
      presentations: items.length,
      conferences: Object.keys(confs).length,
      countries: Object.keys(countries).length,
      since: years.length ? Math.min.apply(null, years) : null
    };
  }

  return {
    clean: clean,
    splitList: splitList,
    findHeaderRow: findHeaderRow,
    mapColumns: mapColumns,
    safeUrl: safeUrl,
    driveImageUrl: driveImageUrl,
    normalizeTitle: normalizeTitle,
    splitNamePrefix: splitNamePrefix,
    normalizeDept: normalizeDept,
    toIsoDate: toIsoDate,
    parseLinks: parseLinks,
    parseOpportunities: parseOpportunities,
    publicOpportunities: publicOpportunities,
    parseEvents: parseEvents,
    parseShowcase: parseShowcase,
    showcaseStats: showcaseStats
  };
})();
