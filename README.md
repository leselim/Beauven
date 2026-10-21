# Beauven: launch site

Pre-launch landing page for Beauven, built with React and Vite.
Three views: **Home** (contact), **Our Story** and **Store** (live countdown to 28 February 2027), with quiet, hand-built motion and no animation library.

## Run it

```bash
npm install
npm run dev          # local dev server on http://localhost:5173
npm run build        # production build into dist/
npm run build:single # one self-contained HTML file into docs/index.html
```

`docs/index.html` is the whole site in a single file. GitHub Pages serves it when the repo's Pages source is set to the `main` branch and the `/docs` folder.

## Change things

Everything brand-specific lives in **`src/config.js`**:

| Setting | What it does |
| --- | --- |
| `name`, `tagline` | Beauven, Beauty beneath it all |
| `email` | General enquiries address |
| `launchISO` | Launch moment. The countdown, bag and calendar invite all read this |
| `storeUrl` | Where "Shop the collection" goes once the countdown reaches zero |
| `socials` | Instagram, TikTok and Facebook links. **Replace the placeholder handles** |
| `TOPICS` | Options in the contact form's Subject field |

The Our Story text lives in `src/views/Story.jsx`.

## Receiving messages

Out of the box, the contact form and the launch list open the visitor's email app with a message already addressed to the enquiries email. Nothing to set up.

To receive submissions straight into an inbox instead, create a free form endpoint (Formspree, Web3Forms or Getform), copy `.env.example` to `.env` and paste it in:

```
VITE_FORM_ENDPOINT=https://formspree.io/f/your-id
```

Rebuild and the forms will post JSON (`kind`, `name`, `email`, `topic`, `message`) to it.

## What's in here

```
src/
  config.js            brand settings
  App.jsx              routing (#home, #story, #store), view transitions, search shortcut
  styles.css           all styling, palette tokens at the top
  views/               Home, Story, Store (each has a left column and a panel)
  components/
    Nav.jsx            tabs, sliding indicator, Store menu, bag and account popovers, mobile menu
    ContactForm.jsx    validated form with sending and sent states
    NotifyForm.jsx     launch-list sign-up, kept in sync everywhere it appears
    Search.jsx         full-screen search (also Ctrl+K or "/"), forgiving of phrases like "about us"
    Motion.jsx         word-by-word headline reveal, view swap, rolling countdown digits
    Intro.jsx          opening curtain: the wordmark types itself out on cocoa, then the page loads
  lib/                 form submission, calendar invite (.ics), clipboard, search
  assets/fonts/        Italiana and Instrument Sans (SIL Open Font License)
public/fonts/          drop licensed Céline files here
docs/index.html        single-file build for GitHub Pages
```

## Type and colour

- **Display: Céline (Bellevue Studio).** Céline is a paid font, so it can't be shipped in this project. If you own a licence, put the web font in `public/fonts/` as `Celine.woff2` (or `Celine.otf`) and rebuild. Every heading, the logo, navigation, buttons and numerals switch to it automatically.
- Until then the site uses **Italiana**, the closest open-licence match.
- **Text: Instrument Sans** for body copy, form fields and the small spaced capitals.
- Soft Ivory `#EDE6D8` and Dark Cocoa `#311B14`.

Motion respects the visitor's reduced-motion setting.
