import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Logo from './Logo.jsx';
import NotifyForm from './NotifyForm.jsx';
import { Reel } from './Motion.jsx';
import { Bag, Chevron, Close, Menu, Search, User } from './Icons.jsx';
import { useCountdown, useDismiss } from '../hooks/index.js';
import { BRAND, LAUNCH } from '../config.js';
import { downloadLaunchInvite } from '../lib/calendar.js';
import { useToast } from './Toast.jsx';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'story', label: 'Our Story' },
  { id: 'store', label: 'Store', menu: true },
];

export default function Nav({ view, go, openSearch }) {
  const toast = useToast();
  const [open, setOpen] = useState(null); // 'store' | 'bag' | 'user' | 'menu'
  const close = useCallback(() => setOpen(null), []);
  const toggle = (name) => setOpen((o) => (o === name ? null : name));

  const storeRef = useRef(null);
  const bagRef = useRef(null);
  const userRef = useRef(null);
  const menuRef = useRef(null);
  useDismiss(storeRef, open === 'store', close);
  useDismiss(bagRef, open === 'bag', close);
  useDismiss(userRef, open === 'user', close);
  useDismiss(menuRef, open === 'menu', close);

  // underline that travels to the active tab
  const linksRef = useRef(null);
  const [bar, setBar] = useState({ x: 0, w: 0, ready: false });
  const measure = useCallback(() => {
    const el = linksRef.current?.querySelector(`[data-tab="${view}"] .link__text`);
    const parent = linksRef.current;
    if (!el || !parent) return;
    const a = el.getBoundingClientRect();
    const b = parent.getBoundingClientRect();
    setBar({ x: a.left - b.left, w: a.width, ready: true });
  }, [view]);
  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const canHover = () => window.matchMedia('(hover: hover)').matches;
  const hoverT = useRef();
  const hoverOpen = () => {
    if (!canHover()) return;
    clearTimeout(hoverT.current);
    setOpen('store');
  };
  const hoverClose = () => {
    if (!canHover()) return;
    clearTimeout(hoverT.current);
    hoverT.current = setTimeout(() => setOpen((o) => (o === 'store' ? null : o)), 200);
  };

  const pick = (fn) => () => {
    close();
    fn();
  };

  return (
    <header className="nav">
      <div className="nav__left">
        <Logo onClick={() => go('home')} />
        <span className="vr" aria-hidden="true" />
        <nav className="links" ref={linksRef} aria-label="Main">
          {LINKS.map((l) =>
            l.menu ? (
              <div
                key={l.id}
                className="menu-wrap"
                ref={storeRef}
                data-tab={l.id}
                onMouseEnter={hoverOpen}
                onMouseLeave={hoverClose}
              >
                <button
                  className="link"
                  aria-current={view === l.id ? 'page' : undefined}
                  aria-expanded={open === 'store'}
                  aria-haspopup="menu"
                  onClick={() => {
                    if (canHover()) {
                      close();
                      go('store');
                    } else toggle('store');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setOpen('store');
                      setTimeout(() => storeRef.current?.querySelector('.drop__item')?.focus(), 30);
                    }
                  }}
                >
                  <span className="link__text">{l.label}</span>
                  <Chevron size={14} className={`chev ${open === 'store' ? 'chev--up' : ''}`} />
                </button>
                <div className={`pop pop--drop ${open === 'store' ? 'is-open' : ''}`} role="menu">
                  <button role="menuitem" className="drop__item" onClick={pick(() => go('store'))}>
                    <span className="drop__title">Launch countdown</span>
                    <span className="drop__note">Opening {BRAND.launchShort}</span>
                  </button>
                  <button
                    role="menuitem"
                    className="drop__item"
                    onClick={pick(() => go('store', { focus: 'notify-store' }))}
                  >
                    <span className="drop__title">Join the launch list</span>
                    <span className="drop__note">Hear from us the day we open</span>
                  </button>
                  <button
                    role="menuitem"
                    className="drop__item"
                    onClick={pick(() => {
                      downloadLaunchInvite();
                      toast('Calendar invite downloaded');
                    })}
                  >
                    <span className="drop__title">Save the date</span>
                    <span className="drop__note">Add launch day to your calendar</span>
                  </button>
                </div>
              </div>
            ) : (
              <a
                key={l.id}
                href={`#${l.id}`}
                data-tab={l.id}
                className="link"
                aria-current={view === l.id ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  go(l.id);
                }}
              >
                <span className="link__text">{l.label}</span>
              </a>
            )
          )}
          <span
            className="links__bar"
            aria-hidden="true"
            style={{ transform: `translateX(${bar.x}px)`, width: bar.w, opacity: bar.ready ? 1 : 0 }}
          />
        </nav>
      </div>

      <div className="nav__right">
        <button className="pill" onClick={() => go('home', { focus: 'f-name' })}>
          Contact
        </button>
        <span className="vr vr--right" aria-hidden="true" />

        <button className="icon-btn" aria-label="Search the site" onClick={openSearch}>
          <Search />
        </button>

        <div className="menu-wrap" ref={bagRef}>
          <button className="icon-btn" aria-label="Bag" aria-expanded={open === 'bag'} onClick={() => toggle('bag')}>
            <Bag />
          </button>
          <div className={`pop pop--card pop--right ${open === 'bag' ? 'is-open' : ''}`}>
            {open === 'bag' ? <BagCard onStore={pick(() => go('store'))} /> : null}
          </div>
        </div>

        <div className="menu-wrap menu-wrap--account" ref={userRef}>
          <button
            className="icon-btn"
            aria-label="Account"
            aria-expanded={open === 'user'}
            onClick={() => toggle('user')}
          >
            <User />
          </button>
          <div className={`pop pop--card pop--right ${open === 'user' ? 'is-open' : ''}`}>
            <p className="eyebrow">Your account</p>
            <h3 className="pop__title">Accounts open with the store</h3>
            <p className="pop__text">Leave your email and we’ll let you know the moment you can sign in and shop.</p>
            <NotifyForm tone="light" compact />
          </div>
        </div>

        <div className="menu-wrap menu-wrap--mobile" ref={menuRef}>
          <button
            className="icon-btn"
            aria-label={open === 'menu' ? 'Close menu' : 'Open menu'}
            aria-expanded={open === 'menu'}
            onClick={() => toggle('menu')}
          >
            {open === 'menu' ? <Close /> : <Menu />}
          </button>
          <div className={`pop pop--sheet pop--right ${open === 'menu' ? 'is-open' : ''}`}>
            {[...LINKS, { id: 'contact', label: 'Contact' }].map((l, i) => (
              <button
                key={l.id}
                className="sheet__link"
                aria-current={view === l.id ? 'page' : undefined}
                style={{ '--d': i }}
                onClick={pick(() => (l.id === 'contact' ? go('home', { focus: 'f-name' }) : go(l.id)))}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function BagCard({ onStore }) {
  const t = useCountdown(LAUNCH);
  return (
    <>
      <p className="eyebrow">Your bag</p>
      <h3 className="pop__title">{t.done ? 'The store is open' : 'Empty, for now'}</h3>
      <p className="pop__text">
        {t.done
          ? 'The full collection is waiting for you.'
          : `The store opens on ${BRAND.launchShort}. Until then, your bag is keeping a space for you.`}
      </p>
      {!t.done ? (
        <div className="mini-count" aria-label={`${t.days} days, ${t.hours} hours, ${t.minutes} minutes to go`}>
          {[
            ['Days', t.days],
            ['Hours', t.hours],
            ['Min', t.minutes],
            ['Sec', t.seconds],
          ].map(([label, v]) => (
            <span key={label}>
              <Reel value={v} />
              <small>{label}</small>
            </span>
          ))}
        </div>
      ) : null}
      {t.done ? (
        <a className="btn btn--block" href={BRAND.storeUrl}>
          Shop the collection
        </a>
      ) : (
        <button className="btn btn--block" onClick={onStore}>
          See the countdown
        </button>
      )}
    </>
  );
}
