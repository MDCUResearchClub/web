// Run with: node --test google-sites/test
// Loads Parse.gs exactly as Apps Script would and checks it against sheet-shaped fixtures.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../apps-script/Parse.gs', import.meta.url), 'utf8');
const context = {};
vm.runInNewContext(source + '\nthis.Parse = Parse;', context);
const { Parse } = context;
const plain = (value) => JSON.parse(JSON.stringify(value));

// Same layout as the live "Research opportunities for MDCU students" tab:
// a banner row, a group-header row, then the real header row.
const OPP_HEADER = ['', 'ชื่อหัวข้อโครงการวิจัย', 'สเตตัสการเปิดรับสมัคร', 'ชื่อจริง', 'นามสกุล', 'ตำแหน่งทางวิชาการ',
  'สังกัด/ภาควิชา', 'ช่องทาง', 'คอนแทคติดต่อ', 'ชื่อโครงการ (Title)', 'รายละเอียดของโครงการโดยสังเขป',
  'บทบาทหน้าที่ของนิสิตในโครงการวิจัย', 'ทักษะหรือสิ่งที่นิสิตจะได้เรียนรู้',
  'สิ่งที่ต้องการให้นิสิตที่สนใจส่งมาด้วยเพื่อพิจารณาการรับเข้าร่วมโครงการ', 'ระยะเวลาโดยประมาณตั้งแต่เริ่มต้นจนสิ้นสุดโครงการ',
  'โปสเตอร์ประชาสัมพันธ์โครงการวิจัย', 'keywords ที่สำคัญของโครงการ', 'เรื่องอื่น ๆ ที่อาจารย์ต้องการแจ้งให้นิสิตทราบเพิ่มเติม',
  'จำนวนนิสิตที่ต้องการ'];

const oppRow = (o) => OPP_HEADER.map((_, i) => o[i] ?? '');

const OPP_ROWS = [
  ['', 'MDCU Research Club 📂 แบบฟอร์มเปิดรับสมัครนิสิตช่วยทำวิจัย', '', '', '', '', '⚠️ หมายเหตุ'],
  ['', 'หัวข้อการทำวิจัย 🧐', '', 'ข้อมูลของอาจารย์', '', '', '', 'ช่องทางการติดต่อที่อาจารย์สะดวก 📩'],
  OPP_HEADER,
  oppRow({ 1: 'Sample antiviral screening project', 2: 'Available', 3: 'สมหญิง', 4: 'ใจดี', 5: 'ดร., พญ., รศ.',
    6: 'จุลชีววิทยา', 7: 'LINE, Email', 8: 'line: sample-id', 9: 'Sample antiviral screening project',
    10: 'Screening compounds in cell culture', 11: 'ขึ้นกับระดับความสนใจของนิสิต', 12: 'cell-based assays',
    13: 'Curriculum vitae, Letter of intent, Transcript (CR25)', 14: 'Until Jan 2028',
    15: 'https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz012345/view?usp=sharing',
    16: 'antiviral drug, drug discovery', 17: '-', 18: '1 คน' }),
  oppRow({ 1: 'ยังไม่มีโครงการแต่เปิดรับนิสิตที่สนใจ', 2: 'Available', 3: 'ศ.นพ.สมชาย', 4: 'ตัวอย่าง', 5: 'ศ.',
    6: 'คณะแพทยศาสตร์/ภาควิชากุมารเวชศาสตร์', 7: 'Email', 16: 'Virology, Vaccines' }),
  oppRow({ 1: 'A closed project', 2: 'Closed', 3: 'สมศรี', 4: 'ทดสอบ', 5: 'ผศ.', 6: 'ภาควิชาโสต ศอ นาสิกวิทยา', 7: 'Email' }),
  oppRow({}),
  oppRow({ 1: 'ยังไม่มีโครงการแต่เปิดรับนิสิตที่สนใจ', 2: 'Available', 3: 'สมปอง', 4: 'ตัวอย่าง',
    5: 'ไม่มีตำแหน่งวิชาการ (นักวิทยาศาสตร์)', 6: 'ภาควิชาโสต ศอ นาสิกวิทยา', 7: 'Email', 16: '' })
];

test('finds the header row below banner rows', () => {
  assert.equal(Parse.findHeaderRow(OPP_ROWS, ['ชื่อหัวข้อโครงการวิจัย']), 2);
});

test('parses defined projects and open labs, hiding closed ones', () => {
  const items = Parse.parseOpportunities(OPP_ROWS);
  assert.equal(items.length, 3);
  const [project, openLab, scientist] = items;

  assert.equal(project.kind, 'project');
  assert.equal(project.title, 'Sample antiviral screening project');
  assert.equal(project.advisor, 'รศ. ดร. พญ. สมหญิง ใจดี');
  assert.deepEqual(plain(project.channels), ['LINE', 'Email']);
  assert.deepEqual(plain(project.docs), ['Curriculum vitae', 'Letter of intent', 'Transcript (CR25)']);
  assert.deepEqual(plain(project.keywords), ['antiviral drug', 'drug discovery']);
  assert.equal(project.seats, '1');
  assert.equal(project.notes, '');
  assert.equal(project.poster, 'https://lh3.googleusercontent.com/d/1AbCdEfGhIjKlMnOpQrStUvWxYz012345=w1200');

  assert.equal(openLab.kind, 'open');
  assert.equal(openLab.title, 'Virology · Vaccines');
  assert.equal(openLab.advisor, 'ศ. นพ. สมชาย ตัวอย่าง');
  assert.equal(openLab.dept, 'กุมารเวชศาสตร์');
  assert.equal(openLab.duration, '');

  assert.equal(scientist.advisor, 'นักวิทยาศาสตร์ สมปอง ตัวอย่าง');
  assert.equal(scientist.dept, 'โสต ศอ นาสิกวิทยา');
  assert.equal(scientist.title, 'Open to interested students');
});

test('closed projects can be included on request', () => {
  const items = Parse.parseOpportunities(OPP_ROWS, { includeClosed: true });
  assert.equal(items.filter((i) => i.status === 'closed').length, 1);
});

test('columns can be reordered without breaking the parser', () => {
  const order = OPP_HEADER.map((_, i) => i).reverse();
  const shuffled = OPP_ROWS.map((row) => order.map((i) => row[i] ?? ''));
  const a = plain(Parse.parseOpportunities(OPP_ROWS)).map(({ id, ...rest }) => rest);
  const b = plain(Parse.parseOpportunities(shuffled)).map(({ id, ...rest }) => rest);
  assert.deepEqual(b, a);
});

test('department aliases merge spelling variants', () => {
  assert.equal(Parse.normalizeDept('หน่วยปฏิบัติการวิจัยความผิดปกติของรก ภาควิชาสูติศาสตร์-นรีเวชวิทยา',
    { 'สูติศาสตร์-นรีเวชวิทยา': 'สูติศาสตร์-นรีเวชวิทยา', 'สูตินรีเวชวิทยา': 'สูติศาสตร์-นรีเวชวิทยา' }), 'สูติศาสตร์-นรีเวชวิทยา');
});

test('reads dates in the formats staff are likely to type', () => {
  for (const v of ['2026-07-06', '6/7/2026', '06/07/2026', '6 Jul 2026', '6 July 2026', '6 ก.ค. 2569', '6/7/2569']) {
    assert.equal(Parse.toIsoDate(v), '2026-07-06', v);
  }
  for (const v of ['', 'next week', '31/31/2026', 'TBA']) {
    assert.equal(Parse.toIsoDate(v), '', v);
  }
});

const EVENT_ROWS = [
  ['Date', 'Start', 'End', 'Type', 'Title', 'Venue', 'Description', 'Register link', 'Poster link', 'Recording links', 'Seats', 'Status', 'Show on site'],
  ['2026-11-20', '16:00', '18:00', 'Workshop', 'Sample upcoming workshop', 'Room 1302', 'Hands-on session', 'https://forms.gle/example', '', '', '40', '', 'TRUE'],
  ['2026-12-05', '13:00', '15:00', 'Lab tour', 'Sample lab tour', 'Lab building', '', 'javascript:alert(1)', '', '', '', 'Full', 'TRUE'],
  ['2026-07-06', '16:00', '18:30', 'Meetup', 'Sample first meet', 'Smart Classroom', '', '', '', '', '', '', 'TRUE'],
  ['2025-07-06', '09:00', '12:00', 'Workshop', 'Sample online workshop', 'Online (Zoom)', '', '',
    '', 'Session 1 | https://youtu.be/example1\nhttps://youtu.be/example2', '', '', 'TRUE'],
  ['2026-11-25', '', '', 'Talk', 'Cancelled talk', '', '', '', '', '', '', 'Cancelled', 'TRUE'],
  ['2026-11-26', '', '', 'Talk', 'Hidden draft', '', '', '', '', '', '', '', 'FALSE'],
  ['', '', '', 'Talk', 'Row without a date', '', '', '', '', '', '', '', 'TRUE']
];

test('splits events into upcoming and past around today', () => {
  const { upcoming, past } = Parse.parseEvents(EVENT_ROWS, '2026-10-23');
  assert.deepEqual(plain(upcoming.map((e) => e.title)), ['Sample upcoming workshop', 'Sample lab tour']);
  assert.deepEqual(plain(past.map((e) => e.title)), ['Sample first meet', 'Sample online workshop']);
  assert.equal(upcoming[0].time, '16:00–18:00');
  assert.equal(upcoming[0].register, 'https://forms.gle/example');
  assert.equal(upcoming[1].status, 'full');
  assert.equal(upcoming[1].register, '', 'unsafe links are dropped');
  assert.deepEqual(plain(past[1].recordings), [
    { label: 'Session 1', url: 'https://youtu.be/example1' },
    { label: 'Watch the recording', url: 'https://youtu.be/example2' }
  ]);
});

test('an event on today counts as upcoming until the day ends', () => {
  const { upcoming } = Parse.parseEvents(EVENT_ROWS, '2026-11-20');
  assert.equal(upcoming[0].title, 'Sample upcoming workshop');
});

const SHOWCASE_ROWS = [
  ['Timestamp', 'Email address', 'Presenter name / ชื่อผู้นำเสนอ', 'Class (e.g. MDCU78) / รุ่น', 'Conference name / ชื่องานประชุม',
    'Short name (e.g. VSS 2026) / ชื่อย่อ', 'City, country / เมือง', 'Conference date / วันที่นำเสนอ', 'Format / รูปแบบ',
    'Research title / ชื่องานวิจัย', 'Research field / สาขา', 'Keywords / คำสำคัญ', 'Advisors / อาจารย์ที่ปรึกษา',
    'Abstract / บทคัดย่อ', 'Reflection / สิ่งที่ได้เรียนรู้', 'Photo / รูป', 'Consent / ยินยอม', 'Approved'],
  ['1/6/2026', 'a@example.com', 'Student A', 'mdcu 78', 'Sample Vision Meeting', 'SVM 2026', 'Florida, USA', '2026-05-16', 'Poster presentation',
    'A sample study title', 'Neuroscience', 'attention, aging', 'Dr. Example', 'Abstract text', '', '', 'I agree', 'TRUE'],
  ['2/6/2026', 'b@example.com', 'Student B', 'MDCU77', 'Sample Cardiology Session', 'SCS 2025', 'Chicago, USA', '2025-03-30', 'Oral',
    'งานวิจัยตัวอย่าง', 'Cardiology', '', '', '', '', '', 'I agree', 'TRUE'],
  ['3/6/2026', 'c@example.com', 'Student C', 'MDCU76', 'Sample Asia Meeting', 'SAM 2024', 'Bangkok, Thailand', '2024-12-01', 'Competition',
    'Awaiting review', '', '', '', '', '', '', 'I agree', 'FALSE'],
  ['4/6/2026', 'd@example.com', 'Student D', 'MDCU76', 'Sample Asia Meeting', 'SAM 2024', 'Bangkok, Thailand', '2024-12-01', 'Poster',
    'No consent given', '', '', '', '', '', '', '', 'TRUE']
];

test('showcase shows only approved rows with consent, newest first', () => {
  const items = Parse.parseShowcase(SHOWCASE_ROWS);
  assert.deepEqual(plain(items.map((i) => i.title)), ['A sample study title', 'งานวิจัยตัวอย่าง']);
  assert.equal(items[0].format, 'Poster');
  assert.equal(items[0].cls, 'MDCU78');
  assert.equal(items[0].year, '2026');
  assert.equal(items[0].country, 'USA');
  assert.equal(items[1].format, 'Oral');
  assert.equal(items[1].lang, 'th');
});

test('showcase stats count distinct conferences and countries', () => {
  const stats = Parse.showcaseStats(Parse.parseShowcase(SHOWCASE_ROWS));
  assert.deepEqual(plain(stats), { presentations: 2, conferences: 2, countries: 1, since: 2025 });
});

test('only web and mail links are allowed', () => {
  assert.equal(Parse.safeUrl('javascript:alert(1)'), '');
  assert.equal(Parse.safeUrl('www.example.com'), 'https://www.example.com');
  assert.equal(Parse.safeUrl('mailto:researchclub@docchula.com'), 'mailto:researchclub@docchula.com');
});
