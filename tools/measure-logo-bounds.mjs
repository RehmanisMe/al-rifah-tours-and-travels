import sharp from 'sharp';

const SRC = 'assets/logo-al-rifah-travels-original.png';
const img = sharp(SRC);
const { width, height } = await img.metadata();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const ch = info.channels;

const THRESH = 18; // anything brighter than this counts as "content"
const lum = (i) => 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];

const rowHas = new Array(height).fill(0);
const colHas = new Array(width).fill(0);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (lum((y * width + x) * ch) > THRESH) {
      rowHas[y]++;
      colHas[x]++;
    }
  }
}

const firstIdx = (a) => a.findIndex((v) => v > 0);
const lastIdx = (a) => a.length - 1 - [...a].reverse().findIndex((v) => v > 0);

console.log(`source: ${width} x ${height}`);
console.log(`content bbox: x ${firstIdx(colHas)}..${lastIdx(colHas)}   y ${firstIdx(rowHas)}..${lastIdx(rowHas)}`);

// Find horizontal empty bands (gaps) to locate the emblem / wordmark boundary.
const bands = [];
let start = null;
for (let y = 0; y < height; y++) {
  const empty = rowHas[y] === 0;
  if (empty && start === null) start = y;
  if (!empty && start !== null) {
    if (y - start >= 6) bands.push([start, y - 1]);
    start = null;
  }
}
if (start !== null) bands.push([start, height - 1]);
console.log('\nempty horizontal bands (y ranges, >=6px tall):');
for (const [a, b] of bands) console.log(`  ${a}..${b}   (${b - a + 1}px)`);
