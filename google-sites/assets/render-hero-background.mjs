// Renders hero-logo-background.svg to a PNG for Google Sites (Section colors › Image only takes bitmaps).
//   node google-sites/assets/render-hero-background.mjs
// No dependencies: the two strokes are flattened and drawn with anti-aliased round caps, then saved with zlib.
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const W = 2400, H = 960;
const NAVY = [0x0B, 0x16, 0x30];
// Same placement as the SVG: translate(1468 -113) scale(1.4125), stroke-width 64 in path units.
const TX = 1468, TY = -113, S = 1.4125, HALF = 32 * S;

const cubic = (p0, p1, p2, p3, n = 96) => Array.from({ length: n }, (_, i) => {
  const t = (i + 1) / n, u = 1 - t;
  return [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]);
});
// The design's paths, written out in absolute coordinates.
const sky = [[150, 790], [150, 270], ...cubic([150, 270], [150, 182], [212, 120], [300, 120]), [470, 120],
  ...cubic([470, 120], [610, 120], [710, 230], [710, 360]), ...cubic([710, 360], [710, 490], [610, 600], [470, 600])];
const amber = [[520, 330], ...cubic([520, 330], [410, 330], [330, 410], [330, 500]),
  ...cubic([330, 500], [330, 590], [410, 670], [520, 670]), [710, 670]];

const STROKES = [
  { points: sky, color: [0x5B, 0xC6, 0xEA], opacity: 0.09 },
  { points: amber, color: [0xF4, 0xB1, 0x3A], opacity: 0.10 }
];

const px = new Float64Array(W * H * 3);
for (let i = 0; i < W * H; i++) px.set(NAVY, i * 3);

for (const { points, color, opacity } of STROKES) {
  const pts = points.map(([x, y]) => [TX + x * S, TY + y * S]);
  const dist = new Float64Array(W * H).fill(Infinity);
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    const x0 = Math.max(0, Math.floor(Math.min(ax, bx) - HALF - 1)), x1 = Math.min(W - 1, Math.ceil(Math.max(ax, bx) + HALF + 1));
    const y0 = Math.max(0, Math.floor(Math.min(ay, by) - HALF - 1)), y1 = Math.min(H - 1, Math.ceil(Math.max(ay, by) + HALF + 1));
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy || 1;
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const cx = x + 0.5, cy = y + 0.5;
        const t = Math.max(0, Math.min(1, ((cx - ax) * dx + (cy - ay) * dy) / len2));
        const d = Math.hypot(cx - (ax + t * dx), cy - (ay + t * dy));
        const k = y * W + x;
        if (d < dist[k]) dist[k] = d;
      }
    }
  }
  for (let k = 0; k < W * H; k++) {
    const cover = Math.max(0, Math.min(1, HALF + 0.5 - dist[k]));
    if (!cover) continue;
    const a = cover * opacity;
    for (let c = 0; c < 3; c++) px[k * 3 + c] = px[k * 3 + c] * (1 - a) + color[c] * a;
  }
}

// PNG: 8-bit RGB, filter 0 on every row.
const raw = Buffer.alloc(H * (1 + W * 3));
for (let y = 0; y < H; y++) {
  raw[y * (1 + W * 3)] = 0;
  for (let x = 0; x < W; x++) {
    for (let c = 0; c < 3; c++) raw[y * (1 + W * 3) + 1 + x * 3 + c] = Math.round(px[(y * W + x) * 3 + c]);
  }
}
const CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xFFFFFFFF;
  for (const b of buf) c = CRC[(c ^ b) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
};
const chunk = (type, data) => {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr.set([8, 2, 0, 0, 0], 8);
const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]), chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
const out = new URL('./hero-logo-background.png', import.meta.url);
writeFileSync(out, png);
console.log('Wrote ' + out.pathname + ' (' + png.length + ' bytes)');
