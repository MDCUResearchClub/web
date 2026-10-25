// Writes one HTML file per widget view, rendered from the placeholder fixtures,
// so the widgets can be checked in a browser without deploying.
//   node google-sites/test/preview.mjs [outDir] [nowIso]
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as fixtures from './fixtures.mjs';
import { render } from './harness.mjs';

const out = resolve(process.argv[2] || new URL('./out', import.meta.url).pathname);
const now = process.argv[3];
const views = ['opportunities', 'open-now', 'hero-actions', 'stats', 'events-home', 'events', 'showcase-home', 'showcase-stats', 'showcase'];

const pages = views.map((view) => [view, view, {}]).concat([
  ['opportunities-member', 'opportunities', { email: 'student@docchula.com' }],
  ['opportunities-full', 'opportunities', { email: 'student@docchula.com', params: { full: '1' } }],
  ['showcase-full', 'showcase', { params: { full: '1' } }]
]);

// Frames each view at the size its Sites embed uses, and at the size Sites shrinks it to on a phone
// (Sites keeps the width-to-height ratio), so both can be checked side by side.
const FRAMES = [
  ['hero-actions', 620, 210, '#0B1630'], ['open-now', 440, 500, '#0B1630'], ['events-home', 1100, 600, '#F4F7FA'],
  ['showcase-home', 1100, 800, '#FFFFFF'], ['opportunities', 1100, 1150, '#FFFFFF'], ['events', 1100, 330, '#FFFFFF'],
  ['showcase-stats', 900, 120, '#0B1630'], ['showcase', 1100, 1400, '#FFFFFF']
];
const frameHtml = (w, h, bg) => FRAMES.map(([v, fw, fh, fbg]) => {
  const s = Math.min(1, w / fw);
  return `<h3 style="font:600 13px monospace;margin:28px 0 6px">${v} — ${Math.round(fw * s)}×${Math.round(fh * s)}</h3>` +
    `<div style="background:${fbg};padding:8px;display:inline-block"><iframe src="${v}.html" style="width:${Math.round(fw * s)}px;height:${Math.round(fh * s)}px;border:1px dashed #999"></iframe></div>`;
}).join('');

mkdirSync(out, { recursive: true });
for (const [file, view, extra] of pages) {
  writeFileSync(resolve(out, file + '.html'), render(view, { fixtures, ...(now ? { now } : {}), ...extra }));
}
writeFileSync(resolve(out, 'frames-desktop.html'), '<!doctype html><meta charset="utf-8"><body style="margin:20px;font-family:sans-serif">' + frameHtml(1100) + '</body>');
writeFileSync(resolve(out, 'frames-phone.html'), '<!doctype html><meta charset="utf-8"><body style="margin:20px;font-family:sans-serif">' + frameHtml(330) + '</body>');
writeFileSync(resolve(out, 'index.html'), '<!doctype html><meta charset="utf-8"><title>Widget previews</title><ul>' +
  pages.map(([file]) => `<li><a href="${file}.html">${file}</a></li>`).join('') +
  '<li><a href="frames-desktop.html">frames-desktop</a></li><li><a href="frames-phone.html">frames-phone</a></li></ul>');
console.log('Wrote ' + pages.length + ' previews to ' + out);
