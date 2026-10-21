import { useState } from 'react';
import Select from './Select.jsx';
import { Arrow } from './Icons.jsx';
import { Reveal } from './Motion.jsx';
import { BRAND, TOPICS } from '../config.js';
import { isEmail, submitLead } from '../lib/submit.js';

const EMPTY = { name: '', email: '', topic: TOPICS[0], message: '' };

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Please tell us your name';
  if (!isEmail(v.email)) e.email = 'Please enter a valid email address';
  if (v.message.trim().length < 10) e.message = 'A few more words, please (10 characters or more)';
  return e;
}

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | mail | error
  const errors = validate(values);
  const show = (k) => touched[k] && errors[k];

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e?.target ? e.target.value : e }));
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  async function onSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errors).length) {
      const first = ['name', 'email', 'message'].find((k) => errors[k]);
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    setStatus('sending');
    try {
      setStatus(await submitLead('message', values));
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent' || status === 'mail') {
    const first = values.name.trim().split(' ')[0];
    return (
      <div className="sent">
        <p className="eyebrow rv" style={{ '--d': 0 }}>
          {status === 'sent' ? 'Message received' : 'Ready to send'}
        </p>
        <h3 className="sent__title rv" style={{ '--d': 1 }}>
          Thank you, {first}
        </h3>
        <p className="sent__text rv" style={{ '--d': 2 }}>
          {status === 'sent'
            ? `We’ll reply to ${values.email} as soon as we can.`
            : `Your email app has opened with your message ready. Press send and it will reach us at ${BRAND.email}.`}
        </p>
        <button
          className="text-btn rv"
          style={{ '--d': 3 }}
          onClick={() => {
            setValues(EMPTY);
            setTouched({});
            setStatus('idle');
          }}
        >
          Write another message
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <Reveal d={0} className="field">
        <label className="label" htmlFor="f-name">
          Full Name
        </label>
        <input
          id="f-name"
          className="input"
          placeholder="Your full name"
          autoComplete="name"
          value={values.name}
          onChange={set('name')}
          onBlur={blur('name')}
          aria-invalid={!!show('name')}
          aria-describedby={show('name') ? 'e-name' : undefined}
        />
        {show('name') ? <span className="err" id="e-name">{errors.name}</span> : null}
      </Reveal>

      <Reveal d={1} className="field">
        <label className="label" htmlFor="f-email">
          Email Address
        </label>
        <input
          id="f-email"
          type="email"
          inputMode="email"
          className="input"
          placeholder="you@example.com"
          autoComplete="email"
          value={values.email}
          onChange={set('email')}
          onBlur={blur('email')}
          aria-invalid={!!show('email')}
          aria-describedby={show('email') ? 'e-email' : undefined}
        />
        {show('email') ? <span className="err" id="e-email">{errors.email}</span> : null}
      </Reveal>

      <Reveal d={2} className="field">
        <label className="label" htmlFor="f-topic">
          Subject
        </label>
        <Select id="f-topic" value={values.topic} options={TOPICS} onChange={set('topic')} />
      </Reveal>

      <Reveal d={3} className="field">
        <label className="label" htmlFor="f-message">
          Message
        </label>
        <textarea
          id="f-message"
          className="input"
          placeholder="How can we help?"
          value={values.message}
          onChange={set('message')}
          onBlur={blur('message')}
          aria-invalid={!!show('message')}
          aria-describedby={show('message') ? 'e-message' : undefined}
        />
        {show('message') ? <span className="err" id="e-message">{errors.message}</span> : null}
      </Reveal>

      <Reveal d={4} className="form__foot">
        <button type="submit" className="btn" data-loading={status === 'sending' || undefined}>
          <span className="btn__label">Send Message</span>
          <Arrow size={15} className="arrow" />
          <span className="btn__busy" aria-hidden="true" />
        </button>
        {status === 'error' ? (
          <span className="err">
            Couldn’t send just now. Try again or email{' '}
            <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
          </span>
        ) : null}
      </Reveal>
    </form>
  );
}
