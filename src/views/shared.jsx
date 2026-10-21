import { Reveal } from '../components/Motion.jsx';
import { Instagram, Mail, SOCIAL_ICONS } from '../components/Icons.jsx';
import { BRAND } from '../config.js';
import { copyText } from '../lib/calendar.js';
import { useToast } from '../components/Toast.jsx';

/** Small capitals preceded by a hairline: the site's section marker */
export function Eyebrow({ d = 0, children, onClick }) {
  const inner = (
    <>
      <span className="eyebrow__rule" aria-hidden="true" />
      <span>{children}</span>
    </>
  );
  return (
    <Reveal d={d} className="eyebrow-wrap">
      {onClick ? (
        <button type="button" className="eyebrow eyebrow--link" onClick={onClick}>
          {inner}
        </button>
      ) : (
        <p className="eyebrow">{inner}</p>
      )}
    </Reveal>
  );
}

export function Row({ icon: Icon, d, children, href, onClick, external }) {
  const inner = (
    <>
      <span className="chip">
        <Icon size={16} />
      </span>
      <span className="row__text">{children}</span>
    </>
  );
  return (
    <Reveal d={d} className="row-wrap">
      {href ? (
        <a className="row" href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {inner}
        </a>
      ) : onClick ? (
        <button className="row" type="button" onClick={onClick}>
          {inner}
        </button>
      ) : (
        <div className="row row--static">{inner}</div>
      )}
    </Reveal>
  );
}

export function EmailRow({ d }) {
  const toast = useToast();
  return (
    <Reveal d={d} className="row-wrap">
      <a className="row" href={`mailto:${BRAND.email}`}>
        <span className="chip">
          <Mail size={16} />
        </span>
        <span className="row__text">{BRAND.email}</span>
      </a>
      <button
        type="button"
        className="copy"
        onClick={async () => {
          if (await copyText(BRAND.email)) toast('Email address copied');
        }}
      >
        Copy
      </button>
    </Reveal>
  );
}

export function SocialRow({ d }) {
  return (
    <Reveal d={d} className="row-wrap">
      <div className="row row--static">
        <span className="chip" aria-hidden="true">
          <Instagram size={16} />
        </span>
        <span className="row__text socials-inline">
          {BRAND.socials.map((s, i) => (
            <span key={s.id}>
              <a href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
              {i < BRAND.socials.length - 1 ? <i aria-hidden="true">/</i> : null}
            </span>
          ))}
        </span>
      </div>
    </Reveal>
  );
}

export function SocialIcons({ className = '' }) {
  return (
    <div className={`social-icons ${className}`}>
      {BRAND.socials.map((s) => {
        const Icon = SOCIAL_ICONS[s.id];
        return (
          <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Beauven on ${s.label}`}>
            <Icon size={17} />
          </a>
        );
      })}
    </div>
  );
}
