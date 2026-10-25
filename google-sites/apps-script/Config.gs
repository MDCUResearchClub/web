/**
 * The only file that should ever need editing. Fill in the blanks once during
 * setup (see google-sites/README.md), then redeploy.
 */
var CONFIG = {
  // "Research opportunities for MDCU students" — the sheet the faculty form already writes to.
  // Tabs named like "2026-2027" are academic years; the newest one is shown by default.
  OPPORTUNITIES_SHEET_ID: '1rauSCAn-TY2GrytPxR-Fz4000X8-A7PXW3-8Hr10X4g',

  // "Website data" — holds the Events tab and the Showcase tab (linked to the showcase form).
  WEBSITE_DATA_SHEET_ID: '1wwTHjyXvQPko8dfZXaXaFK4Oe9wR1CdbtjD0OkfbGjk',
  EVENTS_TAB: 'Events',
  SHOWCASE_TAB: 'Showcase',

  TIME_ZONE: 'Asia/Bangkok',

  // Visitors signed in with an account on this domain see every opportunity detail. Everyone else
  // sees only PUBLIC_OPPORTUNITY_FIELDS — the other fields are removed before the page is sent.
  MEMBER_DOMAIN: 'docchula.com',
  PUBLIC_OPPORTUNITY_FIELDS: ['id', 'kind', 'status', 'title', 'lang', 'dept', 'keywords', 'seats'],

  // Web app URL of the members' deployment of this project (Who has access: "Anyone within docchula.com").
  // The "Sign in" button on the public site opens it. If blank, the button opens the public deployment
  // as its own page instead.
  MEMBERS_APP_URL: 'https://script.google.com/a/macros/docchula.com/s/AKfycbxGjlKCSqzYDLJUrKNKCavVAkAsEGTc46IAmL7bc7lRYL5ZvW-ZRU1ljJzUk8aGSBeQ/exec',

  // How long the site may show slightly old data after a sheet edit.
  CACHE_SECONDS: 300,

  // Different spellings of the same department, merged into one filter option.
  DEPT_ALIASES: {
    'สูตินรีเวชวิทยา': 'สูติศาสตร์-นรีเวชวิทยา',
    'สูติศาสตร์-นรีเวชวิทยา': 'สูติศาสตร์-นรีเวชวิทยา',
    'คณะผู้บริหารด้านยุทธศาสตร์องค์กร': 'ฝ่ายยุทธศาสตร์องค์กร'
  },

  // Used for buttons inside the widgets. Inside Google Sites they open in a new tab (embeds can't navigate the page).
  LINKS: {
    site: 'https://sites.google.com/docchula.com/mdcuresearch-docchula',
    opportunitiesPage: 'https://sites.google.com/docchula.com/mdcuresearch-docchula/opportunities',
    eventsPage: 'https://sites.google.com/docchula.com/mdcuresearch-docchula/previous-events',
    showcasePage: 'https://sites.google.com/docchula.com/mdcuresearch-docchula/researcher-profile',
    instagram: 'https://www.instagram.com/researchclub.mdcu/',
    email: 'researchclub@docchula.com',
    facultyForm: '',
    showcaseForm: 'https://docs.google.com/forms/d/e/1FAIpQLSeovLgBQ3cEw8nlmHkjzG6HwR89R5AEMyThhRb5SWkAS0NGAg/viewform'
  }
};
