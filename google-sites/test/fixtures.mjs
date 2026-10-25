// Placeholder sheet contents shaped like the real tabs. No real people or contact details.

const time = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return { v: new Date(1899, 11, 30, h, m), d: hhmm }; // how Sheets returns time-only cells
};
const date = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { v: new Date(y, m - 1, d), d: `${d}/${m}/${y}` }; // display order is locale-dependent
};

const OPP_HEADER = ['', 'ชื่อหัวข้อโครงการวิจัย', 'สเตตัสการเปิดรับสมัคร', 'ชื่อจริง', 'นามสกุล', 'ตำแหน่งทางวิชาการ',
  'สังกัด/ภาควิชา', 'ช่องทาง', 'คอนแทคติดต่อ', 'ชื่อโครงการ (Title)', 'รายละเอียดของโครงการโดยสังเขป',
  'บทบาทหน้าที่ของนิสิตในโครงการวิจัย', 'ทักษะหรือสิ่งที่นิสิตจะได้เรียนรู้',
  'สิ่งที่ต้องการให้นิสิตที่สนใจส่งมาด้วยเพื่อพิจารณาการรับเข้าร่วมโครงการ', 'ระยะเวลาโดยประมาณตั้งแต่เริ่มต้นจนสิ้นสุดโครงการ',
  'โปสเตอร์ประชาสัมพันธ์โครงการวิจัย', 'keywords ที่สำคัญของโครงการ', 'เรื่องอื่น ๆ ที่อาจารย์ต้องการแจ้งให้นิสิตทราบเพิ่มเติม',
  'จำนวนนิสิตที่ต้องการ'];
const opp = (o) => OPP_HEADER.map((_, i) => o[i] ?? '');

export const opportunities = {
  '2026-2027': [
    ['', 'MDCU Research Club 📂 แบบฟอร์มเปิดรับสมัครนิสิตช่วยทำวิจัย'],
    ['', 'หัวข้อการทำวิจัย 🧐', '', 'ข้อมูลของอาจารย์'],
    OPP_HEADER,
    opp({ 1: 'Deep learning triage for chest radiographs', 2: 'Available', 3: 'ตัวอย่าง', 4: 'หนึ่ง', 5: 'ดร., นพ., ผศ.',
      6: 'รังสีวิทยา', 7: 'Email', 8: 'example.one@example.com', 10: 'Build and validate a model that flags urgent findings on chest X-rays.',
      11: 'Label images, run baseline models, help write the manuscript', 12: 'Python, model evaluation, study design',
      13: 'Curriculum vitae, Letter of intent', 14: 'Jan 2027 – Dec 2027', 16: 'Deep learning, Radiology, Triage', 18: '3' }),
    opp({ 1: 'การศึกษาปัจจัยเสี่ยงของภาวะหกล้มในผู้สูงอายุในชุมชน', 2: 'Available', 3: 'ตัวอย่าง', 4: 'สอง', 5: 'อาจารย์, พญ.',
      6: 'เวชศาสตร์ครอบครัว', 7: 'LINE, Email', 8: 'LINE: example-two\nexample.two@example.com', 10: 'สำรวจและวิเคราะห์ปัจจัยเสี่ยงของการหกล้มในผู้สูงอายุ',
      11: 'เก็บข้อมูลภาคสนามและวิเคราะห์ข้อมูลเบื้องต้น', 12: 'การออกแบบแบบสอบถาม การวิเคราะห์ข้อมูล', 14: 'Mar 2027 – Feb 2028',
      16: 'ผู้สูงอายุ, การหกล้ม, เวชศาสตร์ชุมชน', 18: '2' }),
    opp({ 1: 'ยังไม่มีโครงการแต่เปิดรับนิสิตที่สนใจ', 2: 'Available', 3: 'ศ.นพ.ตัวอย่าง', 4: 'สาม', 5: 'ศ.', 6: 'ภาควิชาจุลชีววิทยา',
      7: 'Email', 8: 'example.three@example.com', 16: 'Virology, Vaccine immunology' }),
    opp({ 1: 'Closed sample project', 2: 'Closed', 3: 'ตัวอย่าง', 4: 'สี่', 5: 'รศ.', 6: 'ศัลยศาสตร์', 7: 'Email' })
  ],
  '2025-2026': [OPP_HEADER, opp({ 1: 'Last year sample', 2: 'Available', 3: 'ตัวอย่าง', 4: 'ห้า', 6: 'อายุรศาสตร์', 7: 'Email' })]
};

const EVENT_HEADER = ['Date', 'Start', 'End', 'Type', 'Title', 'Venue', 'Description', 'Register link', 'Poster link', 'Recording links', 'Seats', 'Status', 'Show on site'];

export const events = [
  EVENT_HEADER,
  [date('2026-11-20'), time('16:00'), time('18:30'), 'Workshop', 'Sample workshop: writing your first abstract', 'Room 1302, Bhumisiri Building',
    'Hands-on session on structuring an abstract, with feedback in small groups.', 'https://forms.gle/example',
    'https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz012345/view?usp=sharing', '', '40', 'Open', 'TRUE'],
  [date('2026-12-05'), time('13:00'), time('15:30'), 'Lab tour', 'Sample lab tour', 'Faculty of Medicine', '', 'https://forms.gle/example2', '', '', '', 'Full', 'TRUE'],
  [date('2026-07-06'), time('16:00'), time('18:30'), 'Meetup', 'Sample First Meet', 'Smart Classroom', 'Meet the team and hear from senior researchers.', '', '', '', '', '', 'TRUE'],
  [date('2025-07-06'), time('09:00'), time('12:00'), 'Workshop', 'Sample statistics workshop', 'Online via Zoom', 'Statistics fundamentals, then hands-on software.', '', '',
    'Session 1 | https://youtu.be/example1\nSession 2 | https://youtu.be/example2', '', '', 'TRUE'],
  [date('2025-03-19'), time('13:00'), time('15:30'), 'Lab tour', 'Sample lab tour 2', 'Faculty of Medicine', '', '', '', '', '', '', 'TRUE']
];

const SHOWCASE_HEADER = ['Timestamp', 'Email address', 'Presenter name / ชื่อผู้นำเสนอ', 'Class (e.g. MDCU78) / รุ่น', 'Conference name / ชื่องานประชุม',
  'Short name (e.g. VSS 2026) / ชื่อย่อ', 'City, country / เมือง', 'Conference date / วันที่นำเสนอ', 'Format / รูปแบบ',
  'Research title / ชื่องานวิจัย', 'Research field / สาขา', 'Keywords / คำสำคัญ', 'Advisors / อาจารย์ที่ปรึกษา',
  'Abstract / บทคัดย่อ', 'Reflection / สิ่งที่ได้เรียนรู้', 'Photo / รูป', 'Consent / ยินยอม', 'Approved'];

const sc = (who, cls, conf, short, city, iso, format, title, field, approved = 'TRUE') =>
  [date('2026-06-01'), 'x@example.com', who, cls, conf, short, city, date(iso), format, title, field,
    'keyword one, keyword two', 'Advisor Example', 'A short placeholder abstract. '.repeat(12).trim(), '', '', 'I agree', approved];

export const showcase = [
  SHOWCASE_HEADER,
  sc('นักศึกษา ก.', 'MDCU78', 'Sample Vision Meeting 2026', 'SVM 2026', 'Florida, USA', '2026-05-16', 'Poster', 'A sample study on visual attention in older adults', 'Neuroscience'),
  sc('นักศึกษา ข.', 'MDCU77', 'Sample Cardiology Session 2026', 'SCS 2026', 'New Orleans, USA', '2026-03-28', 'Poster', 'งานวิจัยตัวอย่างด้านหัวใจล้มเหลวเรื้อรัง', 'Clinical science'),
  sc('นักศึกษา ค.', 'MDCU80', 'Sample Education Meeting 2025', 'SEM 2025', 'Tokyo, Japan', '2025-07-20', 'Oral presentation', 'Peer support teams in a sample medical school', 'Medical education'),
  sc('นักศึกษา ง.', 'MDCU76', 'Sample Asia Meeting 2024', 'SAM 2024', 'Bangkok, Thailand', '2024-12-01', 'Oral', 'A sample retrospective cohort', 'Emergency medicine'),
  sc('นักศึกษา จ.', 'MDCU76', 'Sample Asia Meeting 2024', 'SAM 2024', 'Bangkok, Thailand', '2024-12-01', 'Poster', 'Waiting for approval', '', 'FALSE')
];
