// Fine line icons, 1.4px stroke on a 24px grid
const make = (paths) =>
  function Icon({ size = 18, ...props }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {paths}
      </svg>
    );
  };

export const Mail = make(
  <>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="m4 7.5 8 5.5 8-5.5" />
  </>
);

export const Pin = make(
  <>
    <path d="M12 21s-6.5-5.4-6.5-11a6.5 6.5 0 0 1 13 0c0 5.6-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.2" />
  </>
);

export const Search = make(
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </>
);

export const Bag = make(
  <>
    <path d="M5.5 8h13l-1 11.2a1.8 1.8 0 0 1-1.8 1.6H8.3a1.8 1.8 0 0 1-1.8-1.6L5.5 8Z" />
    <path d="M9 10V7a3 3 0 0 1 6 0v3" />
  </>
);

export const User = make(
  <>
    <circle cx="12" cy="8.5" r="3.8" />
    <path d="M4.8 20c1.2-3.6 4-5.4 7.2-5.4s6 1.8 7.2 5.4" />
  </>
);

export const Chevron = make(<path d="m7.5 10 4.5 4.5 4.5-4.5" />);

export const Arrow = make(
  <>
    <path d="M5 12h14" />
    <path d="m13.5 6.5 5.5 5.5-5.5 5.5" />
  </>
);

export const Calendar = make(
  <>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </>
);

export const Bell = make(
  <>
    <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15L6 16.5Z" />
    <path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
  </>
);

export const Close = make(<path d="M6 6l12 12M18 6 6 18" />);

export const Menu = make(<path d="M4 9h16M4 15h16" />);

export const Instagram = make(
  <>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </>
);

export const TikTok = make(<path d="M14.5 3.5v11.2a3.7 3.7 0 1 1-3.7-3.7M14.5 3.5c.4 2.6 2.2 4.4 5 4.7" />);

export const Facebook = make(
  <path d="M14.5 21v-7.5h2.6l.4-3h-3V8.7c0-.9.3-1.5 1.5-1.5h1.6V4.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 4v2.1H9v3h2.5V21" />
);

export const SOCIAL_ICONS = { instagram: Instagram, tiktok: TikTok, facebook: Facebook };
