import { Reveal, Split } from '../components/Motion.jsx';
import ContactForm from '../components/ContactForm.jsx';
import { Pin } from '../components/Icons.jsx';
import { EmailRow, Eyebrow, Row, SocialRow } from './shared.jsx';
import { useCountdown } from '../hooks/index.js';
import { BRAND, LAUNCH } from '../config.js';

export function HomeLeft({ go }) {
  const t = useCountdown(LAUNCH);
  return (
    <>
      <div className="lead">
        <Eyebrow d={0} onClick={() => go('store')}>
          {t.done
            ? 'The store is now open'
            : `The store opens in ${t.days} ${t.days === 1 ? 'day' : 'days'}`}
        </Eyebrow>
        <Split text="Say hello to Beauven" className="h1" base={160} />
        <Reveal d={3} as="p" className="sub">
          Reach out with a question, a collaboration or simply to say hello. Our official store opens on{' '}
          {BRAND.launchShort}, and we’d love to hear from you before then.
        </Reveal>
      </div>

      <div className="rows">
        <EmailRow d={5} />
        <Row icon={Pin} d={6}>
          South Africa
        </Row>
        <SocialRow d={7} />
      </div>
    </>
  );
}

export function HomePanel() {
  return <ContactForm />;
}
