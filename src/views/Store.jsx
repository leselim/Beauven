import { Reel, Reveal, Split } from '../components/Motion.jsx';
import NotifyForm from '../components/NotifyForm.jsx';
import { Arrow, Bag, Bell, Calendar } from '../components/Icons.jsx';
import { EmailRow, Eyebrow, Row, SocialIcons } from './shared.jsx';
import { useCountdown } from '../hooks/index.js';
import { downloadLaunchInvite } from '../lib/calendar.js';
import { useToast } from '../components/Toast.jsx';
import { BRAND, LAUNCH } from '../config.js';

export function StoreLeft() {
  const t = useCountdown(LAUNCH);
  return (
    <>
      <div className="lead">
        <Eyebrow d={0}>{t.done ? 'Now open' : 'Coming soon'}</Eyebrow>
        {t.done ? (
          <Split text="Our store is open" className="h1" base={140} />
        ) : (
          <Split text="Our store is coming soon" className="h1" base={140} />
        )}
        <Reveal d={3} as="p" className="sub">
          {t.done
            ? 'The official Beauven store is live. Find the pieces that feel like you.'
            : `The official Beauven store opens on ${BRAND.launchShort}. Join the launch list and you’ll be among the first to know when the doors open.`}
        </Reveal>
      </div>

      <div className="rows">
        <Row icon={Calendar} d={5}>
          {BRAND.launchLong}
        </Row>
        {t.done ? (
          <Row icon={Bag} d={6} href={BRAND.storeUrl}>
            Shop the collection
          </Row>
        ) : (
          <Row icon={Bell} d={6} onClick={() => document.getElementById('notify-store')?.focus()}>
            Join the launch list
          </Row>
        )}
        <EmailRow d={7} />
      </div>
    </>
  );
}

const UNITS = [
  ['days', 'Days'],
  ['hours', 'Hours'],
  ['minutes', 'Minutes'],
  ['seconds', 'Seconds'],
];

export function StorePanel() {
  const t = useCountdown(LAUNCH);
  const toast = useToast();

  if (t.done) {
    return (
      <div className="store store--open">
        <Reveal d={0} className="store__top">
          <p className="eyebrow">The official store</p>
          <SocialIcons />
        </Reveal>
        <Reveal d={1} as="h2" className="store__title">
          We’re open
        </Reveal>
        <Reveal d={2} as="p" className="store__date">
          The full collection is waiting for you.
        </Reveal>
        <Reveal d={3}>
          <a className="btn btn--ivory" href={BRAND.storeUrl}>
            <span className="btn__label">Shop the collection</span>
            <Arrow size={15} className="arrow" />
          </a>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="store">
      <Reveal d={0} className="store__top">
        <p className="eyebrow">The official store</p>
        <p className="store__stamp">{BRAND.launchISO.slice(0, 10).split('-').reverse().join(' / ')}</p>
      </Reveal>

      <Reveal d={1} as="h2" className="store__title">
        Opening in
      </Reveal>

      <div
        className="countdown"
        role="timer"
        aria-label={`${t.days} days, ${t.hours} hours and ${t.minutes} minutes until the store opens`}
      >
        {UNITS.map(([key, label], i) => (
          <Reveal d={2 + i * 0.6} className="unit" key={key}>
            <span className="unit__num">
              <Reel value={t[key]} />
            </span>
            <span className="unit__label">{label}</span>
          </Reveal>
        ))}
      </div>

      <Reveal d={5} className="store__notify">
        <p className="store__date">Be the first through the doors on {BRAND.launchLong}</p>
        <NotifyForm tone="dark" inputId="notify-store" />
      </Reveal>

      <Reveal d={6} className="store__foot">
        <button
          type="button"
          className="text-btn text-btn--ivory"
          onClick={() => {
            downloadLaunchInvite();
            toast('Calendar invite downloaded');
          }}
        >
          Add to calendar
        </button>
        <SocialIcons />
      </Reveal>
    </div>
  );
}
