/** Confirms MIME types, cache policy and security headers on the live site. */
const BASE = process.argv[2] || 'https://al-rifah.web.app';

const targets = [
  '/',
  '/scripts/home.page.js',
  '/styles/main.css',
  '/assets/images/logo-al-rifah-travels.png',
  '/site.webmanifest',
  '/this-page-does-not-exist',
];

for (const path of targets) {
  const res = await fetch(BASE + path);
  console.log(`\n${path}  ->  ${res.status}`);
  for (const key of ['content-type', 'cache-control', 'x-content-type-options', 'referrer-policy', 'x-frame-options']) {
    const value = res.headers.get(key);
    if (value) console.log(`  ${key}: ${value}`);
  }
  if (path === '/this-page-does-not-exist') {
    const body = await res.text();
    const branded = body.includes('logo-al-rifah-travels.png') && body.includes('Al Rifah');
    const stockFirebase = body.includes('Firebase Command-Line Interface');
    console.log(`  branded 404: ${branded}   stock firebase page: ${stockFirebase}`);
  }
}
