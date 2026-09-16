# Al Rifah Travels Pvt Ltd

Static marketing site and Umrah cost calculator, hosted on Firebase Hosting at
https://al-rifah.web.app

## Structure

Everything that ships to the web lives in `public/`. Everything outside it is
source, tooling, or configuration and is never deployed, which is enforced by
`firebase.json` pointing at `public` rather than the project root.

```
public/                          # web root - the only deployed directory
├── index.html
├── umrah-cost-calculator.html
├── 404.html
├── favicon.ico
├── site.webmanifest
├── assets/
│   ├── images/                  # logo lockup, emblem, social share image
│   └── icons/                   # favicons, apple touch icon, PWA icons
├── styles/
│   ├── main.css                 # shared site styles
│   └── calculator.css           # calculator page only
└── scripts/
    ├── home.page.js             # entry point: home page
    ├── calculator.page.js       # entry point: calculator page
    ├── config/                  # values, no behaviour
    │   ├── firebase.config.js
    │   └── pricing.config.js
    ├── services/                # external systems
    │   ├── firebase-app.js      # owns Firebase init
    │   └── enquiry.service.js   # owns the "enquiries" collection
    ├── features/                # one concern per file
    │   ├── preloader.js
    │   ├── header-scroll.js
    │   ├── mobile-nav.js
    │   ├── carousels.js
    │   ├── counters.js
    │   ├── text-effects.js
    │   ├── scroll-animations.js
    │   ├── enquiry-form.js
    │   └── calculator/
    │       ├── pricing.js       # pure math, no DOM
    │       ├── quote-form.js    # DOM -> data
    │       ├── quote-view.js    # data -> DOM
    │       └── controls.js      # steppers, slider, toggles
    └── utils/                   # dom.js, currency.js

brand/                           # master logo artwork, not deployed
tools/                           # build and verification scripts
firebase.json  .firebaserc  firestore.rules  firestore.indexes.json
```

## How the code is organised

The two `*.page.js` files are composition only: they decide which features a
page uses and wire dependencies together. They contain no feature logic, so
adding a section to a page does not mean growing a single large script.

Each feature module exports an `init...` function that returns immediately if
its markup is not on the page. That is why both pages can share `mobile-nav.js`
and `header-scroll.js` without per-page conditionals.

The calculator is split by responsibility rather than kept as one handler:

- `pricing.js` is pure. Given a quote input it returns a breakdown, with no DOM
  access and no side effects, so the pricing rules can be reviewed and tested on
  their own. `tools/verify-pricing-parity.mjs` does exactly that.
- `quote-form.js` only turns form state into data.
- `quote-view.js` only turns data into DOM.
- `pricing.config.js` holds the commercial rates, so changing a price never
  means touching calculation code.

`enquiry-form.js` receives its persistence function as an argument instead of
importing Firebase. The form does not know Firestore exists; `home.page.js`
passes `saveEnquiry` in. Replacing the backend with an HTTP endpoint or a Cloud
Function is a change to `enquiry.service.js` and one line of wiring.

`enquiry.service.js` writes only a whitelist of fields, so an unexpected
property on the form object can never reach the database.

## Commands

```bash
npm install            # dev tooling for the scripts in tools/
npm run serve          # local preview
npm test               # verify pricing matches the original, to the exact float
npm run check:links    # verify assets resolve and the module graph is intact
npm run build:brand    # regenerate brand assets from brand/
npm run deploy         # deploy hosting
npm run deploy:rules   # deploy Firestore security rules
```

`npm run check:links` expects a server running; pass the URL if not on the
default port, e.g. `node tools/check-links.mjs http://localhost:5057`.

## Brand assets

`brand/logo-al-rifah-travels-original.png` is the master. Everything in
`public/assets/` is generated from it by `npm run build:brand`, so edit the
master and regenerate rather than editing derived files.

The artwork is gold on **solid black** with no transparency, which drives two
different treatments:

- **Dark surfaces** (preloader, footer, 404) use `mix-blend-mode: screen`, which
  drops the black away so only the gold shows. This only works over dark
  backgrounds; over a light background the logo would disappear.
- **The white header** puts the logo on a black plate with a gold hairline
  border. Keying the black out instead would hollow the Kaaba, since its faces
  are dark by design.

Below 768px the header swaps the full lockup for the emblem, because the
"Travels Pvt Ltd" tagline is unreadable at the 60px mobile header height.

## Known follow-ups

- Firestore rules allow `create: if true` on `enquiries`, so anyone can write to
  that collection. Consider App Check or a Cloud Function with rate limiting.
- The enquiry form reports success and failure with `window.alert`. The notifier
  is injectable in `enquiry-form.js`, so swapping in an inline status message is
  a small change.
- No Content-Security-Policy header yet. The site loads Swiper, Font Awesome,
  Google Fonts, Firebase, and Unsplash images from CDNs, so a policy needs to
  allowlist those before it can be enabled.
- CSS is two hand-maintained files. Splitting further would need a build step to
  avoid extra requests, which this project deliberately does not have.
