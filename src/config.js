// ─────────────────────────────────────────────────────────────
//  Beauven: site settings
//  Everything you are likely to change lives in this one file.
// ─────────────────────────────────────────────────────────────

const env = import.meta.env || {};

export const BRAND = {
  name: 'Beauven',
  tagline: 'Beauty beneath it all',
  email: 'info@beauven.co.za',

  // Launch moment: midnight, South African time (SAST, UTC+2)
  // Change these three lines together. The countdown, the date stamp and the
  // calendar invite all follow launchISO.
  launchISO: '2027-02-28T00:00:00+02:00',
  launchShort: '28 February 2027',
  launchLong: 'Sunday, 28 February 2027',

  // Where "Shop the collection" points once the countdown reaches zero
  storeUrl: 'https://beauven.co.za',

  // Optional: a form service endpoint (Formspree, Web3Forms, Getform…).
  // Set VITE_FORM_ENDPOINT in a .env file. When it is empty, the contact
  // form and the launch list open the visitor's email app instead,
  // pre-filled and addressed to BRAND.email, so the site works either way.
  formEndpoint: env.VITE_FORM_ENDPOINT || '',

  // Placeholder handles: replace them with your real profile links
  socials: [
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/beauven' },
    { id: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@beauven' },
    { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/beauven' },
  ],
};

export const LAUNCH = new Date(BRAND.launchISO);

export const TOPICS = ['General enquiry', 'Collaboration', 'Press & media', 'Something else'];
