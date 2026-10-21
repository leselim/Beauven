import { Fragment, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../hooks/index.js';

/** Headline that rises in line by line, word by word, from behind a mask */
export function Split({ text, as: Tag = 'h1', className = '', base = 80, step = 60 }) {
  const words = text.split(' ');
  return (
    <Tag className={`split ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden="true">
            <span style={{ '--i': i, '--base': `${base}ms`, '--step': `${step}ms` }}>{word}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/** Quiet fade-and-rise. `d` is its place in the sequence. */
export function Reveal({ d = 0, as: Tag = 'div', className = '', style, children, ...rest }) {
  return (
    <Tag className={`rv ${className}`} style={{ '--d': d, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

/** Cross-fade between views: the old one settles away, the new one rises in */
export function Swap({ value, render, className = '', onEntered }) {
  const [shown, setShown] = useState(value);
  const [phase, setPhase] = useState('in');
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (value === shown) return;
    setPhase('out');
    const t = setTimeout(
      () => {
        setShown(value);
        setPhase('in');
      },
      prefersReducedMotion() ? 0 : 260
    );
    return () => clearTimeout(t);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase === 'in' && onEntered) {
      const t = setTimeout(() => onEntered(shown), 60);
      return () => clearTimeout(t);
    }
  }, [phase, shown]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`swap swap--${phase} ${className}`} key={shown}>
      {render(shown)}
    </div>
  );
}

// Advance widths of the display figures (em). The box eases to the width of the
// digit it shows, so proportional figures keep their natural spacing as they roll.
const FIGURE_WIDTH = [0.646, 0.399, 0.439, 0.375, 0.444, 0.348, 0.5, 0.414, 0.54, 0.5];

/** Numeral reel: each digit slides to its value like a mechanical counter */
export function Digit({ value }) {
  return (
    <span className="digit" aria-hidden="true" style={{ width: `${FIGURE_WIDTH[value] + 0.03}em` }}>
      <span className="digit__reel" style={{ transform: `translateY(${-value * 10}%)` }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </span>
    </span>
  );
}

export function Reel({ value, min = 2 }) {
  const digits = String(value).padStart(min, '0').split('').map(Number);
  return (
    <span className="reel">
      {digits.map((d, i) => (
        <Digit key={digits.length - i} value={d} />
      ))}
    </span>
  );
}
