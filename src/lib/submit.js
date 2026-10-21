import { BRAND } from '../config.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function openMail(subject, body) {
  const href = `mailto:${BRAND.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  try {
    window.location.href = href;
  } catch {
    // some embedded previews block in-page navigation
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

/**
 * Sends a message or a launch-list sign-up.
 * With an endpoint configured it posts JSON; without one it opens a
 * pre-filled email to BRAND.email. Resolves to 'sent' or 'mail'.
 */
export async function submitLead(kind, data) {
  const started = Date.now();

  if (BRAND.formEndpoint) {
    const res = await fetch(BRAND.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ kind, ...data, _subject: subjectFor(kind, data) }),
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    // keep the sending state on screen long enough to read as intentional
    await wait(Math.max(0, 700 - (Date.now() - started)));
    return 'sent';
  }

  await wait(650);
  openMail(subjectFor(kind, data), bodyFor(kind, data));
  return 'mail';
}

function subjectFor(kind, data) {
  if (kind === 'notify') return 'Notify me when the Beauven store opens';
  return `${data.topic || 'Enquiry'} from ${data.name}`;
}

function bodyFor(kind, data) {
  if (kind === 'notify') {
    return `Hi Beauven,\n\nPlease add ${data.email} to the launch list for ${BRAND.launchShort}.\n\nThank you`;
  }
  return `${data.message}\n\n${data.name}\n${data.email}`;
}

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());

export function remember(key, value) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch {
    return null;
  }
  return value;
}
