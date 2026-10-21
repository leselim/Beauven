import { useEffect, useRef, useState } from 'react';
import { BRAND } from '../config.js';

const WORDMARK = 'Beauven';

// A typing rhythm with a little human unevenness, slowing into the last letters
const RHYTHM = [0, 170, 140, 160, 150, 190, 230];
const START = 700; // a beat of plain cocoa so the panel has settled before typing begins
const HOLD = 900; // the finished wordmark rests before the curtain lifts

/** Opening curtain: the wordmark types itself out on cocoa, then the page is revealed */
export default function Intro({ onReveal, onDone }) {
  // Typing plays for everyone: letters appearing in place isn't movement,
  // so it stays even when the visitor has reduced motion switched on.
  const [typed, setTyped] = useState(0);
  const [finishedTyping, setFinishedTyping] = useState(false);
  const [out, setOut] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    const timers = [];
    let at = START;
    for (let i = 1; i <= WORDMARK.length; i++) {
      at += RHYTHM[i - 1] || 140;
      timers.push(setTimeout(() => setTyped(i), at));
    }
    at += 260;
    timers.push(setTimeout(() => setFinishedTyping(true), at));
    timers.push(setTimeout(finish, at + HOLD));
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function finish() {
    if (finished.current) return;
    finished.current = true;
    setTyped(WORDMARK.length);
    setFinishedTyping(true);
    setOut(true);
    onReveal();
    setTimeout(onDone, 1100);
  }

  const shown = WORDMARK.slice(0, typed);
  const rest = WORDMARK.slice(typed);

  return (
    <div
      className={`intro ${out ? 'intro--out' : ''} ${finishedTyping ? 'intro--typed' : ''}`}
      onClick={finish}
      role="presentation"
    >
      <div className="intro__inner">
        <p className="intro__logo" aria-label={WORDMARK}>
          <span aria-hidden="true">{shown}</span>
          <span className="intro__caret" aria-hidden="true" />
          {/* the untyped letters hold their space so the wordmark never shifts */}
          <span className="intro__rest" aria-hidden="true">
            {rest}
          </span>
        </p>
        <p className="intro__meta">{BRAND.tagline}</p>
      </div>
    </div>
  );
}
