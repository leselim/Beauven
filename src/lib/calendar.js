import { BRAND } from '../config.js';

// Builds and downloads an .ics file so visitors can save launch day
// launch day as YYYYMMDD, plus the day after (an all-day event ends the next day)
function launchDays() {
  const [y, m, d] = BRAND.launchISO.slice(0, 10).split('-').map(Number);
  const fmt = (dt) => dt.toISOString().slice(0, 10).replace(/-/g, '');
  return [fmt(new Date(Date.UTC(y, m - 1, d))), fmt(new Date(Date.UTC(y, m - 1, d + 1)))];
}

export function downloadLaunchInvite() {
  const [start, end] = launchDays();
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Beauven//Launch//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:beauven-launch-${start}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    'SUMMARY:The Beauven store opens',
    `DESCRIPTION:The official Beauven store opens today. ${BRAND.storeUrl}`,
    `URL:${BRAND.storeUrl}`,
    'BEGIN:VALARM',
    'TRIGGER:PT9H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Beauven is open',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'beauven-launch.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}
