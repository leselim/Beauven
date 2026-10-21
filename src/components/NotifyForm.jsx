import { useEffect, useId, useState } from 'react';
import { isEmail, remember, submitLead } from '../lib/submit.js';
import { BRAND } from '../config.js';

const KEY = 'beauven-notify';
const EVENT = 'beauven:notify';

/** Launch-list sign-up. Every copy on the page stays in sync. */
export default function NotifyForm({ tone = 'dark', inputId, compact = false }) {
  const autoId = useId();
  const id = inputId || autoId;
  const [saved, setSaved] = useState(() => remember(KEY) || '');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const sync = () => setSaved(remember(KEY) || '');
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (!isEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setStatus('sending');
    try {
      const how = await submitLead('notify', { email: email.trim() });
      remember(KEY, email.trim());
      setStatus(how);
      window.dispatchEvent(new Event(EVENT));
    } catch {
      setStatus('idle');
      setError(`Something went wrong. Email us at ${BRAND.email}`);
    }
  }

  if (saved && status !== 'sending') {
    return (
      <div className={`notify-done notify-done--${tone}`}>
        <div>
          <p className="notify-done__title">You’re on the list</p>
          <p className="notify-done__text">
            {status === 'mail'
              ? `Send the email that just opened and we’ll write to ${saved} on launch day.`
              : `We’ll write to ${saved} on launch day.`}
          </p>
        </div>
        <button
          type="button"
          className="text-btn"
          onClick={() => {
            try {
              localStorage.removeItem(KEY);
            } catch {
              /* storage unavailable */
            }
            setSaved('');
            setStatus('idle');
            window.dispatchEvent(new Event(EVENT));
          }}
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <form className={`notify notify--${tone} ${compact ? 'notify--compact' : ''}`} onSubmit={onSubmit} noValidate>
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className="notify__bar" data-invalid={!!error || undefined}>
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          aria-invalid={!!error}
        />
        <button type="submit" className="notify__btn" data-loading={status === 'sending' || undefined}>
          <span className="btn__label">{compact ? 'Join' : 'Notify me'}</span>
          <span className="btn__busy" aria-hidden="true" />
        </button>
      </div>
      {error ? <p className="notify__err">{error}</p> : null}
    </form>
  );
}
