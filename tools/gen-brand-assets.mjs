/*
 * Generates the Al Rifah brand asset set from the master logo artwork.
 *
 * The master lives in brand/ and is never deployed. Everything this script
 * writes into public/assets is derived, so edit the master and re-run rather
 * than editing generated files.
 *
 * Run from the project root:  npm run build:brand
 */
import fs from 'node:fs/promises';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

// Paths are relative to the project root.
const SRC = 'brand/logo-al-rifah-travels-original.png';
const IMAGES = 'public/assets/images';
const ICONS = 'public/assets/icons';
const FAVICON_ICO = 'public/favicon.ico';

// Content bounds measured from the master (see tools/measure-logo-bounds.mjs).
// The master is 1536x1024 but the artwork occupies only this box; the rest is
// empty black padding that would make the logo render tiny if left in.
const LOCKUP = { left: 374, top: 308, width: 818, height: 439 };
const EMBLEM_BOTTOM = 529; // last row of the Kaaba + plane emblem
const SOURCE_WIDTH = 1536;
const LUMA_THRESHOLD = 18; // brighter than this counts as artwork, not background

await fs.mkdir(IMAGES, { recursive: true });
await fs.mkdir(ICONS, { recursive: true });

/* ---------- 1. Full lockup, tightly trimmed ---------- */
await sharp(SRC)
  .extract(LOCKUP)
  .png({ compressionLevel: 9, palette: true, quality: 95 })
  .toFile(`${IMAGES}/logo-al-rifah-travels.png`);

/* ---------- 2. Emblem only (Kaaba + plane), squared for icons ---------- */
// Measure the emblem's own horizontal extent so the square crop is centred on it.
const emblemBand = {
  left: 0,
  top: LOCKUP.top,
  width: SOURCE_WIDTH,
  height: EMBLEM_BOTTOM - LOCKUP.top + 1,
};
const { data, info } = await sharp(SRC).extract(emblemBand).raw().toBuffer({ resolveWithObject: true });

let minX = info.width;
let maxX = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * info.channels;
    const luma = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    if (luma > LUMA_THRESHOLD) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }
  }
}

const emW = maxX - minX + 1;
const emH = emblemBand.height;
const side = Math.max(emW, emH);
const pad = 12; // breathing room inside the square
console.log(`emblem bounds: x ${minX}..${maxX} (${emW}px)  h ${emH}px`);

const emblemSquare = await sharp(SRC)
  .extract({ left: minX, top: emblemBand.top, width: emW, height: emH })
  .extend({
    top: Math.floor((side - emH) / 2) + pad,
    bottom: Math.ceil((side - emH) / 2) + pad,
    left: Math.floor((side - emW) / 2) + pad,
    right: Math.ceil((side - emW) / 2) + pad,
    background: { r: 0, g: 0, b: 0 },
  })
  .png()
  .toBuffer();

await sharp(emblemSquare).png({ compressionLevel: 9 }).toFile(`${IMAGES}/logo-al-rifah-emblem.png`);

// Compact mark for the mobile header (96px source for a ~44px display).
await sharp(emblemSquare).resize(96, 96).png({ compressionLevel: 9 })
  .toFile(`${IMAGES}/logo-al-rifah-emblem-96.png`);

/* ---------- 3. Favicons, apple touch icon, PWA icons ---------- */
const square = (size) =>
  sharp(emblemSquare).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0 } });

const ICON_TARGETS = [
  [16, 'favicon-16x16.png'],
  [32, 'favicon-32x32.png'],
  [48, 'favicon-48x48.png'],
  [180, 'apple-touch-icon.png'],
  [192, 'icon-192.png'],
  [512, 'icon-512.png'],
];

for (const [size, name] of ICON_TARGETS) {
  await square(size).png({ compressionLevel: 9 }).toFile(`${ICONS}/${name}`);
}

// Multi-resolution .ico at the web root, for legacy /favicon.ico requests.
const icoBuffers = await Promise.all([16, 32, 48].map((s) => square(s).png().toBuffer()));
await fs.writeFile(FAVICON_ICO, await pngToIco(icoBuffers));

/* ---------- 4. Social share image (1200x630) ---------- */
const shareLogo = await sharp(SRC).extract(LOCKUP).resize({ width: 820 }).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: { r: 0, g: 0, b: 0 } } })
  .composite([{ input: shareLogo, gravity: 'centre' }])
  .png({ compressionLevel: 9 })
  .toFile(`${IMAGES}/og-image-al-rifah-travels.png`);

/* ---------- report ---------- */
console.log('\ngenerated:');
for (const dir of [IMAGES, ICONS]) {
  for (const f of (await fs.readdir(dir)).sort()) {
    const { size } = await fs.stat(`${dir}/${f}`);
    const { width, height } = await sharp(`${dir}/${f}`).metadata();
    console.log(`  ${String(size).padStart(8)}  ${`${width}x${height}`.padEnd(10)} ${dir}/${f}`);
  }
}
const ico = await fs.stat(FAVICON_ICO);
console.log(`  ${String(ico.size).padStart(8)}  ${'multi'.padEnd(10)} ${FAVICON_ICO}`);
