/**
 * One-time setup. Paste this into its OWN Apps Script project (not the widgets project), run
 * setupWebsiteData() once, approve the permission screen, then read the links in View > Logs.
 * Afterwards the project can be deleted - the widgets project never needs these permissions.
 *
 * It creates, in the signed-in account's Drive:
 *   - a spreadsheet "Website data" with an Events tab (dropdowns, checkboxes, sample rows)
 *   - a Google Form "Add my presentation to the MDCU Research Showcase" linked to a Showcase tab
 *     that has an Approved checkbox column (only ticked rows appear on the site)
 */
function setupWebsiteData() {
  var ss = SpreadsheetApp.create('Website data');
  var events = ss.getSheets()[0];
  events.setName('Events');

  var header = ['Date', 'Start', 'End', 'Type', 'Title', 'Venue', 'Description', 'Register link', 'Poster link',
    'Recording links', 'Seats', 'Status', 'Show on site'];
  var rows = [
    ['2026-07-06', '16:00', '18:30', 'Meetup', 'MDCU Research Division First Meet 2026', 'Smart Classroom, อาคาร อปร.',
      'What research is and how to start, through a hands-on interactive session — plus talks from four senior researchers and an early look at Core Team recruitment.', '', '', '', '', '', true],
    ['2026-01-16', '16:15', '20:00', 'Workshop', 'How to Design High-Impact Research', 'Room 1302, 13th floor, Bhumisiri Building',
      'Lecture on research fundamentals and key ideas, followed by a workshop on the thinking process behind study design.', '', '', '', '40', '', true],
    ['2025-07-06', '09:00', '12:00', 'Workshop', 'Statistics in Medical Research & Basic Software', 'Online via Zoom',
      'ResearchNav 2025, Workshop 4. Session 1: statistical fundamentals from principles to practice. Session 2: hands-on with Stata.', '', '', '', '', '', true],
    ['2025-03-19', '13:00', '15:30', 'Lab tour', 'Lab Tour 2: Systems Biology & Cancer Biomarkers', 'Faculty of Medicine, Chulalongkorn University',
      'Visits to the Center of Excellence in Systems Biology and the Cancer Biomarker Research Laboratory.', '', '', '', '', '', true],
    ['2025-03-11', '16:30', '19:30', 'Workshop', 'Transforming Medical Research with AI', 'Room 1302, 13th floor, Bhumisiri Building',
      'AI tools that help with research, with an interactive session.', '', '', '', '40', '', true]
  ];
  var n = rows.length;
  events.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight('bold').setBackground('#16305A').setFontColor('#FFFFFF');
  // Text format first, so "16:00" and "40" stay exactly as typed.
  events.getRange(2, 2, 500, 2).setNumberFormat('@');
  events.getRange(2, 11, 500, 1).setNumberFormat('@');
  events.getRange(2, 1, 500, 1).setNumberFormat('yyyy-mm-dd');
  var data = rows.map(function (r) {
    var out = r.slice();
    var p = r[0].split('-');
    out[0] = new Date(+p[0], +p[1] - 1, +p[2]);
    return out;
  });
  events.getRange(2, 1, n, header.length).setValues(data);
  events.getRange(2, 4, 500, 1).setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(['Workshop', 'Lab tour', 'Research talk', 'Meetup', 'Other'], true).setAllowInvalid(true).build());
  events.getRange(2, 12, 500, 1).setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(['Open', 'Full', 'Closed', 'Cancelled'], true).setAllowInvalid(true).build());
  events.getRange(2, 13, 500, 1).insertCheckboxes();
  events.getRange(2, 13, n, 1).check();
  events.setFrozenRows(1);
  events.setColumnWidths(1, 3, 90);
  events.setColumnWidth(5, 280);
  events.setColumnWidth(6, 200);
  events.setColumnWidth(7, 380);
  events.getRange(1, 1, 1, 1).setNote('One row per event. Only rows dated today or later appear as "Upcoming" on the site; "Show on site" must be ticked.');

  var form = FormApp.create('Add my presentation to the MDCU Research Showcase');
  form.setDescription('Presented your research at a conference? Fill this in and the Research Division team will review it. '
    + 'Approved entries appear on the Showcase page of the MDCU Research Division website.');
  form.setCollectEmail(true);
  form.setRequireLogin(true);
  form.setConfirmationMessage('Thank you! The team will review your presentation before it appears on the website.');
  var text = function (title, required, help) {
    var item = form.addTextItem().setTitle(title).setRequired(!!required);
    if (help) item.setHelpText(help);
    return item;
  };
  text('Presenter name / ชื่อผู้นำเสนอ', true);
  text('Class (e.g. MDCU78) / รุ่น', true);
  text('Conference name / ชื่องานประชุม', true);
  text('Short name (e.g. VSS 2026) / ชื่อย่อ', false);
  text('City, country / เมือง', true, 'For example: Bangkok, Thailand');
  form.addDateItem().setTitle('Conference date / วันที่นำเสนอ').setRequired(true);
  form.addMultipleChoiceItem().setTitle('Format / รูปแบบ')
    .setChoiceValues(['Oral presentation', 'Poster presentation', 'Other']).setRequired(true);
  text('Research title / ชื่องานวิจัย', true);
  text('Research field / สาขา', false);
  text('Keywords / คำสำคัญ', false, 'Separate with commas');
  text('Advisors / อาจารย์ที่ปรึกษา', false);
  form.addParagraphTextItem().setTitle('Abstract / บทคัดย่อ').setRequired(true);
  form.addParagraphTextItem().setTitle('Reflection / สิ่งที่ได้เรียนรู้').setRequired(false);
  text('Photo / รูป', false, 'Optional. Paste a Google Drive link to your photo, shared as "Anyone with the link - Viewer".');
  form.addCheckboxItem().setTitle('Consent / ยินยอม')
    .setChoiceValues(['I agree that my name, class, photo and research details are shown on the club website'])
    .setRequired(true);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  SpreadsheetApp.flush();

  var showcase = null;
  ss.getSheets().forEach(function (s) { if (s.getName() !== 'Events') showcase = s; });
  if (showcase) {
    showcase.setName('Showcase');
    var col = showcase.getLastColumn() + 1;
    showcase.getRange(1, col).setValue('Approved').setFontWeight('bold');
    showcase.getRange(2, col, 500, 1).insertCheckboxes();
    showcase.setFrozenRows(1);
    showcase.getRange(1, col).setNote('Tick to publish this presentation on the Showcase page.');
  }

  Logger.log('WEBSITE_DATA_SHEET_ID = ' + ss.getId());
  Logger.log('Spreadsheet: ' + ss.getUrl());
  Logger.log('Form (share this with students): ' + form.getPublishedUrl());
  Logger.log('Form (edit): ' + form.getEditUrl());
  return ss.getId();
}
