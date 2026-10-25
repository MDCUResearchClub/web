// Runs the real Apps Script files under Node with small stand-ins for the Google
// services they use, so doGet() can be called for every view.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const dir = new URL('../apps-script/', import.meta.url);
const read = (name) => readFileSync(new URL(name, dir), 'utf8');

const cellValue = (c) => (c && typeof c === 'object' && 'v' in c ? c.v : c);
const cellText = (c) => (c && typeof c === 'object' && 'd' in c ? c.d : String(c ?? ''));

function fakeSheet(name, rows) {
  return {
    getName: () => name,
    getDataRange: () => ({
      getValues: () => rows.map((r) => r.map(cellValue)),
      getDisplayValues: () => rows.map((r) => r.map(cellText))
    })
  };
}

function fakeSpreadsheet(tabs) {
  const sheets = Object.entries(tabs).map(([name, rows]) => fakeSheet(name, rows));
  return { getSheets: () => sheets, getSheetByName: (n) => sheets.find((s) => s.getName() === n) || null };
}

/**
 * fixtures: { opportunities: {tab: rows}, events: rows, showcase: rows }
 * now: ISO timestamp used as "today".
 * email: the visitor Google reports to the script ('' = signed out or another domain).
 */
export function loadApp({ fixtures, now = '2026-10-23T10:00:00+07:00', config = {}, email = '' }) {
  const FIXED = new Date(now).getTime();
  class FixedDate extends Date {
    constructor(...args) { super(...(args.length ? args : [FIXED])); }
    static now() { return FIXED; }
  }
  const store = new Map();
  const context = {
    console,
    JSON,
    Date: FixedDate,
    SpreadsheetApp: {
      openById(id) {
        if (id === 'OPP') return fakeSpreadsheet(fixtures.opportunities || {});
        if (id === 'DATA') return fakeSpreadsheet({ Events: fixtures.events || [], Showcase: fixtures.showcase || [] });
        throw new Error('Unknown spreadsheet ' + id);
      }
    },
    CacheService: {
      getScriptCache: () => ({
        get: (k) => store.get(k) ?? null,
        getAll: (keys) => Object.fromEntries(keys.filter((k) => store.has(k)).map((k) => [k, store.get(k)])),
        putAll: (entries) => Object.entries(entries).forEach(([k, v]) => store.set(k, v)),
        removeAll: (keys) => keys.forEach((k) => store.delete(k))
      })
    },
    Utilities: {
      formatDate: (d, tz) => new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
    },
    ScriptApp: { getService: () => ({ getUrl: () => 'https://script.google.com/a/macros/docchula.com/s/TEST/exec' }) },
    Session: { getActiveUser: () => ({ getEmail: () => email }) },
    HtmlService: {
      XFrameOptionsMode: { ALLOWALL: 'ALLOWALL' },
      createHtmlOutputFromFile: (name) => ({ getContent: () => read(name + '.html') }),
      createTemplateFromFile(name) {
        const source = read(name + '.html');
        const template = {
          evaluate() {
            const vars = { ...template, include: context.include };
            const html = source.replace(/<\?!=\s*([\s\S]*?)\s*;?\s*\?>/g, (_, expr) =>
              String(new Function(...Object.keys(vars), 'return (' + expr + ');')(...Object.values(vars))));
            const output = {
              getContent: () => html,
              setTitle: () => output,
              addMetaTag: () => output,
              setXFrameOptionsMode: () => output
            };
            return output;
          }
        };
        return template;
      }
    }
  };
  vm.createContext(context);
  for (const file of ['Parse.gs', 'Config.gs', 'Code.gs']) vm.runInContext(read(file), context, { filename: file });
  vm.runInContext(
    'CONFIG.OPPORTUNITIES_SHEET_ID = "OPP"; CONFIG.WEBSITE_DATA_SHEET_ID = "DATA";' +
    'Object.assign(CONFIG, ' + JSON.stringify(config) + ');',
    context
  );
  return context;
}

/** Returns the full HTML the web app would serve for ?view=<view>. */
export function render(view, options) {
  const app = loadApp(options);
  return app.doGet({ parameter: { view, ...(options.params || {}) } }).getContent();
}

/** The JSON payload the page receives, parsed back out of the HTML. */
export function payload(html) {
  const m = html.match(/window\.__DATA__ = ([\s\S]*?);\n/);
  return JSON.parse(m[1]);
}
