import { Reveal, Split } from '../components/Motion.jsx';
import { Arrow } from '../components/Icons.jsx';
import { Eyebrow } from './shared.jsx';

const BODY = [
  'We understand that the little things matter. The bra that doesn’t work with your favourite outfit. The straps that show when they shouldn’t. The discomfort of choosing between looking beautiful and feeling comfortable. These everyday frustrations inspire us to think differently about what intimatewear should be.',
  'Our vision is to create thoughtfully designed pieces that move with you, complement your wardrobe, and make you feel good from the moment you put them on. From versatile designs that adapt to different outfits to beautiful essentials that feel as good as they look, every detail is considered with you in mind.',
  'But Beauven is about more than what you wear beneath your clothes. It’s about the confidence you carry, the freedom to express yourself, and the feeling of being comfortable in your own body. It’s about embracing your femininity, celebrating your individuality, and feeling beautiful on your own terms.',
  'We believe comfort can be sensual, practicality can be beautiful, and intimatewear can do more than simply complete an outfit. It can become an essential part of how you experience yourself every day.',
  'Whether you’re dressing for a special occasion, stepping into your everyday routine, or wearing something that makes you feel a little more confident, Beauven is designed to be part of those moments.',
];

export function StoryLeft() {
  return (
    <div className="lead lead--story">
      <Eyebrow d={0}>Our Story</Eyebrow>
      <Split text="Beauty beneath it all" className="h1" base={140} />
      <Reveal d={3} as="p" className="story__subtitle">
        At Beauven, we believe that feeling beautiful begins with how you feel in your own skin
      </Reveal>
    </div>
  );
}

export function StoryPanel({ go }) {
  return (
    <article className="story">
      <Reveal d={0} as="p" className="story__lead">
        Created for women who deserve comfort without compromise and confidence without restriction, Beauven
        reimagines intimatewear for the way women live, dress, and express themselves.
      </Reveal>
      {BODY.map((text, i) => (
        <Reveal key={i} d={1 + i * 0.5} as="p" className="story__body">
          {text}
        </Reveal>
      ))}
      <Reveal d={4} className="story__rule" aria-hidden="true" />
      <Reveal d={4.5} as="p" className="story__close">
        Because beauty isn’t just about what the world sees. It’s also about what you feel
      </Reveal>
      <Reveal d={5} as="p" className="eyebrow story__sign">
        <span className="eyebrow__rule" aria-hidden="true" />
        <span>Beauven. Beauty beneath it all</span>
      </Reveal>
      <Reveal d={5.5} className="story__foot">
        <button className="btn" onClick={() => go('store')}>
          <span className="btn__label">Visit the store</span>
          <Arrow size={15} className="arrow" />
        </button>
        <button className="btn btn--ghost" onClick={() => go('home', { focus: 'f-name' })}>
          Say hello
        </button>
      </Reveal>
    </article>
  );
}
