import { useEffect, useMemo, useRef, useState } from 'react';
import { Close, Search as SearchIcon } from './Icons.jsx';
import { BRAND } from '../config.js';
import { copyText, downloadLaunchInvite } from '../lib/calendar.js';
import { searchItems } from '../lib/search.js';
import { useToast } from './Toast.jsx';

export default function Search({ open, onClose, go }) {
  const toast = useToast();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef(null);
  const list = useRef(null);

  const items = useMemo(
    () => [
      {
        group: 'Pages',
        label: 'Home',
        hint: 'Say hello',
        terms: 'home start main contact hello welcome landing',
        run: () => go('home'),
      },
      {
        group: 'Pages',
        label: 'Our Story',
        hint: 'About Beauven',
        terms: 'about about-us story who we are brand meaning name history mission vision values beauty beneath confidence comfort women',
        run: () => go('story'),
      },
      {
        group: 'Pages',
        label: 'The Store',
        hint: `Opening ${BRAND.launchShort}`,
        terms: 'store shop shopping buy order collection products intimatewear intimates lingerie bra bras underwear launch opening open countdown coming soon date when',
        run: () => go('store'),
      },
      {
        group: 'Get in touch',
        label: 'Send us a message',
        hint: 'Contact form',
        terms: 'contact message enquiry enquiries inquiry question help support talk reach write form',
        run: () => go('home', { focus: 'f-name' }),
      },
      {
        group: 'Get in touch',
        label: 'Join the launch list',
        hint: 'Be told when we open',
        terms: 'notify notification waitlist wait list newsletter subscribe updates alert sign signup launch first',
        run: () => go('store', { focus: 'notify-store' }),
      },
      {
        group: 'Get in touch',
        label: 'Save the date',
        hint: 'Calendar invite',
        terms: 'calendar date reminder remind save launch day event',
        run: () => {
          downloadLaunchInvite();
          toast('Calendar invite downloaded');
        },
      },
      {
        group: 'Get in touch',
        label: BRAND.email,
        hint: 'Copy email address',
        terms: 'email mail address info copy',
        run: async () => {
          if (await copyText(BRAND.email)) toast('Email address copied');
        },
      },
      ...BRAND.socials.map((s) => ({
        group: 'Follow',
        label: s.label,
        hint: 'Opens in a new tab',
        terms: `social socials follow ${s.id} ${s.id === 'instagram' ? 'ig insta' : s.id === 'facebook' ? 'fb' : 'tik tok'}`,
        run: () => window.open(s.href, '_blank', 'noopener'),
      })),
    ],
    [go, toast]
  );

  const { results, exact } = useMemo(() => {
    const found = searchItems(items, q);
    // never a dead end: fall back to the pages
    return found.exact ? found : { results: items.filter((i) => i.group === 'Pages'), exact: false };
  }, [q, items]);

  useEffect(() => {
    if (!open) return;
    setQ('');
    setActive(0);
    const t = setTimeout(() => input.current?.focus(), 60);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    list.current?.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const run = (item) => {
    onClose();
    setTimeout(item.run, 200);
  };

  const onKey = (e) => {
    if (e.key === 'Escape') return onClose();
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(results[active]);
    }
  };

  let lastGroup = null;

  return (
    <div className={`search ${open ? 'is-open' : ''}`} aria-hidden={!open} role="dialog" aria-modal="true" aria-label="Search">
      <div className="search__bar">
        <span className="search__brand">Beauven</span>
        <button className="search__close" onClick={onClose} tabIndex={open ? 0 : -1}>
          Close
          <Close size={16} />
        </button>
      </div>

      <div className="search__body">
        <label className="search__field">
          <SearchIcon size={22} />
          <span className="sr-only">Search the site</span>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search the site"
            tabIndex={open ? 0 : -1}
            autoComplete="off"
            spellCheck="false"
          />
        </label>

        {!exact ? (
          <p className="search__note">
            Nothing matches “{q.trim()}” just yet. Perhaps one of these
          </p>
        ) : null}

        <ul className="search__list" ref={list} role="listbox">
          {results.map((item, i) => {
            const head = exact && item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            return (
              <li key={item.label} role="presentation">
                {head ? <p className="search__group">{head}</p> : null}
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  className={`search__item ${i === active ? 'is-active' : ''}`}
                  onMouseMove={() => setActive(i)}
                  onClick={() => run(item)}
                  tabIndex={open ? 0 : -1}
                >
                  <span className="search__label">{item.label}</span>
                  <span className="search__hint">{item.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
