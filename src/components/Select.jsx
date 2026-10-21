import { useCallback, useRef, useState } from 'react';
import { Chevron } from './Icons.jsx';
import { useDismiss } from '../hooks/index.js';

/** A listbox styled to sit exactly like the text fields */
export default function Select({ id, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.indexOf(value)));
  const wrap = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(wrap, open, close);

  const choose = (i) => {
    onChange(options[i]);
    setOpen(false);
    wrap.current?.querySelector('button')?.focus();
  };

  const onKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActive((a) => (a + (e.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length);
    } else if ((e.key === 'Enter' || e.key === ' ') && open) {
      e.preventDefault();
      choose(active);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div className={`select ${open ? 'is-open' : ''}`} ref={wrap}>
      <button
        type="button"
        id={id}
        className="input select__btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setActive(Math.max(0, options.indexOf(value)));
          setOpen((o) => !o);
        }}
        onKeyDown={onKey}
      >
        <span>{value}</span>
        <Chevron size={16} className="chev" />
      </button>
      <ul className="select__list" role="listbox" aria-labelledby={id} tabIndex={-1}>
        {options.map((o, i) => (
          <li
            key={o}
            role="option"
            aria-selected={o === value}
            className={i === active ? 'is-active' : ''}
            onMouseEnter={() => setActive(i)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => choose(i)}
            style={{ '--d': i }}
          >
            {o}
          </li>
        ))}
      </ul>
    </div>
  );
}
